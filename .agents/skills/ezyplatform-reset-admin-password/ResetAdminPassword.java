import com.tvd12.ezyfox.security.BCrypt;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.Properties;

public class ResetAdminPassword {

    private static final int MIN_LENGTH_PASSWORD = 6;
    private static final int MAX_LENGTH_PASSWORD = 128;

    public static void main(String[] args) throws Exception {
        quietLogs();
        String home = ".";
        String command = null;
        String account = null;
        for (int i = 0; i < args.length; ++i) {
            String arg = args[i];
            if ("--home".equals(arg) && i + 1 < args.length) {
                home = args[++i];
            } else if (command == null) {
                command = arg;
            } else if (account == null) {
                account = arg;
            }
        }
        if ("list".equals(command)) {
            listAdmins(home);
        } else if ("reset".equals(command) && account != null) {
            resetPassword(home, account);
        } else if ("hash".equals(command)) {
            System.out.println(BCrypt.hashpw(readPassword(), BCrypt.gensalt()));
        } else {
            System.err.println(
                "usage: ResetAdminPassword [--home <ezyplatform folder>] "
                    + "list | reset <username or email> | hash"
            );
            System.exit(2);
        }
    }

    private static void listAdmins(String home) throws Exception {
        try (Connection connection = getConnection(home);
             PreparedStatement statement = connection.prepareStatement(
                 "SELECT id, username, email, status FROM ezy_admins ORDER BY id"
             );
             ResultSet resultSet = statement.executeQuery()
        ) {
            System.out.println("id\tusername\temail\tstatus");
            while (resultSet.next()) {
                System.out.println(
                    resultSet.getLong(1) + "\t"
                        + resultSet.getString(2) + "\t"
                        + resultSet.getString(3) + "\t"
                        + resultSet.getString(4)
                );
            }
        }
    }

    private static void resetPassword(
        String home,
        String account
    ) throws Exception {
        String password = readPassword();
        if (password.length() < MIN_LENGTH_PASSWORD
            || password.length() > MAX_LENGTH_PASSWORD
        ) {
            fail(
                "password must have from " + MIN_LENGTH_PASSWORD
                    + " to " + MAX_LENGTH_PASSWORD + " characters"
            );
        }
        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
        try (Connection connection = getConnection(home)) {
            connection.setAutoCommit(false);
            long adminId = 0;
            String username = null;
            String status = null;
            try (PreparedStatement statement = connection.prepareStatement(
                "SELECT id, username, status FROM ezy_admins "
                    + "WHERE username = ? OR email = ?"
            )) {
                statement.setString(1, account);
                statement.setString(2, account);
                try (ResultSet resultSet = statement.executeQuery()) {
                    int count = 0;
                    while (resultSet.next()) {
                        ++count;
                        adminId = resultSet.getLong(1);
                        username = resultSet.getString(2);
                        status = resultSet.getString(3);
                    }
                    if (count == 0) {
                        fail("admin not found: " + account);
                    }
                    if (count > 1) {
                        fail("more than one admin matches: " + account + ", use the username");
                    }
                }
            }
            try (PreparedStatement statement = connection.prepareStatement(
                "UPDATE ezy_admins SET password = ?, updated_at = ? WHERE id = ?"
            )) {
                statement.setString(1, hashedPassword);
                statement.setTimestamp(2, new Timestamp(System.currentTimeMillis()));
                statement.setLong(3, adminId);
                statement.executeUpdate();
            }
            try (PreparedStatement statement = connection.prepareStatement(
                "DELETE FROM ezy_admin_meta WHERE admin_id = ? "
                    + "AND meta_key IN ('login_failures', 'login_blocked_util')"
            )) {
                statement.setLong(1, adminId);
                statement.executeUpdate();
            }
            try (PreparedStatement statement = connection.prepareStatement(
                "DELETE FROM ezy_admin_access_tokens WHERE admin_id = ?"
            )) {
                statement.setLong(1, adminId);
                statement.executeUpdate();
            }
            connection.commit();
            String storedPassword;
            try (PreparedStatement statement = connection.prepareStatement(
                "SELECT password FROM ezy_admins WHERE id = ?"
            )) {
                statement.setLong(1, adminId);
                try (ResultSet resultSet = statement.executeQuery()) {
                    resultSet.next();
                    storedPassword = resultSet.getString(1);
                }
            }
            if (!BCrypt.checkpw(password, storedPassword)) {
                fail("verification failed, the stored password does not match");
            }
            System.out.println("password updated for admin id=" + adminId
                + ", username=" + username
                + ", status=" + status);
            System.out.println("login failures cleared, old sessions signed out, verification ok");
        }
    }

    private static String readPassword() throws Exception {
        BufferedReader reader = new BufferedReader(
            new InputStreamReader(System.in, StandardCharsets.UTF_8)
        );
        String password = reader.readLine();
        if (password == null || password.isEmpty()) {
            fail("password is required on standard input");
        }
        return password;
    }

    private static Connection getConnection(String home) throws Exception {
        File file = new File(home, "settings/setup.properties");
        if (!file.isFile()) {
            fail("not found: " + file.getAbsolutePath() + ", use --home <ezyplatform folder>");
        }
        Properties properties = new Properties();
        try (InputStream inputStream = new FileInputStream(file)) {
            properties.load(inputStream);
        }
        String driver = properties.getProperty("datasource.driver_class_name");
        String jdbcUrl = properties.getProperty("datasource.jdbc_url");
        String username = properties.getProperty("datasource.username");
        String password = properties.getProperty("datasource.password");
        if (jdbcUrl == null || jdbcUrl.trim().isEmpty()) {
            fail("datasource.jdbc_url is missing in " + file.getAbsolutePath()
                + ", EzyPlatform has not been set up yet");
        }
        if (driver != null && !driver.trim().isEmpty()) {
            Class.forName(driver.trim());
        }
        return isBlank(username) || isBlank(password)
            ? DriverManager.getConnection(jdbcUrl.trim())
            : DriverManager.getConnection(jdbcUrl.trim(), username, password);
    }

    private static void quietLogs() {
        try {
            Object rootLogger = Class.forName("org.slf4j.LoggerFactory")
                .getMethod("getLogger", String.class)
                .invoke(null, "ROOT");
            Class<?> levelClass = Class.forName("ch.qos.logback.classic.Level");
            rootLogger.getClass()
                .getMethod("setLevel", levelClass)
                .invoke(rootLogger, levelClass.getField("WARN").get(null));
        } catch (Throwable e) {
            System.setProperty("org.slf4j.simpleLogger.defaultLogLevel", "warn");
        }
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private static void fail(String message) {
        System.err.println("error: " + message);
        System.exit(1);
    }
}

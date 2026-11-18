---
name: ezyplatform-reset-admin-password
description: Reset the password of an EzyPlatform admin account directly in the database when the owner forgot it after setup and cannot sign in to the admin (no working "forgot password" email). Asks the user which admin account and which new password to use, hashes it with BCrypt exactly like EzyPlatform does, updates the `ezy_admins` table, clears login failures and old sessions, then verifies. Works for a normal installation and for EzyPlatform running inside a Docker container. Use when the user says they forgot the admin password, cannot log in to EzyPlatform admin, the admin account is blocked after too many wrong passwords, or asks to reset/change the admin password in the database.
---

# Reset an EzyPlatform admin password

EzyPlatform stores admin passwords in `ezy_admins.password` as a BCrypt hash (`com.tvd12.ezyfox.security.BCrypt.hashpw(password, BCrypt.gensalt())`, cost 10, `$2a$10$...`, 60 characters). Login checks it with `BCrypt.checkpw`, which also accepts `$2b$` and `$2y$` hashes. Never store a plain password, MD5 or SHA hash: the user would not be able to log in.

This skill ships `ResetAdminPassword.java` next to this file. It reads the database settings from the EzyPlatform installation, hashes with the same BCrypt class EzyPlatform uses (from `<ezyplatform>/lib`), updates the account in one transaction, and verifies the stored hash. Prefer it over hand-written SQL.

## Rules

- Talk to the user in their language.
- Only do this on a server the user owns or administers. Confirm it before changing anything.
- Ask the user for the new password; never invent one and never reuse an old one you saw somewhere. Do not echo the password back in your messages, do not write it to any file, log or command history file, and pass it to the tool on standard input only.
- Do not print `datasource.password` or other secrets from `settings/setup.properties` to the user.
- Change only the password of the chosen admin. Do not create admins, change usernames, emails, roles or status unless the user explicitly asks.
- Recommend that the user changes the password again from the admin UI (profile page) after signing in, since the new password passed through this chat.

## Steps

### 1. Find the EzyPlatform installation folder

It is the folder that contains `settings/setup.properties`, `lib/`, `admin/`, `web/` (a release unzips to `ezyplatform/`; a Docker setup usually mounts it as a volume). Ask the user if it is not obvious, then check:

```bash
ls "<ezyplatform>/settings/setup.properties" "<ezyplatform>/lib" | head
grep -E '^datasource\.(jdbc_url|driver_class_name)=' "<ezyplatform>/settings/setup.properties"
```

If `datasource.jdbc_url` is empty, setup has not finished: the user should open the admin URL and finish the setup wizard instead (it creates the first admin with a password they choose).

If EzyPlatform is installed with Docker (no such folder on the host, or `docker ps` shows an EzyPlatform container), follow the section "EzyPlatform in Docker" below instead of steps 1 to 5; steps 4 and 6 still apply.

### 2. Check Java

```bash
java -version
```

- Java 11 or newer: run the `.java` file directly (single-file source launcher), see step 3.
- Java 8: compile it first (needs a JDK with `javac`):

```bash
TOOL_DIR="$(mktemp -d)"
javac -cp "<ezyplatform>/lib/*" -d "$TOOL_DIR" "<skill dir>/ResetAdminPassword.java"
```

and replace `java -cp "<ezyplatform>/lib/*" "<skill dir>/ResetAdminPassword.java"` below with `java -cp "$TOOL_DIR:<ezyplatform>/lib/*" ResetAdminPassword` (on Windows use `;` instead of `:`).

- No usable Java: use the manual fallback at the end of this file.

### 3. Pick the admin account

List the admins (no secrets are printed):

```bash
java -cp "<ezyplatform>/lib/*" "<skill dir>/ResetAdminPassword.java" --home "<ezyplatform>" list
```

Show the list to the user and ask which account (username or email) to reset. If there is only one admin, still confirm it with the user.

### 4. Ask for the new password

Ask the user for the new password. It must be 6 to 128 characters (EzyPlatform's `MIN_LENGTH_PASSWORD` / `MAX_LENGTH_PASSWORD`). Suggest a strong one (12+ characters, mixed character types) but accept the user's choice if it is valid. Ask them to type it twice, or confirm it once, to avoid typos.

### 5. Reset

Pass the password on standard input. Use `printf '%s\n'` (not `echo`, which may interpret backslashes) and single-quote the password; if the password itself contains a single quote `'`, write it as `'\''`.

```bash
printf '%s\n' '<new password>' | java -cp "<ezyplatform>/lib/*" "<skill dir>/ResetAdminPassword.java" --home "<ezyplatform>" reset '<username or email>'
```

On Windows PowerShell:

```powershell
'<new password>' | java -cp "<ezyplatform>\lib\*" "<skill dir>\ResetAdminPassword.java" --home "<ezyplatform>" reset '<username or email>'
```

In one transaction the tool:

1. finds the admin by username or email (fails if none or more than one match),
2. sets `ezy_admins.password` to the new BCrypt hash and `updated_at` to now,
3. deletes the `login_failures` and `login_blocked_util` rows of that admin in `ezy_admin_meta`, so an account blocked by too many wrong passwords can log in right away,
4. deletes that admin's rows in `ezy_admin_access_tokens`, signing out old sessions (same as EzyPlatform does when a password changes),
5. reads the hash back and checks it with `BCrypt.checkpw`.

Expected output:

```
password updated for admin id=1, username=admin, status=ACTIVATED
login failures cleared, old sessions signed out, verification ok
```

No restart of admin or web is needed.

### 6. Tell the user

- Which account was reset (id, username) and that they can sign in at `<admin url>/login` now.
- If `status` is not `ACTIVATED` (for example `BLOCKED`), the account still cannot log in: ask whether they want it activated, and only then run `UPDATE ezy_admins SET status = 'ACTIVATED' WHERE id = <id>;`.
- If the account has two-factor authentication enabled, the password reset does not turn it off; they still need their 2FA code.
- Recommend changing the password again from the admin profile page and setting up a working mail configuration so "forgot password" works next time.

## EzyPlatform in Docker

EzyPlatform then lives inside a container, so run the tool inside that container, where Java, `lib/` and network access to the database already exist. You need the `docker` CLI on the host (with `podman`, replace `docker` by `podman`). The official images:

- `ezyplatform` (all in one): EzyPlatform and MySQL in the same container, `jdbc:mysql://localhost:3306/ezyplatform`.
- `youngmonkeys/ezyplatform-only` (docker compose): EzyPlatform in container `ezyplatform`, MySQL in container `ezyplatform-mysql`, EzyPlatform folder on the volume `ezyplatform-data`. Its entrypoint rewrites `settings/setup.properties` from the `DATASOURCE_*` environment variables on every start.

Both install EzyPlatform at `/app/ezyplatform` and ship Java 8 with `javac`, so the tool must be compiled first (no single-file launcher in Java 8).

Do not run `docker inspect` or `docker exec ... env` and never show their output to the user: it contains `DATASOURCE_PASSWORD` and `EZY_ENCRYPTION_KEY`.

### D1. Find the container and the EzyPlatform folder

```bash
docker ps -a --format '{{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
```

Pick the EzyPlatform container (image `ezyplatform`, `youngmonkeys/ezyplatform*`, or the one publishing ports `9090` / `8080`); ask the user if several match or if it runs on another machine (then run everything on that machine, for example over SSH). If it is stopped, ask before starting it (`docker start <container>`). With docker compose, `docker compose ps` in the compose folder shows the service, and `docker compose exec -T <service> ...` can replace `docker exec -i <container> ...` below.

Check the folder (`/app/ezyplatform` for the official images; for a custom image search for it):

```bash
docker exec <container> sh -c 'ls /app/ezyplatform/settings/setup.properties /app/ezyplatform/lib >/dev/null && echo ok || find / -path "*/settings/setup.properties" 2>/dev/null | head'
```

Use the folder that contains `settings/setup.properties` as `<home>` below (default `/app/ezyplatform`).

### D2. Copy and compile the tool inside the container

```bash
docker exec <container> mkdir -p /tmp/ezy-reset-password
docker cp "<skill dir>/ResetAdminPassword.java" <container>:/tmp/ezy-reset-password/ResetAdminPassword.java
docker exec <container> sh -c 'cd /tmp/ezy-reset-password && javac -cp "<home>/lib/*" ResetAdminPassword.java'
```

If the image has Java 11 or newer and no `javac`, skip the compile and run `java -cp "<home>/lib/*" /tmp/ezy-reset-password/ResetAdminPassword.java ...` instead of the class below.

### D3. List the admins and reset

```bash
docker exec <container> java -cp "/tmp/ezy-reset-password:<home>/lib/*" ResetAdminPassword --home <home> list
```

Ask which account and the new password (steps 3 and 4), then pass the password on standard input. Use `docker exec -i` (keeps stdin open) and never `-t`: a TTY would echo or mangle the piped password.

```bash
printf '%s\n' '<new password>' | docker exec -i <container> java -cp "/tmp/ezy-reset-password:<home>/lib/*" ResetAdminPassword --home <home> reset '<username or email>'
```

On Windows PowerShell:

```powershell
'<new password>' | docker exec -i <container> java -cp "/tmp/ezy-reset-password:<home>/lib/*" ResetAdminPassword --home <home> reset '<username or email>'
```

The classpath separator is `:` here even on a Windows host, because the command runs in the Linux container.

### D4. Clean up

```bash
docker exec <container> rm -rf /tmp/ezy-reset-password
```

Then continue with step 6. No container restart is needed.

### D5. When the EzyPlatform container cannot run

If the container is up but the admin never answers, check `docker logs <container> | tail`. `Test database connection failed: ... RSA public key is not available client side` means the `DATASOURCE_JDBC_URL` of a MySQL 8 database lacks `allowPublicKeyRetrieval=true`: EzyPlatform itself cannot start, which is a different problem from a forgotten password. Tell the user, and with their approval set it in the compose file or `.env` (for example `DATASOURCE_JDBC_URL=jdbc:mysql://mysql:3306/ezyplatform?allowPublicKeyRetrieval=true&useSSL=false`) and recreate the container (`docker compose up -d --force-recreate <service>`); the official entrypoint rewrites `setup.properties` from that variable. Then continue with D1.

For example it keeps restarting, but the database is fine. Create the hash with a throwaway container of the same image (it does not touch the database or the volume):

```bash
printf '%s\n' '<new password>' | docker run --rm -i -v "<skill dir>:/skill:ro" --entrypoint sh <image> -c 'mkdir -p /tmp/t && javac -cp "/app/ezyplatform/lib/*" -d /tmp/t /skill/ResetAdminPassword.java && java -cp "/tmp/t:/app/ezyplatform/lib/*" ResetAdminPassword hash'
```

Then run the SQL of the manual fallback below in the database container, using its own environment variables so no database password appears in the chat. For the docker compose setup (`ezyplatform-mysql`):

```bash
docker exec -i ezyplatform-mysql sh -c 'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"' <<'SQL'
SELECT id, username, email, status FROM ezy_admins;
SQL
```

and the same way with the `UPDATE` / `DELETE` statements (the quoted `'SQL'` heredoc keeps the `$` signs of the hash intact). For the all-in-one image, MySQL runs inside the EzyPlatform container itself, so it must be running anyway: use D1 to D4.

## Manual fallback (no Java)

Only when the tool cannot run. Generate a BCrypt hash with cost 10 using one of these (password on stdin, never as an argument when avoidable):

```bash
printf '%s\n' '<new password>' | python3 -c "import sys,bcrypt; print(bcrypt.hashpw(sys.stdin.readline().rstrip('\n').encode(), bcrypt.gensalt(10)).decode())"
htpasswd -nbBC 10 '' '<new password>' | tr -d ':\n'
```

(`python3 -m pip install bcrypt` if the module is missing; `htpasswd` comes with `apache2-utils` / `httpd-tools` and produces `$2y$`, which EzyPlatform accepts.) Check that the result starts with `$2a$10$`, `$2b$10$` or `$2y$10$` and is 60 characters long.

Then run SQL with the database client of the server (`mysql`/`mariadb` for MySQL/MariaDB, `psql` for PostgreSQL), using the host, port, database and user from `datasource.jdbc_url` / `datasource.username` (let the client prompt for the database password). Replace `<hash>` and `<username>`; the hash contains `$`, so keep it inside single quotes in SQL and do not put the SQL inside a double-quoted shell string.

```sql
SELECT id, username, email, status FROM ezy_admins WHERE username = '<username>';
UPDATE ezy_admins SET password = '<hash>', updated_at = NOW() WHERE id = <id>;
DELETE FROM ezy_admin_meta WHERE admin_id = <id> AND meta_key IN ('login_failures', 'login_blocked_util');
DELETE FROM ezy_admin_access_tokens WHERE admin_id = <id>;
```

Then ask the user to log in to confirm.

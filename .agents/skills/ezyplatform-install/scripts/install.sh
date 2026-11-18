#!/usr/bin/env bash
set -eo pipefail

MYSQL_SERIES="8.4"
MYSQL_FALLBACK_VERSION="8.4.13"
DOCKER_MYSQL_IMAGE="mysql:8.4"
DOCKER_EZY_IMAGE="youngmonkeys/ezyplatform-only"
DB_NAME="ezyplatform"
DB_USER="ezyplatform"

SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"

usage() {
    cat <<'EOF'
usage: install.sh <command> [options]

commands:
  check       detect OS, CPU, Docker, ports and an existing installation (changes nothing)
  install     install MySQL + JDK 8 + EzyPlatform (or the Docker stack), start it and create the first admin
  start       start an installed EzyPlatform (MySQL, admin, web)
  stop        stop it
  status      show what is running
  uninstall   stop and delete everything in --dir (needs --yes)

options:
  --dir <folder>          installation folder (default: $HOME/ezyplatform)
  --docker                use Docker (MySQL + EzyPlatform containers) instead of a native install
  --version <x.y.z>       EzyPlatform version (default: latest)
  --admin-user <name>     first admin username (default: admin)
  --admin-email <email>   first admin email (required by install)
  --lang <code>           admin default language, for example vi or en (default: en)
  --admin-port <port>     admin port (default: 9090, next free port if busy)
  --web-port <port>       web port (default: 8080, next free port if busy)
  --mysql-port <port>     port of the private MySQL (default: first free of 3306..3399)
  --mysql-home <folder>   use MySQL binaries from this folder (it has bin/mysqld) instead of downloading
  --db-url <jdbc url>     use an existing database instead of a private MySQL (with --db-user and env EZY_DB_PASSWORD)
  --db-user <user>
  --public                listen on all network interfaces instead of only this computer
  --name <name>           Docker Compose project name (default: ezyplatform)
  --yes                   confirm uninstall

environment:
  EZY_ADMIN_PASSWORD      first admin password (6-128 characters); generated and printed when empty
  EZY_DB_PASSWORD         password of --db-user when --db-url is used

exit codes: 0 ok, 1 error, 3 a requirement is missing (see the NEED line)
EOF
}

log() { printf '[ezy] %s\n' "$*"; }
die() { printf '[ezy] ERROR: %s\n' "$*" >&2; exit 1; }
need() { printf 'NEED %s: %s\n' "$1" "$2"; exit 3; }

COMMAND="${1:-help}"
[ $# -gt 0 ] && shift

OPT_DIR=""; OPT_DOCKER=""; OPT_VERSION=""; OPT_ADMIN_USER=""; OPT_ADMIN_EMAIL=""
OPT_LANG=""; OPT_ADMIN_PORT=""; OPT_WEB_PORT=""; OPT_MYSQL_PORT=""; OPT_MYSQL_HOME=""
OPT_DB_URL=""; OPT_DB_USER=""; OPT_PUBLIC=""; OPT_NAME=""; OPT_YES=""

while [ $# -gt 0 ]; do
    case "$1" in
        --dir) OPT_DIR="$2"; shift 2 ;;
        --docker) OPT_DOCKER="true"; shift ;;
        --version) OPT_VERSION="$2"; shift 2 ;;
        --admin-user) OPT_ADMIN_USER="$2"; shift 2 ;;
        --admin-email) OPT_ADMIN_EMAIL="$2"; shift 2 ;;
        --lang) OPT_LANG="$2"; shift 2 ;;
        --admin-port) OPT_ADMIN_PORT="$2"; shift 2 ;;
        --web-port) OPT_WEB_PORT="$2"; shift 2 ;;
        --mysql-port) OPT_MYSQL_PORT="$2"; shift 2 ;;
        --mysql-home) OPT_MYSQL_HOME="$2"; shift 2 ;;
        --db-url) OPT_DB_URL="$2"; shift 2 ;;
        --db-user) OPT_DB_USER="$2"; shift 2 ;;
        --public) OPT_PUBLIC="true"; shift ;;
        --name) OPT_NAME="$2"; shift 2 ;;
        --yes) OPT_YES="true"; shift ;;
        -h|--help) usage; exit 0 ;;
        *) die "unknown option: $1" ;;
    esac
done

if [ -z "$OPT_DIR" ] && [ "$(basename "$SCRIPT_PATH")" = "ezyplatform-ctl.sh" ]; then
    OPT_DIR="$(dirname "$SCRIPT_PATH")"
fi
DIR="${OPT_DIR:-${EZY_DIR:-$HOME/ezyplatform}}"
case "$DIR" in /*) ;; *) DIR="$(pwd)/$DIR" ;; esac
STATE_DIR="$DIR/.ezy"
STATE_FILE="$STATE_DIR/state.env"
SECRETS_FILE="$STATE_DIR/secrets.env"
EZ_HOME="$DIR/ezyplatform"

MODE=""; VERSION="latest"; ADMIN_USER="admin"; ADMIN_EMAIL=""; LANG_CODE="en"
ADMIN_PORT=""; WEB_PORT=""; MYSQL_PORT=""; MYSQL_HOME=""; MYSQL_LD_PATH=""
DB_URL=""; EXTERNAL_DB_USER=""; BIND_HOST="127.0.0.1"; PROJECT_NAME="ezyplatform"; JAVA_HOME_DIR=""
DB_ROOT_PASSWORD=""; DB_PASSWORD=""; ENCRYPTION_KEY=""

if [ -f "$STATE_FILE" ]; then
    . "$STATE_FILE"
fi
if [ -f "$SECRETS_FILE" ]; then
    . "$SECRETS_FILE"
fi

[ -n "$OPT_DOCKER" ] && MODE="docker"
[ -n "$OPT_VERSION" ] && VERSION="$OPT_VERSION"
[ -n "$OPT_ADMIN_USER" ] && ADMIN_USER="$OPT_ADMIN_USER"
[ -n "$OPT_ADMIN_EMAIL" ] && ADMIN_EMAIL="$OPT_ADMIN_EMAIL"
[ -n "$OPT_LANG" ] && LANG_CODE="$OPT_LANG"
[ -n "$OPT_ADMIN_PORT" ] && ADMIN_PORT="$OPT_ADMIN_PORT"
[ -n "$OPT_WEB_PORT" ] && WEB_PORT="$OPT_WEB_PORT"
[ -n "$OPT_MYSQL_PORT" ] && MYSQL_PORT="$OPT_MYSQL_PORT"
[ -n "$OPT_MYSQL_HOME" ] && MYSQL_HOME="$OPT_MYSQL_HOME"
[ -n "$OPT_DB_URL" ] && DB_URL="$OPT_DB_URL"
[ -n "$OPT_DB_USER" ] && EXTERNAL_DB_USER="$OPT_DB_USER"
[ -n "$OPT_PUBLIC" ] && BIND_HOST="0.0.0.0"
[ -n "$OPT_NAME" ] && PROJECT_NAME="$OPT_NAME"
[ -z "$MODE" ] && MODE="native"

OS_NAME="$(uname -s)"
case "$(uname -m)" in
    x86_64|amd64) ARCH="x64" ;;
    arm64|aarch64) ARCH="aarch64" ;;
    *) ARCH="$(uname -m)" ;;
esac

save_state() {
    mkdir -p "$STATE_DIR"
    chmod 700 "$STATE_DIR"
    {
        for key in MODE VERSION ADMIN_USER ADMIN_EMAIL LANG_CODE ADMIN_PORT WEB_PORT MYSQL_PORT \
            MYSQL_HOME MYSQL_LD_PATH DB_URL EXTERNAL_DB_USER BIND_HOST PROJECT_NAME JAVA_HOME_DIR; do
            printf '%s=%q\n' "$key" "${!key}"
        done
    } > "$STATE_FILE"
    (
        umask 077
        {
            for key in DB_ROOT_PASSWORD DB_PASSWORD ENCRYPTION_KEY; do
                printf '%s=%q\n' "$key" "${!key}"
            done
        } > "$SECRETS_FILE"
    )
    chmod 600 "$SECRETS_FILE"
}

random_hex() {
    head -c 64 /dev/urandom | od -An -tx1 | tr -d ' \n' | cut -c1-"$1"
}

port_in_use() {
    (exec 3<>"/dev/tcp/127.0.0.1/$1") >/dev/null 2>&1
}

free_port() {
    local port="$1" last="$2"
    while [ "$port" -le "$last" ]; do
        if ! port_in_use "$port"; then
            echo "$port"
            return 0
        fi
        port=$((port + 1))
    done
    return 1
}

http_code() {
    curl -s -o /dev/null -m 10 -w '%{http_code}' "$1" 2>/dev/null || true
}

http_redirect() {
    curl -s -o /dev/null -m 10 -w '%{redirect_url}' "$1" 2>/dev/null || true
}

download() {
    local url="$1" out="$2"
    log "downloading $url"
    if command -v curl >/dev/null 2>&1; then
        curl -fL --retry 3 --retry-delay 3 --connect-timeout 30 -o "$out.part" "$url" || return 1
    elif command -v wget >/dev/null 2>&1; then
        wget -q -O "$out.part" "$url" || return 1
    else
        need linux_packages "curl is missing, install the curl package"
    fi
    mv "$out.part" "$out"
}

sha256_of() {
    if command -v sha256sum >/dev/null 2>&1; then
        sha256sum "$1" | cut -d' ' -f1
    else
        shasum -a 256 "$1" | cut -d' ' -f1
    fi
}

glibc_version() {
    local version
    version="$(getconf GNU_LIBC_VERSION 2>/dev/null | awk '{print $2}' || true)"
    if [ -z "$version" ]; then
        version="$( (ldd --version 2>&1 || true) | sed -n '1s/.* \([0-9][0-9]*\.[0-9][0-9]*\)$/\1/p')"
    fi
    echo "${version:-0.0}"
}

is_musl() {
    [ -z "$(getconf GNU_LIBC_VERSION 2>/dev/null || true)" ] && (ldd --version 2>&1 || true) | grep -qi musl
}

package_manager() {
    for pm in apt-get dnf yum zypper pacman apk; do
        if command -v "$pm" >/dev/null 2>&1; then
            echo "$pm"
            return
        fi
    done
    echo "unknown"
}

wait_http() {
    local url="$1" seconds="$2" name="$3" pid_file="$4" code waited=0
    log "waiting for $name at $url (up to ${seconds}s, the first start creates the database tables)"
    while [ "$waited" -lt "$seconds" ]; do
        code="$(http_code "$url")"
        case "$code" in
            2*|3*|4*) log "$name is up (HTTP $code)"; return 0 ;;
        esac
        if [ -n "$pid_file" ] && [ -f "$pid_file" ]; then
            if ! kill -0 "$(cat "$pid_file")" 2>/dev/null; then
                tail -n 60 "$EZ_HOME/logs/$name-server.log" 2>/dev/null || true
                die "$name stopped while starting, see $EZ_HOME/logs/$name-server.log"
            fi
        fi
        sleep 3
        waited=$((waited + 3))
    done
    if [ "$MODE" = "docker" ]; then
        docker_compose logs --tail 80 ezyplatform || true
    else
        tail -n 60 "$EZ_HOME/logs/$name-server.log" 2>/dev/null || true
    fi
    die "$name did not answer at $url after ${seconds}s"
}

check_command() {
    log "os=$OS_NAME arch=$ARCH dir=$DIR"
    if [ "$OS_NAME" = "Darwin" ]; then
        log "macos=$(sw_vers -productVersion 2>/dev/null)"
        command -v brew >/dev/null 2>&1 && log "homebrew=yes" || log "homebrew=no"
    elif [ "$OS_NAME" = "Linux" ]; then
        log "glibc=$(glibc_version)"
        log "package_manager=$(package_manager)"
        [ -f /etc/os-release ] && log "distro=$(. /etc/os-release; echo "$PRETTY_NAME")"
    fi
    if command -v docker >/dev/null 2>&1; then
        if docker info >/dev/null 2>&1; then
            log "docker=running"
        else
            log "docker=installed_not_running"
        fi
    else
        log "docker=no"
    fi
    for port in 9090 8080 3306; do
        port_in_use "$port" && log "port $port=busy" || log "port $port=free"
    done
    if [ -f "$STATE_FILE" ]; then
        log "existing_install=yes mode=$MODE admin_port=$ADMIN_PORT web_port=$WEB_PORT"
    else
        log "existing_install=no"
    fi
}

resolve_java() {
    if [ -n "$JAVA_HOME_DIR" ] && [ -x "$JAVA_HOME_DIR/bin/java" ]; then
        return 0
    fi
    if [ -d "$DIR/jdk" ]; then
        local java_bin
        java_bin="$(find "$DIR/jdk" -path '*/bin/java' -type f 2>/dev/null | grep -v '/jre/bin/java' | head -1)"
        if [ -n "$java_bin" ]; then
            JAVA_HOME_DIR="$(dirname "$(dirname "$java_bin")")"
            return 0
        fi
    fi
    return 1
}

install_jdk() {
    if resolve_java && "$JAVA_HOME_DIR/bin/java" -version 2>&1 | grep -q '"1\.8'; then
        log "JDK 8 already installed at $JAVA_HOME_DIR"
        return
    fi
    local os_param
    case "$OS_NAME" in
        Darwin) os_param="macos" ;;
        Linux)
            if is_musl; then
                os_param="linux_musl"
            else
                os_param="linux"
            fi
            ;;
        *) die "unsupported OS $OS_NAME" ;;
    esac
    local api="https://api.azul.com/metadata/v1/zulu/packages/?java_version=8&os=$os_param&arch=$ARCH&archive_type=tar.gz&java_package_type=jdk&javafx_bundled=false&crac_supported=false&latest=true&release_status=ga&availability_types=CA&certifications=tck&page=1&page_size=1"
    local json url uuid sha
    json="$(curl -fsSL "$api")" || die "cannot reach api.azul.com to find JDK 8"
    url="$(printf '%s' "$json" | grep -oE '"download_url":"[^"]+"' | head -1 | cut -d'"' -f4)"
    uuid="$(printf '%s' "$json" | grep -oE '"package_uuid":"[^"]+"' | head -1 | cut -d'"' -f4)"
    [ -n "$url" ] || die "no JDK 8 build for $os_param/$ARCH"
    sha="$(curl -fsSL "https://api.azul.com/metadata/v1/zulu/packages/$uuid" | grep -oE '"sha256_hash":"[^"]+"' | head -1 | cut -d'"' -f4 || true)"
    local tmp="$STATE_DIR/tmp/jdk"
    rm -rf "$tmp"
    mkdir -p "$tmp"
    download "$url" "$tmp/jdk.tar.gz" || die "JDK download failed"
    if [ -n "$sha" ] && [ "$(sha256_of "$tmp/jdk.tar.gz")" != "$sha" ]; then
        die "JDK checksum mismatch, download again"
    fi
    tar -xzf "$tmp/jdk.tar.gz" -C "$tmp"
    rm -f "$tmp/jdk.tar.gz"
    rm -rf "$DIR/jdk"
    mv "$(find "$tmp" -mindepth 1 -maxdepth 1 -type d | head -1)" "$DIR/jdk"
    rm -rf "$tmp"
    JAVA_HOME_DIR=""
    resolve_java || die "java not found inside the JDK archive"
    "$JAVA_HOME_DIR/bin/java" -version 2>&1 | grep -q '"1\.8' || die "the installed JDK is not Java 8"
    log "JDK 8 installed at $JAVA_HOME_DIR"
}

mysql_bin() {
    echo "$MYSQL_HOME/bin/$1"
}

mysql_env() {
    if [ -n "$MYSQL_LD_PATH" ]; then
        env LD_LIBRARY_PATH="$MYSQL_LD_PATH${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}" "$@"
    else
        "$@"
    fi
}

latest_mysql_file() {
    local os_id="$1" pattern="$2" page file
    page="$(curl -fsSL -m 30 "https://dev.mysql.com/downloads/mysql/$MYSQL_SERIES.html?os=$os_id" 2>/dev/null || true)"
    file="$(printf '%s' "$page" | grep -oE "mysql-${MYSQL_SERIES//./\\.}\.[0-9]+-$pattern" | head -1 || true)"
    echo "$file"
}

check_linux_libs() {
    local missing
    missing="$(mysql_env ldd "$(mysql_bin mysqld)" "$(mysql_bin mysql)" 2>/dev/null | grep 'not found' | awk '{print $1}' | sort -u || true)"
    if printf '%s\n' "$missing" | grep -qx 'libaio.so.1'; then
        local t64
        t64="$(ls /usr/lib/*/libaio.so.1t64 /usr/lib64/libaio.so.1t64 /lib/*/libaio.so.1t64 2>/dev/null | head -1 || true)"
        if [ -n "$t64" ]; then
            mkdir -p "$DIR/mysql-compat-lib"
            ln -sf "$t64" "$DIR/mysql-compat-lib/libaio.so.1"
            MYSQL_LD_PATH="$DIR/mysql-compat-lib"
            missing="$(mysql_env ldd "$(mysql_bin mysqld)" "$(mysql_bin mysql)" 2>/dev/null | grep 'not found' | awk '{print $1}' | sort -u || true)"
        fi
    fi
    if [ -n "$missing" ]; then
        save_state
        need linux_packages "MySQL needs these system libraries: $(echo $missing). Package manager: $(package_manager). Typical packages: apt-get: libaio1t64 (or libaio1 on older Ubuntu/Debian) libnuma1 libncurses6; dnf/yum: libaio numactl-libs ncurses-libs. Install them (needs sudo) and run install again"
    fi
}

install_mysql_binaries() {
    if [ -n "$DB_URL" ]; then
        log "using the existing database $DB_URL"
        return
    fi
    if [ -n "$MYSQL_HOME" ] && [ -x "$MYSQL_HOME/bin/mysqld" ]; then
        log "MySQL binaries: $MYSQL_HOME"
        if [ "$OS_NAME" = "Linux" ]; then check_linux_libs; fi
        return
    fi
    if [ -x "$DIR/mysql/bin/mysqld" ]; then
        MYSQL_HOME="$DIR/mysql"
        if [ "$OS_NAME" = "Linux" ]; then check_linux_libs; fi
        return
    fi
    local file="" os_id
    if [ "$OS_NAME" = "Darwin" ]; then
        local major
        major="$(sw_vers -productVersion | cut -d. -f1)"
        local mac_arch="x86_64"
        [ "$ARCH" = "aarch64" ] && mac_arch="arm64"
        if [ "$major" -ge 15 ] && [ "$mac_arch" = "arm64" ]; then
            file="$(latest_mysql_file 33 'macos[0-9]+-arm64\.tar\.gz')"
            [ -n "$file" ] || file="mysql-$MYSQL_FALLBACK_VERSION-macos15-arm64.tar.gz"
        elif [ "$major" -ge 15 ]; then
            file="mysql-8.4.11-macos15-x86_64.tar.gz"
        elif [ "$major" -eq 14 ]; then
            file="mysql-8.4.3-macos14-$mac_arch.tar.gz"
        elif [ "$major" -eq 13 ]; then
            file="mysql-8.0.35-macos13-$mac_arch.tar.gz"
        else
            need mysql_unsupported_platform "macOS $(sw_vers -productVersion) is too old for the official MySQL archives (macOS 13+). Use --docker, or install MySQL another way and pass --mysql-home <folder with bin/mysqld> or --db-url/--db-user"
        fi
    elif [ "$OS_NAME" = "Linux" ]; then
        if is_musl; then
            need mysql_unsupported_platform "musl Linux (Alpine) has no official MySQL archive. Use --docker, or install MySQL/MariaDB with the package manager and pass --db-url/--db-user"
        fi
        local glibc
        glibc="$(glibc_version)"
        if [ "$(printf '%s\n2.28\n' "$glibc" | sort -t. -k1,1n -k2,2n | head -1)" != "2.28" ]; then
            need mysql_unsupported_platform "glibc $glibc is older than 2.28. Use --docker, or install MySQL/MariaDB with the package manager and pass --db-url/--db-user"
        fi
        command -v xz >/dev/null 2>&1 || need linux_packages "the xz tool is missing (apt-get: xz-utils, dnf/yum: xz). Install it (needs sudo) and run install again"
        os_id=2
        if [ "$ARCH" = "x64" ]; then
            file="$(latest_mysql_file "$os_id" 'linux-glibc2\.28-x86_64-minimal\.tar\.xz')"
            [ -n "$file" ] || file="mysql-$MYSQL_FALLBACK_VERSION-linux-glibc2.28-x86_64-minimal.tar.xz"
        elif [ "$ARCH" = "aarch64" ]; then
            file="$(latest_mysql_file "$os_id" 'linux-glibc2\.28-aarch64\.tar\.xz')"
            [ -n "$file" ] || file="mysql-$MYSQL_FALLBACK_VERSION-linux-glibc2.28-aarch64.tar.xz"
        else
            need mysql_unsupported_platform "no MySQL archive for CPU $ARCH. Use --docker or --db-url"
        fi
    else
        die "unsupported OS $OS_NAME"
    fi
    local tmp="$STATE_DIR/tmp/mysql"
    rm -rf "$tmp"
    mkdir -p "$tmp"
    local series
    series="$(printf '%s' "$file" | sed -E 's/^mysql-([0-9]+\.[0-9]+)\..*/\1/')"
    download "https://dev.mysql.com/get/Downloads/MySQL-$series/$file" "$tmp/$file" \
        || download "https://cdn.mysql.com/archives/mysql-$series/$file" "$tmp/$file" \
        || die "MySQL download failed ($file)"
    case "$file" in
        *.tar.xz) tar -xJf "$tmp/$file" -C "$tmp" ;;
        *) tar -xzf "$tmp/$file" -C "$tmp" ;;
    esac
    rm -f "$tmp/$file"
    rm -rf "$DIR/mysql"
    mv "$(find "$tmp" -mindepth 1 -maxdepth 1 -type d | head -1)" "$DIR/mysql"
    rm -rf "$tmp"
    MYSQL_HOME="$DIR/mysql"
    [ -x "$MYSQL_HOME/bin/mysqld" ] || die "mysqld not found in the MySQL archive"
    if [ "$OS_NAME" = "Linux" ]; then check_linux_libs; fi
    log "MySQL installed at $MYSQL_HOME"
}

mysql_socket() {
    echo "/tmp/ezy-mysql-$MYSQL_PORT.sock"
}

write_mysql_config() {
    cat > "$DIR/mysql.cnf" <<EOF
[mysqld]
basedir=$MYSQL_HOME
datadir=$DIR/mysql-data
port=$MYSQL_PORT
bind-address=127.0.0.1
mysqlx=OFF
socket=$(mysql_socket)
pid-file=$DIR/mysql-data/mysqld.pid
log-error=$DIR/logs/mysql-error.log
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_520_ci
max_allowed_packet=64M
EOF
    if [ "$(id -u)" = "0" ]; then
        printf 'user=root\n' >> "$DIR/mysql.cnf"
    fi
    (
        umask 077
        cat > "$STATE_DIR/mysql-root.cnf" <<EOF
[client]
user=root
password=$DB_ROOT_PASSWORD
socket=$(mysql_socket)
EOF
    )
    chmod 600 "$STATE_DIR/mysql-root.cnf"
}

mysql_alive() {
    mysql_env "$(mysql_bin mysqladmin)" --no-defaults --socket="$(mysql_socket)" ping >/dev/null 2>&1
}

start_mysql() {
    [ -n "$DB_URL" ] && return 0
    if mysql_alive; then
        log "MySQL is running on port $MYSQL_PORT"
        return 0
    fi
    if port_in_use "$MYSQL_PORT"; then
        die "port $MYSQL_PORT is used by another program, run install again with --mysql-port <free port>"
    fi
    log "starting MySQL on port $MYSQL_PORT"
    (
        if [ -n "$MYSQL_LD_PATH" ]; then
            export LD_LIBRARY_PATH="$MYSQL_LD_PATH${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
        fi
        nohup "$(mysql_bin mysqld)" --defaults-file="$DIR/mysql.cnf" >> "$DIR/logs/mysql-console.log" 2>&1 &
    )
    local waited=0
    while [ "$waited" -lt 120 ]; do
        if mysql_alive; then
            log "MySQL is running"
            return 0
        fi
        sleep 2
        waited=$((waited + 2))
    done
    tail -n 40 "$DIR/logs/mysql-error.log" 2>/dev/null || true
    die "MySQL did not start, see $DIR/logs/mysql-error.log"
}

stop_mysql() {
    [ -n "$DB_URL" ] && return 0
    [ -n "$MYSQL_HOME" ] || return 0
    if mysql_alive; then
        log "stopping MySQL"
        mysql_env "$(mysql_bin mysqladmin)" --defaults-extra-file="$STATE_DIR/mysql-root.cnf" shutdown >/dev/null 2>&1 || true
        local waited=0
        while mysql_alive && [ "$waited" -lt 60 ]; do
            sleep 2
            waited=$((waited + 2))
        done
    fi
}

setup_mysql() {
    [ -n "$DB_URL" ] && return 0
    mkdir -p "$DIR/logs"
    if [ -z "$MYSQL_PORT" ]; then
        MYSQL_PORT="$(free_port 3306 3399)" || die "no free port for MySQL in 3306..3399, use --mysql-port"
    fi
    write_mysql_config
    save_state
    if [ ! -d "$DIR/mysql-data/mysql" ]; then
        log "initializing the MySQL data folder"
        rm -rf "$DIR/mysql-data"
        mysql_env "$(mysql_bin mysqld)" --defaults-file="$DIR/mysql.cnf" --initialize-insecure \
            || { tail -n 40 "$DIR/logs/mysql-error.log" 2>/dev/null; die "MySQL initialization failed"; }
    fi
    start_mysql
    if ! mysql_env "$(mysql_bin mysql)" --defaults-extra-file="$STATE_DIR/mysql-root.cnf" -e 'SELECT 1' >/dev/null 2>&1; then
        printf "ALTER USER 'root'@'localhost' IDENTIFIED BY '%s';\n" "$DB_ROOT_PASSWORD" \
            | mysql_env "$(mysql_bin mysql)" --no-defaults -uroot --socket="$(mysql_socket)" \
            || die "cannot set the MySQL root password (the data folder $DIR/mysql-data belongs to another password)"
    fi
    mysql_env "$(mysql_bin mysql)" --defaults-extra-file="$STATE_DIR/mysql-root.cnf" <<EOF || die "cannot create the database"
CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
CREATE USER IF NOT EXISTS '$DB_USER'@'127.0.0.1' IDENTIFIED BY '$DB_PASSWORD';
ALTER USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
ALTER USER '$DB_USER'@'127.0.0.1' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'localhost';
GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'127.0.0.1';
FLUSH PRIVILEGES;
EOF
    log "database $DB_NAME and user $DB_USER are ready"
}

set_property() {
    local file="$1" key="$2" value="$3"
    [ -f "$file" ] || touch "$file"
    if grep -q "^$key=" "$file"; then
        sed -i.ezybak "s#^$key=.*#$key=$value#" "$file"
        rm -f "$file.ezybak"
    else
        printf '%s=%s\n' "$key" "$value" >> "$file"
    fi
}

install_ezyplatform() {
    if [ ! -f "$EZ_HOME/cli.sh" ]; then
        local tmp="$STATE_DIR/tmp/ezyplatform"
        rm -rf "$tmp"
        mkdir -p "$tmp"
        download "https://ezyplatform.com/api/v1/platforms/$VERSION/download" "$tmp/ezyplatform.zip" \
            || die "EzyPlatform download failed (version $VERSION)"
        if command -v unzip >/dev/null 2>&1; then
            unzip -q "$tmp/ezyplatform.zip" -d "$tmp"
        else
            (cd "$tmp" && "$JAVA_HOME_DIR/bin/jar" xf ezyplatform.zip)
        fi
        rm -f "$tmp/ezyplatform.zip"
        [ -f "$tmp/ezyplatform/cli.sh" ] || die "unexpected EzyPlatform archive layout"
        rm -rf "$EZ_HOME"
        mv "$tmp/ezyplatform" "$EZ_HOME"
        rm -rf "$tmp"
        log "EzyPlatform $(grep '^ezyplatform.version=' "$EZ_HOME/settings/platform.properties" | cut -d= -f2) extracted to $EZ_HOME"
    fi
    local jdbc_url db_user db_password
    if [ -n "$DB_URL" ]; then
        jdbc_url="$DB_URL"
        db_user="$EXTERNAL_DB_USER"
        db_password="${EZY_DB_PASSWORD:-}"
        [ -n "$db_password" ] || die "set EZY_DB_PASSWORD when --db-url is used"
    else
        jdbc_url="jdbc:mariadb://127.0.0.1:$MYSQL_PORT/$DB_NAME?allowPublicKeyRetrieval=true&useSSL=false"
        db_user="$DB_USER"
        db_password="$DB_PASSWORD"
    fi
    (
        umask 077
        cat > "$EZ_HOME/settings/setup.properties" <<EOF
datasource.jdbc_url=$jdbc_url
datasource.driver_class_name=org.mariadb.jdbc.Driver
datasource.username=$db_user
datasource.password=$db_password
tables.create_manually=false
EOF
    )
    chmod 600 "$EZ_HOME/settings/setup.properties"
    if [ ! -s "$EZ_HOME/settings/encryption-keys.txt" ]; then
        (umask 077; printf '%s\n' "$ENCRYPTION_KEY" > "$EZ_HOME/settings/encryption-keys.txt")
    fi
    set_property "$EZ_HOME/admin/settings/config.properties" server.port "$ADMIN_PORT"
    set_property "$EZ_HOME/admin/settings/config.properties" server.host "$BIND_HOST"
    set_property "$EZ_HOME/web/settings/config.properties" server.port "$WEB_PORT"
    set_property "$EZ_HOME/web/settings/config.properties" server.host "$BIND_HOST"
}

pid_file_of() {
    echo "$EZ_HOME/$1/.runtime/$1_server_instance.pid"
}

target_running() {
    local pid_file
    pid_file="$(pid_file_of "$1")"
    [ -f "$pid_file" ] && [ -n "$(cat "$pid_file")" ] && kill -0 "$(cat "$pid_file")" 2>/dev/null
}

start_target() {
    local target="$1" pid_file
    pid_file="$(pid_file_of "$target")"
    if target_running "$target"; then
        log "$target is already running"
        return
    fi
    rm -f "$pid_file"
    log "starting $target"
    (cd "$EZ_HOME" && JAVA_HOME="$JAVA_HOME_DIR" PATH="$JAVA_HOME_DIR/bin:$PATH" bash cli.sh "start $target") >> "$DIR/logs/ezy-cli.log" 2>&1 \
        || die "cli.sh start $target failed, see $DIR/logs/ezy-cli.log"
}

stop_target() {
    local target="$1" pid_file pid waited=0
    pid_file="$(pid_file_of "$target")"
    if ! target_running "$target"; then
        rm -f "$pid_file"
        return
    fi
    pid="$(cat "$pid_file")"
    log "stopping $target"
    kill -15 "$pid" 2>/dev/null || true
    while kill -0 "$pid" 2>/dev/null && [ "$waited" -lt 40 ]; do
        sleep 2
        waited=$((waited + 2))
    done
    kill -0 "$pid" 2>/dev/null && kill -9 "$pid" 2>/dev/null || true
    rm -f "$pid_file"
}

start_native() {
    resolve_java || die "JDK not found in $DIR/jdk, run install"
    mkdir -p "$DIR/logs"
    start_mysql
    start_target admin
    wait_http "http://127.0.0.1:$ADMIN_PORT/setup-admin?lang=$LANG_CODE" 420 admin "$(pid_file_of admin)"
    start_target web
    wait_http "http://127.0.0.1:$WEB_PORT/" 300 web "$(pid_file_of web)"
}

stop_native() {
    stop_target web
    stop_target socket
    stop_target admin
    stop_mysql
}

docker_compose() {
    if docker compose version >/dev/null 2>&1; then
        docker compose -p "$PROJECT_NAME" -f "$DIR/docker-compose.yml" --env-file "$DIR/.env" "$@"
    elif command -v docker-compose >/dev/null 2>&1; then
        docker-compose -p "$PROJECT_NAME" -f "$DIR/docker-compose.yml" --env-file "$DIR/.env" "$@"
    else
        need docker_compose_missing "Docker Compose is missing, update Docker Desktop / install the docker compose plugin"
    fi
}

check_docker() {
    command -v docker >/dev/null 2>&1 || need docker_not_installed "Docker is not installed, install Docker Desktop or run install without --docker"
    docker info >/dev/null 2>&1 || need docker_not_running "Docker is installed but not running. Start Docker Desktop (macOS: open -a Docker; Linux: sudo systemctl start docker) and run again"
}

write_docker_files() {
    local image_tag="$VERSION"
    (
        umask 077
        cat > "$DIR/.env" <<EOF
MYSQL_ROOT_PASSWORD=$DB_ROOT_PASSWORD
MYSQL_PASSWORD=$DB_PASSWORD
EZY_ENCRYPTION_KEY=$ENCRYPTION_KEY
EZY_IMAGE_TAG=$image_tag
BIND_HOST=$BIND_HOST
ADMIN_PORT=$ADMIN_PORT
WEB_PORT=$WEB_PORT
EOF
    )
    chmod 600 "$DIR/.env"
    cat > "$DIR/docker-compose.yml" <<EOF
services:
  mysql:
    image: $DOCKER_MYSQL_IMAGE
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: \${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: $DB_NAME
      MYSQL_USER: $DB_USER
      MYSQL_PASSWORD: \${MYSQL_PASSWORD}
    command: ["--character-set-server=utf8mb4", "--collation-server=utf8mb4_unicode_520_ci", "--mysqlx=OFF"]
    volumes:
      - mysql-data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "127.0.0.1", "--silent"]
      interval: 5s
      timeout: 10s
      retries: 60
      start_period: 30s
  ezyplatform:
    image: $DOCKER_EZY_IMAGE:\${EZY_IMAGE_TAG}
    restart: unless-stopped
    depends_on:
      mysql:
        condition: service_healthy
    environment:
      DATASOURCE_JDBC_URL: "jdbc:mariadb://mysql:3306/$DB_NAME?allowPublicKeyRetrieval=true&useSSL=false"
      DATASOURCE_DRIVER_CLASS_NAME: org.mariadb.jdbc.Driver
      DATASOURCE_USERNAME: $DB_USER
      DATASOURCE_PASSWORD: \${MYSQL_PASSWORD}
      EZY_CREATE_TABLE_MANUALLY: "false"
      EZY_ENCRYPTION_KEY: \${EZY_ENCRYPTION_KEY}
      EZY_SOCKET_START: "false"
    ports:
      - "\${BIND_HOST}:\${ADMIN_PORT}:9090"
      - "\${BIND_HOST}:\${WEB_PORT}:8080"
    volumes:
      - ezyplatform-data:/app/ezyplatform
volumes:
  mysql-data: {}
  ezyplatform-data: {}
EOF
}

docker_running() {
    [ -f "$DIR/docker-compose.yml" ] && [ -n "$(docker_compose ps -q ezyplatform 2>/dev/null)" ] \
        && [ "$(docker inspect -f '{{.State.Running}}' "$(docker_compose ps -q ezyplatform)" 2>/dev/null)" = "true" ]
}

start_docker() {
    check_docker
    log "starting the Docker stack $PROJECT_NAME (the first time downloads the images)"
    docker_compose up -d || die "docker compose up failed"
    wait_http "http://127.0.0.1:$ADMIN_PORT/setup-admin?lang=$LANG_CODE" 900 admin ""
    wait_http "http://127.0.0.1:$WEB_PORT/" 300 web ""
}

fix_docker_web() {
    [ "$MODE" = "docker" ] || return 0
    [ "$(http_code "http://127.0.0.1:$WEB_PORT/")" = "404" ] || return 0
    log "web started before the database was ready, restarting the EzyPlatform container once"
    docker_compose restart ezyplatform >/dev/null 2>&1 || die "docker compose restart failed"
    wait_http "http://127.0.0.1:$ADMIN_PORT/setup-admin?lang=$LANG_CODE" 300 admin ""
    local waited=0
    while [ "$waited" -lt 180 ]; do
        case "$(http_code "http://127.0.0.1:$WEB_PORT/")" in
            2*|3*) log "web is up"; return 0 ;;
        esac
        sleep 3
        waited=$((waited + 3))
    done
    log "web still answers $(http_code "http://127.0.0.1:$WEB_PORT/") after the restart"
}

pick_ports() {
    local running="false"
    if [ "$MODE" = "docker" ]; then
        docker_running && running="true"
    else
        target_running admin && running="true"
    fi
    if [ "$running" = "true" ]; then
        return
    fi
    if [ -z "$ADMIN_PORT" ]; then
        ADMIN_PORT="$(free_port 9090 9190)" || die "no free admin port in 9090..9190, use --admin-port"
    elif port_in_use "$ADMIN_PORT"; then
        die "port $ADMIN_PORT is busy, choose another one with --admin-port"
    fi
    if [ -z "$WEB_PORT" ]; then
        WEB_PORT="$(free_port 8080 8180)" || die "no free web port in 8080..8180, use --web-port"
    elif port_in_use "$WEB_PORT"; then
        die "port $WEB_PORT is busy, choose another one with --web-port"
    fi
    [ "$ADMIN_PORT" = "9090" ] || log "port 9090 is busy, admin uses port $ADMIN_PORT"
    [ "$WEB_PORT" = "8080" ] || log "port 8080 is busy, web uses port $WEB_PORT"
}

setup_admin() {
    local base="http://127.0.0.1:$ADMIN_PORT" code redirect
    code="$(http_code "$base/setup-admin?lang=$LANG_CODE")"
    if [ "$code" != "200" ]; then
        redirect="$(http_redirect "$base/setup-admin?lang=$LANG_CODE")"
        case "$redirect" in
            *setup-admin*) die "unexpected redirect $redirect from /setup-admin" ;;
        esac
        log "an admin account already exists, skip creating the first admin"
        ADMIN_STATUS="existing"
        return
    fi
    printf '%s' "$ADMIN_USER" | grep -Eq '^[a-zA-Z0-9_.-]{3,64}$' \
        || die "admin username must be 3-64 characters of letters, digits, _ . -"
    printf '%s' "$ADMIN_EMAIL" | grep -Eq '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,9}$' \
        || die "a valid --admin-email is required"
    local password="${EZY_ADMIN_PASSWORD:-}"
    if [ -z "$password" ]; then
        password="$(random_hex 20)"
        GENERATED_ADMIN_PASSWORD="$password"
    fi
    if [ "${#password}" -lt 6 ] || [ "${#password}" -gt 128 ]; then
        die "admin password must have 6 to 128 characters"
    fi
    printf '%s' "$password" | curl -s -o /dev/null -m 60 \
        --data-urlencode "username=$ADMIN_USER" \
        --data-urlencode "email=$ADMIN_EMAIL" \
        --data-urlencode "password@-" \
        "$base/setup-admin?lang=$LANG_CODE" || die "cannot send the admin setup form"
    code="$(http_code "$base/setup-admin?lang=$LANG_CODE")"
    [ "$code" != "200" ] || die "the first admin was not created, check username/email/password"
    ADMIN_STATUS="created"
    log "first admin '$ADMIN_USER' created"
}

print_result() {
    local host="localhost"
    echo "=== EzyPlatform is ready ==="
    echo "RESULT_MODE=$MODE"
    echo "RESULT_DIR=$DIR"
    echo "RESULT_ADMIN_URL=http://$host:$ADMIN_PORT"
    echo "RESULT_WEB_URL=http://$host:$WEB_PORT"
    echo "RESULT_ADMIN_USERNAME=$ADMIN_USER"
    echo "RESULT_ADMIN_ACCOUNT=${ADMIN_STATUS:-unknown}"
    if [ -n "${GENERATED_ADMIN_PASSWORD:-}" ]; then
        echo "RESULT_GENERATED_ADMIN_PASSWORD=$GENERATED_ADMIN_PASSWORD"
    fi
    echo "RESULT_CONTROL=bash \"$DIR/ezyplatform-ctl.sh\" start|stop|status"
}

install_command() {
    if [ -f "$STATE_FILE" ] && [ -n "$OPT_DOCKER" ] && [ "$MODE" != "docker" ]; then
        die "$DIR already has a native installation, use another --dir for Docker"
    fi
    mkdir -p "$DIR" "$STATE_DIR" "$DIR/logs"
    chmod 700 "$STATE_DIR"
    [ -n "$DB_ROOT_PASSWORD" ] || DB_ROOT_PASSWORD="$(random_hex 32)"
    [ -n "$DB_PASSWORD" ] || DB_PASSWORD="$(random_hex 32)"
    [ -n "$ENCRYPTION_KEY" ] || ENCRYPTION_KEY="$(random_hex 32)"
    if [ "$MODE" = "docker" ]; then
        check_docker
        pick_ports
        save_state
        write_docker_files
        start_docker
    else
        command -v curl >/dev/null 2>&1 || need linux_packages "curl is missing, install the curl package (needs sudo) and run install again"
        pick_ports
        save_state
        install_jdk
        save_state
        install_mysql_binaries
        save_state
        setup_mysql
        install_ezyplatform
        save_state
        start_native
    fi
    setup_admin
    fix_docker_web
    save_state
    cp "$SCRIPT_PATH" "$DIR/ezyplatform-ctl.sh"
    chmod 700 "$DIR/ezyplatform-ctl.sh"
    rm -rf "$STATE_DIR/tmp"
    print_result
}

require_install() {
    [ -f "$STATE_FILE" ] || die "no EzyPlatform installation in $DIR (run install, or pass --dir)"
}

status_command() {
    require_install
    echo "mode=$MODE dir=$DIR"
    if [ "$MODE" = "docker" ]; then
        check_docker
        docker_compose ps
    else
        if [ -n "$DB_URL" ]; then
            echo "mysql=external"
        elif [ -n "$MYSQL_HOME" ] && mysql_alive; then
            echo "mysql=running port=$MYSQL_PORT"
        else
            echo "mysql=stopped"
        fi
        for target in admin web; do
            target_running "$target" && echo "$target=running" || echo "$target=stopped"
        done
    fi
    echo "admin http=$(http_code "http://127.0.0.1:$ADMIN_PORT/") url=http://localhost:$ADMIN_PORT"
    echo "web http=$(http_code "http://127.0.0.1:$WEB_PORT/") url=http://localhost:$WEB_PORT"
}

uninstall_command() {
    require_install
    [ "$OPT_YES" = "true" ] || die "uninstall deletes $DIR and all its data, pass --yes after the user confirmed"
    case "$DIR" in
        "/"|"$HOME"|"$HOME/") die "refusing to delete $DIR" ;;
    esac
    if [ "$MODE" = "docker" ]; then
        check_docker
        docker_compose down -v || true
    else
        stop_native
    fi
    rm -rf "$DIR"
    log "deleted $DIR"
}

case "$COMMAND" in
    check) check_command ;;
    install) install_command ;;
    start)
        require_install
        if [ "$MODE" = "docker" ]; then start_docker; else start_native; fi
        status_command
        ;;
    stop)
        require_install
        if [ "$MODE" = "docker" ]; then check_docker; docker_compose stop; else stop_native; fi
        log "stopped"
        ;;
    status) status_command ;;
    uninstall) uninstall_command ;;
    help|-h|--help) usage ;;
    *) usage; exit 1 ;;
esac

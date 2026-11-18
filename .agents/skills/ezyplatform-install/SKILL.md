---
name: ezyplatform-install
description: Install EzyPlatform on the user's own computer from scratch, with everything it needs (MySQL 8.4, JDK 8, EzyPlatform admin + web) and the first admin account, so the user does not have to understand or touch anything. Detects Windows, macOS or Linux and the CPU automatically, offers Docker when Docker is available, picks free ports, starts the servers and checks they answer. Also starts, stops, checks or removes an installation made by this skill. Use when the user asks to install / set up / cài đặt / cài EzyPlatform, cannot get EzyPlatform running, needs MySQL or Java 8 for EzyPlatform, or wants to start, stop, check or uninstall their local EzyPlatform.
---

# Install EzyPlatform for a non-technical user

The user is usually a "vibe coder": they do not know what MySQL, a JDK, a port or a terminal is, and they should not need to. Do every step yourself with the scripts in this skill, ask only the few questions listed below, and explain results in plain words.

The skill ships two scripts next to this file (call the folder of this file `<skill>`):

| OS | Script | How to run |
|---|---|---|
| macOS, Linux (also WSL) | `<skill>/scripts/install.sh` | `bash <skill>/scripts/install.sh <command> [options]` |
| Windows | `<skill>/scripts/install.ps1` | `powershell -NoProfile -ExecutionPolicy Bypass -File "<skill>\scripts\install.ps1" <command> [options]` |

Both have the same commands: `check`, `install`, `start`, `stop`, `status`, `uninstall`. Both support a native install and a Docker install. Run the script with `help` for every option. Bash options are `--admin-email`, PowerShell options are `-AdminEmail` (same names in PascalCase).

## What the install does

Native install (default), everything inside one folder (`~/ezyplatform` on macOS/Linux, `C:\ezyplatform` on Windows), nothing installed system-wide, no administrator password needed in the normal case:

- `jdk/`: Azul Zulu JDK 8 for the right OS and CPU (checksum verified). The user's other Java versions are untouched.
- `mysql/` + `mysql-data/` + `mysql.cnf|mysql.ini`: a private MySQL from the official archives. The version depends on the machine:
  - MySQL 8.4 latest: Linux, Windows, and Apple Silicon Macs on macOS 15+.
  - MySQL 8.4.11: Intel Macs on macOS 15+, the last Intel build.
  - MySQL 8.4.3: macOS 14.
  - MySQL 8.0.35: macOS 13.

  It listens only on `127.0.0.1` on the first free port of 3306..3399, so it never clashes with a MySQL the user already has. Database `ezyplatform`, user `ezyplatform`, random passwords, `utf8mb4_unicode_520_ci`.
- `ezyplatform/`: the latest EzyPlatform from `https://ezyplatform.com/api/v1/platforms/latest/download` (or `--version x.y.z`). The script writes:
  - `settings/setup.properties`, using the MariaDB driver that ships with EzyPlatform and `allowPublicKeyRetrieval=true&useSSL=false`.
  - A random `settings/encryption-keys.txt`.
  - Admin on port 9090 and web on port 8080, or the next free ports. Both listen on `127.0.0.1` only, unless `--public` is given.
- Starts MySQL, admin, waits until admin answers (the first start creates the tables, up to a few minutes), starts web, then creates the first admin through the setup form (`POST /setup-admin`) and checks that it exists.
- `.ezy/`: state and secrets of the installation (random DB passwords, encryption key). Never show its content.
- Copies the script itself to `<dir>/ezyplatform-ctl.sh` / `<dir>\ezyplatform-ctl.ps1` for later start/stop.

Docker install (`--docker` / `-Docker`), files in the same kind of folder:
- `docker-compose.yml` + `.env` (secrets) with two containers:
  - `mysql:8.4`, not exposed to the host.
  - `youngmonkeys/ezyplatform-only` (amd64 and arm64).
- Data lives in the Docker volumes `mysql-data` and `ezyplatform-data` of the Compose project (default name `ezyplatform`).
- Admin and web ports are published on `127.0.0.1` only.
- Containers restart automatically with Docker.

Re-running `install` is safe: finished steps are skipped and a step that failed is retried. Secrets and ports are reused.

## Rules

- Talk to the user in their language, in simple words. Do not dump logs on them. Summarize what you are doing ("đang tải MySQL, khoảng vài phút").
- Ask only:
  - Docker or not, and only when Docker exists on the machine.
  - The admin account (email, username, password).
  - The user's confirmation before `uninstall` or anything that deletes data.
  - Never ask them to edit files, choose ports, or understand errors.
- Never print or repeat secrets: `.ezy/secrets.*`, `.ezy/mysql-root.cnf`, `.env`, `settings/setup.properties`, `encryption-keys.txt`. The only secret you show is the admin password the script generated, once, in the final report.
- Pass the admin password only through the environment variable `EZY_ADMIN_PASSWORD` of the install command. Never write it to a file, a note or memory.
- Do not uninstall or delete an existing EzyPlatform, database or Docker volume unless the user explicitly asks and confirms.
- Do not use `sudo`, install system packages or start installers that show a Windows admin prompt without telling the user first what it is for. Only do it in the cases listed under "When the script prints NEED".
- The install downloads a lot (JDK about 100 MB, MySQL 50–300 MB, EzyPlatform about 40 MB, Docker images about 1 GB) and takes from 3 to 15 minutes. Run it with a long timeout (or in the background and wait for it) and tell the user it is working.

## Steps

### 1. Detect the OS and the current state

Find out the OS from your environment (`uname -s` gives `Darwin` or `Linux`; on Windows `$env:OS` is `Windows_NT`, or the shell is PowerShell/cmd/Git Bash). On Windows use the PowerShell script even when your shell is Git Bash. Inside WSL use the bash script: the user's Windows browser reaches `localhost` of WSL 2.

Run `check` (changes nothing):

```bash
bash <skill>/scripts/install.sh check
```
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "<skill>\scripts\install.ps1" check
```

It prints the OS, CPU, Docker state (`docker=running|installed_not_running|no`), the ports and whether an installation already exists in the default folder.

If `existing_install=yes`, do not install again. Run `status`, tell the user it is already installed, and `start` it if it is stopped. If the user has an EzyPlatform installed some other way (not by this skill), ask before installing a second one, and use different ports (the script picks free ones automatically).

### 2. Docker or native

- `docker=running` or `docker=installed_not_running`: ask the user once, in plain words, with a recommendation. For example: "Máy bạn có Docker. Cài bằng Docker (gọn, xoá sạch dễ, khuyên dùng) hay cài trực tiếp vào máy?" If they do not care, use Docker when it is running, native otherwise.
- `docker=no`: native, do not mention Docker.

### 3. Ask for the first admin account (one message)

- Email: required, used to sign in and to recover the password.
- Username: default `admin`. Allowed: 3-64 letters, digits, `_ . -`.
- Password: 6-128 characters, or "let me create one". If they let you, do not pass `EZY_ADMIN_PASSWORD`: the script generates a strong one and prints it.

Use the user's language as the admin language: `--lang vi`, `--lang en`, ...

Do not ask about the folder or the ports. Use the defaults unless the user mentions them. On Windows the folder must not contain spaces or accented characters, so keep `C:\ezyplatform` (the script refuses other paths with such characters).

### 4. Install

macOS / Linux:

```bash
EZY_ADMIN_PASSWORD='<password>' bash <skill>/scripts/install.sh install --admin-email '<email>' --admin-user '<username>' --lang vi [--docker]
```

Windows (escape a `'` in the password as `''`):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -Command "$env:EZY_ADMIN_PASSWORD='<password>'; & '<skill>\scripts\install.ps1' install -AdminEmail '<email>' -AdminUser '<username>' -Lang vi [-Docker]"
```

Leave `EZY_ADMIN_PASSWORD` out when the user let you generate the password.

Exit codes:
- `0`: done. The last lines are `RESULT_*` (`RESULT_ADMIN_URL`, `RESULT_WEB_URL`, `RESULT_ADMIN_USERNAME`, `RESULT_ADMIN_ACCOUNT=created|existing`, optional `RESULT_GENERATED_ADMIN_PASSWORD`, `RESULT_CONTROL`).
- `3`: a requirement is missing. The script prints a line `NEED <code>: <what to do>`. Fix it as below, then run the same install command again.
- `1`: error. Read the message and the log tail it prints; see "Troubleshooting".

`RESULT_ADMIN_ACCOUNT=existing` means an admin already existed: the password was not changed. If the user does not know it, use the skill `ezyplatform-reset-admin-password`.

### 5. When the script prints NEED

| Code | What to do |
|---|---|
| `docker_not_running` | Start Docker yourself: `open -a Docker` (macOS), `Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"` (Windows), `sudo systemctl start docker` (Linux, ask first). Wait until `docker info` works (poll up to 3 minutes), then run install again. If it does not start, offer the native install. |
| `docker_not_installed`, `docker_compose_missing` | Use the native install instead (run install without `--docker`). Install Docker only if the user insists. |
| `vc_runtime` (Windows) | MySQL needs the Microsoft Visual C++ runtime. Tell the user that Windows will ask "Do you want to allow this app to make changes" once and they should click Yes. Run `winget install --id Microsoft.VCRedist.2015+.x64 -e --silent --accept-package-agreements --accept-source-agreements`. Without winget, download `https://aka.ms/vs/17/release/vc_redist.x64.exe` to a temp folder and run it with `/install /quiet /norestart`. Then install again. |
| `mysql_unsupported_platform` on macOS 12 or older | Official MySQL archives start at macOS 13. Prefer `--docker` when Docker Desktop can be installed. Otherwise install MySQL another way (Homebrew may compile it from source for a long time on old or Intel Macs, warn the user) and pass `--mysql-home "$(brew --prefix mysql)"`. |
| `linux_packages` | Missing system libraries (`libaio`, `libnuma`, `ncurses`, `xz`, `curl`). Build the install command for the package manager the script names, for example `sudo apt-get update && sudo apt-get install -y libaio1t64 libnuma1 libncurses6 xz-utils` (Ubuntu 24.04+; use `libaio1` on older Ubuntu/Debian; `sudo dnf install -y libaio numactl-libs ncurses-libs xz` on Fedora/RHEL). If `sudo -n true` succeeds, run it yourself after telling the user. Otherwise ask the user to paste that one command in their terminal and type their password. Never ask for the password in the chat. Then install again. |
| `mysql_unsupported_platform` | Old glibc, musl (Alpine) or an unusual CPU. Prefer `--docker`. Otherwise install MySQL or MariaDB with the system package manager (with the user's permission). Create a database `ezyplatform` (`utf8mb4`, `utf8mb4_unicode_520_ci`) and a user with all privileges on it, with a random password. Then run install with `--db-url 'jdbc:mariadb://127.0.0.1:3306/ezyplatform?allowPublicKeyRetrieval=true&useSSL=false' --db-user ezyplatform` and the password in `EZY_DB_PASSWORD`. |

### 6. Check and hand over

1. Run `status` (via the copied control script or the skill script with the same `--dir`). MySQL, admin and web must be running, and `admin http` / `web http` must not be `000`.
2. Open the admin page in the user's browser: `open <url>` (macOS), `xdg-open <url>` (Linux), `Start-Process <url>` (Windows).
3. Report to the user, in their language and in plain words:
   - Admin address (`RESULT_ADMIN_URL`, for example http://localhost:9090) and website address (`RESULT_WEB_URL`).
   - The username. If the password was generated, show `RESULT_GENERATED_ADMIN_PASSWORD` once and tell them to save it and change it in the admin profile page.
   - That EzyPlatform runs only on this computer.
   - That after restarting the computer they can just ask you to "start EzyPlatform". With Docker, it starts by itself when Docker Desktop starts.
   - The installation folder, and that deleting it (after `stop`) removes everything (Docker: `uninstall`).

Do not mention database passwords, encryption keys or ports of MySQL unless asked.

## Later requests

Run the control script that the install copied, or the skill script with `--dir <folder>` / `-Dir <folder>` when the folder is not the default.

| User says | Command |
|---|---|
| start / bật / chạy lại EzyPlatform | `start` (starts MySQL, then admin, then web, and waits until they answer) |
| stop / tắt | `stop` |
| is it running / kiểm tra | `status` |
| remove / gỡ / xoá EzyPlatform | Confirm first, warning that all data is deleted. Then run `uninstall --yes` / `uninstall -Yes`. |
| run automatically when the computer starts | Only on request. Native installs have no auto start:<br>- macOS: a LaunchAgent plist in `~/Library/LaunchAgents` that runs `bash <dir>/ezyplatform-ctl.sh start` with `RunAtLoad`.<br>- Linux: a `systemd --user` service of type oneshot with `RemainAfterExit=yes`, plus `loginctl enable-linger` if needed. Or a `@reboot` crontab line.<br>- Windows: `schtasks /Create /SC ONLOGON /TN EzyPlatform /TR "powershell -NoProfile -ExecutionPolicy Bypass -File C:\ezyplatform\ezyplatform-ctl.ps1 start"`.<br>Docker installs already restart with Docker. |
| forgot the admin password | skill `ezyplatform-reset-admin-password`:<br>- Native: EzyPlatform home is `<dir>/ezyplatform`, Java is `<dir>/jdk` (`<dir>/jdk/.../bin/java`). MySQL must be running (`start`).<br>- Docker: the container is the `ezyplatform` service of the Compose project. |

## Troubleshooting

Where to look:

| What | Where |
|---|---|
| EzyPlatform logs (native) | `<dir>/ezyplatform/logs/admin-server.log` and `web-server.log` |
| Windows console output | `<dir>/logs/admin-console.log` and `web-console.log` |
| MySQL logs | `<dir>/logs/mysql-error.log` |
| CLI output | `<dir>/logs/ezy-cli.log` |
| Docker logs | `docker compose -p ezyplatform -f <dir>/docker-compose.yml --env-file <dir>/.env logs --tail 200 ezyplatform` (or `mysql`) |

Read the end of the log, fix the cause yourself, and run `install` or `start` again.

Common causes:
- **Admin stops at start:**
  - `Communications link failure` or `Access denied`: the database is not reachable. Check `status`, start MySQL with `start`, and check `setup.properties` points to the private MySQL port. Do not print the password.
  - `Address already in use`: another program took the port after install. Stop that program, or set another port with `install --admin-port <port>`. A re-run updates the configuration.
- **MySQL does not start:**
  - A leftover `mysqld` still running from a crash: find it and stop it.
  - Disk full.
  - On Linux, missing libraries (see `linux_packages`).
  - On Windows, a missing VC++ runtime (see `vc_runtime`).
  - On macOS, a "cannot be opened because the developer cannot be verified" dialog: run `xattr -dr com.apple.quarantine <dir>/mysql <dir>/jdk`.
- **Admin answers but the setup form fails:** the email or username is invalid. Ask the user for a valid one and run install again. The admin is created only once.
- **The first start is slow:** creating the tables can take a few minutes on slow disks. The script waits up to 7 minutes natively and 15 minutes with Docker (image download included).
- **Behind a proxy:**
  - `curl` honours `HTTPS_PROXY`.
  - Docker needs the proxy set in Docker Desktop.
- **Antivirus or a corporate policy blocking downloads:**
  - Download the files the script names on another network into the place the script expects, or use `--mysql-home` with an existing MySQL folder.
  - Then run install again.

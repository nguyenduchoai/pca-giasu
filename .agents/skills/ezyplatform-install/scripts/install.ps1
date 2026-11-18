param(
    [Parameter(Position = 0)] [string] $Command = "help",
    [string] $Dir = "",
    [switch] $Docker,
    [string] $Version = "",
    [string] $AdminUser = "",
    [string] $AdminEmail = "",
    [string] $Lang = "",
    [int] $AdminPort = 0,
    [int] $WebPort = 0,
    [int] $MysqlPort = 0,
    [string] $MysqlHome = "",
    [string] $DbUrl = "",
    [string] $DbUser = "",
    [switch] $Public,
    [string] $Name = "",
    [switch] $Yes
)

$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

$MysqlSeries = "8.4"
$MysqlFallbackVersion = "8.4.13"
$DockerMysqlImage = "mysql:8.4"
$DockerEzyImage = "youngmonkeys/ezyplatform-only"
$DbName = "ezyplatform"
$DbUserName = "ezyplatform"
$Utf8NoBom = New-Object System.Text.UTF8Encoding $false

function Show-Usage {
    @"
usage: powershell -NoProfile -ExecutionPolicy Bypass -File install.ps1 <command> [options]

commands:
  check       detect Windows version, CPU, Docker, ports and an existing installation (changes nothing)
  install     install MySQL + JDK 8 + EzyPlatform (or the Docker stack), start it and create the first admin
  start       start an installed EzyPlatform (MySQL, admin, web)
  stop        stop it
  status      show what is running
  uninstall   stop and delete everything in -Dir (needs -Yes)

options:
  -Dir <folder>          installation folder (default: C:\ezyplatform)
  -Docker                use Docker (MySQL + EzyPlatform containers) instead of a native install
  -Version <x.y.z>       EzyPlatform version (default: latest)
  -AdminUser <name>      first admin username (default: admin)
  -AdminEmail <email>    first admin email (required by install)
  -Lang <code>           admin default language, for example vi or en (default: en)
  -AdminPort <port>      admin port (default: 9090, next free port if busy)
  -WebPort <port>        web port (default: 8080, next free port if busy)
  -MysqlPort <port>      port of the private MySQL (default: first free of 3306..3399)
  -MysqlHome <folder>    use MySQL binaries from this folder (it has bin\mysqld.exe) instead of downloading
  -DbUrl <jdbc url>      use an existing database instead of a private MySQL (with -DbUser and env EZY_DB_PASSWORD)
  -DbUser <user>
  -Public                listen on all network interfaces instead of only this computer
  -Name <name>           Docker Compose project name (default: ezyplatform)
  -Yes                   confirm uninstall

environment:
  EZY_ADMIN_PASSWORD     first admin password (6-128 characters); generated and printed when empty
  EZY_DB_PASSWORD        password of -DbUser when -DbUrl is used

exit codes: 0 ok, 1 error, 3 a requirement is missing (see the NEED line)
"@ | Write-Output
}

function Log([string] $Message) { Write-Host "[ezy] $Message" }
function Fail([string] $Message) { [Console]::Error.WriteLine("[ezy] ERROR: $Message"); exit 1 }
function Need([string] $Code, [string] $Message) { Write-Host "NEED ${Code}: $Message"; exit 3 }

if (-not $Dir -and (Split-Path -Leaf $PSCommandPath) -eq "ezyplatform-ctl.ps1") {
    $Dir = Split-Path -Parent $PSCommandPath
}
if (-not $Dir) {
    if ($env:EZY_DIR) { $Dir = $env:EZY_DIR } else { $Dir = "C:\ezyplatform" }
}
$Dir = [System.IO.Path]::GetFullPath($Dir)
$StateDir = Join-Path $Dir ".ezy"
$StateFile = Join-Path $StateDir "state.json"
$SecretsFile = Join-Path $StateDir "secrets.json"
$EzHome = Join-Path $Dir "ezyplatform"
$LogsDir = Join-Path $Dir "logs"

$State = [ordered]@{
    Mode = "native"; Version = "latest"; AdminUser = "admin"; AdminEmail = ""; Lang = "en"
    AdminPort = 0; WebPort = 0; MysqlPort = 0; MysqlHome = ""; DbUrl = ""; DbUser = ""
    BindHost = "127.0.0.1"; ProjectName = "ezyplatform"; JavaHome = ""
}
$Secrets = [ordered]@{ DbRootPassword = ""; DbPassword = ""; EncryptionKey = "" }

if (Test-Path $StateFile) {
    $loaded = Get-Content $StateFile -Raw -ErrorAction Stop | ConvertFrom-Json
    foreach ($p in $loaded.PSObject.Properties) { $State[$p.Name] = $p.Value }
}
if (Test-Path $SecretsFile) {
    $loaded = Get-Content $SecretsFile -Raw | ConvertFrom-Json
    foreach ($p in $loaded.PSObject.Properties) { $Secrets[$p.Name] = $p.Value }
}

if ($Docker) { $State.Mode = "docker" }
if ($Version) { $State.Version = $Version }
if ($AdminUser) { $State.AdminUser = $AdminUser }
if ($AdminEmail) { $State.AdminEmail = $AdminEmail }
if ($Lang) { $State.Lang = $Lang }
if ($AdminPort) { $State.AdminPort = $AdminPort }
if ($WebPort) { $State.WebPort = $WebPort }
if ($MysqlPort) { $State.MysqlPort = $MysqlPort }
if ($MysqlHome) { $State.MysqlHome = $MysqlHome }
if ($DbUrl) { $State.DbUrl = $DbUrl }
if ($DbUser) { $State.DbUser = $DbUser }
if ($Public) { $State.BindHost = "0.0.0.0" }
if ($Name) { $State.ProjectName = $Name }

$Arch = $env:PROCESSOR_ARCHITECTURE
if ($env:PROCESSOR_ARCHITEW6432) { $Arch = $env:PROCESSOR_ARCHITEW6432 }

function Write-TextFile([string] $Path, [string] $Text) {
    $parent = Split-Path $Path -Parent
    if ($parent -and -not (Test-Path $parent)) { New-Item -ItemType Directory -Force -Path $parent | Out-Null }
    [System.IO.File]::WriteAllText($Path, $Text, $Utf8NoBom)
}

function Protect-File([string] $Path) {
    try {
        $acl = New-Object System.Security.AccessControl.FileSecurity
        $acl.SetAccessRuleProtection($true, $false)
        $identity = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
        $rule = New-Object System.Security.AccessControl.FileSystemAccessRule($identity, "FullControl", "Allow")
        $acl.AddAccessRule($rule)
        Set-Acl -Path $Path -AclObject $acl
    } catch {
    }
}

function Save-State {
    New-Item -ItemType Directory -Force -Path $StateDir | Out-Null
    Write-TextFile $StateFile ($State | ConvertTo-Json)
    Write-TextFile $SecretsFile ($Secrets | ConvertTo-Json)
    Protect-File $SecretsFile
}

function New-RandomHex([int] $Length) {
    $bytes = New-Object byte[] 64
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    (($bytes | ForEach-Object { $_.ToString("x2") }) -join "").Substring(0, $Length)
}

function Test-PortInUse([int] $Port) {
    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $task = $client.ConnectAsync("127.0.0.1", $Port)
        return ($task.Wait(1000) -and $client.Connected)
    } catch {
        return $false
    } finally {
        $client.Close()
    }
}

function Get-FreePort([int] $First, [int] $Last) {
    for ($port = $First; $port -le $Last; $port++) {
        if (-not (Test-PortInUse $port)) { return $port }
    }
    return 0
}

function Get-Curl {
    $curl = Join-Path $env:WINDIR "System32\curl.exe"
    if (Test-Path $curl) { return $curl }
    $found = Get-Command curl.exe -ErrorAction SilentlyContinue
    if ($found) { return $found.Source }
    return $null
}

function Get-HttpCode([string] $Url) {
    $curl = Get-Curl
    if ($curl) {
        $code = & $curl -s -o NUL -m 10 -w "%{http_code}" $Url 2>$null
        if ($code) { return [string]$code }
        return "000"
    }
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -MaximumRedirection 0 -TimeoutSec 10 -ErrorAction Stop
        return [string][int]$response.StatusCode
    } catch {
        if ($_.Exception.Response) { return [string][int]$_.Exception.Response.StatusCode }
        return "000"
    }
}

function Get-HttpRedirect([string] $Url) {
    $curl = Get-Curl
    if ($curl) { return [string](& $curl -s -o NUL -m 10 -w "%{redirect_url}" $Url 2>$null) }
    return ""
}

function Invoke-Download([string] $Url, [string] $Out) {
    Log "downloading $Url"
    $part = "$Out.part"
    $curl = Get-Curl
    if ($curl) {
        & $curl -fL --retry 3 --retry-delay 3 --connect-timeout 30 -o $part $Url | Out-Host
        if ($LASTEXITCODE -ne 0) { return $false }
    } else {
        try { Invoke-WebRequest -Uri $Url -OutFile $part -UseBasicParsing -ErrorAction Stop } catch { return $false }
    }
    Move-Item -Force $part $Out
    return $true
}

function Expand-Zip([string] $Zip, [string] $Destination) {
    New-Item -ItemType Directory -Force -Path $Destination | Out-Null
    $tar = Join-Path $env:WINDIR "System32\tar.exe"
    if (Test-Path $tar) {
        & $tar -xf $Zip -C $Destination
        if ($LASTEXITCODE -eq 0) { return }
    }
    Expand-Archive -Path $Zip -DestinationPath $Destination -Force -ErrorAction Stop
}

function Wait-Http([string] $Url, [int] $Seconds, [string] $Label, [scriptblock] $AliveCheck) {
    Log "waiting for $Label at $Url (up to ${Seconds}s, the first start creates the database tables)"
    $waited = 0
    while ($waited -lt $Seconds) {
        $code = Get-HttpCode $Url
        if ($code -match '^[234]\d\d$') { Log "$Label is up (HTTP $code)"; return }
        if ($AliveCheck -and $waited -ge 30 -and -not (& $AliveCheck)) {
            Show-LogTail $Label
            Fail "$Label stopped while starting, see $LogsDir"
        }
        Start-Sleep -Seconds 3
        $waited += 3
    }
    Show-LogTail $Label
    Fail "$Label did not answer at $Url after ${Seconds}s"
}

function Show-LogTail([string] $Label) {
    if ($State.Mode -eq "docker") {
        Invoke-Compose @("logs", "--tail", "80", "ezyplatform")
        return
    }
    foreach ($file in @((Join-Path $EzHome "logs\$Label-server.log"), (Join-Path $LogsDir "$Label-console.log"))) {
        if (Test-Path $file) { Get-Content $file -Tail 60 | Out-Host }
    }
}

function Invoke-Check {
    $os = Get-CimInstance Win32_OperatingSystem
    Log "os=Windows $($os.Caption) $($os.Version) arch=$Arch dir=$Dir"
    if (Get-Command docker -ErrorAction SilentlyContinue) {
        & docker info *> $null
        if ($LASTEXITCODE -eq 0) { Log "docker=running" } else { Log "docker=installed_not_running" }
    } else {
        Log "docker=no"
    }
    if (Get-Command winget -ErrorAction SilentlyContinue) { Log "winget=yes" } else { Log "winget=no" }
    if (Test-VcRuntime) { Log "vc_runtime=yes" } else { Log "vc_runtime=no" }
    foreach ($port in 9090, 8080, 3306) {
        if (Test-PortInUse $port) { Log "port $port=busy" } else { Log "port $port=free" }
    }
    if (Test-Path $StateFile) {
        Log "existing_install=yes mode=$($State.Mode) admin_port=$($State.AdminPort) web_port=$($State.WebPort)"
    } else {
        Log "existing_install=no"
    }
}

function Test-VcRuntime {
    $system32 = Join-Path $env:WINDIR "System32"
    return (Test-Path (Join-Path $system32 "vcruntime140.dll")) -and (Test-Path (Join-Path $system32 "vcruntime140_1.dll")) -and (Test-Path (Join-Path $system32 "msvcp140.dll"))
}

function Resolve-Java {
    if ($State.JavaHome -and (Test-Path (Join-Path $State.JavaHome "bin\java.exe"))) { return $true }
    $jdkDir = Join-Path $Dir "jdk"
    if (Test-Path $jdkDir) {
        $java = Get-ChildItem -Path $jdkDir -Recurse -Filter java.exe -ErrorAction SilentlyContinue |
            Where-Object { $_.FullName -notmatch '\\jre\\bin\\' -and $_.Directory.Name -eq "bin" } | Select-Object -First 1
        if ($java) {
            $State.JavaHome = $java.Directory.Parent.FullName
            return $true
        }
    }
    return $false
}

function Test-Java8 {
    $java = Join-Path $State.JavaHome "bin\java.exe"
    $output = & cmd.exe /c "`"$java`" -version 2>&1"
    return (($output -join "`n") -match '"1\.8')
}

function Install-Jdk {
    if ((Resolve-Java) -and (Test-Java8)) {
        Log "JDK 8 already installed at $($State.JavaHome)"
        return
    }
    $api = "https://api.azul.com/metadata/v1/zulu/packages/?java_version=8&os=windows&arch=x64&archive_type=zip&java_package_type=jdk&javafx_bundled=false&crac_supported=false&latest=true&release_status=ga&availability_types=CA&certifications=tck&page=1&page_size=1"
    try { $packages = Invoke-RestMethod -Uri $api -UseBasicParsing -ErrorAction Stop } catch { Fail "cannot reach api.azul.com to find JDK 8" }
    $package = @($packages)[0]
    if (-not $package) { Fail "no JDK 8 build for Windows x64" }
    $sha = ""
    try { $sha = (Invoke-RestMethod -Uri "https://api.azul.com/metadata/v1/zulu/packages/$($package.package_uuid)" -UseBasicParsing -ErrorAction Stop).sha256_hash } catch { }
    $tmp = Join-Path $StateDir "tmp\jdk"
    if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp }
    New-Item -ItemType Directory -Force -Path $tmp | Out-Null
    $zip = Join-Path $tmp "jdk.zip"
    if (-not (Invoke-Download $package.download_url $zip)) { Fail "JDK download failed" }
    if ($sha -and ((Get-FileHash -Algorithm SHA256 $zip).Hash.ToLower() -ne $sha.ToLower())) { Fail "JDK checksum mismatch, download again" }
    Expand-Zip $zip $tmp
    Remove-Item -Force $zip
    $jdkDir = Join-Path $Dir "jdk"
    if (Test-Path $jdkDir) { Remove-Item -Recurse -Force $jdkDir }
    $top = Get-ChildItem -Path $tmp -Directory | Select-Object -First 1
    Move-Item $top.FullName $jdkDir
    Remove-Item -Recurse -Force $tmp
    $State.JavaHome = ""
    if (-not (Resolve-Java)) { Fail "java.exe not found inside the JDK archive" }
    if (-not (Test-Java8)) { Fail "the installed JDK is not Java 8" }
    Log "JDK 8 installed at $($State.JavaHome)"
}

function Get-MysqlBin([string] $Tool) { return Join-Path $State.MysqlHome "bin\$Tool.exe" }

function Install-MysqlBinaries {
    if ($State.DbUrl) { Log "using the existing database $($State.DbUrl)"; return }
    if (-not (Test-VcRuntime)) {
        Need "vc_runtime" "MySQL needs the Microsoft Visual C++ Redistributable. Run: winget install --id Microsoft.VCRedist.2015+.x64 -e --silent --accept-package-agreements --accept-source-agreements (Windows asks the user to allow it once), then run install again"
    }
    if ($State.MysqlHome -and (Test-Path (Get-MysqlBin "mysqld"))) { Log "MySQL binaries: $($State.MysqlHome)"; return }
    $local = Join-Path $Dir "mysql"
    if (Test-Path (Join-Path $local "bin\mysqld.exe")) { $State.MysqlHome = $local; return }
    $file = ""
    try {
        $page = (Invoke-WebRequest -Uri "https://dev.mysql.com/downloads/mysql/$MysqlSeries.html?os=3" -UseBasicParsing -TimeoutSec 30 -ErrorAction Stop).Content
        $match = [regex]::Match($page, "mysql-$([regex]::Escape($MysqlSeries))\.\d+-winx64\.zip")
        if ($match.Success) { $file = $match.Value }
    } catch { }
    if (-not $file) { $file = "mysql-$MysqlFallbackVersion-winx64.zip" }
    $tmp = Join-Path $StateDir "tmp\mysql"
    if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp }
    New-Item -ItemType Directory -Force -Path $tmp | Out-Null
    $zip = Join-Path $tmp $file
    $ok = Invoke-Download "https://dev.mysql.com/get/Downloads/MySQL-$MysqlSeries/$file" $zip
    if (-not $ok) { $ok = Invoke-Download "https://cdn.mysql.com/archives/mysql-$MysqlSeries/$file" $zip }
    if (-not $ok) { Fail "MySQL download failed ($file)" }
    Log "extracting MySQL (this can take a few minutes)"
    Expand-Zip $zip $tmp
    Remove-Item -Force $zip
    if (Test-Path $local) { Remove-Item -Recurse -Force $local }
    $top = Get-ChildItem -Path $tmp -Directory | Select-Object -First 1
    Move-Item $top.FullName $local
    Remove-Item -Recurse -Force $tmp
    $State.MysqlHome = $local
    if (-not (Test-Path (Get-MysqlBin "mysqld"))) { Fail "mysqld.exe not found in the MySQL archive" }
    Log "MySQL installed at $local"
}

function ConvertTo-ForwardSlash([string] $Path) { return $Path.Replace("\", "/") }

function Write-MysqlConfig {
    $config = @"
[mysqld]
basedir=$(ConvertTo-ForwardSlash $State.MysqlHome)
datadir=$(ConvertTo-ForwardSlash (Join-Path $Dir "mysql-data"))
port=$($State.MysqlPort)
bind-address=127.0.0.1
mysqlx=OFF
log-error=$(ConvertTo-ForwardSlash (Join-Path $LogsDir "mysql-error.log"))
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_520_ci
max_allowed_packet=64M
"@
    Write-TextFile (Join-Path $Dir "mysql.ini") $config
    $rootConfig = @"
[client]
user=root
password=$($Secrets.DbRootPassword)
host=127.0.0.1
port=$($State.MysqlPort)
"@
    $rootFile = Join-Path $StateDir "mysql-root.cnf"
    Write-TextFile $rootFile $rootConfig
    Protect-File $rootFile
}

function Test-MysqlAlive {
    if (-not $State.MysqlHome) { return $false }
    & (Get-MysqlBin "mysqladmin") --no-defaults -h 127.0.0.1 -P $State.MysqlPort ping *> $null
    return ($LASTEXITCODE -eq 0)
}

function Invoke-MysqlRoot([string] $Sql, [switch] $NoPassword, [switch] $Quiet) {
    $sqlFile = Join-Path $StateDir "tmp-sql.sql"
    Write-TextFile $sqlFile $Sql
    Protect-File $sqlFile
    try {
        $mysql = Get-MysqlBin "mysql"
        if ($NoPassword) {
            $mysqlArgs = "--no-defaults -uroot -h 127.0.0.1 -P $($State.MysqlPort)"
        } else {
            $mysqlArgs = "--defaults-extra-file=`"$(Join-Path $StateDir 'mysql-root.cnf')`""
        }
        if ($Quiet) {
            & cmd.exe /c "`"`"$mysql`" $mysqlArgs < `"$sqlFile`" > NUL 2>&1`""
        } else {
            & cmd.exe /c "`"`"$mysql`" $mysqlArgs < `"$sqlFile`"`"" 2>&1 | Out-Host
        }
        return ($LASTEXITCODE -eq 0)
    } finally {
        Remove-Item -Force $sqlFile -ErrorAction SilentlyContinue
    }
}

function Start-Mysql {
    if ($State.DbUrl) { return }
    if (Test-MysqlAlive) { Log "MySQL is running on port $($State.MysqlPort)"; return }
    if (Test-PortInUse $State.MysqlPort) { Fail "port $($State.MysqlPort) is used by another program, run install again with -MysqlPort <free port>" }
    Log "starting MySQL on port $($State.MysqlPort)"
    Start-Process -FilePath (Get-MysqlBin "mysqld") -ArgumentList "--defaults-file=`"$(Join-Path $Dir 'mysql.ini')`"" -WindowStyle Hidden | Out-Null
    $waited = 0
    while ($waited -lt 120) {
        if (Test-MysqlAlive) { Log "MySQL is running"; return }
        Start-Sleep -Seconds 2
        $waited += 2
    }
    $errorLog = Join-Path $LogsDir "mysql-error.log"
    if (Test-Path $errorLog) { Get-Content $errorLog -Tail 40 | Out-Host }
    Fail "MySQL did not start, see $errorLog"
}

function Stop-Mysql {
    if ($State.DbUrl -or -not $State.MysqlHome) { return }
    if (Test-MysqlAlive) {
        Log "stopping MySQL"
        & (Get-MysqlBin "mysqladmin") "--defaults-extra-file=$(Join-Path $StateDir 'mysql-root.cnf')" shutdown *> $null
        $waited = 0
        while ((Test-MysqlAlive) -and $waited -lt 60) { Start-Sleep -Seconds 2; $waited += 2 }
    }
}

function Initialize-Mysql {
    if ($State.DbUrl) { return }
    New-Item -ItemType Directory -Force -Path $LogsDir | Out-Null
    if (-not $State.MysqlPort) {
        $State.MysqlPort = Get-FreePort 3306 3399
        if (-not $State.MysqlPort) { Fail "no free port for MySQL in 3306..3399, use -MysqlPort" }
    }
    Write-MysqlConfig
    Save-State
    $dataDir = Join-Path $Dir "mysql-data"
    if (-not (Test-Path (Join-Path $dataDir "mysql"))) {
        Log "initializing the MySQL data folder"
        if (Test-Path $dataDir) { Remove-Item -Recurse -Force $dataDir }
        & (Get-MysqlBin "mysqld") "--defaults-file=$(Join-Path $Dir 'mysql.ini')" --initialize-insecure | Out-Host
        if ($LASTEXITCODE -ne 0) {
            $errorLog = Join-Path $LogsDir "mysql-error.log"
            if (Test-Path $errorLog) { Get-Content $errorLog -Tail 40 | Out-Host }
            Fail "MySQL initialization failed"
        }
    }
    Start-Mysql
    if (-not (Invoke-MysqlRoot "SELECT 1;" -Quiet)) {
        if (-not (Invoke-MysqlRoot "ALTER USER 'root'@'localhost' IDENTIFIED BY '$($Secrets.DbRootPassword)';" -NoPassword)) {
            Fail "cannot set the MySQL root password (the data folder $dataDir belongs to another password)"
        }
    }
    $p = $Secrets.DbPassword
    $sql = @"
CREATE DATABASE IF NOT EXISTS ``$DbName`` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
CREATE USER IF NOT EXISTS '$DbUserName'@'localhost' IDENTIFIED BY '$p';
CREATE USER IF NOT EXISTS '$DbUserName'@'127.0.0.1' IDENTIFIED BY '$p';
ALTER USER '$DbUserName'@'localhost' IDENTIFIED BY '$p';
ALTER USER '$DbUserName'@'127.0.0.1' IDENTIFIED BY '$p';
GRANT ALL PRIVILEGES ON ``$DbName``.* TO '$DbUserName'@'localhost';
GRANT ALL PRIVILEGES ON ``$DbName``.* TO '$DbUserName'@'127.0.0.1';
FLUSH PRIVILEGES;
"@
    if (-not (Invoke-MysqlRoot $sql)) { Fail "cannot create the database" }
    Log "database $DbName and user $DbUserName are ready"
}

function Set-Property([string] $File, [string] $Key, [string] $Value) {
    $lines = @()
    if (Test-Path $File) { $lines = @(Get-Content $File) }
    $found = $false
    $result = foreach ($line in $lines) {
        if ($line -match "^$([regex]::Escape($Key))=") { $found = $true; "$Key=$Value" } else { $line }
    }
    if (-not $found) { $result = @($result) + "$Key=$Value" }
    Write-TextFile $File ((@($result) -join "`n") + "`n")
}

function Install-EzyPlatform {
    if (-not (Test-Path (Join-Path $EzHome "cli.bat"))) {
        $tmp = Join-Path $StateDir "tmp\ezyplatform"
        if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp }
        New-Item -ItemType Directory -Force -Path $tmp | Out-Null
        $zip = Join-Path $tmp "ezyplatform.zip"
        if (-not (Invoke-Download "https://ezyplatform.com/api/v1/platforms/$($State.Version)/download" $zip)) {
            Fail "EzyPlatform download failed (version $($State.Version))"
        }
        Expand-Zip $zip $tmp
        Remove-Item -Force $zip
        if (-not (Test-Path (Join-Path $tmp "ezyplatform\cli.bat"))) { Fail "unexpected EzyPlatform archive layout" }
        if (Test-Path $EzHome) { Remove-Item -Recurse -Force $EzHome }
        Move-Item (Join-Path $tmp "ezyplatform") $EzHome
        Remove-Item -Recurse -Force $tmp
        Log "EzyPlatform extracted to $EzHome"
    }
    if ($State.DbUrl) {
        if (-not $env:EZY_DB_PASSWORD) { Fail "set EZY_DB_PASSWORD when -DbUrl is used" }
        $jdbcUrl = $State.DbUrl; $user = $State.DbUser; $password = $env:EZY_DB_PASSWORD
    } else {
        $jdbcUrl = "jdbc:mariadb://127.0.0.1:$($State.MysqlPort)/${DbName}?allowPublicKeyRetrieval=true&useSSL=false"
        $user = $DbUserName; $password = $Secrets.DbPassword
    }
    $setupFile = Join-Path $EzHome "settings\setup.properties"
    $jdbcEscaped = $jdbcUrl.Replace("\", "\\").Replace(":", "\:")
    Write-TextFile $setupFile "datasource.jdbc_url=$jdbcEscaped`ndatasource.driver_class_name=org.mariadb.jdbc.Driver`ndatasource.username=$user`ndatasource.password=$password`ntables.create_manually=false`n"
    Protect-File $setupFile
    $keyFile = Join-Path $EzHome "settings\encryption-keys.txt"
    if (-not (Test-Path $keyFile) -or -not (Get-Content $keyFile -Raw).Trim()) {
        Write-TextFile $keyFile "$($Secrets.EncryptionKey)`n"
        Protect-File $keyFile
    }
    Set-Property (Join-Path $EzHome "admin\settings\config.properties") "server.port" $State.AdminPort
    Set-Property (Join-Path $EzHome "admin\settings\config.properties") "server.host" $State.BindHost
    Set-Property (Join-Path $EzHome "web\settings\config.properties") "server.port" $State.WebPort
    Set-Property (Join-Path $EzHome "web\settings\config.properties") "server.host" $State.BindHost
}

function Get-TargetProcess([string] $Target) {
    $class = if ($Target -eq "admin") { "ezyplatform.admin.AdminStartup" } elseif ($Target -eq "web") { "ezyplatform.web.WebStartup" } else { "ezyplatform.socket" }
    $jdk = Join-Path $Dir "jdk"
    Get-CimInstance Win32_Process -Filter "Name='java.exe'" | Where-Object {
        $_.CommandLine -and $_.CommandLine.Contains($class) -and $_.ExecutablePath -and $_.ExecutablePath.StartsWith($jdk, [System.StringComparison]::OrdinalIgnoreCase)
    }
}

function Start-Target([string] $Target) {
    if (Get-TargetProcess $Target) { Log "$Target is already running"; return }
    Log "starting $Target"
    $env:JAVA_HOME = $State.JavaHome
    $env:PATH = (Join-Path $State.JavaHome "bin") + ";" + $env:PATH
    $consoleLog = Join-Path $LogsDir "$Target-console.log"
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c cli.bat `"console $Target`" > `"$consoleLog`" 2>&1" -WorkingDirectory $EzHome -WindowStyle Hidden | Out-Null
}

function Stop-Target([string] $Target) {
    $processes = @(Get-TargetProcess $Target)
    if ($processes.Count -eq 0) { return }
    Log "stopping $Target"
    foreach ($process in $processes) {
        Stop-Process -Id $process.ProcessId -Force -ErrorAction SilentlyContinue
    }
}

function Start-Native {
    if (-not (Resolve-Java)) { Fail "JDK not found in $Dir\jdk, run install" }
    New-Item -ItemType Directory -Force -Path $LogsDir | Out-Null
    Start-Mysql
    Start-Target "admin"
    Start-Sleep -Seconds 5
    Wait-Http "http://127.0.0.1:$($State.AdminPort)/setup-admin?lang=$($State.Lang)" 420 "admin" { [bool](Get-TargetProcess "admin") }
    Start-Target "web"
    Start-Sleep -Seconds 5
    Wait-Http "http://127.0.0.1:$($State.WebPort)/" 300 "web" { [bool](Get-TargetProcess "web") }
}

function Stop-Native {
    Stop-Target "web"
    Stop-Target "socket"
    Stop-Target "admin"
    Stop-Mysql
}

function Invoke-Compose([string[]] $Arguments) {
    $compose = Join-Path $Dir "docker-compose.yml"
    $envFile = Join-Path $Dir ".env"
    & docker compose version *> $null
    if ($LASTEXITCODE -eq 0) {
        & docker compose -p $State.ProjectName -f $compose --env-file $envFile @Arguments
    } elseif (Get-Command docker-compose -ErrorAction SilentlyContinue) {
        & docker-compose -p $State.ProjectName -f $compose --env-file $envFile @Arguments
    } else {
        Need "docker_compose_missing" "Docker Compose is missing, update Docker Desktop"
    }
}

function Test-Docker {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) { Need "docker_not_installed" "Docker is not installed, install Docker Desktop or run install without -Docker" }
    & docker info *> $null
    if ($LASTEXITCODE -ne 0) { Need "docker_not_running" "Docker Desktop is installed but not running. Start it (Start-Process 'C:\Program Files\Docker\Docker\Docker Desktop.exe'), wait until it is ready and run again" }
}

function Test-DockerRunning {
    if (-not (Test-Path (Join-Path $Dir "docker-compose.yml"))) { return $false }
    $id = (Invoke-Compose @("ps", "-q", "ezyplatform") 2>$null | Select-Object -First 1)
    if (-not $id) { return $false }
    return ((& docker inspect -f "{{.State.Running}}" $id 2>$null) -eq "true")
}

function Write-DockerFiles {
    $envText = @"
MYSQL_ROOT_PASSWORD=$($Secrets.DbRootPassword)
MYSQL_PASSWORD=$($Secrets.DbPassword)
EZY_ENCRYPTION_KEY=$($Secrets.EncryptionKey)
EZY_IMAGE_TAG=$($State.Version)
BIND_HOST=$($State.BindHost)
ADMIN_PORT=$($State.AdminPort)
WEB_PORT=$($State.WebPort)
"@
    Write-TextFile (Join-Path $Dir ".env") $envText
    Protect-File (Join-Path $Dir ".env")
    $compose = @"
services:
  mysql:
    image: $DockerMysqlImage
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: `${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: $DbName
      MYSQL_USER: $DbUserName
      MYSQL_PASSWORD: `${MYSQL_PASSWORD}
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
    image: ${DockerEzyImage}:`${EZY_IMAGE_TAG}
    restart: unless-stopped
    depends_on:
      mysql:
        condition: service_healthy
    environment:
      DATASOURCE_JDBC_URL: "jdbc:mariadb://mysql:3306/${DbName}?allowPublicKeyRetrieval=true&useSSL=false"
      DATASOURCE_DRIVER_CLASS_NAME: org.mariadb.jdbc.Driver
      DATASOURCE_USERNAME: $DbUserName
      DATASOURCE_PASSWORD: `${MYSQL_PASSWORD}
      EZY_CREATE_TABLE_MANUALLY: "false"
      EZY_ENCRYPTION_KEY: `${EZY_ENCRYPTION_KEY}
      EZY_SOCKET_START: "false"
    ports:
      - "`${BIND_HOST}:`${ADMIN_PORT}:9090"
      - "`${BIND_HOST}:`${WEB_PORT}:8080"
    volumes:
      - ezyplatform-data:/app/ezyplatform
volumes:
  mysql-data: {}
  ezyplatform-data: {}
"@
    Write-TextFile (Join-Path $Dir "docker-compose.yml") $compose
}

function Start-DockerStack {
    Test-Docker
    Log "starting the Docker stack $($State.ProjectName) (the first time downloads the images)"
    Invoke-Compose @("up", "-d") | Out-Host
    if ($LASTEXITCODE -ne 0) { Fail "docker compose up failed" }
    Wait-Http "http://127.0.0.1:$($State.AdminPort)/setup-admin?lang=$($State.Lang)" 900 "admin" $null
    Wait-Http "http://127.0.0.1:$($State.WebPort)/" 300 "web" $null
}

function Repair-DockerWeb {
    if ($State.Mode -ne "docker") { return }
    if ((Get-HttpCode "http://127.0.0.1:$($State.WebPort)/") -ne "404") { return }
    Log "web started before the database was ready, restarting the EzyPlatform container once"
    Invoke-Compose @("restart", "ezyplatform") | Out-Host
    Wait-Http "http://127.0.0.1:$($State.AdminPort)/setup-admin?lang=$($State.Lang)" 300 "admin" $null
    $waited = 0
    while ($waited -lt 180) {
        if ((Get-HttpCode "http://127.0.0.1:$($State.WebPort)/") -match '^[23]\d\d$') { Log "web is up"; return }
        Start-Sleep -Seconds 3
        $waited += 3
    }
    Log "web still answers $(Get-HttpCode "http://127.0.0.1:$($State.WebPort)/") after the restart"
}

function Select-Ports {
    if ($State.Mode -eq "docker") { $running = Test-DockerRunning } else { $running = [bool](Get-TargetProcess "admin") }
    if ($running) { return }
    if (-not $State.AdminPort) {
        $State.AdminPort = Get-FreePort 9090 9190
        if (-not $State.AdminPort) { Fail "no free admin port in 9090..9190, use -AdminPort" }
    } elseif (Test-PortInUse $State.AdminPort) {
        Fail "port $($State.AdminPort) is busy, choose another one with -AdminPort"
    }
    if (-not $State.WebPort) {
        $State.WebPort = Get-FreePort 8080 8180
        if (-not $State.WebPort) { Fail "no free web port in 8080..8180, use -WebPort" }
    } elseif (Test-PortInUse $State.WebPort) {
        Fail "port $($State.WebPort) is busy, choose another one with -WebPort"
    }
    if ($State.AdminPort -ne 9090) { Log "port 9090 is busy, admin uses port $($State.AdminPort)" }
    if ($State.WebPort -ne 8080) { Log "port 8080 is busy, web uses port $($State.WebPort)" }
}

$script:AdminStatus = "unknown"
$script:GeneratedAdminPassword = ""

function Initialize-Admin {
    $base = "http://127.0.0.1:$($State.AdminPort)"
    $url = "$base/setup-admin?lang=$($State.Lang)"
    $code = Get-HttpCode $url
    if ($code -ne "200") {
        $redirect = Get-HttpRedirect $url
        if ($redirect -match "setup-admin") { Fail "unexpected redirect $redirect from /setup-admin" }
        Log "an admin account already exists, skip creating the first admin"
        $script:AdminStatus = "existing"
        return
    }
    if ($State.AdminUser -notmatch '^[a-zA-Z0-9_.-]{3,64}$') { Fail "admin username must be 3-64 characters of letters, digits, _ . -" }
    if ($State.AdminEmail -notmatch '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,9}$') { Fail "a valid -AdminEmail is required" }
    $password = $env:EZY_ADMIN_PASSWORD
    if (-not $password) {
        $password = New-RandomHex 20
        $script:GeneratedAdminPassword = $password
    }
    if ($password.Length -lt 6 -or $password.Length -gt 128) { Fail "admin password must have 6 to 128 characters" }
    $curl = Get-Curl
    if (-not $curl) { Fail "curl.exe is missing (Windows 10 1803 or newer has it)" }
    $passwordFile = Join-Path $StateDir "tmp-admin-password.txt"
    Write-TextFile $passwordFile $password
    Protect-File $passwordFile
    try {
        & $curl -s -o NUL -m 60 --data-urlencode "username=$($State.AdminUser)" --data-urlencode "email=$($State.AdminEmail)" --data-urlencode "password@$passwordFile" $url
        if ($LASTEXITCODE -ne 0) { Fail "cannot send the admin setup form" }
    } finally {
        Remove-Item -Force $passwordFile -ErrorAction SilentlyContinue
    }
    if ((Get-HttpCode $url) -eq "200") { Fail "the first admin was not created, check username/email/password" }
    $script:AdminStatus = "created"
    Log "first admin '$($State.AdminUser)' created"
}

function Write-Result {
    Write-Output "=== EzyPlatform is ready ==="
    Write-Output "RESULT_MODE=$($State.Mode)"
    Write-Output "RESULT_DIR=$Dir"
    Write-Output "RESULT_ADMIN_URL=http://localhost:$($State.AdminPort)"
    Write-Output "RESULT_WEB_URL=http://localhost:$($State.WebPort)"
    Write-Output "RESULT_ADMIN_USERNAME=$($State.AdminUser)"
    Write-Output "RESULT_ADMIN_ACCOUNT=$script:AdminStatus"
    if ($script:GeneratedAdminPassword) { Write-Output "RESULT_GENERATED_ADMIN_PASSWORD=$script:GeneratedAdminPassword" }
    Write-Output "RESULT_CONTROL=powershell -NoProfile -ExecutionPolicy Bypass -File `"$Dir\ezyplatform-ctl.ps1`" start|stop|status"
}

function Invoke-Install {
    if ((Test-Path $StateFile) -and $Docker -and $State.Mode -ne "docker") { Fail "$Dir already has a native installation, use another -Dir for Docker" }
    if ($State.Mode -ne "docker" -and $Dir -match '[^\x21-\x7E\\:]') {
        Fail "the folder $Dir has spaces or non-English characters that MySQL does not handle well, use -Dir C:\ezyplatform"
    }
    New-Item -ItemType Directory -Force -Path $Dir, $StateDir, $LogsDir | Out-Null
    if (-not $Secrets.DbRootPassword) { $Secrets.DbRootPassword = New-RandomHex 32 }
    if (-not $Secrets.DbPassword) { $Secrets.DbPassword = New-RandomHex 32 }
    if (-not $Secrets.EncryptionKey) { $Secrets.EncryptionKey = New-RandomHex 32 }
    if ($State.Mode -eq "docker") {
        Test-Docker
        Select-Ports
        Save-State
        Write-DockerFiles
        Start-DockerStack
    } else {
        Select-Ports
        Save-State
        Install-Jdk
        Save-State
        Install-MysqlBinaries
        Save-State
        Initialize-Mysql
        Install-EzyPlatform
        Save-State
        Start-Native
    }
    Initialize-Admin
    Repair-DockerWeb
    Save-State
    Copy-Item -Force $PSCommandPath (Join-Path $Dir "ezyplatform-ctl.ps1")
    $tmp = Join-Path $StateDir "tmp"
    if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp }
    Write-Result
}

function Assert-Installed {
    if (-not (Test-Path $StateFile)) { Fail "no EzyPlatform installation in $Dir (run install, or pass -Dir)" }
}

function Invoke-Status {
    Assert-Installed
    Write-Output "mode=$($State.Mode) dir=$Dir"
    if ($State.Mode -eq "docker") {
        Test-Docker
        Invoke-Compose @("ps")
    } else {
        if ($State.DbUrl) { Write-Output "mysql=external" }
        elseif (Test-MysqlAlive) { Write-Output "mysql=running port=$($State.MysqlPort)" }
        else { Write-Output "mysql=stopped" }
        foreach ($target in "admin", "web") {
            if (Get-TargetProcess $target) { Write-Output "$target=running" } else { Write-Output "$target=stopped" }
        }
    }
    Write-Output "admin http=$(Get-HttpCode "http://127.0.0.1:$($State.AdminPort)/") url=http://localhost:$($State.AdminPort)"
    Write-Output "web http=$(Get-HttpCode "http://127.0.0.1:$($State.WebPort)/") url=http://localhost:$($State.WebPort)"
}

function Invoke-Uninstall {
    Assert-Installed
    if (-not $Yes) { Fail "uninstall deletes $Dir and all its data, pass -Yes after the user confirmed" }
    $root = [System.IO.Path]::GetPathRoot($Dir)
    if ($Dir.TrimEnd("\") -eq $root.TrimEnd("\") -or $Dir.TrimEnd("\") -eq $env:USERPROFILE.TrimEnd("\")) { Fail "refusing to delete $Dir" }
    if ($State.Mode -eq "docker") {
        Test-Docker
        Invoke-Compose @("down", "-v")
    } else {
        Stop-Native
        Start-Sleep -Seconds 3
    }
    Set-Location $env:USERPROFILE
    Remove-Item -Recurse -Force $Dir
    Log "deleted $Dir"
}

switch ($Command) {
    "check" { Invoke-Check }
    "install" { Invoke-Install }
    "start" {
        Assert-Installed
        if ($State.Mode -eq "docker") { Start-DockerStack } else { Start-Native }
        Invoke-Status
    }
    "stop" {
        Assert-Installed
        if ($State.Mode -eq "docker") { Test-Docker; Invoke-Compose @("stop") } else { Stop-Native }
        Log "stopped"
    }
    "status" { Invoke-Status }
    "uninstall" { Invoke-Uninstall }
    default { Show-Usage }
}

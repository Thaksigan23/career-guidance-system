$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root "backend_final_real"

$mysqlInstallDb = "C:\xampp\mysql\bin\mysql_install_db.exe"
$mysqlClient = "C:\xampp\mysql\bin\mysql.exe"
$mysqlServer = "C:\xampp\mysql\bin\mysqld.exe"

$mysqlPort = 3308
$mysqlDataRoot = Join-Path $backend ".local-mysql-data"
$mysqlDataDir = Join-Path $mysqlDataRoot "data"
$mysqlSocket = Join-Path $mysqlDataRoot "mysql.sock"
$schema = Join-Path $backend "schema.sql"

if (-not (Test-Path $mysqlInstallDb) -or -not (Test-Path $mysqlClient) -or -not (Test-Path $mysqlServer)) {
  throw "XAMPP MySQL binaries not found in C:\xampp\mysql\bin"
}

New-Item -ItemType Directory -Path $mysqlDataDir -Force | Out-Null

$isInitialized = Test-Path (Join-Path $mysqlDataDir "mysql")
if (-not $isInitialized) {
  & $mysqlInstallDb --datadir="$mysqlDataDir"
}

$portOpen = Test-NetConnection -ComputerName "127.0.0.1" -Port $mysqlPort -WarningAction SilentlyContinue
if (-not $portOpen.TcpTestSucceeded) {
  Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "& `"$mysqlServer`" --console --port=$mysqlPort --bind-address=127.0.0.1 --datadir=`"$mysqlDataDir`" --socket=`"$mysqlSocket`"" | Out-Null
  Start-Sleep -Seconds 3
}

Get-Content $schema | & $mysqlClient -h 127.0.0.1 -P $mysqlPort -u root

Write-Host "Local DB initialized and schema imported on port $mysqlPort."

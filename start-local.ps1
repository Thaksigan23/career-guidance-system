$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root "backend_final_real"
$frontend = Join-Path $root "frontend_final_fixed_from_upload"

$mysqlExe = "C:\xampp\mysql\bin\mysqld.exe"
$mysqlDataDir = Join-Path $backend ".local-mysql-data\data"
$mysqlSocket = Join-Path $backend ".local-mysql-data\mysql.sock"
$mysqlPort = 3308

if (-not (Test-Path $mysqlExe)) {
  throw "MySQL binary not found at $mysqlExe"
}

if (-not (Test-Path $mysqlDataDir)) {
  Write-Host "Local DB data directory not found. Run setup-local-db.ps1 first." -ForegroundColor Yellow
  exit 1
}

$portOpen = Test-NetConnection -ComputerName "127.0.0.1" -Port $mysqlPort -WarningAction SilentlyContinue
if (-not $portOpen.TcpTestSucceeded) {
  Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "& `"$mysqlExe`" --console --port=$mysqlPort --bind-address=127.0.0.1 --datadir=`"$mysqlDataDir`" --socket=`"$mysqlSocket`"" | Out-Null
  Start-Sleep -Seconds 2
}

Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "Set-Location `"$backend`"; npm run dev" | Out-Null
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "Set-Location `"$frontend`"; npm run dev" | Out-Null

Write-Host "Started local DB, backend, and frontend terminals."

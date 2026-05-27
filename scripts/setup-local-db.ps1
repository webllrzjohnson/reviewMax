# Creates the local ReviewMax database using your PostgreSQL superuser password.
param(
  [string]$PostgresPassword
)

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

if (-not $PostgresPassword) {
  $secure = Read-Host "Enter your local PostgreSQL superuser (postgres) password" -AsSecureString
  $PostgresPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  )
}

if (-not $PostgresPassword) {
  throw "Password is required."
}

$encoded = [uri]::EscapeDataString($PostgresPassword)
$env:POSTGRES_ADMIN_URL = "postgresql://postgres:$encoded@localhost:5432/postgres"

Write-Host "Creating database and user..."
npm run db:create
npm run db:migrate
npm run db:seed

Write-Host ""
Write-Host "Done. Start the app with: npm run dev"
Write-Host "Login at http://localhost:3000/login"
Write-Host "  Email: admin@reviewmax.local"
Write-Host "  Password: (ADMIN_INITIAL_PASSWORD from .env.local)"

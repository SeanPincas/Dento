$ErrorActionPreference = "Stop"

# -f docker-compose.yml skips docker-compose.override.yml (the live-reload setup)
docker compose -f docker-compose.yml up -d --build

if ($LASTEXITCODE -ne 0) {
    throw "Docker Compose failed to start the Dento services."
}

Write-Host ""
Write-Host "Dento is running:" -ForegroundColor Green
Write-Host "  Customer app: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Admin dashboard: http://localhost:5174" -ForegroundColor Cyan
Write-Host "  Backend API: http://localhost:4000" -ForegroundColor Cyan
Write-Host ""

docker compose -f docker-compose.yml ps

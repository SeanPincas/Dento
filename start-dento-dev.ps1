$ErrorActionPreference = "Stop"

# Starts Dento with live reload for the customer and admin apps.
docker compose up -d --build

if ($LASTEXITCODE -ne 0) {
    throw "Docker Compose failed to start the Dento dev services."
}

Write-Host ""
Write-Host "Dento (dev, live reload) is starting:" -ForegroundColor Green
Write-Host "  Customer app: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Admin dashboard: http://localhost:5174" -ForegroundColor Cyan
Write-Host "  Backend API: http://localhost:4000" -ForegroundColor Cyan
Write-Host ""
Write-Host "The first start installs packages inside the containers, so give it a minute." -ForegroundColor Yellow
Write-Host "Follow progress with: docker compose logs -f frontend admin"
Write-Host ""

docker compose ps

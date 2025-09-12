Write-Host "Starting THINK AI 3.0 Development Servers..." -ForegroundColor Green

Write-Host "`nStarting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run server"

Write-Host "`nStarting Frontend Server..." -ForegroundColor Yellow  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm start"

Write-Host "`nBoth servers are starting..." -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

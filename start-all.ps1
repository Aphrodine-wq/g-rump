# Start Backend and Web Client Together (Windows)
Write-Host "🚀 Starting Grump Platform..." -ForegroundColor Cyan
Write-Host ""

# Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Web Client
Write-Host "Starting Web Client..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd web; npm run dev"

Write-Host ""
Write-Host "✓ Backend: http://localhost:3000" -ForegroundColor Green
Write-Host "✓ Web Client: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop" -ForegroundColor Yellow


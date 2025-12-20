# Grump Platform - Complete Setup Script for Windows
Write-Host "🎭 Grump Platform Setup" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Setup Backend
Write-Host ""
Write-Host "📦 Setting up Backend..." -ForegroundColor Yellow
Set-Location backend
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Backend setup failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✓ Backend dependencies already installed" -ForegroundColor Green
}

# Check for .env
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env"
    Write-Host "⚠ Please add your ANTHROPIC_API_KEY to backend/.env" -ForegroundColor Yellow
} else {
    Write-Host "✓ .env file exists" -ForegroundColor Green
}

Set-Location ..

# Setup Web Client
Write-Host ""
Write-Host "🌐 Setting up Web Client..." -ForegroundColor Yellow
Set-Location web
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing web dependencies..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Web setup failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✓ Web dependencies already installed" -ForegroundColor Green
}

# Check for .env
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
} else {
    Write-Host "✓ .env file exists" -ForegroundColor Green
}

Set-Location ..

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Add your ANTHROPIC_API_KEY to backend/.env" -ForegroundColor White
Write-Host "2. Start backend: cd backend && npm start" -ForegroundColor White
Write-Host "3. Start web client: cd web && npm run dev" -ForegroundColor White
Write-Host "4. Or run Electron: cd web && npm run electron:dev" -ForegroundColor White
Write-Host ""


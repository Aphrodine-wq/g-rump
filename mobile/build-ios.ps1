# EAS Build Script for iOS
Write-Host "🚀 Starting EAS Build for iOS..." -ForegroundColor Cyan
Write-Host ""

# Check if EAS CLI is installed
if (-not (Get-Command eas -ErrorAction SilentlyContinue)) {
    Write-Host "Installing EAS CLI..." -ForegroundColor Yellow
    npm install -g eas-cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install EAS CLI. Make sure Node.js is installed." -ForegroundColor Red
        exit 1
    }
}

# Check if logged in
Write-Host "Checking EAS login status..." -ForegroundColor Yellow
eas whoami
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to EAS:" -ForegroundColor Yellow
    eas login
}

# Ask which build profile
Write-Host ""
Write-Host "Select build profile:" -ForegroundColor Cyan
Write-Host "1. iOS Simulator (fastest, no Apple account needed)" -ForegroundColor Green
Write-Host "2. Development (for device testing)" -ForegroundColor Yellow
Write-Host "3. Preview (for TestFlight)" -ForegroundColor Yellow
Write-Host "4. Production (for App Store)" -ForegroundColor Yellow
Write-Host ""
$choice = Read-Host "Enter choice (1-4)"

switch ($choice) {
    "1" { 
        Write-Host "Building for iOS Simulator..." -ForegroundColor Cyan
        eas build --platform ios --profile ios-simulator
    }
    "2" { 
        Write-Host "Building for iOS Device (Development)..." -ForegroundColor Cyan
        eas build --platform ios --profile development
    }
    "3" { 
        Write-Host "Building for iOS Device (Preview)..." -ForegroundColor Cyan
        eas build --platform ios --profile preview
    }
    "4" { 
        Write-Host "Building for iOS Device (Production)..." -ForegroundColor Cyan
        eas build --platform ios --profile production
    }
    default {
        Write-Host "Invalid choice. Building for iOS Simulator..." -ForegroundColor Yellow
        eas build --platform ios --profile ios-simulator
    }
}

Write-Host ""
Write-Host "✅ Build started! Check the URL above for progress." -ForegroundColor Green






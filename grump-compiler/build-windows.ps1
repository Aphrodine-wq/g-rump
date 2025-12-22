# G-Rump Compiler Build Script for Windows
# Builds the compiler and sets up targets for iOS and React Native

Write-Host "Building G-Rump Compiler..." -ForegroundColor Green

# Check if Rust is installed
if (!(Get-Command cargo -ErrorAction SilentlyContinue)) {
    Write-Host "Rust/Cargo not found. Installing Rust..." -ForegroundColor Yellow
    # Download and install Rust
    Invoke-WebRequest -Uri "https://static.rust-lang.org/rustup/dist/x86_64-pc-windows-msvc/rustup-init.exe" -OutFile "rustup-init.exe"
    .\rustup-init.exe -y
    $env:Path += ";$env:USERPROFILE\.cargo\bin"
    Remove-Item rustup-init.exe
}

# Build the compiler
Write-Host "Building compiler in release mode..." -ForegroundColor Cyan
cargo build --release

if ($LASTEXITCODE -eq 0) {
    Write-Host "Compiler built successfully!" -ForegroundColor Green

    # Create output directories
    New-Item -ItemType Directory -Force -Path "compiled/ios" | Out-Null
    New-Item -ItemType Directory -Force -Path "compiled/react-native" | Out-Null
    New-Item -ItemType Directory -Force -Path "compiled/web" | Out-Null

    Write-Host "Build complete. Use compile-targets.ps1 to compile animations." -ForegroundColor Green
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
# G-Rump Animation Compilation Script
# Compiles Grump character animations for iOS, React Native, and Web targets

param(
    [Parameter(Mandatory=$false)]
    [string]$Target = "all",

    [Parameter(Mandatory=$false)]
    [string]$InputFile = "examples/grump-character-animations.grump"
)

$CompilerPath = "target/release/grump.exe"

# Check if compiler exists
if (!(Test-Path $CompilerPath)) {
    Write-Host "Compiler not found. Run build-windows.ps1 first." -ForegroundColor Red
    exit 1
}

Write-Host "Compiling G-Rump animations for Grump character..." -ForegroundColor Green
Write-Host "Input: $InputFile" -ForegroundColor Cyan

function Compile-Target {
    param(
        [string]$TargetName,
        [string]$TargetFlag
    )

    Write-Host "Compiling for $TargetName..." -ForegroundColor Yellow

    $OutputDir = "compiled/$TargetName"
    New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

    $Command = "& $CompilerPath compile $InputFile --target $TargetFlag --output $OutputDir"
    Write-Host "Running: $Command" -ForegroundColor Gray

    try {
        Invoke-Expression $Command
        if ($LASTEXITCODE -eq 0) {
            Write-Host "$TargetName compilation successful!" -ForegroundColor Green
        } else {
            Write-Host "$TargetName compilation failed!" -ForegroundColor Red
        }
    } catch {
        Write-Host "Error compiling for $TargetName : $_" -ForegroundColor Red
    }
}

# Compile based on target parameter
switch ($Target.ToLower()) {
    "ios" {
        Compile-Target -TargetName "iOS" -TargetFlag "ios"
    }
    "react-native" {
        Compile-Target -TargetName "React Native" -TargetFlag "react-native"
    }
    "web" {
        Compile-Target -TargetName "Web" -TargetFlag "web"
    }
    "all" {
        Compile-Target -TargetName "iOS" -TargetFlag "ios"
        Compile-Target -TargetName "React Native" -TargetFlag "react-native"
        Compile-Target -TargetName "Web" -TargetFlag "web"
    }
    default {
        Write-Host "Invalid target. Use: ios, react-native, web, or all" -ForegroundColor Red
    }
}

Write-Host "Compilation complete!" -ForegroundColor Green

# List generated files
Write-Host "`nGenerated files:" -ForegroundColor Cyan
Get-ChildItem -Path "compiled" -Recurse -File | ForEach-Object {
    Write-Host "  $($_.FullName)" -ForegroundColor Gray
}
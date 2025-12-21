# 🔧 Install Node.js for Windows

## Quick Install (Recommended)

### Option 1: Download Installer (Easiest)
1. Go to: **https://nodejs.org/**
2. Download the **LTS version** (Long Term Support)
3. Run the installer
4. **Check "Add to PATH"** during installation
5. Restart your terminal/PowerShell after installation

### Option 2: Using Winget (If Available)
```powershell
winget install OpenJS.NodeJS.LTS
```

### Option 3: Using Chocolatey (If Installed)
```powershell
choco install nodejs-lts
```

## Verify Installation

After installing, **close and reopen** your terminal, then run:

```powershell
node --version
npm --version
```

You should see version numbers like:
```
v20.11.0
10.2.4
```

## If Node.js Still Doesn't Work

### Check if it's installed but not in PATH:
1. Open File Explorer
2. Go to: `C:\Program Files\nodejs\`
3. If you see `node.exe` there, it's installed but PATH isn't set

### Fix PATH manually:
1. Search for "Environment Variables" in Windows
2. Edit "Path" in System Variables
3. Add: `C:\Program Files\nodejs\`
4. Restart terminal

## After Node.js is Working

Then you can install EAS CLI:
```powershell
npm install -g eas-cli
```

---

**"Just install it already. I'm waiting."** — Grump




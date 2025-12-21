# 🚀 Quick EAS Build Guide

## Fastest Way to Build

### Option 1: Use the Script (Recommended)
```powershell
cd mobile
.\build-ios.ps1
```

### Option 2: Manual Commands

**1. Install EAS CLI (if not installed):**
```powershell
npm install -g eas-cli
```

**2. Login to EAS:**
```powershell
eas login
```

**3. Build for iOS Simulator (no Apple account needed):**
```powershell
cd mobile
eas build --platform ios --profile ios-simulator
```

## Build Profiles

- **ios-simulator**: Fastest, no Apple account needed
- **development**: For device testing
- **preview**: For TestFlight
- **production**: For App Store submission

## What Happens Next

1. EAS will start building in the cloud
2. You'll get a URL to monitor progress
3. When done, download the build
4. Run on simulator or install on device

## Troubleshooting

**"npm not found"**
→ Install Node.js from https://nodejs.org

**"eas not found"**
→ Run: `npm install -g eas-cli`

**"Not logged in"**
→ Run: `eas login`

**Build fails**
→ Check the build logs at the URL provided

---

**"Fine. Build it already."** — Grump







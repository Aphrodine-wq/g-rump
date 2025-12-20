# EAS Build for iOS Simulator

## Quick Start

Build and run Grump on iOS Simulator using EAS Build:

```bash
cd mobile
eas build --platform ios --profile ios-simulator
```

## What This Does

The `ios-simulator` profile:
- ✅ Extends the `development` profile (includes `developmentClient` and `distribution`)
- ✅ Sets `ios.simulator: true` to build for iOS Simulator
- ✅ Creates a development build optimized for simulator testing

## Build Process

1. **Create Build:**
   ```bash
   eas build --platform ios --profile ios-simulator
   ```

2. **First Time Prompts:**
   - **Bundle Identifier:** Press Enter to use default (`com.grump.app`) or enter custom
   - **Encryption:** Press `Y` (app uses standard/exempt encryption)

3. **Wait for Build:**
   - Build is queued on EAS servers
   - Check progress via the provided dashboard link
   - Typically takes 10-20 minutes

4. **Install on Simulator:**
   - When build completes, EAS CLI will prompt: "Do you want to run this build on an iOS Simulator?"
   - Press `Y` to automatically install and launch

## Alternative: Manual Installation

If you skipped the auto-install prompt:

1. Download the `.tar.gz` file from EAS dashboard
2. Extract it
3. Drag the `.app` file to iOS Simulator

## Running the Development Server

After the build is installed:

```bash
cd mobile
npx expo start
```

Then press `i` in the terminal to open on iOS Simulator.

## Profile Configuration

The `ios-simulator` profile in `eas.json`:

```json
{
  "ios-simulator": {
    "extends": "development",
    "ios": {
      "simulator": true
    }
  }
}
```

This profile inherits:
- `developmentClient: true` - Development build with Expo Dev Client
- `distribution: "internal"` - Internal distribution
- `ios.simulator: true` - Builds for iOS Simulator (not physical devices)

## Troubleshooting

### Build Fails
- Check EAS dashboard for error logs
- Ensure bundle identifier is valid
- Verify Apple Developer account is linked

### Simulator Not Found
- Ensure Xcode is installed
- Run `xcrun simctl list` to see available simulators
- Open Xcode → Window → Devices and Simulators

### Can't Connect to Dev Server
- Ensure backend is running on `http://localhost:3000`
- For physical device testing, use device IP address instead

## Next Steps

After testing on simulator:
- Create a device build: `eas build --platform ios --profile development`
- Or create production build: `eas build --platform ios --profile production`

---

**"Fine. I'm building. This better work."** — Grump


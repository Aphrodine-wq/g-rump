# Grump Mobile - React Native/Expo

React Native version of Grump using Expo.

## Setup

1. **Install dependencies:**
   ```bash
   cd mobile
   npm install
   ```

2. **Start Expo:**
   ```bash
   npm start
   ```

3. **Run on device:**
   - Scan QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator
   - Or press `a` for Android emulator

## Configuration

### Backend API

Update the API URL in `mobile/store/ChatStore.tsx`:

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000'  // Development
  : 'https://your-production-api.com';  // Production
```

For physical devices, use your computer's local IP:
```typescript
const API_BASE_URL = 'http://192.168.1.XXX:3000';
```

## Building

### EAS Build

```bash
# Install EAS CLI (if not already installed)
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS Simulator (Development)
eas build --platform ios --profile ios-simulator

# Build for iOS Device
eas build --platform ios

# Build for Android
eas build --platform android
```

See [EAS-IOS-SIMULATOR.md](./EAS-IOS-SIMULATOR.md) for detailed iOS Simulator build instructions.

## Features

- ✅ Pissed-off face design (matching BUDDY.md)
- ✅ Dark theme (optimized for dark backgrounds)
- ✅ Chat interface
- ✅ Backend API integration
- ✅ Onboarding flow
- ✅ Typing indicators
- ✅ Message animations

## Project Structure

```
mobile/
├── app/
│   ├── _layout.tsx      # Root layout
│   └── index.tsx        # Main screen
├── components/
│   ├── ChatView.tsx
│   ├── MinimalGrumpFace.tsx
│   ├── MessageBubble.tsx
│   ├── TypingIndicator.tsx
│   └── OnboardingView.tsx
├── store/
│   ├── ChatStore.tsx
│   └── AnimationStore.tsx
└── package.json
```

---

**"Fine. I'm on mobile now. Happy?"** — Grump


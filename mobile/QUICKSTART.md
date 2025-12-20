# Grump Mobile - Quick Start

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Start Expo
```bash
npm start
```

### 3. Run on Your Device

**Option A: Expo Go (Easiest)**
1. Install "Expo Go" app on your phone (iOS/Android)
2. Scan the QR code from terminal
3. App loads instantly!

**Option B: iOS Simulator**
- Press `i` in the terminal
- Requires Xcode (Mac only)

**Option C: Android Emulator**
- Press `a` in the terminal
- Requires Android Studio

## 📱 Testing on Physical Device

### Important: Backend Connection

For physical devices, update the API URL in `mobile/store/ChatStore.tsx`:

```typescript
// Find your computer's local IP:
// Windows: ipconfig
// Mac/Linux: ifconfig

const API_BASE_URL = 'http://192.168.1.XXX:3000'; // Replace XXX with your IP
```

**Make sure:**
- Your phone and computer are on the same WiFi network
- Backend is running (`cd backend && npm start`)
- Firewall allows connections on port 3000

## 🎨 Features

- ✅ Pissed-off face design (matching BUDDY.md)
- ✅ Dark theme optimized for dark backgrounds
- ✅ Chat interface with Grump
- ✅ Backend API integration
- ✅ Onboarding flow
- ✅ Smooth animations

## 🛠️ Troubleshooting

**"Cannot connect to backend"**
- Check your local IP address
- Make sure backend is running
- Ensure same WiFi network

**"Expo Go can't find the app"**
- Make sure you're in the `mobile/` directory
- Try `npx expo start --clear`

**"Module not found"**
- Run `npm install` again
- Clear cache: `npx expo start --clear`

---

**"Fine. I'm ready to test. What do you want."** — Grump


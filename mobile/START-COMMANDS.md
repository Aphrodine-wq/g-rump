# Start Expo Commands

## Quick Start

```bash
cd C:\Users\Walt\Desktop\grump\mobile
npx expo start
```

## With Clear Cache (if having issues)

```bash
cd C:\Users\Walt\Desktop\grump\mobile
npx expo start --clear
```

## Start Backend First (Required)

Before starting Expo, make sure the backend is running:

```bash
# Terminal 1: Start Backend
cd C:\Users\Walt\Desktop\grump\backend
npm start
```

Then in a **new terminal**:

```bash
# Terminal 2: Start Expo
cd C:\Users\Walt\Desktop\grump\mobile
npx expo start --clear
```

## Full Setup (Both Servers)

**Terminal 1 - Backend:**
```bash
cd C:\Users\Walt\Desktop\grump\backend
npm start
```

**Terminal 2 - Expo:**
```bash
cd C:\Users\Walt\Desktop\grump\mobile
npx expo start --clear
```

## What You'll See

After running `npx expo start`, you'll see:

```
› Metro waiting on exp://172.20.10.2:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
```

## Connect with Expo Go

1. Open **Expo Go** app on your iPhone
2. **Scan the QR code** from terminal
3. Grump will load!

## Troubleshooting

### Port Already in Use
```bash
npx expo start --port 8083
```

### Clear Everything and Restart
```bash
npx expo start --clear
```

### Backend Not Connecting
- Make sure backend is running on port 3000
- Check IP address in `mobile/store/ChatStore.tsx` is `172.20.10.2:3000`

---

**"Just run the commands. I'm waiting."** — Grump


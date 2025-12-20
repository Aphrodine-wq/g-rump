# Start Expo Dev Server

## Quick Start

Open a **new terminal window** and run:

```bash
cd C:\Users\Walt\Desktop\grump\mobile
npx expo start --clear
```

## If Port is Busy

If you see "Port 8081 is being used", try:

```bash
npx expo start --port 8083
```

Or kill the process using port 8081:

```bash
# Find the process
netstat -ano | findstr :8081

# Kill it (replace PID with the number from above)
taskkill /PID <PID> /F

# Then start Expo
npx expo start --clear
```

## What You Should See

After running the command, you'll see:

```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press o │ open project code in your editor

› Press ? │ show all commands

Logs for your project will appear below. Press Ctrl+C to exit.
```

## Connect with Expo Go

1. **Open Expo Go app** on your iPhone
2. **Scan the QR code** shown in the terminal
3. **Or manually enter URL**: Tap "Enter URL manually" and paste the `exp://` URL

## Troubleshooting

### Can't see QR code
- Make terminal window larger
- Increase font size in terminal
- Use "Enter URL manually" in Expo Go

### Connection fails
- Ensure iPhone and computer on same WiFi
- Try tunnel mode: `npx expo start --tunnel`
- Check firewall allows port 8081/8083

### Backend not connecting
- Make sure backend is running: `cd backend && npm start`
- Verify IP address in `mobile/store/ChatStore.tsx` is `172.20.10.2:3000`

---

**"Just run the command. I'm waiting."** — Grump


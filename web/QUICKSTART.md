# Grump Web - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Start the Backend

```bash
cd ../backend
npm install
npm start
```

Backend should be running on `http://localhost:3000`

### Step 2: Install Web Dependencies

```bash
cd ../web
npm install
```

### Step 3: Run the Web App

**Option A: Browser (Recommended for development)**
```bash
npm run dev
```
Open `http://localhost:5173` in your browser

**Option B: Electron App (Windows native)**
```bash
npm run electron:dev
```

### Step 4: Start Chatting!

The web app connects to the same backend as iOS, so you'll get the same Grump personality.

## 🎨 Features

- ✅ Full chat interface
- ✅ Animated Grump avatar
- ✅ Character-by-character message reveal
- ✅ Real-time typing indicators
- ✅ Syncs with iOS via shared backend

## 🔧 Configuration

Create `web/.env`:
```env
VITE_API_URL=http://localhost:3000
```

For production, update to your production backend URL.

## 📦 Building for Production

```bash
npm run build
npm run electron:build
```

Windows installer will be in `dist/` folder.

## 🐛 Troubleshooting

**Can't connect to backend?**
- Make sure backend is running on port 3000
- Check `VITE_API_URL` in `.env`
- Check browser console for errors

**Electron won't start?**
- Make sure Vite dev server is running first
- Check that port 5173 is available

## 🎯 Next Steps

- Customize avatar animations
- Add more expressions
- Implement WebSocket for real-time sync
- Add user authentication for true cross-device sync


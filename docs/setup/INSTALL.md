# 🚀 Grump Platform - Complete Installation Guide

## Quick Start (Automated)

### Windows
```powershell
.\setup.ps1
```

### macOS/Linux
```bash
chmod +x setup.sh
./setup.sh
```

This will:
- ✅ Check Node.js installation
- ✅ Install all backend dependencies
- ✅ Install all web dependencies
- ✅ Create .env files
- ✅ Set everything up automatically

## Manual Setup

### 1. Prerequisites
- Node.js 18+ ([Download](https://nodejs.org))
- npm (comes with Node.js)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 3. Web Client Setup
```bash
cd web
npm install
cp .env.example .env
# .env is already configured for localhost:3000
```

## Running Everything

### Option 1: Automated (All at Once)

**Windows:**
```powershell
.\start-all.ps1
```

**macOS/Linux:**
```bash
chmod +x start-all.sh
./start-all.sh
```

### Option 2: Manual (Separate Terminals)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Web Client:**
```bash
cd web
npm run dev        # Browser version
# OR
npm run electron:dev  # Electron app
```

## What Gets Installed

### Backend
- express
- @anthropic-ai/sdk
- dotenv
- express-rate-limit
- cors

### Web Client
- react
- react-dom
- typescript
- vite
- framer-motion
- axios
- electron (for Windows app)

## Verification

After setup, you should have:
- ✅ `backend/node_modules/` - Backend dependencies
- ✅ `backend/.env` - Backend config (add API key!)
- ✅ `web/node_modules/` - Web dependencies
- ✅ `web/.env` - Web config (already set)

## Next Steps

1. **Add API Key**: Edit `backend/.env` and add your `ANTHROPIC_API_KEY`
2. **Start Backend**: `cd backend && npm start`
3. **Start Web**: `cd web && npm run dev`
4. **Open Browser**: Go to `http://localhost:5173`

## Troubleshooting

**"npm not found"**
- Install Node.js from https://nodejs.org

**"Port 3000 already in use"**
- Stop other services using port 3000
- Or change PORT in `backend/.env`

**"Port 5173 already in use"**
- Stop other Vite dev servers
- Or change port in `web/vite.config.ts`

**"Cannot connect to backend"**
- Make sure backend is running on port 3000
- Check `VITE_API_URL` in `web/.env`

## That's It!

You're ready to chat with Grump! 🎭


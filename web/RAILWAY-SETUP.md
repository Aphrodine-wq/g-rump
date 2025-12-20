# 🚂 Railway Backend Setup Guide

This guide shows you how to configure the frontend to connect to your Railway backend.

## 🔗 Setting VITE_API_URL

The frontend uses the `VITE_API_URL` environment variable to connect to your backend API.

### Option 1: Railway Environment Variables (Recommended for Production)

1. **Go to your Railway project dashboard**
2. **Navigate to:** Your frontend service → Variables
3. **Add a new variable:**
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend-app.railway.app`
   - Replace `your-backend-app` with your actual Railway backend service name

4. **Redeploy your frontend** for the changes to take effect

### Option 2: Local Development (.env file)

1. **Create `web/.env` file:**
   ```powershell
   cd web
   Copy-Item .env.example .env
   ```

2. **Edit `web/.env`:**
   ```env
   # For local development (backend running locally)
   VITE_API_URL=http://localhost:3000

   # OR for Railway backend (during development)
   # VITE_API_URL=https://your-backend-app.railway.app
   ```

3. **Restart your dev server:**
   ```powershell
   npm run dev
   ```

## 🔍 Finding Your Railway Backend URL

1. **Go to Railway dashboard:** https://railway.app/
2. **Select your backend project**
3. **Click on your backend service**
4. **Go to Settings → Networking**
5. **Copy the Public Domain URL** (e.g., `https://your-app-name.railway.app`)

## ✅ Verification

### Check Current Configuration

The frontend code uses:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
```

This means:
- If `VITE_API_URL` is set → uses that URL
- If not set → defaults to `http://localhost:3000`

### Test Your Connection

1. **Start your frontend:**
   ```powershell
   cd web
   npm run dev
   ```

2. **Open browser console** (F12)
3. **Try sending a message** in the chat
4. **Check the Network tab** to see which URL is being used
5. **Look for requests to:** `https://your-backend-app.railway.app/api/chat`

## 🚀 Deployment Scenarios

### Scenario 1: Frontend on Railway, Backend on Railway

**Frontend Service Variables:**
```env
VITE_API_URL=https://your-backend-app.railway.app
```

**Backend Service:**
- Already configured with your API keys
- Public domain enabled

### Scenario 2: Frontend Local, Backend on Railway

**Local `web/.env`:**
```env
VITE_API_URL=https://your-backend-app.railway.app
```

### Scenario 3: Both Local (Development)

**Local `web/.env`:**
```env
VITE_API_URL=http://localhost:3000
```

## 🔒 Security Notes

- ✅ `VITE_API_URL` is safe to expose (it's a public API endpoint)
- ✅ Backend API keys are stored server-side only
- ✅ `.env` file is in `.gitignore` (won't be committed)
- ✅ Railway environment variables are secure

## 🐛 Troubleshooting

### "Network Error" or "Connection Refused"

1. **Check your Railway backend is running:**
   - Go to Railway dashboard
   - Verify service is "Active"
   - Check logs for errors

2. **Verify the URL is correct:**
   - Check Railway → Settings → Networking
   - Copy the exact Public Domain URL
   - Make sure it includes `https://`

3. **Check CORS settings:**
   - Backend should allow your frontend origin
   - Check `backend/config/config.js`:
     ```javascript
     cors: {
       origin: process.env.CORS_ORIGIN || '*'
     }
     ```

### "Invalid API Key" Errors

- This is a backend issue, not frontend
- Check your `backend/.env` has the correct API keys
- See `backend/PROVIDER-SETUP.md` for backend configuration

### Environment Variable Not Loading

1. **Restart your dev server** after changing `.env`
2. **Clear browser cache** and hard refresh (Ctrl+Shift+R)
3. **Check variable name** is exactly `VITE_API_URL` (case-sensitive)
4. **Verify `.env` file** is in the `web/` directory

## 📝 Quick Reference

| Environment | VITE_API_URL Value |
|-------------|-------------------|
| Local Dev | `http://localhost:3000` |
| Railway Backend | `https://your-app-name.railway.app` |
| Production | `https://api.yourdomain.com` |

## 🔄 Updating After Deployment

If you change your Railway backend URL:

1. **Update Railway environment variable** (if using Option 1)
2. **OR update `web/.env`** (if using Option 2)
3. **Redeploy/restart** your frontend
4. **Test the connection**

---

**Need help?** Check:
- `backend/README.md` - Backend setup
- `web/README.md` - Frontend setup
- Railway documentation: https://docs.railway.app/


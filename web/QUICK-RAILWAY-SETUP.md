# 🚂 Quick Railway Setup

## Set VITE_API_URL for Railway Backend

### Step 1: Get Your Railway Backend URL

1. Go to https://railway.app/
2. Select your backend project
3. Click on your backend service
4. Go to **Settings → Networking**
5. Copy the **Public Domain URL** (e.g., `https://your-app-name.railway.app`)

### Step 2: Set the Environment Variable

#### Option A: Railway Environment Variables (Production)

1. In Railway, go to your **frontend service**
2. Navigate to **Variables** tab
3. Click **+ New Variable**
4. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend-app.railway.app` (your actual URL)
5. **Redeploy** your frontend service

#### Option B: Local Development (.env file)

1. **Create `web/.env`:**
   ```powershell
   cd web
   Copy-Item .env.example .env
   ```

2. **Edit `web/.env`:**
   ```env
   VITE_API_URL=https://your-backend-app.railway.app
   ```

3. **Restart dev server:**
   ```powershell
   npm run dev
   ```

### Step 3: Verify

1. Open your app
2. Open browser console (F12)
3. Send a test message
4. Check Network tab - should see requests to your Railway URL

---

**That's it!** Your frontend will now connect to your Railway backend.

For detailed instructions, see `web/RAILWAY-SETUP.md`


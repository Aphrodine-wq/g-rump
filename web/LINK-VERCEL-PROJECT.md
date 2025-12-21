# 🔗 Link to Existing Vercel Project

Your Vercel Project ID: `prj_834pXqdDfpAIvfntpB8c48u9H8sz`

## Option 1: Link via CLI (After Login)

1. **Login to Vercel:**
   ```powershell
   vercel login
   ```
   This will open your browser for authentication.

2. **Link to your project:**
   ```powershell
   vercel link --project prj_834pXqdDfpAIvfntpB8c48u9H8sz
   ```

3. **Deploy:**
   ```powershell
   vercel --prod --yes
   ```

## Option 2: Configure via Dashboard

1. **Go to:** https://vercel.com/dashboard
2. **Find your project** (ID: `prj_834pXqdDfpAIvfntpB8c48u9H8sz`)
3. **Go to:** Settings → General
4. **Verify configuration:**
   - Root Directory: `web`
   - Build Command: `npm install --legacy-peer-deps && npm run build --workspace=grump-web`
   - Output Directory: `dist`
   - Framework: Vite

5. **Add Environment Variable:**
   - Go to: Settings → Environment Variables
   - Add: `VITE_API_URL` = Your Railway backend URL

6. **Deploy:**
   - Go to: Deployments tab
   - Click "Redeploy" on latest deployment
   - OR push to `main` branch (auto-deploys)

## Option 3: Use Vercel Dashboard to Connect GitHub

1. **Go to:** https://vercel.com/dashboard
2. **Select your project**
3. **Go to:** Settings → Git
4. **Connect GitHub repository:** `Aphrodine-wq/g-rump`
5. **Set Root Directory:** `web`
6. **Save**

After connecting, every push to `main` will auto-deploy!

## Quick Deploy Command (After Login)

Once logged in, you can deploy with:
```powershell
vercel --prod --yes
```

The project is already linked via the project ID.

---

**Current Status:**
- ✅ Project ID: `prj_834pXqdDfpAIvfntpB8c48u9H8sz`
- ✅ `vercel.json` configured
- ✅ Build settings ready
- ⏳ Need authentication to deploy



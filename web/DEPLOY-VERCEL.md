# 🚀 Deploy to Vercel - Quick Guide

## Option 1: Deploy via Vercel Dashboard (Easiest - Recommended)

1. **Go to:** https://vercel.com/
2. **Sign in** with GitHub
3. **Click:** "Add New Project"
4. **Import** your repository: `Aphrodine-wq/g-rump`
5. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `web` (click "Edit" and set to `web`)
   - **Build Command:** `npm install --legacy-peer-deps && npm run build --workspace=grump-web`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install --legacy-peer-deps`
6. **Add Environment Variable:**
   - **Name:** `VITE_API_URL`
   - **Value:** Your Railway backend URL (e.g., `https://your-backend-app.railway.app`)
7. **Click:** "Deploy"

Vercel will automatically deploy on every push to `main` branch!

## Option 2: Deploy via CLI

### Step 1: Login
```powershell
vercel login
```
This will open your browser to authenticate.

### Step 2: Deploy
```powershell
# From project root
vercel --prod --yes
```

Or from web directory:
```powershell
cd web
vercel --prod --yes
```

## Current Status

✅ **Vercel CLI installed**  
✅ **vercel.json configured**  
✅ **SPA rewrites added**  
✅ **Node version specified (.nvmrc)**  
⏳ **Ready to deploy!**

## After Deployment

Your app will be available at:
- **Preview:** `https://your-project.vercel.app`
- **Production:** `https://your-project.vercel.app`

## Automatic Deployments

Once connected, Vercel will automatically:
- ✅ Deploy on every push to `main` branch
- ✅ Create preview deployments for pull requests
- ✅ Show build logs and deployment status

---

**Need help?** See `web/VERCEL-DEPLOY.md` for detailed instructions.



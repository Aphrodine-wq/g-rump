# 🚀 Deploy to Vercel

## Quick Deploy

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to:** https://vercel.com/
2. **Sign in** or create an account
3. **Click:** "Add New Project"
4. **Import** your GitHub repository: `Aphrodine-wq/g-rump`
5. **Configure:**
   - **Framework Preset:** Vite
   - **Root Directory:** `web`
   - **Build Command:** `npm ci && npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm ci`

6. **Add Environment Variable:**
   - **Name:** `VITE_API_URL`
   - **Value:** Your Railway backend URL (e.g., `https://your-backend-app.railway.app`)

7. **Click:** "Deploy"

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```powershell
   npm i -g vercel
   ```

2. **Login:**
   ```powershell
   vercel login
   ```

3. **Navigate to web directory:**
   ```powershell
   cd web
   ```

4. **Deploy:**
   ```powershell
   vercel
   ```

5. **Set environment variable:**
   ```powershell
   vercel env add VITE_API_URL
   ```
   Enter your Railway backend URL when prompted.

6. **Deploy to production:**
   ```powershell
   vercel --prod
   ```

## Configuration

The project already has a `vercel.json` in the root with:
- Build command for workspace
- Output directory: `web/dist`
- Framework: Vite
- Node version: 22.x
- SPA rewrites for client-side routing

## Environment Variables

**Required:**
- `VITE_API_URL` - Your Railway backend URL

**Set in Vercel Dashboard:**
1. Go to your project → Settings → Environment Variables
2. Add `VITE_API_URL` with your Railway backend URL
3. Redeploy

## After Deployment

Your app will be available at:
- **Preview:** `https://your-project.vercel.app`
- **Production:** `https://your-project.vercel.app` (or custom domain)

## Automatic Deployments

Vercel automatically deploys:
- ✅ Every push to `main` branch → Production
- ✅ Pull requests → Preview deployments
- ✅ Other branches → Preview deployments

## Troubleshooting

### Build Fails

1. **Check Node version:** Should be 22.x (configured in vercel.json)
2. **Check build logs** in Vercel dashboard
3. **Verify environment variables** are set correctly

### API Connection Issues

1. **Verify `VITE_API_URL`** is set in Vercel environment variables
2. **Check Railway backend** is running and accessible
3. **Verify CORS** settings in backend allow Vercel domain

### Routing Issues

The `vercel.json` includes SPA rewrites to handle client-side routing. If you have routing issues, check the rewrites configuration.

---

**Your app is now deployed!** 🎉

For more details, see: https://vercel.com/docs



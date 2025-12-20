# G-RUMP Railway Deployment Guide

Complete guide to deploying the G-RUMP backend to Railway.app

## Why Railway?

✅ **Auto-deploys** from GitHub on every push
✅ **Simple setup** - Connect GitHub, done
✅ **Perfect for Express.js** - Runs full Node.js server
✅ **Affordable** - $5-10/month after free trial
✅ **Production-ready** - Auto SSL, monitoring, logs
✅ **Easy environment variables** - No config files needed

---

## Quick Start (5 Minutes)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Start Free"
3. Sign in with GitHub
4. Authorize Railway to access your GitHub account

### Step 2: Deploy G-RUMP Backend
1. Click "Create New Project" or "New"
2. Select "Deploy from GitHub repo"
3. Find and select `Aphrodine-wq/g-rump`
4. Click "Create project"

### Step 3: Configure Backend Service
1. In the project, click "Add a Service"
2. Select "GitHub Repo"
3. Choose `Aphrodine-wq/g-rump` again
4. In the config panel:
   - **Root Directory:** `backend` ← **IMPORTANT**
   - Leave other settings default
5. Click "Deploy"

Railway will automatically detect it's a Node.js project and start building!

### Step 4: Set Environment Variables
1. Go to your service in Railway
2. Click the "Variables" tab
3. Add these variables:

```
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://g-rump.com
AI_PROVIDER=groq
GROQ_API_KEY=<your_groq_api_key>
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_TEMPERATURE=0.7
GROQ_TOP_P=1
GROQ_MAX_TOKENS=256
```

**Getting your GROQ_API_KEY:**
1. Go to https://console.groq.com
2. Sign up/login
3. Click "API Keys"
4. Create a new key
5. Copy and paste into Railway

4. Click "Add Variable" for each one
5. Railway will automatically redeploy with new variables

### Step 5: Get Your Railway URL
1. Go to the "Deployments" tab
2. Click the latest deployment
3. Look for the "URL" - it will be something like:
   ```
   https://g-rump-prod-production.up.railway.app
   ```
4. Copy this URL

### Step 6: Test Backend is Working
```bash
# Test health check
curl https://YOUR_RAILWAY_URL/health

# You should see:
# {"status":"ok"}
```

### Step 7: Configure Vercel Frontend
1. Go to Vercel project for g-rump
2. Click Settings → Environment Variables
3. Update `VITE_API_URL`:
   ```
   VITE_API_URL=https://YOUR_RAILWAY_URL
   ```
4. Vercel will auto-redeploy
5. Wait 1-2 minutes for rebuild

### Step 8: Test End-to-End
1. Visit https://g-rump.com
2. Open browser console (F12)
3. Send a message to Grump
4. You should see:
   ```
   [DEBUG] Sending message to API: http://...
   [DEBUG] API response received: {...}
   [DEBUG ChatView] Messages updated: 2
   ```
5. Chat response should appear in UI

✅ **Done! You're live!**

---

## Detailed Setup

### Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_ENV` | Production vs Development | `production` |
| `PORT` | Server port (Railway ignores, uses 3000) | `3000` |
| `CORS_ORIGIN` | Frontend domain (for CORS security) | `https://g-rump.com` |
| `AI_PROVIDER` | Which AI service to use | `groq` or `anthropic` |
| `GROQ_API_KEY` | Groq API authentication key | Copy from console.groq.com |
| `GROQ_MODEL` | Which Groq model to use | `llama-3.3-70b-versatile` |
| `GROQ_TEMPERATURE` | Response creativity (0-2) | `0.7` |
| `GROQ_TOP_P` | Response diversity | `1` |
| `GROQ_MAX_TOKENS` | Max response length | `256` |

### Using Anthropic Instead of Groq

If you prefer Claude (Anthropic) instead:

1. Get API key from https://console.anthropic.com
2. Set these variables in Railway:
   ```
   AI_PROVIDER=anthropic
   ANTHROPIC_API_KEY=<your_anthropic_key>
   ```
3. Remove Groq variables (or leave them)

---

## Auto-Deploy on Git Push

Railway is already configured for auto-deploy! Here's how it works:

1. You push to GitHub: `git push origin main`
2. GitHub webhook notifies Railway
3. Railway pulls latest code
4. Railway rebuilds the backend
5. Railway deploys new version
6. Your backend is live (1-2 minutes)

**No additional setup needed!** It just works.

---

## Viewing Logs

### In Railway Dashboard
1. Go to your service
2. Click "Logs" tab
3. See real-time logs as requests come in

### Command Line (With Railway CLI)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# View logs
railway logs
```

### Watch Logs in Real-Time
```bash
railway logs --follow
```

---

## Common Issues & Troubleshooting

### Issue: "Deployment Failed"

**Check:**
1. Click on failed deployment
2. Scroll to bottom of logs
3. Look for error message

**Common causes:**
- Wrong root directory (should be `backend`)
- Missing environment variables
- Invalid API key

**Fix:**
```bash
# Check your backend folder structure
ls backend/
# Should see: server.js, package.json, routes/, services/, etc.
```

### Issue: API Endpoint Returns 500 Error

**Check environment variables:**
1. Railway dashboard → Variables
2. Verify `GROQ_API_KEY` is set correctly
3. Verify `AI_PROVIDER=groq`

**Test API directly:**
```bash
curl -X POST https://YOUR_RAILWAY_URL/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

### Issue: CORS Errors in Browser Console

**Error message:** "Access to XMLHttpRequest blocked by CORS policy"

**Fix:**
1. Railway → Variables
2. Update `CORS_ORIGIN` to your Vercel domain:
   ```
   CORS_ORIGIN=https://g-rump.com
   ```
3. Railway auto-redeploys
4. Try again in browser

### Issue: Messages Not Appearing in UI

**Check logs:**
1. Browser console (F12) - look for errors
2. Railway logs - look for API errors
3. Check `VITE_API_URL` in Vercel matches Railway URL

**Debug:**
```bash
# Check if backend is responding
curl https://YOUR_RAILWAY_URL/health

# Should return: {"status":"ok"}
```

### Issue: Rate Limiting / Too Many Requests (429)

This is intentional! Backend has 100 requests per 15 minutes.

If you hit it while testing:
- Wait 15 minutes, or
- Adjust in `backend/middleware/rateLimit.js`

---

## Custom Domain (Optional)

Want `api.g-rump.com` instead of the Railway URL?

### Step 1: Add Domain in Railway
1. Railway dashboard → Your service
2. Click "Settings" → "Networking"
3. Click "Add Domain"
4. Enter: `api.g-rump.com`

### Step 2: Update DNS
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find DNS settings
3. Add CNAME record:
   - **Name:** `api`
   - **Value:** `YOUR_RAILWAY_URL`

Railway will provide the exact value to use.

### Step 3: Update Vercel
1. Vercel → Environment Variables
2. Change `VITE_API_URL` to:
   ```
   VITE_API_URL=https://api.g-rump.com
   ```
3. Vercel auto-redeploys

### Step 4: Wait for DNS
- DNS propagation takes 5-48 hours
- Check: `nslookup api.g-rump.com`

---

## Monitoring & Health

### Check Service Status
```bash
# Is your backend alive?
curl https://YOUR_RAILWAY_URL/health

# Response should be: {"status":"ok"}
```

### View Resource Usage
1. Railway dashboard → Your service
2. Click "Analytics" tab
3. See CPU, Memory, Network usage

### Set Up Alerts (Optional)
1. Settings → Notifications
2. Get alerts if deployment fails or service stops

---

## Updating Your App

To deploy new code:

```bash
# Make changes locally
nano backend/services/groq.js

# Commit and push
git add .
git commit -m "Update Grump personality"
git push origin main

# Railway automatically deploys!
# Check Railway dashboard → Deployments
```

---

## Rollback (If Something Goes Wrong)

### Instant Rollback in Railway

1. Railway → Deployments tab
2. Find previous working deployment
3. Click the three dots (⋯)
4. Select "Restore"
5. Boom! Previous version is live

### Or Revert Git Commit
```bash
git revert HEAD
git push origin main
# Railway redeploys from new commit
```

---

## Cost

### Free Trial
- First $5 free credit
- Enough to test deployment

### After Trial
- **Starter Plan:** $5/month minimum
- Includes 1 service running 24/7
- Generous resource limits
- Email support

### How to See Costs
1. Railway dashboard → Billing
2. See usage breakdown
3. Current month's costs

### Cost Optimization
- Current setup: ~$5-8/month
- Most cost is from running 24/7 (expected)
- Can't reduce much without stopping service
- Switch to Heroku only if cost is a concern

---

## Next Steps

1. ✅ Create Railway account
2. ✅ Deploy backend (this guide)
3. ✅ Configure environment variables
4. ✅ Get Railway URL
5. ✅ Update Vercel's `VITE_API_URL`
6. ✅ Test end-to-end
7. Configure custom domain (optional)
8. Set up monitoring (optional)
9. iOS/mobile app updates (if needed)

---

## Support

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **G-RUMP GitHub:** https://github.com/Aphrodine-wq/g-rump
- **Check logs:** Railway dashboard → Logs tab

---

## Production Checklist

Before launching to users:

- [ ] Backend deployed to Railway
- [ ] Environment variables set correctly
- [ ] GROQ_API_KEY configured
- [ ] Health check working (`/health` endpoint)
- [ ] Frontend updated with Railway URL
- [ ] End-to-end test: message → response works
- [ ] No errors in browser console
- [ ] No errors in Railway logs
- [ ] Domain configured (if using custom domain)
- [ ] CORS_ORIGIN set to your Vercel domain
- [ ] Auto-deploy verified (push code, Railway deploys)
- [ ] Cost understood ($5-10/month after trial)
- [ ] Rollback procedure understood

✅ **All set! You're production-ready!**

# G-RUMP Deployment Checklist for g-rump.com

## Pre-Deployment
- [ ] All code committed to GitHub (`Aphrodine-wq/g-rump`)
- [ ] `.env` files created with production values
- [ ] API keys obtained (Groq or Anthropic)
- [ ] Domain g-rump.com registered and available
- [ ] Vercel account created (https://vercel.com)
- [ ] Backend hosting provider chosen (Railway recommended)

## Frontend Deployment (Vercel)

### Step 1: Connect GitHub
- [ ] Go to https://vercel.com
- [ ] Click "New Project"
- [ ] Connect GitHub account if not already connected
- [ ] Select `Aphrodine-wq/g-rump` repository
- [ ] Click "Import"

### Step 2: Configure Build
- [ ] Framework: `Vite`
- [ ] Build Command: `cd web && npm install && npm run build`
- [ ] Output Directory: `web/dist`
- [ ] Node Version: `18.x` (or latest LTS)

### Step 3: Set Environment Variables
- [ ] `VITE_API_URL` = Your backend API endpoint
  - Local: `http://localhost:3000`
  - Railway: `https://g-rump-prod.railway.app`
  - Custom domain: `https://api.g-rump.com`

### Step 4: Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Verify frontend loads at vercel-generated URL
- [ ] Test chat interface works

### Step 5: Configure Domain
- [ ] In Vercel Project → Settings → Domains
- [ ] Add domain: `g-rump.com`
- [ ] Copy Vercel nameservers
- [ ] Update domain registrar's DNS to point to Vercel
- [ ] Wait for DNS propagation (5-48 hours)
- [ ] Verify domain points to frontend

## Backend Deployment (Choose One)

### Option A: Railway (Recommended)

#### Step 1: Setup Railway
- [ ] Create account at https://railway.app
- [ ] Connect GitHub account
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub"
- [ ] Choose `Aphrodine-wq/g-rump`

#### Step 2: Configure
- [ ] Root directory: `backend`
- [ ] Go to Variables tab
- [ ] Set all environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3000`
  - [ ] `CORS_ORIGIN=https://g-rump.com`
  - [ ] `AI_PROVIDER=groq` or `anthropic`
  - [ ] `GROQ_API_KEY=your_key` (if using Groq)
  - [ ] `ANTHROPIC_API_KEY=your_key` (if using Anthropic)

#### Step 3: Deploy & Test
- [ ] Railway auto-deploys on git push
- [ ] Go to Deployments tab
- [ ] Note your Railway app URL (e.g., `https://g-rump-prod.railway.app`)
- [ ] Update Vercel's `VITE_API_URL` with Railway URL

#### Step 4: Test Connection
- [ ] Go to frontend at https://g-rump.com
- [ ] Open browser console (F12)
- [ ] Send a test message to Grump
- [ ] Verify response appears in UI (not just console)
- [ ] Check for `[DEBUG]` logs confirming API connection

#### Step 5: Custom Domain (Optional)
- [ ] Railway dashboard → Networking → Domains
- [ ] Add `api.g-rump.com`
- [ ] Update DNS with Railway's nameserver
- [ ] Update Vercel's `VITE_API_URL=https://api.g-rump.com`

### Option B: Heroku

- [ ] Install Heroku CLI
- [ ] `heroku login`
- [ ] `heroku create grump-api`
- [ ] Set config variables: `heroku config:set NODE_ENV=production CORS_ORIGIN=https://g-rump.com GROQ_API_KEY=your_key`
- [ ] `git subtree push --prefix backend heroku main`
- [ ] Test endpoint: `curl https://grump-api.herokuapp.com/health`
- [ ] Update Vercel's `VITE_API_URL`

### Option C: Other Provider
- [ ] Follow provider-specific deployment steps
- [ ] Set all required environment variables
- [ ] Test backend is responding
- [ ] Note backend URL
- [ ] Update Vercel's `VITE_API_URL`

## Post-Deployment Testing

### Frontend Tests
- [ ] Visit https://g-rump.com in browser
- [ ] Page loads without 404s
- [ ] No console errors (F12 → Console)
- [ ] Grump face animation displays
- [ ] All UI elements visible

### Backend Connection Tests
- [ ] Open browser console (F12)
- [ ] Look for `[DEBUG] Sending message to API:`
- [ ] Send a test message
- [ ] Look for `[DEBUG] API response received:`
- [ ] Message appears in chat UI within 5-10 seconds
- [ ] No CORS errors in console

### Full End-to-End Test
- [ ] Send message: "Hello Grump"
- [ ] Grump should respond
- [ ] Face animation should change based on mood
- [ ] Test multiple messages
- [ ] Test different message types (questions, comments)
- [ ] Verify responses are contextually appropriate

### Error Handling Tests
- [ ] Stop backend temporarily, send message
- [ ] Frontend should show error message
- [ ] Verify error message is helpful
- [ ] Restart backend and retry
- [ ] Message should send successfully

## Security & Performance

- [ ] HTTPS enabled on frontend (automatic with Vercel)
- [ ] HTTPS enabled on backend
- [ ] CORS restricted to `https://g-rump.com` (not `*`)
- [ ] API keys not exposed in frontend code
- [ ] API keys stored as environment variables
- [ ] Rate limiting working (100 req/15min)
- [ ] Test with multiple rapid requests
- [ ] Verify rate limiting kicks in appropriately

## Monitoring Setup (Optional but Recommended)

- [ ] Set up error tracking (Sentry, Rollbar, etc.)
- [ ] Set up performance monitoring
- [ ] Configure uptime monitoring
- [ ] Set up alerts for downtime
- [ ] Review logs periodically

## Documentation & Handoff

- [ ] DEPLOYMENT.md reviewed and accurate
- [ ] Environment variables documented
- [ ] API keys stored securely
- [ ] Deployment URLs recorded
- [ ] Rollback procedure documented
- [ ] Team members informed of production URLs

## Go-Live

- [ ] All above checkboxes completed ✓
- [ ] Frontend responsive on mobile
- [ ] iOS/Android apps updated with production API URL (if applicable)
- [ ] Privacy policy published at https://g-rump.com/privacy
- [ ] Monitor for first 24 hours
- [ ] Success! 🎉

## Rollback Plan (In Case of Issues)

### Vercel Rollback
1. Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "Promote" to make it live

### Railway Rollback
1. Railway Dashboard → Deployments
2. Select previous working deployment
3. Click "Restore" or redeploy from earlier commit

### Emergency Rollback
```bash
git revert HEAD
git push origin main
# Services auto-redeploy from new commit
```

## Post-Launch Maintenance

- [ ] Monitor error logs daily for first week
- [ ] Check API response times
- [ ] Verify rate limiting isn't blocking users
- [ ] Monitor API provider costs
- [ ] Plan for scaling if needed
- [ ] Regular backups (if using database)
- [ ] Keep dependencies updated
- [ ] Plan for iOS App Store submission
- [ ] Plan for Google Play Store submission

## Quick Reference

**Frontend URL:** https://g-rump.com
**Backend API:** https://api.g-rump.com (or Railway-provided URL)
**Admin Dashboards:**
- Vercel: https://vercel.com/dashboard
- Railway: https://railway.app/dashboard
- API Keys: Stored in environment variables

**Support Resources:**
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- GitHub Repo: https://github.com/Aphrodine-wq/g-rump

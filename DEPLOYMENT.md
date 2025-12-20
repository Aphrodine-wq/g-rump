# G-RUMP Deployment Guide

This guide covers deploying G-RUMP to production on g-rump.com using Vercel for the frontend.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
3. [Backend Deployment Options](#backend-deployment-options)
4. [Production Configuration](#production-configuration)
5. [Environment Variables](#environment-variables)
6. [Monitoring & Troubleshooting](#monitoring--troubleshooting)

---

## Quick Start

### Prerequisites
- Git repository pushed to GitHub (Aphrodine-wq/g-rump)
- Vercel account (free tier available at vercel.com)
- Backend hosting chosen (Railway recommended)
- Domain g-rump.com registered and ready

### Deployment Steps
1. Deploy frontend to Vercel (see below)
2. Deploy backend to your chosen provider
3. Configure environment variables
4. Test the connection
5. Update DNS if needed

---

## Frontend Deployment (Vercel)

### Option 1: Deploy from GitHub (Recommended)

1. **Connect GitHub Repository:**
   - Go to https://vercel.com
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose "Aphrodine-wq/g-rump"
   - Click "Import"

2. **Configure Build Settings:**
   - Framework Preset: `Vite`
   - Build Command: `cd web && npm install && npm run build`
   - Output Directory: `web/dist`
   - Root Directory: `.` (leave empty)
   - Node Version: `18.x` (or latest LTS)

3. **Set Environment Variables:**
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `https://api.g-rump.com` (or wherever your backend is hosted)
   - Click "Deploy"

4. **Configure Domain:**
   - Go to Project Settings → Domains
   - Add domain: `g-rump.com`
   - Follow Vercel's DNS instructions
   - Update your domain registrar's DNS records

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Follow the prompts:
# - Link to existing project or create new
# - Set VITE_API_URL environment variable
# - Wait for deployment
```

### Verify Frontend Deployment
- Visit https://g-rump.com
- Check browser console (F12) for any errors
- Look for `[DEBUG]` logs to verify API connection attempts

---

## Backend Deployment Options

Choose ONE of the following based on your preferences:

### Option A: Railway (Recommended) ⭐

**Pros:** Easy integration with Git, free tier, good performance
**Cons:** Paid after trial period ($5-20/month)

1. **Create Railway Account:**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy Backend:**
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Choose `Aphrodine-wq/g-rump`
   - Configure root directory: `backend`

3. **Configure Environment Variables:**
   - Go to Project → Variables
   - Add all `.env` variables from `backend/.env.example`
   - Set `NODE_ENV=production`
   - Set `CORS_ORIGIN=https://g-rump.com`
   - Set your AI provider keys (Groq or Anthropic)

4. **Get Public URL:**
   - Go to Deployments → View Deployment
   - Copy the auto-generated URL (e.g., `https://g-rump-prod.railway.app`)
   - Use this as your `VITE_API_URL` in Vercel

5. **Custom Domain (Optional):**
   - Go to Networking → Domains
   - Add `api.g-rump.com`
   - Update DNS records

### Option B: Heroku

**Pros:** Popular, straightforward deployment
**Cons:** Pricing changed, requires paid tier for apps ($7/month)

```bash
# Install Heroku CLI
brew install heroku

# Login
heroku login

# Create app
heroku create grump-api

# Set environment variables
heroku config:set GROQ_API_KEY=your_key
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://g-rump.com

# Deploy
git subtree push --prefix backend heroku main
```

### Option C: DigitalOcean App Platform

**Pros:** Affordable, Docker support, good documentation
**Cons:** Slightly more complex setup

1. Go to DigitalOcean Apps → Create App
2. Select GitHub repository: `Aphrodine-wq/g-rump`
3. Set source directory: `/backend`
4. Configure environment variables
5. Deploy

### Option D: AWS/Elastic Beanstalk

**Pros:** Scalable, powerful
**Cons:** More complex, steeper learning curve

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p "Node.js 18" grump-api

# Set environment variables
eb setenv GROQ_API_KEY=your_key NODE_ENV=production

# Create and deploy
eb create grump-api-env
eb deploy
```

### Option E: Self-Hosted VPS (DigitalOcean, Linode, AWS EC2)

**Pros:** Full control, potentially cheaper at scale
**Cons:** You manage server, updates, security

See [VPS Deployment Guide](#vps-deployment-guide) below.

---

## Production Configuration

### 1. Environment Setup

**Backend (.env):**
```
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://g-rump.com
AI_PROVIDER=groq
GROQ_API_KEY=your_production_key
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_TEMPERATURE=0.7
```

**Frontend (Vercel Environment Variables):**
```
VITE_API_URL=https://api.g-rump.com
```

### 2. CORS Configuration

Update `backend/config/config.js` to restrict CORS in production:
```javascript
const corsOrigin = process.env.CORS_ORIGIN;
// Should be: https://g-rump.com (not "*")
```

### 3. SSL/TLS

- Vercel automatically provides SSL for your frontend
- Railway/Heroku automatically provide SSL for your backend
- If using a custom domain, ensure DNS is pointing to correct service
- All API calls should use HTTPS

### 4. Rate Limiting

Current backend has rate limiting: 100 requests per 15 minutes
- Adjust in `backend/middleware/rateLimit.js` if needed
- Monitor actual usage and adjust accordingly

---

## Environment Variables

### Backend Required Variables

```
AI_PROVIDER          # "groq" or "anthropic"
GROQ_API_KEY        # From console.groq.com (if using Groq)
GROQ_MODEL          # Model ID (default: llama-3.3-70b-versatile)
NODE_ENV            # "production" or "development"
PORT                # Server port (default: 3000)
CORS_ORIGIN         # Frontend URL (https://g-rump.com)
```

### Frontend Required Variables

```
VITE_API_URL        # Backend API endpoint
```

### Getting API Keys

**Groq API Key:**
1. Go to https://console.groq.com
2. Sign up/login
3. Create new API key
4. Copy and save securely

**Anthropic API Key:**
1. Go to https://console.anthropic.com
2. Create API key
3. Copy and save securely

---

## Monitoring & Troubleshooting

### Frontend Issues

**Check Vercel Logs:**
```bash
# Via CLI
vercel logs --prod

# Via Dashboard
# Go to Deployments → Click latest → Logs
```

**Browser Console:**
- Open F12 in browser
- Look for `[DEBUG]` logs
- Check for CORS errors

**Common Issues:**
- 404 on API calls → Check `VITE_API_URL` environment variable
- CORS errors → Check `CORS_ORIGIN` in backend .env
- Blank page → Check build output at Vercel dashboard

### Backend Issues

**Check Logs:**
```bash
# Railway
vercel logs (if using Vercel edge functions)
# Or Railway dashboard → Logs

# Heroku
heroku logs --tail

# DigitalOcean
View in App Platform dashboard
```

**Test API Directly:**
```bash
# Check if backend is running
curl https://api.g-rump.com/health

# Test chat endpoint
curl -X POST https://api.g-rump.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

**Common Issues:**
- 500 errors → Check API key configuration
- 401 errors → Invalid/expired API key
- Rate limit hits → Check rate limiting settings
- Cold start delays → Normal for serverless (Railway handles this)

---

## Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Domain g-rump.com pointing to Vercel
- [ ] Backend deployed (Railway/Heroku/other)
- [ ] Environment variables configured in both services
- [ ] API key configured and working
- [ ] CORS_ORIGIN set to frontend domain
- [ ] Tested chat functionality end-to-end
- [ ] Verified SSL/HTTPS working
- [ ] Set up error monitoring (optional)
- [ ] Configured auto-deploys from GitHub
- [ ] Updated iOS app with production API URL (if needed)
- [ ] Updated mobile app with production API URL (if needed)

---

## Automated Deployments

### GitHub Actions (Future Enhancement)

You can add GitHub Actions workflows to auto-deploy on push:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## Rollback Procedures

**Vercel:**
- Go to Deployments
- Click "Promote" on any previous deployment

**Railway/Heroku:**
- Redeploy from earlier commit or rollback in dashboard

**Emergency:**
```bash
# Revert last commit and redeploy
git revert HEAD
git push origin main
```

---

## VPS Deployment Guide

If you choose to self-host, use this guide with DigitalOcean, Linode, or AWS EC2:

### Server Setup

```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install Git
apt install -y git

# Install PM2 (process manager)
npm install -g pm2

# Clone repository
git clone https://github.com/Aphrodine-wq/g-rump.git
cd g-rump/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
nano .env  # Edit with your production values

# Start with PM2
pm2 start server.js --name "grump-api"
pm2 startup
pm2 save
```

### Nginx Reverse Proxy

```bash
# Install Nginx
apt install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/g-rump

# Add this configuration:
server {
    listen 80;
    server_name api.g-rump.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/g-rump /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL with Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.g-rump.com
```

---

## Support & Troubleshooting

For issues:
1. Check logs (see Monitoring section)
2. Verify environment variables
3. Test API endpoint directly
4. Check GitHub Issues
5. Review error messages carefully

---

## Next Steps

1. Choose your backend hosting provider
2. Configure environment variables
3. Deploy following the steps above
4. Test thoroughly
5. Set up monitoring
6. Consider CI/CD automation

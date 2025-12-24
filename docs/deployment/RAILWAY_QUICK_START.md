# Railway Deployment - Quick Start (5 Minutes)

## 1️⃣ Sign Up
- Go to https://railway.app
- Click "Start Free"
- Sign in with GitHub

## 2️⃣ Create Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Select `Aphrodine-wq/g-rump`

## 3️⃣ Configure Service
- Click "Add Service" → "GitHub Repo"
- Choose `Aphrodine-wq/g-rump` again
- **Root Directory: `backend`** ← IMPORTANT
- Click "Deploy"

## 4️⃣ Set Environment Variables

In Railway dashboard, click "Variables" and add:

```
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://g-rump.com
AI_PROVIDER=groq
GROQ_API_KEY=<GET_FROM_BELOW>
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_TEMPERATURE=0.7
GROQ_TOP_P=1
GROQ_MAX_TOKENS=256
```

### Get GROQ_API_KEY
1. Go to https://console.groq.com
2. Sign up/login
3. Click "API Keys"
4. Create new key
5. Copy & paste into Railway

## 5️⃣ Get Railway URL

- Click "Deployments" tab
- Copy your URL (looks like: `https://g-rump-prod-production.up.railway.app`)

## 6️⃣ Test Backend

```bash
curl https://YOUR_RAILWAY_URL/health
# Should return: {"status":"ok"}
```

## 7️⃣ Update Vercel

Go to your Vercel project:
- Settings → Environment Variables
- Set `VITE_API_URL=https://YOUR_RAILWAY_URL`
- Vercel auto-redeploys

## 8️⃣ Test Everything

1. Visit https://g-rump.com
2. Open browser console (F12)
3. Send message to Grump
4. Response should appear in chat UI

## ✅ Done!

Your app is now live on:
- **Frontend:** https://g-rump.com (via Vercel)
- **Backend:** YOUR_RAILWAY_URL (via Railway)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Deployment fails | Click deployment → scroll to error message |
| API returns 500 | Check GROQ_API_KEY is valid |
| CORS errors | Verify CORS_ORIGIN=https://g-rump.com |
| Messages don't appear | Check VITE_API_URL in Vercel matches Railway URL |
| Rate limit (429) | Wait 15 minutes or adjust in backend |

---

## After Launch

Every time you push code:
```bash
git push origin main
```

Railway automatically:
1. Pulls latest code
2. Rebuilds backend
3. Deploys new version
4. You're live in 1-2 minutes!

---

## Remove Debugging Logs (Optional)

Once deployed, you can remove the `[DEBUG]` logs:

In `web/src/store/ChatStore.tsx`, find and remove lines:
```javascript
logger.log('[DEBUG]...')
```

In `web/src/components/ChatView.tsx`, remove:
```javascript
console.log('[DEBUG ChatView]...')
```

Then commit and push - Railway will auto-deploy the cleaner version.

# 🚀 Deployment Guide - Master Index

**All deployment documentation in one place.**

## 🎯 Quick Deploy (Choose Your Path)

### Fastest Option (5 minutes)
**[Railway Quick Start](RAILWAY_QUICK_START.md)** ⭐ - Deploy backend in 5 minutes

### Complete Guides
- **[Railway Deployment](RAILWAY_DEPLOYMENT.md)** - Full Railway setup guide
- **[Full Deployment Guide](DEPLOYMENT.md)** - All platforms (Vercel + Railway/Heroku/etc)
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Pre-launch checklist

## 📋 Deployment Options

### Backend Hosting

| Platform | Guide | Best For |
|----------|-------|----------|
| **Railway** | [RAILWAY_QUICK_START.md](RAILWAY_QUICK_START.md) | ⭐ Recommended - Easiest |
| **Railway** | [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) | Complete Railway guide |
| **Heroku** | [DEPLOYMENT.md](DEPLOYMENT.md#option-b-heroku) | Alternative option |
| **DigitalOcean** | [DEPLOYMENT.md](DEPLOYMENT.md#option-c-digitalocean-app-platform) | App Platform |
| **AWS** | [DEPLOYMENT.md](DEPLOYMENT.md#option-d-awselastic-beanstalk) | Enterprise |
| **VPS** | [DEPLOYMENT.md](DEPLOYMENT.md#vps-deployment-guide) | Self-hosted |

### Frontend Hosting

| Platform | Guide | Best For |
|----------|-------|----------|
| **Vercel** | [web/DEPLOY-VERCEL.md](web/DEPLOY-VERCEL.md) | ⭐ Recommended |
| **Vercel** | [web/VERCEL-DEPLOY.md](web/VERCEL-DEPLOY.md) | Alternative guide |
| **Vercel** | [web/LINK-VERCEL-PROJECT.md](web/LINK-VERCEL-PROJECT.md) | Link existing project |

### Platform-Specific

- **[Web Client](web/README.md)** - Web deployment
- **[Mobile/Expo](mobile/README.md)** - Mobile deployment
- **[iOS Native](ios/README.md)** - iOS deployment

## 🗺️ Deployment Journey

### First Time Deployment

```
1. RAILWAY_QUICK_START.md     → Deploy backend (5 min)
2. web/DEPLOY-VERCEL.md       → Deploy frontend (5 min)
3. DEPLOYMENT_CHECKLIST.md    → Verify everything
4. ✅ Live!
```

### Production Setup

```
1. DEPLOYMENT.md              → Choose platform
2. Set environment variables  → API keys, URLs
3. Configure domains         → Custom domains
4. Test end-to-end           → Verify functionality
5. DEPLOYMENT_CHECKLIST.md    → Final checks
```

## 📝 Environment Variables Reference

### Backend (Railway)
```env
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-domain.com
AI_PROVIDER=groq
GROQ_API_KEY=your_key
KNOWLEDGE_BASE_GITHUB_FOLDER=https://github.com/user/repo/tree/main/docs/knowledge-base
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-railway-url.up.railway.app
```

## 🔗 Related Documentation

- **[Knowledge Base Setup](SETUP-GITHUB-FOLDER.md)** - Set up PDFs for production
- **[API Documentation](README.md#-api-documentation)** - API endpoints
- **[Troubleshooting](docs/QUICK-REFERENCE.md#troubleshooting)** - Common issues

---

**"Fine. I'm deployed. Test me."** — Grump


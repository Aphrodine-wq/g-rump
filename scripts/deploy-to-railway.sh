#!/bin/bash

##############################################################################
# G-RUMP Railway Deployment Helper
#
# This script helps you deploy the backend to Railway.app
#
# Usage: ./scripts/deploy-to-railway.sh
##############################################################################

set -e

echo "═══════════════════════════════════════════════════════════════"
echo "  G-RUMP Railway Deployment Helper"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}⚠️  Railway CLI not found${NC}"
    echo ""
    echo "Install Railway CLI:"
    echo "  npm install -g @railway/cli"
    echo ""
    read -p "Continue without Railway CLI? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check git status
echo -e "${BLUE}1. Checking git status...${NC}"
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}❌ Uncommitted changes detected${NC}"
    echo "Please commit your changes first:"
    echo "  git add ."
    echo "  git commit -m 'Your message'"
    exit 1
fi
echo -e "${GREEN}✓ Git working tree clean${NC}"
echo ""

# Display next steps
echo -e "${BLUE}2. Railway Deployment Steps${NC}"
echo ""
echo "To deploy to Railway:"
echo ""
echo "  Step 1: Create Railway account"
echo "    → Go to https://railway.app"
echo "    → Click 'Start Free'"
echo "    → Sign in with GitHub"
echo ""
echo "  Step 2: Create Project"
echo "    → Click 'New Project'"
echo "    → Select 'Deploy from GitHub repo'"
echo "    → Choose 'Aphrodine-wq/g-rump'"
echo ""
echo "  Step 3: Configure Service"
echo "    → Click 'Add Service' → 'GitHub Repo'"
echo "    → Choose 'Aphrodine-wq/g-rump'"
echo "    → Set Root Directory: backend"
echo "    → Click 'Deploy'"
echo ""
echo "  Step 4: Set Environment Variables (in Railway dashboard)"
echo "    → Click 'Variables' tab"
echo "    → Add these variables:"
echo ""
echo "    NODE_ENV=production"
echo "    PORT=3000"
echo "    CORS_ORIGIN=https://g-rump.com"
echo "    AI_PROVIDER=groq"
echo "    GROQ_API_KEY=<your_key_from_console.groq.com>"
echo "    GROQ_MODEL=llama-3.3-70b-versatile"
echo "    GROQ_TEMPERATURE=0.7"
echo "    GROQ_TOP_P=1"
echo "    GROQ_MAX_TOKENS=256"
echo ""
echo "  Step 5: Get Railway URL"
echo "    → Click 'Deployments' tab"
echo "    → Copy your auto-generated URL"
echo ""
echo "  Step 6: Update Vercel"
echo "    → Go to Vercel project"
echo "    → Settings → Environment Variables"
echo "    → Set VITE_API_URL=<your_railway_url>"
echo ""
echo "  Step 7: Test"
echo "    → Visit https://g-rump.com"
echo "    → Send a message to Grump"
echo "    → Chat response should appear in UI"
echo ""
echo -e "${GREEN}✓ Ready to deploy!${NC}"
echo ""

# Offer to read more detailed guide
read -p "Want to read the detailed Railway guide? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v less &> /dev/null; then
        less RAILWAY_DEPLOYMENT.md
    else
        cat RAILWAY_DEPLOYMENT.md | head -100
    fi
fi

echo ""
echo "For detailed information, see:"
echo "  RAILWAY_QUICK_START.md - Quick 5-minute setup"
echo "  RAILWAY_DEPLOYMENT.md - Complete deployment guide"
echo ""
echo -e "${GREEN}✅ Done!${NC}"

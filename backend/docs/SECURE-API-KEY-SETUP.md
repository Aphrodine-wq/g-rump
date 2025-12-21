# 🔐 Secure Claude API Key Setup Guide

## ✅ Security First

Your `.env` file is **already protected** by `.gitignore` - it will **never** be committed to git. This is the safest way to store API keys.

## 📋 Step-by-Step Instructions

### Method 1: Using the Template (Recommended)

1. **Copy the example file:**
   ```powershell
   cd backend
   Copy-Item .env.example .env
   ```

2. **Open the `.env` file:**
   ```powershell
   notepad .env
   ```
   Or use any text editor (VS Code, Notepad++, etc.)

3. **Find this line:**
   ```env
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

4. **Replace `your_anthropic_api_key_here` with your actual key:**
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

5. **Save the file**

### Method 2: Create from Scratch

1. **Navigate to backend folder:**
   ```powershell
   cd backend
   ```

2. **Create the `.env` file:**
   ```powershell
   New-Item -Path .env -ItemType File
   ```

3. **Add your API key:**
   ```powershell
   Add-Content -Path .env -Value "ANTHROPIC_API_KEY=sk-ant-api03-YOUR_ACTUAL_KEY_HERE"
   Add-Content -Path .env -Value "PORT=3000"
   Add-Content -Path .env -Value "NODE_ENV=development"
   ```

## 🔑 Getting Your Claude API Key

1. **Visit:** https://console.anthropic.com/
2. **Sign in** or create an account
3. **Navigate to:** API Keys section
4. **Click:** "Create Key"
5. **Copy** the key (starts with `sk-ant-api03-`)
6. **Paste** it into your `.env` file

⚠️ **Important:** Copy the key immediately - you won't be able to see it again!

## ✅ Verify Your Setup

Your `backend/.env` file should look like this:

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 🧪 Test Your Configuration

1. **Start the backend server:**
   ```powershell
   cd backend
   npm start
   ```

2. **Look for these success messages:**
   ```
   🚀 Grump backend server running on port 3000
   Environment: development
   ✓ Knowledge base initialization complete
   ```

3. **If you see a warning:**
   ```
   ⚠️  Warning: ANTHROPIC_API_KEY is not set
   ```
   → Your key wasn't loaded. Check:
   - File is named exactly `.env` (not `.env.txt`)
   - File is in the `backend/` folder (not root)
   - Key is on the correct line
   - No extra spaces around the `=` sign

## 🔒 Security Best Practices

### ✅ DO:
- ✅ Keep `.env` file local only (already in `.gitignore`)
- ✅ Use different keys for development and production
- ✅ Rotate keys if you suspect they're compromised
- ✅ Use environment variables in production (not `.env` files)
- ✅ Restrict API key permissions in Anthropic console
- ✅ Monitor API usage regularly

### ❌ DON'T:
- ❌ Commit `.env` to git (already protected, but double-check!)
- ❌ Share API keys in screenshots, messages, or documentation
- ❌ Hardcode keys in source code files
- ❌ Upload `.env` files to cloud storage publicly
- ❌ Use the same key for multiple projects
- ❌ Leave keys in public repositories (even in old commits)

## 🔄 Switching Between Providers

### Use Claude (Anthropic):
```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Use Groq (Alternative):
```env
AI_PROVIDER=groq
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 🚨 If Your Key is Compromised

1. **Immediately revoke it** in Anthropic console
2. **Create a new key**
3. **Update your `.env` file**
4. **Restart your server**

## 📝 Environment Variable Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | Yes* | - | Your Claude API key |
| `PORT` | No | `3000` | Server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `AI_PROVIDER` | No | `anthropic` | AI provider: `anthropic` or `groq` |
| `ANTHROPIC_TEMPERATURE` | No | `0.9` | Response creativity (0-1) |
| `ANTHROPIC_MAX_TOKENS` | No | `256` | Max response length |

*Required if `AI_PROVIDER=anthropic` or not set

## 🎯 Quick Checklist

- [ ] `.env` file created in `backend/` folder
- [ ] API key added (starts with `sk-ant-api03-`)
- [ ] No extra spaces around `=` sign
- [ ] File saved
- [ ] Server restarted
- [ ] No warnings in console
- [ ] Test message works

---

**Your API key is safe!** The `.env` file is in `.gitignore` and will never be committed to your repository.

**Need help?** Check `backend/README.md` or the main project `README.md`.


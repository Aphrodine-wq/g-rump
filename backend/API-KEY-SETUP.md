# 🔐 How to Safely Add Your API Key

## ✅ Security Check

Your `.env` file is **already protected** - it's in `.gitignore`, so it will **never** be committed to git.

## 📝 Step-by-Step Instructions

### Option 1: Edit the .env File Directly (Recommended)

1. **Open the `.env` file** in the `backend/` folder:
   ```
   backend/.env
   ```

2. **Find or add this line:**
   ```env
   ANTHROPIC_API_KEY=your_api_key_here
   ```

3. **Replace `your_api_key_here`** with your actual API key:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

4. **Save the file**

### Option 2: Using PowerShell (Command Line)

```powershell
# Navigate to backend folder
cd backend

# Add your API key (replace YOUR_KEY_HERE with your actual key)
Add-Content -Path .env -Value "ANTHROPIC_API_KEY=YOUR_KEY_HERE"
```

Or edit it:
```powershell
notepad .env
```

## 🔍 Verify Your Setup

Your `.env` file should look like this:

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PORT=3000
NODE_ENV=development
```

## ⚠️ Important Security Notes

✅ **DO:**
- Keep your `.env` file local (it's already in `.gitignore`)
- Use different API keys for development and production
- Rotate your keys if you suspect they're compromised

❌ **DON'T:**
- Commit `.env` to git (already protected)
- Share your API key in screenshots or messages
- Hardcode API keys in your code files
- Upload `.env` files to cloud storage publicly

## 🧪 Test Your API Key

After adding your key, restart the backend server:

```powershell
cd backend
npm start
```

You should see:
- ✅ `Server running on port 3000`
- ⚠️ No warnings about missing API key

## 🔄 If You Need to Change Your Key

Just edit `backend/.env` and change the `ANTHROPIC_API_KEY` value, then restart the server.

---

**Your API key is safe!** The `.env` file is in `.gitignore` and will never be committed to your repository.


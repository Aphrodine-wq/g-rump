# 📁 GitHub Folder Setup - One Link for All PDFs!

The easiest way to host your knowledge base: **one GitHub folder URL = all PDFs automatically discovered!**

## 🚀 Quick Setup (2 Minutes)

### Step 1: Create Folder & Upload PDFs

1. In your GitHub repo, create a folder (e.g., `knowledge-pdfs/`)
2. Upload all your PDFs to that folder
3. Commit and push to GitHub

### Step 2: Get Folder URL

Go to the folder on GitHub and copy the URL from your browser:

```
https://github.com/YOUR_USERNAME/g-rump/tree/main/knowledge-pdfs
```

Or if you prefer raw format:
```
https://raw.githubusercontent.com/YOUR_USERNAME/g-rump/main/knowledge-pdfs/
```

### Step 3: Add to Railway

1. Go to Railway dashboard → Your backend service
2. Click "Variables" tab
3. Add new variable:
   - **Key:** `KNOWLEDGE_BASE_GITHUB_FOLDER`
   - **Value:** `https://github.com/YOUR_USERNAME/g-rump/tree/main/knowledge-pdfs`
4. Save

### Step 4: Done! 🎉

Railway will auto-redeploy. Check logs to see:
```
📁 Fetching GitHub folder contents from: https://api.github.com/repos/...
✓ Found 5 PDF(s) in GitHub folder: file1.pdf, file2.pdf, ...
✓ Learned from: file1.pdf (750 chars from remote PDF, 750/15000 total)
```

---

## ✅ That's It!

**No need to:**
- ❌ List each PDF URL individually
- ❌ Update URLs when you add new PDFs
- ❌ Manage multiple environment variables

**Just:**
- ✅ Add PDFs to the folder
- ✅ Push to GitHub
- ✅ System auto-discovers them!

---

## 📝 Supported URL Formats

All of these work:

```
https://github.com/user/repo/tree/main/pdfs
https://github.com/user/repo/tree/master/pdfs
https://github.com/user/repo/blob/main/pdfs
https://raw.githubusercontent.com/user/repo/main/pdfs/
```

---

## 🔄 Adding New PDFs

1. Add PDF to the GitHub folder
2. Commit and push
3. System automatically picks it up on next server restart
4. Or call `/api/knowledge/reload` endpoint to reload immediately

---

## 🆚 GitHub Folder vs Individual URLs

**GitHub Folder (Recommended):**
- ✅ One URL for all PDFs
- ✅ Automatic discovery
- ✅ Easy to add new PDFs
- ✅ No URL management

**Individual URLs:**
- ✅ Works with any hosting (not just GitHub)
- ✅ More control over specific files
- ❌ Need to list each URL
- ❌ Manual updates when adding PDFs

**You can use both!** Set `KNOWLEDGE_BASE_GITHUB_FOLDER` for bulk PDFs and `KNOWLEDGE_BASE_URLS` for specific files.

---

## 🐛 Troubleshooting

### "GitHub folder not found"

- Check the URL is correct
- Make sure the folder exists in your repo
- Verify the branch name (main/master) matches

### "No PDFs found"

- Make sure PDFs are in the folder (not subfolders)
- Check file extensions are `.pdf` (lowercase)
- Verify the folder is in the correct branch

### "GitHub API rate limit"

- Normal: 60 requests/hour for unauthenticated
- Folder fetch is only 1 request, so you're fine
- If you hit limits, wait an hour or use GitHub token (future feature)

---

**"Fine. One link. Whatever."** — Grump


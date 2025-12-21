# 🚀 Quick Setup: Use Your Existing PDFs Folder

Your PDFs are already in `docs/knowledge-base/` on GitHub! Just set this one environment variable:

## Railway Environment Variable

**Key:** `KNOWLEDGE_BASE_GITHUB_FOLDER`

**Value:** 
```
https://github.com/Aphrodine-wq/g-rump/tree/main/docs/knowledge-base
```

## Steps

1. Go to Railway dashboard
2. Click your backend service
3. Go to "Variables" tab
4. Click "New Variable"
5. Add:
   - **Key:** `KNOWLEDGE_BASE_GITHUB_FOLDER`
   - **Value:** `https://github.com/Aphrodine-wq/g-rump/tree/main/docs/knowledge-base`
6. Save

Railway will auto-redeploy and fetch all 27 PDFs from that folder!

## Verify It Works

After deployment, check Railway logs. You should see:
```
📁 Fetching GitHub folder contents from: https://api.github.com/repos/Aphrodine-wq/g-rump/contents/docs/knowledge-base
✓ Found 27 PDF(s) in GitHub folder: [Kernighan-Ritchie]The_C_Programming_Language.pdf, 11.pdf, ...
✓ Learned from: [Kernighan-Ritchie]The_C_Programming_Language.pdf (750 chars from remote PDF, 750/15000 total)
...
✅ Knowledge base loaded: 27 PDF(s) processed, 0 skipped, X total characters
```

Or test the API:
```bash
curl https://your-railway-url/api/knowledge
```

Should show:
```json
{
  "localPDFCount": 0,
  "remotePDFCount": 27,
  "totalPDFCount": 27,
  "hasKnowledge": true,
  "githubFolder": "https://github.com/Aphrodine-wq/g-rump/tree/main/docs/knowledge-base"
}
```

---

**That's it! One variable, all 27 PDFs automatically loaded!** 🎉


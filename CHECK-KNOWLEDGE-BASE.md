# 🔍 Check Grump's Knowledge Base Status

## Quick Check

### Option 1: Query the API Endpoint

Call your production API's knowledge endpoint:

```bash
# Replace with your actual Railway/production URL
curl https://your-railway-url.up.railway.app/api/knowledge
```

Or visit in browser:
```
https://your-railway-url.up.railway.app/api/knowledge
```

**Expected Response if PDFs are loaded:**
```json
{
  "localPDFCount": 0,
  "localPDFs": [],
  "remotePDFCount": 5,
  "remotePDFs": ["https://example.com/pdf1.pdf", ...],
  "totalPDFCount": 5,
  "hasKnowledge": true
}
```

**Expected Response if NO PDFs are loaded:**
```json
{
  "localPDFCount": 0,
  "localPDFs": [],
  "remotePDFCount": 0,
  "remotePDFs": [],
  "totalPDFCount": 0,
  "hasKnowledge": false
}
```

### Option 2: Check Railway Logs

1. Go to Railway dashboard
2. Click on your backend service
3. Go to "Logs" tab
4. Look for startup logs that show:
   - `Loading knowledge base from X local PDF(s) and Y remote URL(s)...`
   - `✓ Learned from: filename.pdf`
   - `✅ Knowledge base loaded: X PDF(s) processed`

If you see `No PDFs found in knowledge base folder or remote URLs configured.`, then **no PDFs are being used**.

---

## Current Status: Likely NOT Using PDFs

Based on your deployment setup:

❌ **PDFs are probably NOT being used** because:
1. Railway deployments don't include the `docs/knowledge-base/` folder (180MB+ would be too large)
2. `KNOWLEDGE_BASE_URLS` environment variable is likely not set in Railway
3. The knowledge base service needs either local files OR remote URLs to work

---

## How to Enable PDFs in Production

### Step 1: Upload PDFs Online

Choose one:
- **GitHub Releases** (easiest, free)
- **Cloudflare R2** (cheap, S3-compatible)
- **AWS S3** (standard)
- Any CDN/static hosting

See: [`backend/KNOWLEDGE-BASE-REMOTE-HOSTING.md`](backend/KNOWLEDGE-BASE-REMOTE-HOSTING.md)

### Step 2: Get Direct Download URLs

Example GitHub Releases:
```
https://github.com/yourusername/g-rump/releases/download/v1.0/book1.pdf
https://github.com/yourusername/g-rump/releases/download/v1.0/book2.pdf
```

### Step 3: Add to Railway Environment Variables

1. Go to Railway dashboard
2. Click your backend service
3. Go to "Variables" tab
4. Add new variable:
   - **Key:** `KNOWLEDGE_BASE_URLS`
   - **Value:** `https://github.com/yourusername/g-rump/releases/download/v1.0/book1.pdf,https://github.com/yourusername/g-rump/releases/download/v1.0/book2.pdf`

5. Railway will auto-redeploy
6. Check logs to verify PDFs loaded

---

## Test After Enabling

1. **Check API:**
   ```bash
   curl https://your-railway-url/api/knowledge
   ```
   Should show `"hasKnowledge": true` and list your PDFs

2. **Test Chat:**
   Ask Grump something specific from your PDFs to verify he knows the content

3. **Check Logs:**
   Railway logs should show:
   ```
   ✓ Learned from: book1.pdf (750 chars from remote PDF, 750/15000 total)
   ✓ Learned from: book2.pdf (750 chars from remote PDF, 1500/15000 total)
   ✅ Knowledge base loaded: 2 PDF(s) processed, 0 skipped, 1500 total characters
   ```

---

## Quick Answer

**Right now, Grump is probably NOT using your PDFs** because:
- PDFs aren't bundled with Railway deployment
- `KNOWLEDGE_BASE_URLS` is likely not configured

**To fix:** Upload PDFs online and set `KNOWLEDGE_BASE_URLS` in Railway environment variables.


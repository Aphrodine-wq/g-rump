# 📚 Knowledge Base Remote Hosting Guide

Host your knowledge base PDFs online instead of bundling 180MB+ with your deployment!

## 🎯 Why Remote Hosting?

- **Vercel/Railway limits**: Avoid hitting deployment size limits
- **Faster deployments**: Smaller codebase = faster builds
- **Easy updates**: Update PDFs without redeploying
- **Cost savings**: Use free/cheap storage instead of deployment storage

---

## 🚀 Quick Setup

### Option A: GitHub Folder (Easiest - One Link!) ⭐

**Just upload all PDFs to a GitHub folder and use one URL!**

1. **Create a folder in your GitHub repo** (e.g., `knowledge-pdfs/`)
2. **Upload all PDFs to that folder**
3. **Get the folder URL:**
   - `https://github.com/YOUR_USERNAME/g-rump/tree/main/knowledge-pdfs`
   - Or: `https://raw.githubusercontent.com/YOUR_USERNAME/g-rump/main/knowledge-pdfs/`
4. **Add to Railway environment variables:**
   ```env
   KNOWLEDGE_BASE_GITHUB_FOLDER=https://github.com/YOUR_USERNAME/g-rump/tree/main/knowledge-pdfs
   ```
5. **Done!** The system automatically discovers all PDFs in that folder.

### Option B: Individual URLs

### Step 1: Upload PDFs to a Hosting Service

Choose one of these options (see details below):

1. **GitHub Releases** (Free, recommended for public repos)
2. **Cloudflare R2** (S3-compatible, very cheap)
3. **AWS S3** (Standard option)
4. **Any CDN/static hosting**

### Step 2: Get Direct Download URLs

Get direct download URLs for each PDF. Examples:
- GitHub Releases: `https://github.com/user/repo/releases/download/v1.0/file.pdf`
- S3/R2: `https://bucket.s3.region.amazonaws.com/file.pdf`
- CDN: `https://cdn.example.com/file.pdf`

### Step 3: Configure Environment Variable

Add to your `backend/.env`:

```env
# Comma-separated list of PDF URLs
KNOWLEDGE_BASE_URLS=https://example.com/pdf1.pdf,https://example.com/pdf2.pdf,https://example.com/pdf3.pdf
```

Or use newlines for readability:
```env
KNOWLEDGE_BASE_URLS=https://example.com/pdf1.pdf
https://example.com/pdf2.pdf
https://example.com/pdf3.pdf
```

### Step 4: Deploy!

The backend will automatically download and process PDFs from these URLs on startup.

---

## 📦 Hosting Options

### Option 1: GitHub Folder (Easiest - One Link!) ⭐

**Best for:** One folder, automatic discovery, no manual URL management

**Steps:**

1. **Create a folder in your GitHub repo:**
   - Create a folder like `knowledge-pdfs/` or `pdfs/` in your repo
   - Upload all your PDFs to that folder
   - Commit and push

2. **Get the folder URL:**
   - Go to the folder on GitHub
   - Copy the URL from browser (should look like):
     ```
     https://github.com/YOUR_USERNAME/g-rump/tree/main/knowledge-pdfs
     ```
   - Or use raw format:
     ```
     https://raw.githubusercontent.com/YOUR_USERNAME/g-rump/main/knowledge-pdfs/
     ```

3. **Add to Railway environment variables:**
   ```env
   KNOWLEDGE_BASE_GITHUB_FOLDER=https://github.com/YOUR_USERNAME/g-rump/tree/main/knowledge-pdfs
   ```

4. **Done!** The system automatically:
   - Fetches the folder contents via GitHub API
   - Finds all PDF files
   - Downloads and processes them

**Pros:**
- ✅ **One URL for all PDFs** - no need to list each file
- ✅ **Automatic discovery** - add new PDFs, just push to GitHub
- ✅ **Free** - no cost
- ✅ **Versioned** - tied to your repo
- ✅ **No manual URL management**

**Cons:**
- ⚠️ Public repos expose folder structure (but PDFs are public anyway)
- ⚠️ GitHub API rate limits (60 requests/hour for unauthenticated, but folder fetch is one request)

**Note:** For private repos, you may need a GitHub token (future feature).

---

### Option 2: GitHub Releases (Free, Recommended)

**Best for:** Public repositories, version control

**Steps:**

1. Create a new release in your GitHub repo:
   - Go to your repo → Releases → Create a new release
   - Tag version (e.g., `v1.0`)
   - Upload your PDFs as release assets

2. Get direct download URLs:
   ```
   https://github.com/USERNAME/REPO/releases/download/v1.0/filename.pdf
   ```

3. Add to `.env`:
   ```env
   KNOWLEDGE_BASE_URLS=https://github.com/yourusername/g-rump/releases/download/v1.0/book1.pdf,https://github.com/yourusername/g-rump/releases/download/v1.0/book2.pdf
   ```

**Pros:**
- ✅ Free
- ✅ Versioned (easy to update)
- ✅ No bandwidth limits for reasonable use
- ✅ Works with private repos (use GitHub token if needed)

**Cons:**
- ⚠️ Public repos expose URLs (but PDFs are public anyway)
- ⚠️ 2GB file size limit per file

---

### Option 2: Cloudflare R2 (Very Cheap)

**Best for:** Production, large files, S3-compatible storage

**Steps:**

1. Sign up at [Cloudflare R2](https://developers.cloudflare.com/r2/)
2. Create a bucket
3. Upload PDFs
4. Make files public (or use signed URLs)
5. Get public URLs:
   ```
   https://pub-xxxxx.r2.dev/filename.pdf
   ```

**Pros:**
- ✅ Very cheap ($0.015/GB storage, $0.36/GB egress)
- ✅ S3-compatible API
- ✅ No egress fees to Cloudflare (if using Cloudflare Workers)
- ✅ Fast CDN

**Cons:**
- ⚠️ Requires Cloudflare account
- ⚠️ Small learning curve

---

### Option 3: AWS S3 (Standard)

**Best for:** Enterprise, existing AWS infrastructure

**Steps:**

1. Create S3 bucket
2. Upload PDFs
3. Make files public (or use pre-signed URLs)
4. Get public URLs:
   ```
   https://bucket-name.s3.region.amazonaws.com/filename.pdf
   ```

**Pros:**
- ✅ Industry standard
- ✅ Reliable
- ✅ Integrates with AWS ecosystem

**Cons:**
- ⚠️ More expensive than R2
- ⚠️ Requires AWS account

---

### Option 4: Other Options

**Google Cloud Storage:**
```
https://storage.googleapis.com/bucket-name/filename.pdf
```

**Azure Blob Storage:**
```
https://account.blob.core.windows.net/container/filename.pdf
```

**Any CDN/Static Hosting:**
- Netlify
- Vercel (static files)
- GitHub Pages
- Any web server with public access

---

## 🔧 Configuration

### Environment Variables

**Option 1: GitHub Folder (Easiest)**
```env
# One URL for all PDFs in a GitHub folder
KNOWLEDGE_BASE_GITHUB_FOLDER=https://github.com/user/repo/tree/main/pdfs
```

**Option 2: Individual URLs**
```env
# Comma-separated or newline-separated URLs
KNOWLEDGE_BASE_URLS=https://example.com/pdf1.pdf,https://example.com/pdf2.pdf
```

**Optional: Size limits (defaults shown)**
```env
KNOWLEDGE_BASE_MAX_TOTAL_CHARS=15000  # Total characters from all PDFs
KNOWLEDGE_BASE_MAX_CHARS_PER_PDF=750  # Characters per PDF
```

### Using Multiple Sources

You can use **all three** simultaneously:

1. Keep some PDFs in `docs/knowledge-base/` (for local development)
2. Add GitHub folder in `KNOWLEDGE_BASE_GITHUB_FOLDER` (for bulk PDFs)
3. Add individual URLs in `KNOWLEDGE_BASE_URLS` (for specific files)

The system processes all sources automatically!

---

## 🧪 Testing

### Test Locally

**Option 1: GitHub Folder**
```env
KNOWLEDGE_BASE_GITHUB_FOLDER=https://github.com/yourusername/g-rump/tree/main/knowledge-pdfs
```

**Option 2: Individual URLs**
```env
KNOWLEDGE_BASE_URLS=https://example.com/test.pdf
```

2. Restart backend:
   ```bash
   cd backend
   npm start
   ```

3. Check logs for:
   ```
   📁 Fetching GitHub folder contents from: https://api.github.com/repos/...
   ✓ Found 5 PDF(s) in GitHub folder: file1.pdf, file2.pdf, ...
   ✓ Learned from: file1.pdf (750 chars from remote PDF, 750/15000 total)
   ```

### Test API

```bash
curl http://localhost:3000/api/knowledge
```

Should show:
```json
{
  "localPDFCount": 0,
  "localPDFs": [],
  "remotePDFCount": 1,
  "remotePDFs": ["https://example.com/test.pdf"],
  "totalPDFCount": 1,
  "hasKnowledge": true
}
```

---

## 🚨 Troubleshooting

### "Error downloading PDF from URL"

**Causes:**
- URL is not publicly accessible
- URL requires authentication
- File is too large (>100MB)
- Network timeout

**Solutions:**
- Verify URL works in browser
- Check CORS headers (if needed)
- Use signed URLs for private files
- Increase timeout in code if needed

### "No PDFs found"

**Check:**
1. `KNOWLEDGE_BASE_URLS` is set in `.env`
2. URLs are valid (test in browser)
3. URLs are comma-separated or newline-separated
4. URLs start with `http://` or `https://`

### PDFs Not Loading on Startup

**Check server logs:**
```bash
cd backend
npm start
```

Look for:
- `Loading knowledge base from X local PDF(s) and Y remote URL(s)...`
- `✓ Learned from: filename.pdf`

---

## 💡 Best Practices

1. **Use versioned URLs**: GitHub Releases or versioned S3 paths
2. **Test URLs first**: Verify they download correctly in browser
3. **Monitor size**: Keep total under limits (default 15k chars)
4. **Use CDN**: Faster downloads = faster startup
5. **Cache locally**: Consider caching downloaded PDFs (future feature)

---

## 📝 Example: Full Setup

### 1. Upload to GitHub Releases

Upload `book1.pdf`, `book2.pdf` to release `v1.0`

### 2. Get URLs

```
https://github.com/yourusername/g-rump/releases/download/v1.0/book1.pdf
https://github.com/yourusername/g-rump/releases/download/v1.0/book2.pdf
```

### 3. Add to `.env`

```env
KNOWLEDGE_BASE_URLS=https://github.com/yourusername/g-rump/releases/download/v1.0/book1.pdf,https://github.com/yourusername/g-rump/releases/download/v1.0/book2.pdf
```

### 4. Deploy

```bash
git push origin main
```

Backend automatically downloads and processes PDFs on startup! 🎉

---

## 🔗 See Also

- [Knowledge Base Guide](../docs/knowledge-base/README.md) - Local knowledge base setup
- [Backend README](./README.md) - Full backend documentation

---

**"Fine. I'll learn from the internet now. Whatever."** — Grump


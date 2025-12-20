# Privacy Policy Setup Guide

## Overview

A Privacy Policy template has been created for Grump. Follow these steps to customize and publish it.

## Step 1: Customize the Template

1. Open `docs/PRIVACY_POLICY.md`
2. Replace all placeholder information:
   - `[Date]` → Today's date
   - `[your-email@example.com]` → Your actual contact email
   - `[your-website.com]` → Your website URL
   - `[Your business address, if applicable]` → Your business address (or remove if not applicable)

## Step 2: Review Content

Review each section and customize as needed:

- **Information We Collect**: Verify this matches what your app actually collects
- **Third-Party Services**: Update if you use different AI providers
- **Data Storage**: Confirm local vs cloud storage approach
- **Children's Privacy**: Verify age requirements
- **International Users**: Update if your data is stored elsewhere

## Step 3: Host the Privacy Policy

You need to host the Privacy Policy at a public URL. Options:

### Option A: GitHub Pages (Free)
1. Create a repository or use existing one
2. Create `privacy-policy.md` or `privacy-policy.html`
3. Enable GitHub Pages in repository settings
4. Access at: `https://yourusername.github.io/repo-name/privacy-policy`

### Option B: Your Website
1. Upload the privacy policy to your website
2. Access at: `https://yourdomain.com/privacy-policy`

### Option C: Simple HTML Hosting
- Netlify (free tier)
- Vercel (free tier)
- Any web hosting service

## Step 4: Convert to HTML (Optional but Recommended)

If you want a nicer-looking page, convert the Markdown to HTML:

```bash
# Using pandoc
pandoc docs/PRIVACY_POLICY.md -o privacy-policy.html --standalone

# Or use an online converter
# https://www.markdowntohtml.com/
```

## Step 5: Add to App Store Connect

1. Go to App Store Connect
2. Select your app
3. Go to App Information
4. Scroll to "Privacy Policy URL"
5. Enter your hosted URL
6. Save

## Step 6: Add Link in App (Optional)

Consider adding a link to the privacy policy in your app's Settings or About section.

---

## Quick Checklist

- [ ] Privacy Policy customized with your information
- [ ] All placeholders replaced
- [ ] Content reviewed and accurate
- [ ] Privacy Policy hosted at public URL
- [ ] URL added to App Store Connect
- [ ] (Optional) Link added in app

---

## Legal Note

⚠️ **Important:** This is a template. You should:
- Have a legal professional review it if handling sensitive data
- Ensure it complies with applicable laws (GDPR, CCPA, etc.)
- Update it if your data practices change

---

**Status:** Template ready - needs customization and hosting

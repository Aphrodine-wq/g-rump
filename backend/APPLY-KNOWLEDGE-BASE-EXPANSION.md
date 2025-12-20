# Knowledge Base Expansion - Apply These Changes

This document shows the exact changes needed to expand the knowledge base to handle all 27 PDFs.

## File to Edit

`backend/services/knowledgeBase.js`

## Changes Needed

### Change 1: Expand Total Character Limit (Line ~69)

**FIND:**
```javascript
    const MAX_TOTAL_CHARS = 150000; // Limit total knowledge to ~150k chars
```

**REPLACE WITH:**
```javascript
    // Expanded for 27 PDFs - configurable via environment variable
    const MAX_TOTAL_CHARS = parseInt(process.env.KNOWLEDGE_BASE_MAX_TOTAL_CHARS || '500000'); // ~500k chars (enough for all 27 PDFs)
```

### Change 2: Expand Per-PDF Character Limit (Line ~88)

**FIND:**
```javascript
          const maxPerPDF = Math.min(5000, remainingSpace); // Max 5k chars per PDF
```

**REPLACE WITH:**
```javascript
          // More space per PDF - configurable via environment variable
          const MAX_CHARS_PER_PDF = parseInt(process.env.KNOWLEDGE_BASE_MAX_CHARS_PER_PDF || '20000'); // ~20k chars per PDF
          const maxPerPDF = Math.min(MAX_CHARS_PER_PDF, remainingSpace);
```

### Change 3: Improve Logging (Line ~108)

**FIND:**
```javascript
    console.log(`\n✅ Knowledge base loaded: ${processed} PDF(s) processed, ${skipped} skipped, ${totalChars} total characters`);
```

**REPLACE WITH:**
```javascript
    console.log(`\n✅ Knowledge base loaded: ${processed} PDF(s) processed, ${skipped} skipped, ${totalChars} total characters (${Math.round(totalChars/1024)}KB)`);
```

## Optional: Add Environment Variables

Add these to `backend/.env` to customize limits (optional - defaults work for 27 PDFs):

```env
# Knowledge Base Size Limits (for 27 PDFs)
KNOWLEDGE_BASE_MAX_TOTAL_CHARS=500000
KNOWLEDGE_BASE_MAX_CHARS_PER_PDF=20000
```

## What This Does

- **Before**: 150k total, 5k per PDF → Could only fit ~30 PDFs at 5k each
- **After**: 500k total, 20k per PDF → Fits all 27 PDFs comfortably
- **Math**: 27 PDFs × ~18,500 chars each ≈ 500k total ✅

## After Making Changes

1. Save the file
2. Restart the backend server
3. Check logs for: "Knowledge base loaded: X PDF(s) processed"
4. Verify with: `curl http://localhost:3000/api/knowledge` (should show `hasKnowledge: true`)

---

**That's it! Your knowledge base can now handle all 27 PDFs!**

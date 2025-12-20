# PDF Analysis Implementation Guide

This guide explains how to implement PDF analysis functionality for the Grump AI system.

## Overview

The PDF analysis feature allows Grump to read, analyze, and answer questions about PDF documents stored in the `docs/pdfs/` folder.

## Architecture

```
User Query → Backend API → PDF Parser → AI Analysis → Response
                     ↓
            docs/pdfs/ folder
```

## Implementation Steps

### 1. Backend: Install PDF Parsing Library

Install a PDF parsing library for Node.js:

```bash
cd backend
npm install pdf-parse
```

Or for more advanced features:
```bash
npm install pdfjs-dist
```

### 2. Create PDF Service

Create `backend/services/pdfService.js`:

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDFS_DIR = path.join(__dirname, '../../docs/pdfs');

/**
 * Get list of available PDF files
 */
export async function listPDFs() {
  try {
    const files = await fs.promises.readdir(PDFS_DIR);
    return files.filter(file => file.toLowerCase().endsWith('.pdf'));
  } catch (error) {
    console.error('Error listing PDFs:', error);
    return [];
  }
}

/**
 * Extract text from a PDF file
 */
export async function extractPDFText(filename) {
  try {
    const filePath = path.join(PDFS_DIR, filename);
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    
    return {
      text: data.text,
      pages: data.numpages,
      info: data.info,
      metadata: data.metadata
    };
  } catch (error) {
    console.error(`Error extracting text from ${filename}:`, error);
    throw new Error(`Failed to read PDF: ${error.message}`);
  }
}

/**
 * Search for PDFs by name (case-insensitive)
 */
export async function findPDF(query) {
  const pdfs = await listPDFs();
  const lowerQuery = query.toLowerCase();
  
  // Exact match first
  const exact = pdfs.find(pdf => pdf.toLowerCase() === lowerQuery);
  if (exact) return exact;
  
  // Partial match
  const partial = pdfs.find(pdf => 
    pdf.toLowerCase().includes(lowerQuery) || 
    lowerQuery.includes(pdf.toLowerCase().replace('.pdf', ''))
  );
  
  return partial || null;
}

/**
 * Get PDF content for AI analysis
 */
export async function getPDFContent(filename) {
  const extracted = await extractPDFText(filename);
  
  // Limit text length for AI context (adjust based on model limits)
  const maxLength = 50000; // ~50k characters
  let text = extracted.text;
  
  if (text.length > maxLength) {
    text = text.substring(0, maxLength) + '\n\n[Document truncated...]';
  }
  
  return {
    filename,
    content: text,
    pages: extracted.pages,
    truncated: extracted.text.length > maxLength
  };
}
```

### 3. Update Chat Route to Support PDF Analysis

Update `backend/routes/chat.js`:

```javascript
import express from 'express';
import { getGrumpResponse } from '../services/anthropic.js';
import { chatRateLimiter } from '../middleware/rateLimit.js';
import { findPDF, getPDFContent, listPDFs } from '../services/pdfService.js';

const router = express.Router();

// ... existing code ...

router.post('/chat', chatRateLimiter, async (req, res, next) => {
  try {
    const { message, conversationHistory } = req.body;

    // Check if message references a PDF
    let pdfContext = '';
    const pdfMatch = message.match(/(?:pdf|document|file)\s+["']?([^"'\s]+)["']?/i);
    
    if (pdfMatch) {
      const pdfName = pdfMatch[1];
      const pdfFile = await findPDF(pdfName);
      
      if (pdfFile) {
        try {
          const pdfData = await getPDFContent(pdfFile);
          pdfContext = `\n\n[PDF Context from "${pdfData.filename}":\n${pdfData.content}\n]`;
        } catch (error) {
          console.error('Error loading PDF:', error);
          // Continue without PDF context
        }
      }
    }

    // Enhance message with PDF context if available
    const enhancedMessage = pdfContext ? message + pdfContext : message;

    // Get Grump's response
    const response = await getGrumpResponse(enhancedMessage, conversationHistory || []);

    res.json({
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// New endpoint: List available PDFs
router.get('/pdfs', async (req, res) => {
  try {
    const pdfs = await listPDFs();
    res.json({ pdfs });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to list PDFs' } });
  }
});

export default router;
```

### 4. Enhanced System Prompt (Optional)

Update `grumpprompt.md` to mention PDF analysis:

```markdown
## Document Analysis

You can analyze PDF documents from the pdfs folder. When users ask about documents:
- Extract key information
- Answer questions about content
- Provide summaries
- Reference specific sections when relevant

Be your usual grumpy self: "Oh good, you want me to read documents now. Fine. Here's what it says..."
```

### 5. Frontend: PDF List Component (Optional)

Create a component to list available PDFs:

```typescript
// web/src/components/PDFList.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function PDFList() {
  const [pdfs, setPdfs] = useState<string[]>([]);
  
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/pdfs`)
      .then(res => setPdfs(res.data.pdfs))
      .catch(err => console.error('Error loading PDFs:', err));
  }, []);
  
  return (
    <div className="pdf-list">
      <h3>Available Documents</h3>
      {pdfs.length === 0 ? (
        <p>No PDFs found in docs/pdfs folder</p>
      ) : (
        <ul>
          {pdfs.map(pdf => (
            <li key={pdf}>{pdf}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Usage Examples

### User Queries

1. **Direct reference**:
   ```
   User: "Can you analyze the document called project-proposal.pdf?"
   ```

2. **Question about content**:
   ```
   User: "What does the user manual say about installation?"
   ```

3. **Summary request**:
   ```
   User: "Summarize the research paper in pdfs folder"
   ```

### Expected Responses

```
Grump: *sigh* Fine. I read your document. Here's what it actually says...

[Provides analysis with grumpy commentary]

Was that helpful? Of course it was. You're welcome, I guess.
```

## Advanced Features

### 1. Full-Text Search

Add search capability:

```javascript
export async function searchPDFs(query) {
  const pdfs = await listPDFs();
  const results = [];
  
  for (const pdf of pdfs) {
    try {
      const content = await getPDFContent(pdf);
      if (content.content.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          filename: pdf,
          matches: content.content.toLowerCase().split(query.toLowerCase()).length - 1
        });
      }
    } catch (error) {
      // Skip if error
    }
  }
  
  return results.sort((a, b) => b.matches - a.matches);
}
```

### 2. Caching PDF Content

Cache extracted text to avoid re-parsing:

```javascript
const pdfCache = new Map();

export async function getPDFContent(filename, useCache = true) {
  if (useCache && pdfCache.has(filename)) {
    return pdfCache.get(filename);
  }
  
  const content = await extractPDFText(filename);
  if (useCache) {
    pdfCache.set(filename, content);
  }
  
  return content;
}
```

### 3. Multi-Document Analysis

Allow analyzing multiple PDFs:

```javascript
export async function analyzeMultiplePDFs(filenames) {
  const contents = await Promise.all(
    filenames.map(filename => getPDFContent(filename))
  );
  
  return contents.map(c => ({
    filename: c.filename,
    preview: c.content.substring(0, 500) + '...',
    pages: c.pages
  }));
}
```

## Error Handling

Handle common issues:

- **PDF not found**: Return helpful error message
- **Corrupted PDF**: Log error, continue gracefully
- **Large files**: Implement chunking or truncation
- **Permission errors**: Check file permissions

## Performance Considerations

1. **Caching**: Cache extracted text to avoid re-parsing
2. **Async processing**: Parse PDFs asynchronously
3. **Size limits**: Limit text sent to AI (most models have token limits)
4. **Background processing**: Pre-process PDFs on server start

## Security Considerations

1. **File validation**: Validate PDF files before processing
2. **Path traversal**: Prevent access to files outside pdfs folder
3. **Size limits**: Enforce maximum file size
4. **Malicious files**: Consider virus scanning for uploaded PDFs

## Testing

Test with various PDFs:
- Text-based PDFs
- Scanned PDFs (may need OCR)
- Large documents
- Multi-page documents
- PDFs with images/tables

## Troubleshooting

### PDF text extraction fails
- Check if PDF is text-based or scanned
- Try alternative PDF parsing libraries
- Consider OCR for scanned documents

### AI doesn't understand PDF references
- Improve prompt matching patterns
- Add explicit instructions in system prompt
- Provide PDF list to user

### Performance issues
- Implement caching
- Process PDFs in background
- Limit PDF size or page count

## Next Steps

1. Implement basic PDF reading
2. Add PDF list endpoint
3. Integrate with chat route
4. Add frontend UI for PDF selection
5. Implement caching
6. Add advanced search features

## Related Files

- `backend/services/pdfService.js` - PDF processing service
- `backend/routes/chat.js` - Chat route with PDF support
- `docs/pdfs/` - PDF storage folder
- `grumpprompt.md` - System prompt (may need updates)

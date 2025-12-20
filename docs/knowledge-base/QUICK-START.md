# Knowledge Base Quick Start

## Simple 3-Step Process

1. **Place PDFs here**: Drop your PDF files in this `knowledge-base/` folder
2. **Restart backend**: Restart the backend server (`npm start` in backend folder)
3. **Done!**: Grump now knows everything in those PDFs

## How It Works

- PDFs in this folder are processed when the server starts
- Content becomes part of Grump's permanent knowledge
- Grump can use this knowledge in ALL future conversations
- No need to mention the PDFs - Grump just knows

## Managing Knowledge

**Add knowledge**: Place new PDF → Restart server

**Remove knowledge**: Delete PDF → Restart server

**Update knowledge**: Replace PDF with new version → Restart server

## Check What Grump Knows

Visit: `http://localhost:3000/api/knowledge`

Or check the server logs when it starts - it will show which PDFs were learned.

---

**That's it! Simple and effective.**

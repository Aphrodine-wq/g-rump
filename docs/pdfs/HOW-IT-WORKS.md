# How PDF Reading Works

This is a simple implementation - just place PDFs in this folder and Grump will read them automatically.

## How It Works

1. **Place PDFs here**: Any PDF file you put in `docs/pdfs/` will be available for Grump to read
2. **Ask Grump about them**: When you chat with Grump and mention a PDF or document, Grump automatically reads it
3. **That's it!** No complex setup needed

## Example Queries

- "Can you read the document about X?"
- "What does the PDF say about Y?"
- "Analyze the document in the pdfs folder"
- "Summarize the PDF called project-proposal.pdf"

Grump will automatically:
- Detect that you're asking about a PDF
- Find the relevant PDF file
- Read its content
- Answer your question based on what it read

## Automatic Detection

Grump looks for keywords like:
- "pdf"
- "document"
- "file in pdfs"
- PDF filenames you mention

## Technical Details

- PDFs are cached after first read (faster on subsequent requests)
- Content is limited to ~30,000 characters per PDF for AI context
- Uses `pdf-parse` library to extract text from PDFs
- Works with both Groq and Anthropic AI providers

## Troubleshooting

**PDF not being read?**
- Make sure the PDF is in `docs/pdfs/` folder
- Check that the filename matches what you're asking about
- Try mentioning "PDF" or "document" in your message

**Want to see available PDFs?**
- Visit: `http://localhost:3000/api/pdfs` (when backend is running)
- Or just ask Grump: "What PDFs are available?"

---

*Simple and straightforward - just drop PDFs here and chat!*

# AI Knowledge Base

This folder contains PDF documents that Grump learns from permanently. Place PDFs here to teach Grump new knowledge that will be retained for future conversations.

## Purpose

PDFs in this folder are used to **train and expand Grump's knowledge base**. Unlike the `pdfs/` folder (which provides context for specific questions), documents here are processed and learned by the AI, making the knowledge available in all future conversations.

## How to Use

1. **Place PDFs in this folder**: Simply copy or move your PDF files here
2. **AI automatically learns**: When the backend starts, Grump processes these PDFs and learns their content
3. **Knowledge persists**: The learned information is available in all future conversations

## Important Notes

- **Clear this folder**: Remove PDFs you no longer want Grump to know about
- **Replace with new PDFs**: Add new PDFs to update Grump's knowledge
- **Startup processing**: PDFs are processed when the backend server starts
- **Permanent learning**: Content from these PDFs becomes part of Grump's knowledge base

## Folder Structure

```
knowledge-base/
├── README.md          (this file)
└── [your-training-pdfs]   (add PDF files here)
```

## Usage

### Adding Knowledge

1. Place a PDF in this folder
2. Restart the backend server
3. Grump now knows the content from that PDF

### Removing Knowledge

1. Delete the PDF from this folder
2. Restart the backend server
3. Grump no longer knows that content

### Updating Knowledge

1. Replace the PDF with a new version
2. Restart the backend server
3. Grump learns the updated content

## What Grump Learns

- **Text content**: All readable text from PDFs
- **Key concepts**: Main topics and ideas
- **Facts and information**: Data, statistics, dates, etc.
- **Context**: Relationships between concepts

## Best Practices

1. **Use descriptive filenames**: Helps identify what Grump has learned
   - ✅ `company-policies-2024.pdf`
   - ✅ `product-specifications.pdf`
   - ❌ `doc1.pdf`

2. **Keep it updated**: Remove outdated PDFs and add current ones

3. **Organize by topic**: Use clear naming to manage what Grump knows

4. **Size considerations**: Larger PDFs take longer to process but provide more knowledge

## Privacy & Security

⚠️ **Important**: PDFs in this folder become part of Grump's permanent knowledge base. The AI will remember this information in all future conversations. Ensure:
- You have permission to share these documents
- They don't contain sensitive information unless appropriate
- You understand the content will be learned by the AI

## Technical Details

- PDFs are processed on backend startup
- Content is extracted and integrated into the AI's system prompt
- Knowledge persists across all conversations
- Processing happens automatically when server starts

---

**This is your AI training folder - place PDFs here to teach Grump new knowledge!**

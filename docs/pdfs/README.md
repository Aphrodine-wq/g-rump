# PDF Documents for AI Analysis

This folder contains PDF documents that can be analyzed by the Grump AI assistant.

## Purpose

Place PDF files here that you want Grump to be able to read, analyze, and reference during conversations. The AI can extract text, answer questions about the content, summarize documents, and provide insights.

## How to Use

1. **Place PDFs in this folder**: Simply copy or move your PDF files here
2. **Reference in conversation**: When chatting with Grump, you can ask questions like:
   - "Can you analyze the document about X?"
   - "What does the PDF in the pdfs folder say about Y?"
   - "Summarize the document titled Z"

## Folder Structure

```
pdfs/
├── README.md          (this file)
├── example-doc.pdf    (example - replace with your PDFs)
└── [your-documents]   (add your PDF files here)
```

## Supported Features

- **Text Extraction**: Extract text content from PDFs
- **Question Answering**: Ask questions about PDF content
- **Summarization**: Get summaries of documents
- **Keyword Search**: Find specific information within documents
- **Multi-document Analysis**: Compare or analyze multiple PDFs

## File Naming Recommendations

Use descriptive names for easier reference:
- ✅ `project-proposal-2024.pdf`
- ✅ `user-manual-v2.1.pdf`
- ✅ `research-paper-quantum-computing.pdf`
- ❌ `document1.pdf`
- ❌ `scan.pdf`

## Size Limitations

- Maximum file size: 50MB per PDF
- Recommended: Keep files under 20MB for faster processing
- Large documents may take longer to analyze

## Privacy Note

PDFs in this folder will be accessible to the AI for analysis. Ensure you have the right to share these documents and that they don't contain sensitive information unless you're comfortable with AI access.

## Implementation Status

✅ **PDF reading is now enabled!** 

Just place PDFs in this folder and Grump will automatically read them when you ask about documents.

**How it works:**
- Place your PDF files in this folder
- Chat with Grump and mention the PDF (e.g., "What does the document say?")
- Grump automatically reads the PDF and answers your questions

See `HOW-IT-WORKS.md` for more details, or `../PDF-ANALYSIS-GUIDE.md` for advanced implementation options.

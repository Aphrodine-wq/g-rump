# Knowledge Base Troubleshooting

## Quick Check

1. **Check if knowledge loaded**: Visit `http://localhost:3000/api/knowledge`
   - Should show `"hasKnowledge": true` if PDFs were processed
   - Shows list of PDFs found

2. **If `hasKnowledge` is false**:
   - PDFs might be failing to process
   - Check server console logs for errors
   - Try processing one PDF at a time

## Common Issues

### Too Many PDFs
- With 27+ PDFs, processing can be slow
- Solution: Start with 1-2 PDFs, verify it works, then add more

### Large PDF Files
- Very large PDFs can take time to process
- Solution: The system automatically limits content size

### PDFs Not Processing
- Some PDFs might be scanned images (no text)
- Some PDFs might be corrupted
- Check server logs for error messages

## How to Verify It's Working

1. **Check the endpoint**: `curl http://localhost:3000/api/knowledge`
   - Should show `"hasKnowledge": true`

2. **Ask Grump a question** about content from one of your PDFs
   - If Grump knows the answer, it's working!

3. **Check server startup logs**:
   - Should see "Loading knowledge base..."
   - Should see "✓ Learned from: [filename]" for each PDF
   - Should see "Knowledge base loaded successfully"

## Manual Reload

After adding/removing PDFs:
1. Call the reload endpoint: `POST http://localhost:3000/api/knowledge/reload`
2. OR restart the server completely

## Limits

- Maximum total knowledge: ~150,000 characters
- Maximum per PDF: ~5,000 characters
- PDFs beyond the limit are skipped with a warning

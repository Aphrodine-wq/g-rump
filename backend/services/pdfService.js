import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to PDFs folder
const PDFS_DIR = path.join(__dirname, '../../docs/pdfs');

// Cache for PDF content
const pdfCache = new Map();

/**
 * Get all PDF files from the pdfs folder
 */
export function listPDFs() {
  try {
    if (!fs.existsSync(PDFS_DIR)) {
      return [];
    }
    const files = fs.readdirSync(PDFS_DIR);
    return files.filter(file => file.toLowerCase().endsWith('.pdf'));
  } catch (error) {
    console.error('Error listing PDFs:', error);
    return [];
  }
}

/**
 * Extract text from a PDF file using pdf-parse
 */
async function extractPDFText(filePath) {
  try {
    // pdf-parse v2.x API: use PDFParse class with getText() method
    const pdfParseModule = await import('pdf-parse');
    const PDFParse = pdfParseModule.PDFParse;
    if (typeof PDFParse !== 'function') {
      throw new Error(`pdf-parse PDFParse is not a class (got ${typeof PDFParse})`);
    }
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    return result.text || `[PDF: ${path.basename(filePath)} - No text content found]`;
  } catch (error) {
    console.error(`Error reading PDF ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * Check if user message mentions PDFs or documents
 */
export function messageMentionsPDFs(message) {
  const lowerMessage = message.toLowerCase();
  const pdfKeywords = ['pdf', 'document', 'file in pdfs', 'docs/pdfs', 'pdf folder', 'read document', 'analyze document', 'document about'];
  return pdfKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Get relevant PDF content based on user message
 */
export async function getRelevantPDFContent(userMessage) {
  const pdfs = listPDFs();
  if (pdfs.length === 0) {
    return null;
  }

  // Simple matching: check if user mentions a PDF filename
  const lowerMessage = userMessage.toLowerCase();
  
  // Find matching PDF
  let matchingPDF = null;
  for (const pdf of pdfs) {
    const pdfName = pdf.toLowerCase().replace('.pdf', '').replace(/-/g, ' ').replace(/_/g, ' ');
    if (lowerMessage.includes(pdfName) || pdfName.includes(lowerMessage.split(' ').pop())) {
      matchingPDF = pdf;
      break;
    }
  }

  // If no specific match but user asks about PDFs, use first PDF or all PDFs
  if (!matchingPDF && messageMentionsPDFs(userMessage)) {
    // For now, use the first PDF or can be enhanced to use all
    matchingPDF = pdfs[0];
  }

  if (!matchingPDF) {
    return null;
  }

  // Check cache first
  if (pdfCache.has(matchingPDF)) {
    return pdfCache.get(matchingPDF);
  }

  // Read PDF
  const filePath = path.join(PDFS_DIR, matchingPDF);
  try {
    const content = await extractPDFText(filePath);
    const result = {
      filename: matchingPDF,
      content: content.substring(0, 30000), // Limit to ~30k chars for AI context
      available: pdfs
    };
    
    // Cache it
    pdfCache.set(matchingPDF, result);
    return result;
  } catch (error) {
    console.error(`Error processing PDF ${matchingPDF}:`, error);
    return null;
  }
}

/**
 * Create context message with PDF content
 */
export function createPDFContextMessage(pdfContent) {
  if (!pdfContent) return '';
  
  return `\n\n[Context from PDF "${pdfContent.filename}":\n${pdfContent.content}\n]\n\nAvailable PDFs: ${pdfContent.available.join(', ')}`;
}

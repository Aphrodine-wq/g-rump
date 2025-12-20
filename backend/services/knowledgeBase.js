import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to knowledge base folder
const KNOWLEDGE_BASE_DIR = path.join(__dirname, '../../docs/knowledge-base');

// Cache for processed knowledge (shared across services)
let learnedKnowledge = '';

/**
 * Set learned knowledge (used by services to share the loaded content)
 */
export function setLearnedKnowledge(knowledge) {
  learnedKnowledge = knowledge;
}

/**
 * Get all PDF files from the knowledge base folder
 */
function listKnowledgePDFs() {
  try {
    if (!fs.existsSync(KNOWLEDGE_BASE_DIR)) {
      return [];
    }
    const files = fs.readdirSync(KNOWLEDGE_BASE_DIR);
    return files.filter(file => file.toLowerCase().endsWith('.pdf'));
  } catch (error) {
    console.error('Error listing knowledge base PDFs:', error);
    return [];
  }
}

/**
 * Extract text from a PDF file
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
    return result.text || '';
  } catch (error) {
    console.error(`Error reading PDF ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * Process all PDFs in knowledge base and extract learned knowledge
 */
export async function loadKnowledgeBase() {
  try {
    const pdfs = listKnowledgePDFs();
    
    if (pdfs.length === 0) {
      learnedKnowledge = '';
      console.log('No PDFs found in knowledge base folder.');
      return '';
    }

    console.log(`Loading knowledge base from ${pdfs.length} PDF(s)...`);
    
    const allKnowledge = [];
    // Expanded for 27 PDFs - configurable via environment variable
    // Fully optimized: Reduced to 15k chars to maximize cost savings while still covering all PDFs
    // For Groq: use smaller limit (~15k chars), for Anthropic can use larger (500k+)
    const MAX_TOTAL_CHARS = parseInt(process.env.KNOWLEDGE_BASE_MAX_TOTAL_CHARS || '15000'); // ~15k chars (fully optimized for cost)
    let currentTotal = 0;
    let processed = 0;
    let skipped = 0;
    
    for (const pdf of pdfs) {
      // Stop if we've reached the limit
      if (currentTotal >= MAX_TOTAL_CHARS) {
        console.log(`⚠ Reached size limit (${MAX_TOTAL_CHARS} chars). Processed ${processed} of ${pdfs.length} PDFs.`);
        break;
      }
      
      try {
        const filePath = path.join(KNOWLEDGE_BASE_DIR, pdf);
        const content = await extractPDFText(filePath);
        
        if (content && content.trim()) {
          // Calculate how much space we have left
          const remainingSpace = MAX_TOTAL_CHARS - currentTotal;
          // More space per PDF - configurable via environment variable
          // Fully optimized: Reduced to 750 chars per PDF to maximize cost savings while maintaining knowledge coverage
          const MAX_CHARS_PER_PDF = parseInt(process.env.KNOWLEDGE_BASE_MAX_CHARS_PER_PDF || '750'); // ~750 chars per PDF (fully optimized)
          const maxPerPDF = Math.min(MAX_CHARS_PER_PDF, remainingSpace);
          const limitedContent = content.substring(0, maxPerPDF);
          
          const pdfKnowledge = `\n\n[Knowledge from "${pdf}":\n${limitedContent}${content.length > maxPerPDF ? '\n\n[Content truncated for size...]' : ''}\n]`;
          allKnowledge.push(pdfKnowledge);
          currentTotal += pdfKnowledge.length;
          processed++;
          console.log(`✓ Learned from: ${pdf} (${limitedContent.length} chars from PDF, ${currentTotal}/${MAX_TOTAL_CHARS} total)`);
        } else {
          skipped++;
          console.log(`⚠ Skipped ${pdf} (no extractable text content)`);
        }
      } catch (error) {
        skipped++;
        console.error(`✗ Failed to process ${pdf}:`, error.message);
      }
    }
    
    learnedKnowledge = allKnowledge.join('\n\n');
    const totalChars = learnedKnowledge.length;
    console.log(`\n✅ Knowledge base loaded: ${processed} PDF(s) processed, ${skipped} skipped, ${totalChars} total characters (${Math.round(totalChars/1024)}KB)`);
    
    return learnedKnowledge;
  } catch (error) {
    console.error('Error loading knowledge base:', error);
    return '';
  }
}

/**
 * Get the learned knowledge (cached version)
 */
export function getLearnedKnowledge() {
  return learnedKnowledge;
}

/**
 * Clear the knowledge base (removes all learned content)
 */
export function clearKnowledgeBase() {
  learnedKnowledge = '';
  console.log('Knowledge base cleared.');
}

/**
 * Get knowledge base summary
 */
export function getKnowledgeBaseSummary() {
  const pdfs = listKnowledgePDFs();
  return {
    pdfCount: pdfs.length,
    pdfs: pdfs,
    hasKnowledge: learnedKnowledge.length > 0
  };
}

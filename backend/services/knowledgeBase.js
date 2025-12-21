import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to knowledge base folder
const KNOWLEDGE_BASE_DIR = path.join(__dirname, '../../docs/knowledge-base');

// Cache for processed knowledge (shared across services)
let learnedKnowledge = '';

// Cache for remote PDF URLs
let remotePDFUrls = [];

/**
 * Set learned knowledge (used by services to share the loaded content)
 */
export function setLearnedKnowledge(knowledge) {
  learnedKnowledge = knowledge;
}

/**
 * Get all knowledge base files (PDFs and Markdown)
 */
function listKnowledgeFiles() {
  try {
    if (!fs.existsSync(KNOWLEDGE_BASE_DIR)) {
      return { pdfs: [], markdown: [] };
    }
    const files = fs.readdirSync(KNOWLEDGE_BASE_DIR);
    return {
      pdfs: files.filter(file => file.toLowerCase().endsWith('.pdf')),
      markdown: files.filter(file => file.toLowerCase().endsWith('.md') && file !== 'README.md' && file !== 'QUICK-START.md' && file !== 'TROUBLESHOOTING.md' && file !== 'STATUS.md')
    };
  } catch (error) {
    console.error('Error listing knowledge base files:', error);
    return { pdfs: [], markdown: [] };
  }
}

/**
 * Get all PDF files from the knowledge base folder (legacy function, kept for compatibility)
 */
function listKnowledgePDFs() {
  const files = listKnowledgeFiles();
  return files.pdfs;
}

/**
 * Get PDFs from a GitHub folder using GitHub API
 */
async function getPDFsFromGitHubFolder(folderUrl) {
  try {
    let apiUrl;
    let user, repo, branch, folderPath;
    
    // Parse GitHub URL - support multiple formats
    if (folderUrl.includes('raw.githubusercontent.com')) {
      // Format: https://raw.githubusercontent.com/user/repo/branch/path/
      const match = folderUrl.match(/raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+)/);
      if (match) {
        [, user, repo, branch, folderPath] = match;
        // Remove trailing slash if present
        folderPath = folderPath.replace(/\/$/, '');
        apiUrl = `https://api.github.com/repos/${user}/${repo}/contents/${folderPath}`;
      }
    } else if (folderUrl.includes('github.com')) {
      // Format: https://github.com/user/repo/tree/branch/path
      // Format: https://github.com/user/repo/blob/branch/path
      const match = folderUrl.match(/github\.com\/([^\/]+)\/([^\/]+)\/(?:tree|blob)\/([^\/]+)\/(.+)/);
      if (match) {
        [, user, repo, branch, folderPath] = match;
        // Remove trailing slash if present
        folderPath = folderPath.replace(/\/$/, '');
        apiUrl = `https://api.github.com/repos/${user}/${repo}/contents/${folderPath}`;
      }
    }
    
    if (!apiUrl) {
      throw new Error('Invalid GitHub folder URL format. Use: https://github.com/user/repo/tree/branch/path or https://raw.githubusercontent.com/user/repo/branch/path/');
    }
    
    console.log(`📁 Fetching GitHub folder contents from: ${apiUrl}`);
    
    // Use GitHub API (no auth needed for public repos)
    const response = await axios.get(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Grump-Knowledge-Base'
      },
      timeout: 15000
    });
    
    const files = Array.isArray(response.data) ? response.data : [response.data];
    
    // Filter for PDFs and Markdown files, generate raw download URLs
    const fileUrls = files
      .filter(file => file.type === 'file' && (file.name.toLowerCase().endsWith('.pdf') || file.name.toLowerCase().endsWith('.md')))
      .map(file => {
        // Use download_url if available, otherwise construct raw URL
        if (file.download_url) {
          return file.download_url;
        }
        // Fallback: construct raw GitHub URL
        return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${folderPath}/${file.name}`;
      });
    
    console.log(`✓ Found ${fileUrls.length} file(s) in GitHub folder (PDFs and Markdown): ${fileUrls.map(url => url.split('/').pop()).join(', ')}`);
    return fileUrls;
  } catch (error) {
    if (error.response?.status === 404) {
      console.error(`✗ GitHub folder not found: ${folderUrl}`);
    } else if (error.response?.status === 403) {
      console.error(`✗ GitHub API rate limit or access denied. If repo is private, you may need a GitHub token.`);
    } else {
      console.error(`✗ Error fetching GitHub folder: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Get remote PDF URLs from environment variable
 * Now supports GitHub folders via KNOWLEDGE_BASE_GITHUB_FOLDER
 */
async function getRemotePDFUrls() {
  const urlsEnv = process.env.KNOWLEDGE_BASE_URLS;
  const folderUrl = process.env.KNOWLEDGE_BASE_GITHUB_FOLDER;
  
  if (!urlsEnv && !folderUrl) {
    return [];
  }
  
  const urls = [];
  
  // Handle individual URLs
  if (urlsEnv) {
    const individualUrls = urlsEnv
      .split(/[,\n]/)
      .map(url => url.trim())
      .filter(url => url.length > 0 && (url.startsWith('http://') || url.startsWith('https://')));
    urls.push(...individualUrls);
  }
  
  // Handle GitHub folder
  if (folderUrl) {
    try {
      const githubUrls = await getPDFsFromGitHubFolder(folderUrl);
      urls.push(...githubUrls);
    } catch (error) {
      console.error(`⚠ Failed to load GitHub folder (${folderUrl}): ${error.message}`);
      // Continue with other URLs even if GitHub folder fails
    }
  }
  
  return urls;
}

/**
 * Download PDF from URL and return as buffer
 */
async function downloadPDFFromUrl(url) {
  try {
    console.log(`Downloading PDF from: ${url}`);
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000, // 30 second timeout
      maxContentLength: 100 * 1024 * 1024, // 100MB max
    });
    return Buffer.from(response.data);
  } catch (error) {
    console.error(`Error downloading PDF from ${url}:`, error.message);
    throw error;
  }
}

/**
 * Extract text from a PDF file (local file path)
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
 * Extract text from a PDF buffer (from remote URL)
 */
async function extractPDFTextFromBuffer(buffer, sourceName) {
  try {
    const pdfParseModule = await import('pdf-parse');
    const PDFParse = pdfParseModule.PDFParse;
    if (typeof PDFParse !== 'function') {
      throw new Error(`pdf-parse PDFParse is not a class (got ${typeof PDFParse})`);
    }
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text || '';
  } catch (error) {
    console.error(`Error parsing PDF from ${sourceName}:`, error.message);
    throw error;
  }
}

/**
 * Extract text from a Markdown file
 */
function extractMarkdownText(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    // Remove markdown formatting but keep the content
    // Basic cleanup: remove headers, code blocks, links, etc. but keep text
    return content;
  } catch (error) {
    console.error(`Error reading Markdown ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * Process all PDFs in knowledge base and extract learned knowledge
 * Supports both local files and remote URLs
 */
export async function loadKnowledgeBase() {
  try {
    // Get local files (PDFs and Markdown) and remote URLs
    const localFiles = listKnowledgeFiles();
    const localPDFs = localFiles.pdfs;
    const localMarkdown = localFiles.markdown;
    remotePDFUrls = await getRemotePDFUrls();
    
    const totalSources = localPDFs.length + localMarkdown.length + remotePDFUrls.length;
    
    if (totalSources === 0) {
      learnedKnowledge = '';
      console.log('No knowledge base files found (PDFs, Markdown, or remote URLs configured).');
      return '';
    }

    console.log(`Loading knowledge base from ${localPDFs.length} local PDF(s), ${localMarkdown.length} Markdown file(s), and ${remotePDFUrls.length} remote URL(s)...`);
    
    const allKnowledge = [];
    // Expanded for 27 PDFs - configurable via environment variable
    // Fully optimized: Reduced to 15k chars to maximize cost savings while still covering all PDFs
    // For Groq: use smaller limit (~15k chars), for Anthropic can use larger (500k+)
    const MAX_TOTAL_CHARS = parseInt(process.env.KNOWLEDGE_BASE_MAX_TOTAL_CHARS || '15000'); // ~15k chars (fully optimized for cost)
    let currentTotal = 0;
    let processed = 0;
    let skipped = 0;
    
    // Process local Markdown files first (usually more structured)
    for (const mdFile of localMarkdown) {
      // Stop if we've reached the limit
      if (currentTotal >= MAX_TOTAL_CHARS) {
        console.log(`⚠ Reached size limit (${MAX_TOTAL_CHARS} chars). Processed ${processed} of ${totalSources} files.`);
        break;
      }
      
      try {
        const filePath = path.join(KNOWLEDGE_BASE_DIR, mdFile);
        const content = extractMarkdownText(filePath);
        
        if (content && content.trim()) {
          // Calculate how much space we have left
          const remainingSpace = MAX_TOTAL_CHARS - currentTotal;
          const MAX_CHARS_PER_FILE = parseInt(process.env.KNOWLEDGE_BASE_MAX_CHARS_PER_PDF || '750');
          const maxPerFile = Math.min(MAX_CHARS_PER_FILE, remainingSpace);
          const limitedContent = content.substring(0, maxPerFile);
          
          const fileKnowledge = `\n\n[Knowledge from "${mdFile}":\n${limitedContent}${content.length > maxPerFile ? '\n\n[Content truncated for size...]' : ''}\n]`;
          allKnowledge.push(fileKnowledge);
          currentTotal += fileKnowledge.length;
          processed++;
          console.log(`✓ Learned from: ${mdFile} (${limitedContent.length} chars from Markdown, ${currentTotal}/${MAX_TOTAL_CHARS} total)`);
        } else {
          skipped++;
          console.log(`⚠ Skipped ${mdFile} (no extractable text content)`);
        }
      } catch (error) {
        skipped++;
        console.error(`✗ Failed to process ${mdFile}:`, error.message);
      }
    }
    
    // Process local PDFs
    for (const pdf of localPDFs) {
      // Stop if we've reached the limit
      if (currentTotal >= MAX_TOTAL_CHARS) {
        console.log(`⚠ Reached size limit (${MAX_TOTAL_CHARS} chars). Processed ${processed} of ${totalSources} PDFs.`);
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
    
    // Process remote PDFs
    for (const url of remotePDFUrls) {
      // Stop if we've reached the limit
      if (currentTotal >= MAX_TOTAL_CHARS) {
        console.log(`⚠ Reached size limit (${MAX_TOTAL_CHARS} chars). Processed ${processed} of ${totalSources} PDFs.`);
        break;
      }
      
      try {
        // Download file (PDF or Markdown)
        const fileBuffer = await downloadPDFFromUrl(url);
        const fileName = url.split('/').pop() || 'remote.pdf';
        
        let content;
        if (fileName.toLowerCase().endsWith('.md')) {
          // Markdown file - read as text
          content = fileBuffer.toString('utf-8');
        } else {
          // PDF file - parse with pdf-parse
          content = await extractPDFTextFromBuffer(fileBuffer, fileName);
        }
        
        if (content && content.trim()) {
          // Calculate how much space we have left
          const remainingSpace = MAX_TOTAL_CHARS - currentTotal;
          const MAX_CHARS_PER_PDF = parseInt(process.env.KNOWLEDGE_BASE_MAX_CHARS_PER_PDF || '750');
          const maxPerPDF = Math.min(MAX_CHARS_PER_PDF, remainingSpace);
          const limitedContent = content.substring(0, maxPerPDF);
          
          const pdfKnowledge = `\n\n[Knowledge from "${fileName}" (${url}):\n${limitedContent}${content.length > maxPerPDF ? '\n\n[Content truncated for size...]' : ''}\n]`;
          allKnowledge.push(pdfKnowledge);
          currentTotal += pdfKnowledge.length;
          processed++;
          console.log(`✓ Learned from: ${fileName} (${limitedContent.length} chars from remote PDF, ${currentTotal}/${MAX_TOTAL_CHARS} total)`);
        } else {
          skipped++;
          console.log(`⚠ Skipped ${url} (no extractable text content)`);
        }
      } catch (error) {
        skipped++;
        console.error(`✗ Failed to process ${url}:`, error.message);
      }
    }
    
    learnedKnowledge = allKnowledge.join('\n\n');
    const totalChars = learnedKnowledge.length;
    console.log(`\n✅ Knowledge base loaded: ${processed} file(s) processed (${localMarkdown.length} Markdown, ${localPDFs.length} PDFs, ${remotePDFUrls.length} remote), ${skipped} skipped, ${totalChars} total characters (${Math.round(totalChars/1024)}KB)`);
    
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
 * Uses cached remotePDFUrls to avoid async issues
 */
export function getKnowledgeBaseSummary() {
  const localFiles = listKnowledgeFiles();
  const localPDFs = localFiles.pdfs;
  const localMarkdown = localFiles.markdown;
  // Use cached remotePDFUrls (set during loadKnowledgeBase)
  const remoteUrls = remotePDFUrls || [];
  return {
    localPDFCount: localPDFs.length,
    localPDFs: localPDFs,
    localMarkdownCount: localMarkdown.length,
    localMarkdown: localMarkdown,
    remotePDFCount: remoteUrls.length,
    remotePDFs: remoteUrls,
    totalFileCount: localPDFs.length + localMarkdown.length + remoteUrls.length,
    hasKnowledge: learnedKnowledge.length > 0,
    githubFolder: process.env.KNOWLEDGE_BASE_GITHUB_FOLDER || null
  };
}

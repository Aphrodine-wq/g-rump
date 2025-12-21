/**
 * Language detection utility for game development languages
 * Helps identify which programming language the user wants to use
 */

const SUPPORTED_LANGUAGES = [
  'cpp', 'c++', 'cplusplus',
  'java',
  'javascript', 'js',
  'html5', 'html',
  'csharp', 'c#',
  'lua',
  'python', 'py'
];

const LANGUAGE_ALIASES = {
  'cpp': ['cpp', 'c++', 'cplusplus', 'c plus plus'],
  'java': ['java'],
  'javascript': ['javascript', 'js', 'ecmascript'],
  'html5': ['html5', 'html'],
  'csharp': ['csharp', 'c#', 'c-sharp', 'unity'],
  'lua': ['lua'],
  'python': ['python', 'py', 'pygame', 'panda3d']
};

const LANGUAGE_CONTEXT_KEYWORDS = {
  'cpp': ['unreal', 'engine', 'performance', 'aaa', 'low-level', 'hardware', 'starcraft', 'counterstrike'],
  'java': ['android', 'minecraft', 'cross-platform', 'jvm'],
  'javascript': ['web', 'browser', 'html', 'canvas', 'phaser', 'three.js', 'babylon'],
  'html5': ['web', 'browser', 'canvas', 'webgl', 'mobile web'],
  'csharp': ['unity', 'xna', 'monogame', 'super mario run', 'pokemon go'],
  'lua': ['scripting', 'modding', 'roblox', 'world of warcraft', 'addon'],
  'python': ['pygame', 'panda3d', 'prototype', 'educational', 'indie']
};

/**
 * Detect which programming language the user wants based on their message
 * @param {string} message - User's message
 * @returns {string|null} - Detected language code or null if unclear
 */
export function detectLanguage(message) {
  if (!message || typeof message !== 'string') {
    return null;
  }

  const lowerMessage = message.toLowerCase();

  // First, check for explicit language mentions
  for (const [lang, aliases] of Object.entries(LANGUAGE_ALIASES)) {
    for (const alias of aliases) {
      // Check for exact word matches (not substrings)
      const regex = new RegExp(`\\b${alias.replace(/[#+]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lowerMessage)) {
        return lang;
      }
    }
  }

  // Then check for context keywords
  const contextMatches = {};
  for (const [lang, keywords] of Object.entries(LANGUAGE_CONTEXT_KEYWORDS)) {
    let matchCount = 0;
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        matchCount++;
      }
    }
    if (matchCount > 0) {
      contextMatches[lang] = matchCount;
    }
  }

  // Return the language with the most context matches
  if (Object.keys(contextMatches).length > 0) {
    const sorted = Object.entries(contextMatches).sort((a, b) => b[1] - a[1]);
    return sorted[0][0];
  }

  return null;
}

/**
 * Get the proper code block language identifier for a language
 * @param {string} language - Language code
 * @returns {string} - Code block identifier
 */
export function getCodeBlockLanguage(language) {
  const languageMap = {
    'cpp': 'cpp',
    'java': 'java',
    'javascript': 'javascript',
    'html5': 'html',
    'csharp': 'csharp',
    'lua': 'lua',
    'python': 'python'
  };

  return languageMap[language] || 'text';
}

/**
 * Get a human-readable language name
 * @param {string} language - Language code
 * @returns {string} - Human-readable name
 */
export function getLanguageName(language) {
  const nameMap = {
    'cpp': 'C++',
    'java': 'Java',
    'javascript': 'JavaScript',
    'html5': 'HTML5',
    'csharp': 'C#',
    'lua': 'Lua',
    'python': 'Python'
  };

  return nameMap[language] || language;
}

/**
 * Check if a language is supported
 * @param {string} language - Language code or name
 * @returns {boolean} - Whether the language is supported
 */
export function isLanguageSupported(language) {
  if (!language) return false;
  const lower = language.toLowerCase();
  return SUPPORTED_LANGUAGES.some(lang => lang === lower) ||
         Object.keys(LANGUAGE_ALIASES).some(lang => LANGUAGE_ALIASES[lang].includes(lower));
}

/**
 * Get all supported languages
 * @returns {Array<string>} - Array of supported language codes
 */
export function getSupportedLanguages() {
  return Object.keys(LANGUAGE_ALIASES);
}


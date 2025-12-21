// Animation Cache Service
// Caches common animation prompts to reduce AI costs

const cache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate cache key from prompt
 */
function getCacheKey(prompt, style, format) {
  const normalized = prompt.toLowerCase().trim();
  return `${normalized}_${style || 'default'}_${format || 'gif'}`;
}

/**
 * Get cached animation if available
 */
export function getCachedAnimation(prompt, style, format) {
  const key = getCacheKey(prompt, style, format);
  const cached = cache.get(key);
  
  if (!cached) {
    return null;
  }
  
  // Check if cache is expired
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return cached.animation;
}

/**
 * Cache an animation
 */
export function cacheAnimation(prompt, style, format, animation) {
  const key = getCacheKey(prompt, style, format);
  cache.set(key, {
    animation,
    timestamp: Date.now()
  });
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const now = Date.now();
  let hits = 0;
  let misses = 0;
  let expired = 0;
  
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      expired++;
    } else {
      hits++;
    }
  }
  
  return {
    size: cache.size,
    hits,
    misses,
    expired,
    hitRate: hits / (hits + misses) || 0
  };
}

/**
 * Clean up expired cache entries
 */
export function cleanupCache() {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      cache.delete(key);
      cleaned++;
    }
  }
  
  return cleaned;
}

// Cleanup every hour
setInterval(cleanupCache, 60 * 60 * 1000);


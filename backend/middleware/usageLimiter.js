// Usage Limiter Middleware
// Enforces animation creation limits based on subscription tier

import { canCreateAnimation, incrementUsage, getUserTier } from '../services/usageService.js';

/**
 * Middleware to check if user can create animation
 */
export function animationUsageLimiter(req, res, next) {
  try {
    // Get user ID from request (in production, from auth token)
    // For now, use IP address or session ID as fallback
    const userId = req.headers['x-user-id'] || 
                   req.session?.userId || 
                   req.ip || 
                   'anonymous';
    
    // Check if user can create animation
    const check = canCreateAnimation(userId);
    
    if (!check.allowed) {
      return res.status(429).json({
        error: {
          message: getLimitMessage(check.reason),
          code: check.reason,
          limit: check.limit,
          used: check.used,
          resetTime: check.resetTime,
          upgradeUrl: '/pricing'
        }
      });
    }
    
    // Attach usage info to request for later increment
    req.userId = userId;
    req.usageCheck = check;
    
    next();
  } catch (error) {
    console.error('Usage limiter error:', error);
    // On error, allow request (fail open for now)
    next();
  }
}

/**
 * Middleware to increment usage after successful animation creation
 */
export function incrementAnimationUsage(req, res, next) {
  try {
    if (req.userId && req.animationCreated) {
      incrementUsage(req.userId);
    }
    next();
  } catch (error) {
    console.error('Usage increment error:', error);
    next();
  }
}

/**
 * Get user-friendly limit message
 */
function getLimitMessage(reason) {
  switch (reason) {
    case 'daily_limit_exceeded':
      return 'Daily animation limit reached. Upgrade to Pro for 200 animations/day, or wait until tomorrow.';
    case 'monthly_limit_exceeded':
      return 'Monthly animation limit reached. Upgrade to Pro for higher limits.';
    default:
      return 'Animation limit reached. Upgrade to Pro for more animations.';
  }
}


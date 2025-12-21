// Usage Tracking Service
// Tracks animation usage per user and enforces limits based on subscription tier

import { config } from '../config/config.js';

// In-memory store (in production, use Redis or database)
const usageStore = new Map();

// Subscription tiers and limits
export const TIERS = {
  FREE: {
    id: 'free',
    name: 'Free',
    dailyLimit: 1, // Aggressive limit for profitability
    monthlyLimit: 30, // 1/day * 30 days
    features: {
      exports: false,
      watermark: true,
      resolution: '720p',
      priority: false,
      aiModel: 'gemma-7b-it' // Cheapest AI model
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    dailyLimit: 200,
    monthlyLimit: 6000, // 200/day * 30 days
    features: {
      exports: true,
      watermark: false,
      resolution: '4k',
      priority: true,
      aiModel: 'llama-3.1-8b-instant' // Fast, cost-effective
    }
  },
  TEAM: {
    id: 'team',
    name: 'Team',
    dailyLimit: 500,
    monthlyLimit: 15000, // 500/day * 30 days
    features: {
      exports: true,
      watermark: false,
      resolution: '4k',
      priority: true,
      aiModel: 'llama-3.1-70b-versatile' // Best quality
    }
  }
};

/**
 * Get user's subscription tier
 * In production, this would check a database or auth service
 */
export function getUserTier(userId) {
  // For now, check from request headers or default to FREE
  // In production: return await db.getUserTier(userId)
  return TIERS.FREE; // Default to free tier
}

/**
 * Get usage for a user
 */
export function getUserUsage(userId) {
  const today = new Date().toISOString().split('T')[0];
  const month = new Date().toISOString().slice(0, 7);
  
  const key = `${userId}_${today}`;
  const monthKey = `${userId}_${month}`;
  
  return {
    daily: usageStore.get(key) || 0,
    monthly: usageStore.get(monthKey) || 0,
    today: today,
    month: month
  };
}

/**
 * Check if user can create animation
 */
export function canCreateAnimation(userId) {
  const tier = getUserTier(userId);
  const usage = getUserUsage(userId);
  
  // Check daily limit
  if (usage.daily >= tier.dailyLimit) {
    return {
      allowed: false,
      reason: 'daily_limit_exceeded',
      limit: tier.dailyLimit,
      used: usage.daily,
      resetTime: getNextResetTime()
    };
  }
  
  // Check monthly limit
  if (usage.monthly >= tier.monthlyLimit) {
    return {
      allowed: false,
      reason: 'monthly_limit_exceeded',
      limit: tier.monthlyLimit,
      used: usage.monthly,
      resetTime: getNextMonthResetTime()
    };
  }
  
  return {
    allowed: true,
    remaining: {
      daily: tier.dailyLimit - usage.daily,
      monthly: tier.monthlyLimit - usage.monthly
    }
  };
}

/**
 * Increment usage counter
 */
export function incrementUsage(userId) {
  const today = new Date().toISOString().split('T')[0];
  const month = new Date().toISOString().slice(0, 7);
  
  const dailyKey = `${userId}_${today}`;
  const monthlyKey = `${userId}_${month}`;
  
  const dailyCount = (usageStore.get(dailyKey) || 0) + 1;
  const monthlyCount = (usageStore.get(monthlyKey) || 0) + 1;
  
  usageStore.set(dailyKey, dailyCount);
  usageStore.set(monthlyKey, monthlyCount);
  
  return {
    daily: dailyCount,
    monthly: monthlyCount
  };
}

/**
 * Get next reset time (midnight UTC)
 */
function getNextResetTime() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCHours(24, 0, 0, 0);
  return tomorrow.toISOString();
}

/**
 * Get next month reset time
 */
function getNextMonthResetTime() {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString();
}

/**
 * Clean up old usage data (run periodically)
 */
export function cleanupOldUsage() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 60); // Keep 60 days
  
  for (const [key, value] of usageStore.entries()) {
    // Extract date from key format: userId_YYYY-MM-DD or userId_YYYY-MM
    const parts = key.split('_');
    if (parts.length >= 3) {
      const dateStr = `${parts[parts.length - 2]}-${parts[parts.length - 1]}`;
      const keyDate = new Date(dateStr);
      if (keyDate < cutoffDate) {
        usageStore.delete(key);
      }
    }
  }
}

// Run cleanup every hour
setInterval(cleanupOldUsage, 60 * 60 * 1000);


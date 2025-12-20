/**
 * Pricing Configuration
 * Based on optimized API costs (~$0.08-0.10 per message)
 */

export interface PricingTier {
  id: string
  name: string
  price: number
  priceDisplay: string
  messagesPerMonth: number
  features: string[]
  popular?: boolean
  description: string
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceDisplay: '$0',
    messagesPerMonth: 20,
    description: 'Perfect for trying out Grump',
    features: [
      '20 messages per month',
      'Basic Grump personality',
      'Standard response time',
      'Chat history',
      'Basic features'
    ]
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    priceDisplay: '$9.99',
    messagesPerMonth: 100,
    description: 'For casual users who want more',
    features: [
      '100 messages per month',
      'Full Grump personality',
      'Full knowledge base access',
      'Priority response time',
      'Unlimited chat history',
      'All features'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    priceDisplay: '$19.99',
    messagesPerMonth: 300,
    description: 'For power users who chat a lot',
    popular: true,
    features: [
      '300 messages per month',
      'Full Grump personality',
      'Full knowledge base access',
      'Priority response time',
      'Unlimited chat history',
      'Advanced features',
      'Priority support'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 39.99,
    priceDisplay: '$39.99',
    messagesPerMonth: 1000,
    description: 'For the most dedicated Grump fans',
    features: [
      '1,000 messages per month',
      'Full Grump personality',
      'Full knowledge base access',
      'Fastest response time',
      'Unlimited chat history',
      'All advanced features',
      'Priority support',
      'Early access to new features'
    ]
  }
]

/**
 * Get current user's subscription tier
 */
export function getCurrentTier(): PricingTier {
  const tierId = localStorage.getItem('subscriptionTier') || 'free'
  return PRICING_TIERS.find(tier => tier.id === tierId) || PRICING_TIERS[0]
}

/**
 * Get remaining messages for current user this month
 */
export function getRemainingMessages(): number {
  const tier = getCurrentTier()
  if (tier.messagesPerMonth === 0) return -1 // Unlimited (shouldn't display)
  const monthKey = new Date().toISOString().slice(0, 7) // YYYY-MM
  const usedKey = `messagesUsed_${monthKey}`
  const used = parseInt(localStorage.getItem(usedKey) || '0')
  const remaining = Math.max(0, tier.messagesPerMonth - used)
  return remaining
}

/**
 * Increment message count for current month
 */
export function incrementMessageCount(): boolean {
  const tier = getCurrentTier()
  if (tier.id === 'free' && tier.messagesPerMonth === 0) {
    return false // Unlimited
  }
  
  const monthKey = new Date().toISOString().slice(0, 7)
  const usedKey = `messagesUsed_${monthKey}`
  const used = parseInt(localStorage.getItem(usedKey) || '0')
  
  if (used >= tier.messagesPerMonth) {
    return false // Limit reached
  }
  
  localStorage.setItem(usedKey, String(used + 1))
  return true
}

/**
 * Check if user can send a message
 */
export function canSendMessage(): boolean {
  const tier = getCurrentTier()
  if (tier.id === 'premium' && tier.messagesPerMonth >= 1000) {
    // Premium tier - check if it's truly unlimited or just high limit
    return true // For now, treat premium as effectively unlimited
  }
  const remaining = getRemainingMessages()
  return remaining > 0
}

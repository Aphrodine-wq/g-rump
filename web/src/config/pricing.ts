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
  highlight?: boolean
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceDisplay: '$0',
    messagesPerMonth: 30, // 1 per day
    description: 'Perfect for hobbyists & students',
    features: [
      '1 animation per day',
      'Preview only exports',
      'Watermarked results',
      'Basic animation creation',
      'Access to free marketplace assets',
      'Community support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    priceDisplay: '$49',
    messagesPerMonth: 6000, // 200 per day
    description: 'For professional creators',
    popular: true,
    highlight: true,
    features: [
      '200 animations per day',
      '4K resolution exports',
      'No watermarks',
      'Custom Character Creator (5 chars)',
      'Professional Timeline Editor',
      'Sell on Animation Marketplace',
      'Priority rendering'
    ]
  },
  {
    id: 'team',
    name: 'Team',
    price: 199,
    priceDisplay: '$199',
    messagesPerMonth: 15000, // 500 per day
    description: 'For studios & small teams',
    features: [
      '500 animations/day per seat',
      'Team collaboration workspace',
      'Unlimited Custom Characters',
      'Version control & history',
      'Enterprise API (10k calls/mo)',
      'Brand kits & admin controls',
      'Priority support'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    priceDisplay: '$999+',
    messagesPerMonth: 1000000, // Unlimited effectively
    description: 'For large organizations',
    features: [
      'Unlimited API access',
      'White-Label Solutions',
      'Custom integrations',
      'Dedicated support manager',
      'SSO & Audit logs',
      'Custom SLAs',
      'On-premise options'
    ]
  }
]

/**
 * Get current user's subscription tier
 */
export function getCurrentTier(): PricingTier {
  const tierId = localStorage.getItem('subscriptionTier') || 'free'
  // Map old tiers to new ones if necessary
  if (tierId === 'basic') return PRICING_TIERS.find(t => t.id === 'pro') || PRICING_TIERS[1]
  if (tierId === 'premium') return PRICING_TIERS.find(t => t.id === 'team') || PRICING_TIERS[2]
  
  return PRICING_TIERS.find(tier => tier.id === tierId) || PRICING_TIERS[0]
}

/**
 * Get remaining messages for current user this month
 */
export function getRemainingMessages(): number {
  const tier = getCurrentTier()
  if (tier.messagesPerMonth >= 1000000) return 999999 // Unlimited
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
  if (tier.messagesPerMonth >= 1000000) {
    return true // Unlimited
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
  if (tier.id === 'enterprise' || tier.id === 'team') {
    return true 
  }
  const remaining = getRemainingMessages()
  return remaining > 0
}

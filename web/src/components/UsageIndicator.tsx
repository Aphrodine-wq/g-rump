// Usage Indicator - Shows remaining animations for current tier

import { useState, useEffect } from 'react'
import './UsageIndicator.css'

interface UsageIndicatorProps {
  userId?: string
  tier?: 'free' | 'pro' | 'team'
}

export default function UsageIndicator({ userId, tier = 'free' }: UsageIndicatorProps) {
  const [usage, setUsage] = useState<{
    daily: number
    monthly: number
    dailyLimit: number
    monthlyLimit: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch usage from API
    fetchUsage()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchUsage, 30000)
    return () => clearInterval(interval)
  }, [userId, tier])

  const fetchUsage = async () => {
    try {
      // In production, this would call /api/usage endpoint
      // For now, use localStorage as fallback
      const today = new Date().toISOString().split('T')[0]
      const month = new Date().toISOString().slice(0, 7)
      
      const dailyKey = `animations_${today}`
      const monthlyKey = `animations_${month}`
      
      const dailyUsed = parseInt(localStorage.getItem(dailyKey) || '0')
      const monthlyUsed = parseInt(localStorage.getItem(monthlyKey) || '0')
      
      const limits = {
        free: { daily: 3, monthly: 90 },
        pro: { daily: 200, monthly: 6000 },
        team: { daily: 500, monthly: 15000 }
      }
      
      const limit = limits[tier]
      
      setUsage({
        daily: dailyUsed,
        monthly: monthlyUsed,
        dailyLimit: limit.daily,
        monthlyLimit: limit.monthly
      })
    } catch (error) {
      console.error('Failed to fetch usage:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !usage) {
    return null
  }

  const dailyRemaining = Math.max(0, usage.dailyLimit - usage.daily)
  const dailyPercent = (usage.daily / usage.dailyLimit) * 100
  const isNearLimit = dailyPercent > 80
  const isAtLimit = dailyRemaining === 0

  return (
    <div className={`usage-indicator ${isAtLimit ? 'at-limit' : ''} ${isNearLimit ? 'near-limit' : ''}`}>
      <div className="usage-header">
        <span className="usage-label">Animations Today</span>
        <span className="usage-count">
          {dailyRemaining} / {usage.dailyLimit} remaining
        </span>
      </div>
      <div className="usage-bar">
        <div 
          className="usage-progress" 
          style={{ width: `${Math.min(100, dailyPercent)}%` }}
        />
      </div>
      {isAtLimit && (
        <div className="usage-upgrade">
          <span>Daily limit reached</span>
          <a href="/pricing">Upgrade to Pro</a>
        </div>
      )}
      {isNearLimit && !isAtLimit && (
        <div className="usage-warning">
          Almost at daily limit
        </div>
      )}
    </div>
  )
}


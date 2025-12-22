// User Dashboard - Overview of usage and recent creations

import { useState, useEffect } from 'react'
import { animationApi } from '../services/animationApi'
import { useAnimation } from '../store/AnimationStore'
import { getCurrentTier, getRemainingMessages } from '../config/pricing'
import Grump2 from './Grump2'
import './UserDashboard.css'

interface UserDashboardProps {
  onNavigate?: (view: 'chat' | 'templates' | 'settings' | 'pricing' | 'education') => void
}

export default function UserDashboard({ onNavigate }: UserDashboardProps = {}) {
  const { transitionToState } = useAnimation()
  const currentTier = getCurrentTier()
  const [usage, setUsage] = useState({ 
    created: currentTier.messagesPerMonth - getRemainingMessages(), 
    limit: currentTier.messagesPerMonth 
  })
  const [recentAnimations, setRecentAnimations] = useState<any[]>([])

  useEffect(() => {
    // Refresh usage on mount
    const tier = getCurrentTier()
    const remaining = getRemainingMessages()
    // If unlimited (large number), show a simpler view or cap it
    const isUnlimited = tier.messagesPerMonth >= 1000000
    
    setUsage({
      created: isUnlimited ? 0 : tier.messagesPerMonth - remaining,
      limit: tier.messagesPerMonth
    })

    // Load animation history from API
    const loadHistory = async () => {
      try {
        const history = await animationApi.getHistory(4, 0)
        setRecentAnimations(history.map(anim => {
          // Determine icon based on animation type/prompt
          let icon = '◠◡◠' // default
          const promptLower = anim.prompt.toLowerCase()
          if (promptLower.includes('loading') || promptLower.includes('spinner')) {
            icon = '⟳'
          } else if (promptLower.includes('button') || promptLower.includes('hover')) {
            icon = '┌─────┐'
          } else if (promptLower.includes('logo') || promptLower.includes('reveal')) {
            icon = '◇'
          } else if (promptLower.includes('heart') || promptLower.includes('like')) {
            icon = '♥'
          } else if (promptLower.includes('star') || promptLower.includes('burst')) {
            icon = '★'
          } else if (promptLower.includes('coin') || promptLower.includes('collect')) {
            icon = '✦'
          } else if (promptLower.includes('run') || promptLower.includes('walk')) {
            icon = '🏃'
          } else if (promptLower.includes('progress') || promptLower.includes('bar')) {
            icon = '████'
          }
          
          return {
            id: anim.id,
            name: anim.prompt.substring(0, 30) + (anim.prompt.length > 30 ? '...' : ''),
            date: new Date(anim.createdAt).toLocaleDateString(),
            icon: icon,
            animation: anim
          }
        }))
      } catch (error) {
        console.error('Failed to load animation history:', error)
        // Fallback to empty array
        setRecentAnimations([])
      }
    }
    loadHistory()
  }, [])

  useEffect(() => {
    transitionToState('idle')
  }, [transitionToState])

  const usagePercentage = usage.limit >= 1000000 ? 0 : (usage.created / usage.limit) * 100
  const isProOrHigher = currentTier.id !== 'free'

  return (
    <div className="user-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <span className="header-title">G-RUMP</span>
          <button className="header-btn" onClick={() => onNavigate?.('chat')}>New Chat</button>
        </div>
        <div className="header-right">
          <button className="header-btn" onClick={() => onNavigate?.('templates')}>Templates</button>
          <button className="header-btn" onClick={() => onNavigate?.('settings')}>Settings</button>
          {!isProOrHigher && (
            <button className="header-btn pro" onClick={() => onNavigate?.('pricing')}>Pro ✨</button>
          )}
          {isProOrHigher && (
             <span className="badge-pro">{currentTier.name.toUpperCase()}</span>
          )}
        </div>
      </header>

      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome back, Alex</h1>
          {!isProOrHigher ? (
             <button className="upgrade-btn" onClick={() => onNavigate?.('pricing')}>Upgrade to Pro</button>
          ) : (
             <p className="pro-welcome">You are on the {currentTier.name} plan. Create something awesome!</p>
          )}
        </div>
        <div className="welcome-grump">
          <Grump2 size="medium" />
          <p>"Oh, you're back. I was just starting to enjoy the quiet."</p>
        </div>
      </div>

      {/* Usage Section */}
      <div className="usage-section">
        <div className="usage-card">
          <h3>Monthly Usage</h3>
          <div className="usage-stats">
            <div className="usage-info">
              {usage.limit >= 1000000 ? (
                <span className="usage-number">Unlimited</span>
              ) : (
                <span className="usage-number">{usage.created}/{usage.limit}</span>
              )}
              <span className="usage-label">animations</span>
            </div>
            {usage.limit < 1000000 && (
              <div className="usage-bar">
                <div 
                  className="usage-progress" 
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            )}
            <p className="usage-reset">Resets in: 14 days</p>
          </div>
        </div>

        <div className="plan-card">
          <h3>{currentTier.name.toUpperCase()} PLAN</h3>
          <div className="plan-info">
             {usage.limit >= 1000000 ? (
               <span className="plan-usage">Unlimited Access</span>
             ) : (
               <span className="plan-usage">{usage.created} / {usage.limit} animations used</span>
             )}
            
            {usage.limit < 1000000 && (
              <>
                <div className="plan-bar">
                  <div 
                    className="plan-progress" 
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
                <p className="plan-percentage">{Math.round(usagePercentage)}%</p>
              </>
            )}
            
            {currentTier.id !== 'enterprise' && (
              <button className="plan-upgrade" onClick={() => onNavigate?.('pricing')}>
                {currentTier.id === 'free' ? 'Need more? Go Pro →' : 'Upgrade Plan →'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Creator Tools & Marketplace (New Features) */}
      <div className="creations-section">
        <div className="section-header">
           <h2>Creator Tools</h2>
        </div>
        <div className="actions-grid" style={{ marginBottom: '2rem' }}>
           <div className="action-card" style={{ cursor: 'pointer', borderColor: '#a855f7' }}>
             <div className="action-icon">🛒</div>
             <h3>Marketplace</h3>
             <p>{currentTier.id === 'free' ? 'Browse assets' : 'Sell your animations'}</p>
             {currentTier.id === 'free' && <span className="feature-tag">Buy & Download</span>}
             {isProOrHigher && <span className="feature-tag pro">Earn 90% Rev</span>}
           </div>
           
           <div className="action-card" style={{ cursor: 'pointer', borderColor: '#3b82f6' }} onClick={() => onNavigate?.('education')}>
             <div className="action-icon">🎓</div>
             <h3>Education</h3>
             <p>Master animation skills</p>
             <span className="feature-tag">New Courses</span>
           </div>

           <div className="action-card" style={{ cursor: 'pointer', borderColor: '#10b981' }}>
             <div className="action-icon">👤</div>
             <h3>Character Creator</h3>
             <p>Build custom rigs</p>
             {currentTier.id === 'free' ? (
                <span className="feature-tag lock">Pro Only</span>
             ) : (
                <span className="feature-tag pro">5 Slots</span>
             )}
           </div>
        </div>
      </div>

      {/* Recent Creations */}
      <div className="creations-section">
        <div className="section-header">
          <h2>Recent Creations</h2>
          <button className="see-all-btn">See All →</button>
        </div>
        <div className="creations-grid">
          {recentAnimations.map(anim => (
            <div key={anim.id} className="creation-card">
              <div className="creation-preview">
                <div className="creation-icon">{anim.icon}</div>
              </div>
              <div className="creation-info">
                <h4>{anim.name}</h4>
                <p>{anim.date}</p>
              </div>
              <div className="creation-actions">
                <button className="action-btn">Edit</button>
                <button className="action-btn">Export</button>
              </div>
            </div>
          ))}
          {recentAnimations.length === 0 && (
            <div className="empty-state">
              <p>No animations yet. Start creating!</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <div className="action-card" onClick={() => onNavigate?.('chat')} style={{ cursor: 'pointer' }}>
            <div className="action-icon">💬</div>
            <h3>New Chat</h3>
            <p>Start creating with G-Rump</p>
          </div>
          <div className="action-card" onClick={() => onNavigate?.('templates')} style={{ cursor: 'pointer' }}>
            <div className="action-icon">📚</div>
            <h3>Browse Templates</h3>
            <p>Find inspiration from pre-made animations</p>
          </div>
          <div className="action-card" onClick={() => onNavigate?.('chat')} style={{ cursor: 'pointer' }}>
            <div className="action-icon">✨</div>
            <h3>Random Idea</h3>
            <p>Let G-Rump surprise you</p>
          </div>
        </div>
      </div>
    </div>
  )
}


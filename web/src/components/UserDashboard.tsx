// User Dashboard - Overview of usage and recent creations

import { useState, useEffect } from 'react'
import { animationApi } from '../services/animationApi'
import { useAnimation } from '../store/AnimationStore'
import './UserDashboard.css'

interface UserDashboardProps {
  onNavigate?: (view: 'chat' | 'templates' | 'settings' | 'pricing') => void
}

export default function UserDashboard({ onNavigate }: UserDashboardProps = {}) {
  const { transitionToState } = useAnimation()
  const [usage] = useState({ created: 7, limit: 10 })
  const [recentAnimations, setRecentAnimations] = useState<any[]>([])

  useEffect(() => {
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

  const usagePercentage = (usage.created / usage.limit) * 100

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
          <button className="header-btn pro" onClick={() => onNavigate?.('pricing')}>Pro ✨</button>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1>Welcome back, Alex</h1>
          <button className="upgrade-btn" onClick={() => onNavigate?.('pricing')}>Upgrade to Pro</button>
        </div>
        <div className="welcome-grump">
          <Grump size="medium" />
          <p>"Oh, you're back. I was just starting to enjoy the quiet."</p>
        </div>
      </div>

      {/* Usage Section */}
      <div className="usage-section">
        <div className="usage-card">
          <h3>Today's Usage</h3>
          <div className="usage-stats">
            <div className="usage-info">
              <span className="usage-number">{usage.created}/{usage.limit}</span>
              <span className="usage-label">animations today</span>
            </div>
            <div className="usage-bar">
              <div 
                className="usage-progress" 
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <p className="usage-reset">Resets in: 14h 23m</p>
          </div>
        </div>

        <div className="plan-card">
          <h3>FREE PLAN</h3>
          <div className="plan-info">
            <span className="plan-usage">{usage.created} / {usage.limit} animations today</span>
            <div className="plan-bar">
              <div 
                className="plan-progress" 
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <p className="plan-percentage">{Math.round(usagePercentage)}%</p>
            <button className="plan-upgrade" onClick={() => onNavigate?.('pricing')}>Need more? Go Pro →</button>
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

      {/* Chat History */}
      <div className="history-section">
        <h2>Chat History</h2>
        <div className="history-list">
          <div className="history-item">
            <div className="history-icon">📁</div>
            <div className="history-content">
              <h4>Loading spinner for app</h4>
              <p>"A loading spinner. How original..."</p>
            </div>
            <span className="history-date">Today</span>
          </div>
          <div className="history-item">
            <div className="history-icon">📁</div>
            <div className="history-content">
              <h4>Logo animation for startup</h4>
              <p>"Let me add some actual animation principles..."</p>
            </div>
            <span className="history-date">Yesterday</span>
          </div>
          <div className="history-item">
            <div className="history-icon">📁</div>
            <div className="history-content">
              <h4>Button hover effects</h4>
              <p>"Fine. Here's your button effect..."</p>
            </div>
            <span className="history-date">2 days ago</span>
          </div>
          <div className="history-item">
            <div className="history-icon">📁</div>
            <div className="history-content">
              <h4>Game character run cycle</h4>
              <p>"Oh? An actual challenge?..."</p>
            </div>
            <span className="history-date">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}


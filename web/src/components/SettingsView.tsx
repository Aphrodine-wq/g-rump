import { useState, useEffect } from 'react'
import { getCurrentTier, getRemainingMessages } from '../config/pricing'
import PricingView from './PricingView'
import './SettingsView.css'

export default function SettingsView() {
  const [showPricing, setShowPricing] = useState(false)
  const [hapticFeedback, setHapticFeedback] = useState(() => {
    return localStorage.getItem('hapticFeedbackEnabled') !== 'false'
  })
  const [typingSounds, setTypingSounds] = useState(() => {
    return localStorage.getItem('typingSoundsEnabled') === 'true'
  })
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkModeEnabled') !== 'false'
  })
  const [grumpMood] = useState('Cranky')
  const [sarcasmLevel] = useState('Maximum')

  useEffect(() => {
    localStorage.setItem('hapticFeedbackEnabled', String(hapticFeedback))
  }, [hapticFeedback])

  useEffect(() => {
    localStorage.setItem('typingSoundsEnabled', String(typingSounds))
  }, [typingSounds])

  useEffect(() => {
    localStorage.setItem('darkModeEnabled', String(darkMode))
  }, [darkMode])

  if (showPricing) {
    return (
      <div className="settings-container">
        <div className="settings-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setShowPricing(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--fg)',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <h1>Pricing</h1>
        </div>
        <PricingView />
      </div>
    )
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
      </div>

      <div className="settings-content">
        {/* Grump Settings */}
        <div className="settings-section">
          <h2 className="settings-section-title">Grump Settings</h2>
          
          <div className="settings-item">
            <span className="settings-label">Grump's Mood</span>
            <div className="settings-value">
              <div className="mood-indicator"></div>
              <span>{grumpMood}</span>
            </div>
          </div>

          <div className="settings-item">
            <span className="settings-label">Sarcasm Level</span>
            <div className="settings-value">
              <div className="mood-indicator"></div>
              <span>{sarcasmLevel}</span>
            </div>
          </div>
        </div>

        {/* Subscription & Pricing */}
        <div className="settings-section">
          <h2 className="settings-section-title">Subscription & Pricing</h2>
          
          <div className="settings-item clickable" onClick={() => setShowPricing(true)}>
            <div>
              <span className="settings-label">Current Plan</span>
              <span className="settings-value-text" style={{ display: 'block', marginTop: '4px' }}>
                {(() => {
                  const tier = getCurrentTier()
                  const remaining = getRemainingMessages()
                  if (remaining < 0) {
                    return `${tier.name} • Unlimited messages`
                  }
                  return `${tier.name} • ${remaining} messages remaining`
                })()}
              </span>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
        </div>

        {/* App Settings */}
        <div className="settings-section">
          <h2 className="settings-section-title">App Settings</h2>
          
          <div className="settings-item">
            <span className="settings-label">Dark Mode</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="settings-item">
            <span className="settings-label">Haptic Feedback</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={hapticFeedback}
                onChange={(e) => setHapticFeedback(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="settings-item">
            <span className="settings-label">Typing Sounds</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={typingSounds}
                onChange={(e) => setTypingSounds(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* About */}
        <div className="settings-section">
          <h2 className="settings-section-title">About</h2>
          
          <div className="settings-item">
            <span className="settings-label">Version</span>
            <span className="settings-value-text">1.0.0</span>
          </div>

          <div className="settings-item">
            <span className="settings-label">Developer</span>
            <span className="settings-value-text">Grump Industries</span>
          </div>
        </div>
      </div>
    </div>
  )
}


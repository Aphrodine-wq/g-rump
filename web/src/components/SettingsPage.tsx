// Settings Page - User preferences and account management

import { useState, useEffect } from 'react'
import { useAnimation } from '../store/AnimationStore'
import './SettingsPage.css'

export default function SettingsPage() {
  const { transitionToState } = useAnimation()
  const [sassLevel, setSassLevel] = useState(5)
  const [responseStyle, setResponseStyle] = useState('standard')
  const [showAnimations, setShowAnimations] = useState(true)
  const [typingSounds, setTypingSounds] = useState(true)
  const [celebrationMode, setCelebrationMode] = useState(false)
  const [defaultFormat, setDefaultFormat] = useState('gif')
  const [defaultResolution, setDefaultResolution] = useState('720p')
  const [defaultBackground, setDefaultBackground] = useState('transparent')
  const [alwaysLoop, setAlwaysLoop] = useState(true)
  const [optimizeSize, setOptimizeSize] = useState(true)
  const [includeWatermark, setIncludeWatermark] = useState(true)
  const [theme, setTheme] = useState('light')
  const [accentColor, setAccentColor] = useState('#3b82f6')

  useEffect(() => {
    transitionToState('idle')
  }, [transitionToState])

  return (
    <div className="settings-page">
      {/* Header */}
      <header className="settings-header">
        <button className="back-btn">← Back</button>
        <h1>Settings</h1>
      </header>

      <div className="settings-content">
        {/* Account Section */}
        <section className="settings-section">
          <h2>Account</h2>
          <div className="settings-card">
            <div className="account-info">
              <div className="account-details">
                <div className="account-avatar">👤</div>
                <div>
                  <h3>Alex Johnson</h3>
                  <p>alex@email.com</p>
                </div>
              </div>
              <div className="account-plan">
                <p>Plan: <strong>FREE</strong></p>
                <p>Animations today: 7/10</p>
                <button className="upgrade-btn">Upgrade to Pro →</button>
              </div>
            </div>
            <div className="account-actions">
              <button className="action-btn">Edit Profile</button>
              <button className="action-btn">Change Password</button>
              <button className="action-btn danger">Sign Out</button>
            </div>
          </div>
        </section>

        {/* G-Rump Personality */}
        <section className="settings-section">
          <h2>G-Rump Personality</h2>
          <div className="settings-card">
            <div className="setting-item">
              <label>Sass Level</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sassLevel}
                  onChange={(e) => setSassLevel(Number(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>Mild</span>
                  <span>Maximum</span>
                </div>
                <p className="slider-value">Current: "{sassLevel <= 3 ? 'Mildly Judgy' : sassLevel <= 7 ? 'Moderately Judgy' : 'Maximum Sass'}"</p>
              </div>
            </div>

            <div className="setting-item">
              <label>Response Style</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="responseStyle"
                    value="brief"
                    checked={responseStyle === 'brief'}
                    onChange={(e) => setResponseStyle(e.target.value)}
                  />
                  <span>Brief (less commentary)</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="responseStyle"
                    value="standard"
                    checked={responseStyle === 'standard'}
                    onChange={(e) => setResponseStyle(e.target.value)}
                  />
                  <span>Standard (balanced)</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="responseStyle"
                    value="verbose"
                    checked={responseStyle === 'verbose'}
                    onChange={(e) => setResponseStyle(e.target.value)}
                  />
                  <span>Verbose (more roasts)</span>
                </label>
              </div>
            </div>

            <div className="setting-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={showAnimations}
                  onChange={(e) => setShowAnimations(e.target.checked)}
                />
                <span>Show G-Rump animations</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={typingSounds}
                  onChange={(e) => setTypingSounds(e.target.checked)}
                />
                <span>Play typing sounds</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={celebrationMode}
                  onChange={(e) => setCelebrationMode(e.target.checked)}
                />
                <span>Enable celebration mode (rare happy G-Rump)</span>
              </label>
            </div>
          </div>
        </section>

        {/* Export Defaults */}
        <section className="settings-section">
          <h2>Export Defaults</h2>
          <div className="settings-card">
            <div className="settings-grid">
              <div className="setting-item">
                <label>Default Format</label>
                <select
                  value={defaultFormat}
                  onChange={(e) => setDefaultFormat(e.target.value)}
                  className="select-input"
                >
                  <option value="gif">GIF</option>
                  <option value="mp4">MP4</option>
                  <option value="lottie">Lottie</option>
                  <option value="css">CSS</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Default Resolution</label>
                <select
                  value={defaultResolution}
                  onChange={(e) => setDefaultResolution(e.target.value)}
                  className="select-input"
                >
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                  <option value="4k">4K (Pro)</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Default Background</label>
                <select
                  value={defaultBackground}
                  onChange={(e) => setDefaultBackground(e.target.value)}
                  className="select-input"
                >
                  <option value="transparent">Transparent</option>
                  <option value="white">White</option>
                  <option value="black">Black</option>
                </select>
              </div>
            </div>

            <div className="setting-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={alwaysLoop}
                  onChange={(e) => setAlwaysLoop(e.target.checked)}
                />
                <span>Always loop animations</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={optimizeSize}
                  onChange={(e) => setOptimizeSize(e.target.checked)}
                />
                <span>Optimize for file size</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={includeWatermark}
                  onChange={(e) => setIncludeWatermark(e.target.checked)}
                />
                <span>Include G-Rump watermark (Free users)</span>
              </label>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="settings-section">
          <h2>Appearance</h2>
          <div className="settings-card">
            <div className="setting-item">
              <label>Theme</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={theme === 'light'}
                    onChange={(e) => setTheme(e.target.value)}
                  />
                  <span>Light</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={theme === 'dark'}
                    onChange={(e) => setTheme(e.target.value)}
                  />
                  <span>Dark</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="theme"
                    value="system"
                    checked={theme === 'system'}
                    onChange={(e) => setTheme(e.target.value)}
                  />
                  <span>System</span>
                </label>
              </div>
            </div>

            <div className="setting-item">
              <label>Accent Color</label>
              <div className="color-options">
                {['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'].map(color => (
                  <button
                    key={color}
                    className={`color-option ${accentColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setAccentColor(color)}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="settings-section">
          <h2>Danger Zone</h2>
          <div className="settings-card danger">
            <button className="danger-btn">Delete All Animations</button>
            <button className="danger-btn">Delete Account</button>
          </div>
        </section>
      </div>
    </div>
  )
}


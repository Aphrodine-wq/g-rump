// Animation Preview Panel - Right side of chat interface

import { useState, useEffect } from 'react'
import { type Animation } from '../services/animationApi'
import './AnimationPreview.css'

interface AnimationPreviewProps {
  animation: Animation | null
  onExport: () => void
}

export default function AnimationPreview({ animation, onExport }: AnimationPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [loopEnabled, setLoopEnabled] = useState(true)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (animation) {
      // Set preview URL from animation
      if (typeof animation.preview === 'string') {
        setPreviewUrl(animation.preview)
      } else if (animation.preview && typeof animation.preview === 'object' && 'url' in animation.preview) {
        setPreviewUrl(animation.preview.url)
      } else {
        setPreviewUrl(null)
      }
    } else {
      setPreviewUrl(null)
    }
  }, [animation])

  if (!animation) {
    return (
      <div className="animation-preview empty">
        <div className="empty-state">
          <div className="empty-icon">🎬</div>
          <p>Animation preview will appear here</p>
          <p className="empty-subtitle">Ask G-Rump to create something</p>
        </div>
      </div>
    )
  }

  return (
    <div className="animation-preview">
      <div className="preview-header">
        <h3>Preview</h3>
        <div className="preview-controls">
          <button 
            className="control-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <label className="loop-toggle">
            <input 
              type="checkbox" 
              checked={loopEnabled}
              onChange={(e) => setLoopEnabled(e.target.checked)}
            />
            <span>Loop</span>
          </label>
        </div>
      </div>

      <div className="preview-canvas">
          <div className="animation-display">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Animation preview" 
                className="animation-preview-image"
                style={{ 
                  display: isPlaying ? 'block' : 'none',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            ) : animation.format === 'css-live' ? (
              <>
                <style>{animation.code}</style>
                <div className="flex items-center justify-center w-full h-full bg-gray-50 rounded-xl overflow-hidden">
                   <div className="animated-element shadow-lg">
                      Preview
                   </div>
                </div>
              </>
            ) : (
              <div className="animation-placeholder">
                {animation.status === 'processing' ? (
                  <>
                    <div className="spinner">◠◡◠</div>
                    <p>Creating animation...</p>
                  </>
                ) : (
                  <>
                    <div className="spinner">◠◡◠</div>
                    <p>Animation ready</p>
                    {animation.code && (
                      <details style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                        <summary>View G-Rump Code</summary>
                        <pre style={{ 
                          background: '#f3f4f6', 
                          padding: '0.5rem', 
                          borderRadius: '4px',
                          overflow: 'auto',
                          maxHeight: '200px',
                          fontSize: '0.75rem'
                        }}>
                          {animation.code}
                        </pre>
                      </details>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
      </div>

      <div className="preview-info">
        <div className="info-item">
          <span className="info-label">Duration:</span>
          <span className="info-value">2.0s</span>
        </div>
        <div className="info-item">
          <span className="info-label">Loop:</span>
          <span className="info-value">{loopEnabled ? 'On' : 'Off'}</span>
        </div>
      </div>

      <div className="preview-export">
        <h4>Export Options</h4>
        <div className="export-grid">
          <button className="export-btn">GIF</button>
          <button className="export-btn">MP4</button>
          <button className="export-btn">Lottie</button>
          <button className="export-btn">Code</button>
          <button className="export-btn">Sprite</button>
          <button className="export-btn">SVG</button>
        </div>
        <button className="export-primary" onClick={onExport}>
          Download ↓
        </button>
      </div>

      <div className="preview-settings">
        <h4>Animation Settings</h4>
        <div className="setting-group">
          <label>
            <span>Color</span>
            <input type="color" defaultValue="#3B82F6" />
          </label>
          <label>
            <span>Speed</span>
            <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" />
            <span className="range-value">1.5x</span>
          </label>
          <label>
            <span>Size</span>
            <input type="range" min="24" max="96" step="8" defaultValue="48" />
            <span className="range-value">48px</span>
          </label>
          <label>
            <span>Stroke</span>
            <input type="range" min="1" max="8" step="1" defaultValue="4" />
            <span className="range-value">4px</span>
          </label>
        </div>
        <button className="apply-btn">Apply Changes</button>
      </div>
    </div>
  )
}


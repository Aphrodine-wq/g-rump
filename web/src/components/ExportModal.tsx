// Export Modal Component

import { useState } from 'react'
import { animationApi } from '../services/animationApi'
import { getCurrentTier } from '../config/pricing'
import Grump2 from './Grump2'
import './ExportModal.css'

interface ExportModalProps {
  animation: any | null
  onClose: () => void
}

export default function ExportModal({ animation, onClose }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState('gif')
  const [resolution, setResolution] = useState('720p')
  const [quality, setQuality] = useState('high')
  const [loopMode, setLoopMode] = useState('on')
  const [background, setBackground] = useState('transparent')
  const [includeWatermark, setIncludeWatermark] = useState(true)

  const currentTier = getCurrentTier()
  const isPro = currentTier.id !== 'free'

  const formats = [
    { id: 'gif', name: 'GIF', desc: 'Basic' },
    { id: 'mp4', name: 'MP4', desc: 'Video' },
    { id: 'webm', name: 'WebM', desc: 'Web' },
    { id: 'apng', name: 'APNG', desc: 'PNG' },
    { id: 'lottie', name: 'Lottie', desc: 'Apps', pro: true },
    { id: 'sprite', name: 'Sprite', desc: 'Games', pro: true },
    { id: 'css', name: 'CSS', desc: 'Web', pro: true },
    { id: 'code', name: 'G-Rump', desc: 'Dev', pro: true },
  ]

  const handleFormatSelect = (formatId: string, isFormatPro?: boolean) => {
    if (isFormatPro && !isPro) {
      alert(`The ${formatId.toUpperCase()} format is available on the Pro plan.`)
      return
    }
    setSelectedFormat(formatId)
  }

  const handleWatermarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPro && !e.target.checked) {
      alert('Removing the watermark requires the Pro plan.')
      return
    }
    setIncludeWatermark(e.target.checked)
  }

  const handleExport = async () => {
    if (!animation) {
      console.error('No animation to export')
      return
    }

    try {
      const exportResult = await animationApi.exportAnimation(animation.id, {
        format: selectedFormat as any,
        resolution: resolution as any,
        quality: quality as any,
        loop: loopMode === 'on' || loopMode === 'bounce',
        background: background as any,
        watermark: includeWatermark
      })

      // Download the file
      const link = document.createElement('a')
      link.href = exportResult.downloadUrl
      link.download = `animation.${selectedFormat}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      onClose()
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export animation. Please try again.')
    }
  }

  return (
    <div className="export-modal-overlay" onClick={onClose}>
      <div className="export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Export Your Animation</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-grump">
          <Grump2 size="small" />
          <p>"Finally done. Now pick a format before I change my mind."</p>
        </div>

        <div className="modal-preview">
          <div className="preview-box">
            <div className="animation-preview-content">
              <div className="spinner-preview">◠◡◠</div>
            </div>
          </div>
        </div>

        <div className="modal-content">
          <div className="format-selection">
            <h3>Select Format</h3>
            <div className="format-grid">
              {formats.map(format => (
                <button
                  key={format.id}
                  className={`format-btn ${selectedFormat === format.id ? 'active' : ''} ${format.pro ? 'pro' : ''}`}
                  onClick={() => handleFormatSelect(format.id, format.pro)}
                  style={format.pro && !isPro ? { opacity: 0.7 } : {}}
                >
                  <div className="format-name">{format.name}</div>
                  <div className="format-desc">{format.desc}</div>
                  {format.pro && <span className="pro-badge">🔒 Pro</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="export-settings">
            <h3>Settings</h3>
            <div className="settings-grid">
              <div className="setting-item">
                <label>Resolution</label>
                <select value={resolution} onChange={(e) => setResolution(e.target.value)}>
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                  <option value="4k" disabled={!isPro}>4K {isPro ? '' : '(Pro)'}</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Quality</label>
                <select value={quality} onChange={(e) => setQuality(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="high">High</option>
                  <option value="max">Max</option>
                </select>
              </div>
              <div className="setting-item">
                <label>Loop</label>
                <select value={loopMode} onChange={(e) => setLoopMode(e.target.value)}>
                  <option value="on">On</option>
                  <option value="off">Off</option>
                  <option value="bounce">Bounce</option>
                </select>
              </div>
            </div>

            <div className="background-options">
              <label>Background</label>
              <div className="bg-options">
                <button 
                  className={`bg-option ${background === 'transparent' ? 'active' : ''}`}
                  onClick={() => setBackground('transparent')}
                >
                  Transparent
                </button>
                <button 
                  className={`bg-option ${background === 'white' ? 'active' : ''}`}
                  onClick={() => setBackground('white')}
                >
                  White
                </button>
                <button 
                  className={`bg-option ${background === 'black' ? 'active' : ''}`}
                  onClick={() => setBackground('black')}
                >
                  Black
                </button>
                <button 
                  className={`bg-option ${background === 'custom' ? 'active' : ''}`}
                  onClick={() => setBackground('custom')}
                >
                  Custom
                </button>
              </div>
            </div>

            <div className="watermark-option">
              <label>
                <input 
                  type="checkbox" 
                  checked={includeWatermark}
                  onChange={handleWatermarkChange}
                />
                <span>Include G-Rump watermark {!isPro && '(uncheck with Pro)'}</span>
              </label>
            </div>
          </div>

          <div className="export-info">
            <p>Estimated size: ~245 KB</p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="export-btn" onClick={handleExport}>
            Download {selectedFormat.toUpperCase()} ↓
          </button>
        </div>
      </div>
    </div>
  )
}


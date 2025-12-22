// Share/Embed Modal - Share animations with others

import { useState, useEffect } from 'react'
import Grump2 from './Grump2'
import { useToast } from '../hooks/useToast'
import { generateQRCode, downloadQRCode } from '../utils/qrCode'
import Toast from './Toast'
import './ShareModal.css'

interface ShareModalProps {
  animationId: string
  animationName: string
  onClose: () => void
}

export default function ShareModal({ animationId, animationName, onClose }: ShareModalProps) {
  const [embedSize, setEmbedSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [showWatermark, setShowWatermark] = useState(true)
  const [autoPlay, setAutoPlay] = useState(true)
  const [loopAnimation, setLoopAnimation] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
  const { toasts, showToast, removeToast } = useToast()

  const previewUrl = `https://grump.ai/a/${animationId}`
  const embedCode = `<iframe src="https://grump.ai/embed/${animationId}" width="${embedSize === 'small' ? '300' : embedSize === 'medium' ? '400' : '600'}" height="${embedSize === 'small' ? '200' : embedSize === 'medium' ? '300' : '400'}" frameborder="0"></iframe>`

  useEffect(() => {
    // Generate QR code on mount
    const qrData = generateQRCode(previewUrl, 200)
    setQrCodeDataUrl(qrData)
  }, [previewUrl])

  const shareLinks = [
    { name: 'Twitter', icon: '𝕏', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(previewUrl)}&text=${encodeURIComponent(`Check out this animation made with G-Rump: ${animationName}`)}` },
    { name: 'Facebook', icon: 'f', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(previewUrl)}` },
    { name: 'TikTok', icon: '▶', url: '#' },
    { name: 'LinkedIn', icon: 'in', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(previewUrl)}` },
    { name: 'Email', icon: '✉', url: `mailto:?subject=${encodeURIComponent(`Check out this G-Rump animation: ${animationName}`)}&body=${encodeURIComponent(`I made this animation with G-Rump: ${previewUrl}`)}` },
  ]

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    showToast(`${type} copied to clipboard!`, 'success')
  }

  const handleDownloadQR = () => {
    if (qrCodeDataUrl) {
      downloadQRCode(qrCodeDataUrl, `grump-${animationId}-qr.png`)
      showToast('QR code downloaded!', 'success')
    }
  }

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Share Animation</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-grump">
          <Grump2 size="small" />
          <p>"Sure, show it off. I did all the work anyway."</p>
        </div>

        {/* Preview Link */}
        <div className="share-section">
          <h3>Preview Link</h3>
          <div className="link-container">
            <input
              type="text"
              value={previewUrl}
              readOnly
              className="link-input"
            />
            <button
              className="copy-btn"
              onClick={() => handleCopy(previewUrl, 'link')}
            >
              Copy
            </button>
          </div>
        </div>

        {/* Share To */}
        <div className="share-section">
          <h3>Share To</h3>
          <div className="share-buttons">
            {shareLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="share-button"
              >
                <span className="share-icon">{link.icon}</span>
                <span>{link.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Embed Code */}
        <div className="share-section">
          <h3>Embed Code</h3>
          <div className="embed-code-container">
            <textarea
              value={embedCode}
              readOnly
              className="embed-code"
              rows={3}
            />
            <button
              className="copy-btn"
              onClick={() => handleCopy(embedCode, 'embed code')}
            >
              Copy
            </button>
          </div>
          <div className="embed-size-options">
            <label className="size-option">
              <input
                type="radio"
                name="embedSize"
                value="small"
                checked={embedSize === 'small'}
                onChange={(e) => setEmbedSize(e.target.value as 'small' | 'medium' | 'large')}
              />
              <span>Small (300x200)</span>
            </label>
            <label className="size-option">
              <input
                type="radio"
                name="embedSize"
                value="medium"
                checked={embedSize === 'medium'}
                onChange={(e) => setEmbedSize(e.target.value as 'small' | 'medium' | 'large')}
              />
              <span>Medium (400x300)</span>
            </label>
            <label className="size-option">
              <input
                type="radio"
                name="embedSize"
                value="large"
                checked={embedSize === 'large'}
                onChange={(e) => setEmbedSize(e.target.value as 'small' | 'medium' | 'large')}
              />
              <span>Large (600x400)</span>
            </label>
          </div>
        </div>

        {/* Options */}
        <div className="share-section">
          <h3>Options</h3>
          <div className="share-options">
            <label className="option-checkbox">
              <input
                type="checkbox"
                checked={showWatermark}
                onChange={(e) => setShowWatermark(e.target.checked)}
              />
              <span>Show G-Rump watermark</span>
            </label>
            <label className="option-checkbox">
              <input
                type="checkbox"
                checked={autoPlay}
                onChange={(e) => setAutoPlay(e.target.checked)}
              />
              <span>Auto-play animation</span>
            </label>
            <label className="option-checkbox">
              <input
                type="checkbox"
                checked={loopAnimation}
                onChange={(e) => setLoopAnimation(e.target.checked)}
              />
              <span>Loop animation</span>
            </label>
            <label className="option-checkbox">
              <input
                type="checkbox"
                checked={showControls}
                onChange={(e) => setShowControls(e.target.checked)}
              />
              <span>Show controls</span>
            </label>
          </div>
        </div>

        {/* QR Code */}
        <div className="share-section">
          <h3>QR Code</h3>
          <div className="qr-container">
            {qrCodeDataUrl ? (
              <img src={qrCodeDataUrl} alt="QR Code" className="qr-code-image" />
            ) : (
              <div className="qr-code-placeholder">
                <div className="qr-pattern">
                  <div className="qr-square"></div>
                  <div className="qr-square"></div>
                  <div className="qr-square"></div>
                  <div className="qr-square"></div>
                  <div className="qr-square"></div>
                  <div className="qr-square"></div>
                  <div className="qr-square"></div>
                  <div className="qr-square"></div>
                  <div className="qr-square"></div>
                </div>
              </div>
            )}
            <button className="download-qr-btn" onClick={handleDownloadQR}>Download QR</button>
          </div>
        </div>
      </div>
      
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  )
}


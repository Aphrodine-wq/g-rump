// Mobile-optimized chat view

import { useState } from 'react'
import { useChat } from '../store/ChatStore'
import { useAnimation } from '../store/AnimationStore'
import GrumpAvatarWrapper from './GrumpAvatarWrapper'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import AnimationPreview from './AnimationPreview'
import ExportModal from './ExportModal'
import './MobileChatView.css'

export default function MobileChatView() {
  const { messages, isTyping, sendMessage } = useChat()
  const { state, transitionToState } = useAnimation()
  const [messageText, setMessageText] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [currentAnimation, setCurrentAnimation] = useState<any>(null)

  const handleSend = async () => {
    if (!messageText.trim()) return
    const userMessage = messageText.trim()
    setMessageText('')
    transitionToState('thinking')
    await sendMessage(userMessage)
    transitionToState('idle')
  }

  return (
    <div className="mobile-chat-view">
      {/* Mobile Header */}
      <header className="mobile-header">
        <button className="back-btn">←</button>
        <span className="mobile-title">G-RUMP</span>
        <button className="export-btn" onClick={() => setShowExport(true)}>Export</button>
      </header>

      {/* Main Content - Toggle between chat and preview */}
      {!showPreview ? (
        /* Chat View */
        <div className="mobile-chat-panel">
          <div className="mobile-messages">
            {messages.length === 0 && (
              <div className="mobile-welcome">
                <GrumpAvatarWrapper size="medium" />
                <p>"What do you want?"</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <MessageBubble
                key={idx}
                message={msg.content}
                sender={msg.sender}
                timestamp={msg.timestamp}
              />
            ))}

            {isTyping && (
              <div className="mobile-typing">
                <GrumpAvatarWrapper size="small" />
                <TypingIndicator />
              </div>
            )}
          </div>

          <div className="mobile-input">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type message..."
              className="mobile-input-field"
              rows={1}
            />
            <button 
              onClick={handleSend}
              className="mobile-send"
              disabled={!messageText.trim()}
            >
              🐸
            </button>
          </div>
        </div>
      ) : (
        /* Preview View */
        <div className="mobile-preview-panel">
          <button className="back-to-chat" onClick={() => setShowPreview(false)}>
            ← Back
          </button>
          <AnimationPreview 
            animation={currentAnimation}
            onExport={() => setShowExport(true)}
          />
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="mobile-nav">
        <button className="nav-item active">
          <span>🏠</span>
          <span>Home</span>
        </button>
        <button className="nav-item" onClick={() => setShowPreview(!showPreview)}>
          <span>📚</span>
          <span>Library</span>
        </button>
        <button className="nav-item">
          <span>⚙️</span>
          <span>Settings</span>
        </button>
      </nav>

      {/* Export Modal */}
      {showExport && (
        <ExportModal
          animation={currentAnimation}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  )
}


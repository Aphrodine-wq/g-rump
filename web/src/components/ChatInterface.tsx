// New Chat Interface - Split view with chat + preview
// White design, 200fps animations

import { useState, useEffect, useRef } from 'react'
import { useChat } from '../store/ChatStore'
import { useAnimation } from '../store/AnimationStore'
import { animationApi, type Animation } from '../services/animationApi'
import GrumpAvatarWrapper from './GrumpAvatarWrapper'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import AnimationPreview from './AnimationPreview'
import ExportModal from './ExportModal'
import './ChatInterface.css'

export default function ChatInterface() {
  const { messages, isTyping, sendMessage } = useChat()
  const { transitionToState } = useAnimation()
  const [messageText, setMessageText] = useState('')
  const [showExportModal, setShowExportModal] = useState(false)
  const [currentAnimation, setCurrentAnimation] = useState<Animation | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!messageText.trim()) return

    const userMessage = messageText.trim()
    setMessageText('')

    // Check if this is an animation request
    const isAnimationRequest = animationApi.isAnimationRequest(userMessage)

    // Update G-Rump state based on message
    if (isAnimationRequest) {
      transitionToState('processing')
    } else {
      transitionToState('thinkingDeep')
    }

    // Send chat message
    await sendMessage(userMessage)

    // If it's an animation request, also create the animation
    if (isAnimationRequest) {
      try {
        const animation = await animationApi.createAnimation({
          prompt: userMessage,
          style: 'default',
          format: 'gif'
        })
        
        setCurrentAnimation(animation)
        transitionToState('impressed')
      } catch (error) {
        console.error('Failed to create animation:', error)
        transitionToState('error')
        // Animation creation failed, but chat message was sent
      }
    } else {
      transitionToState('idle')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-interface">
      {/* Header */}
      <header className="chat-header">
        <div className="header-left">
          <span className="grump-emoji">🐸</span>
          <span className="header-title">G-RUMP</span>
          <button className="header-btn">New Chat</button>
        </div>
        <div className="header-right">
          <button className="header-btn">History</button>
          <button className="header-btn">Settings</button>
          <button className="header-btn pro">Pro ✨</button>
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="chat-main">
        {/* Left: Chat */}
        <div className="chat-panel">
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="welcome-message">
                <GrumpAvatarWrapper size="medium" />
                <p className="welcome-text">"What do you want?"</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <MessageBubble
                key={idx}
                message={msg}
                index={idx}
              />
            ))}

            {isTyping && (
              <div className="typing-container">
                <GrumpAvatarWrapper 
                  size="small"
                  customState={{
                    glowColor: 'soft',
                    glowIntensity: 0.5
                  }}
                />
                <TypingIndicator />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <div className="input-actions">
              <button className="action-btn" title="Upload">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </button>
              <button className="action-btn" title="Inspire Me">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </button>
              <button className="action-btn" title="Templates">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </button>
            </div>
            <div className="input-wrapper">
              <textarea
                ref={inputRef}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="chat-input"
                rows={1}
              />
              <button 
                onClick={handleSend}
                className="send-button"
                disabled={!messageText.trim()}
              >
                <span className="grump-emoji">🐸</span>
              </button>
            </div>
            <p className="input-footer">Made with 🐸 G-Rump</p>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="preview-panel">
          <AnimationPreview 
            animation={currentAnimation}
            onExport={() => setShowExportModal(true)}
          />
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          animation={currentAnimation}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  )
}


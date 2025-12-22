// New Chat Interface - Split view with chat + preview
// White design, 200fps animations

import { useState, useEffect, useRef } from 'react'
import { useChat } from '../store/ChatStore'
import { useAnimation } from '../store/AnimationStore'
import { useAchievements } from '../store/AchievementsStore'
import { animationApi, type Animation } from '../services/animationApi'
import { contextAwarenessService } from '../services/ContextAwareness'
import { audioManager } from '../services/audio'
import Grump2 from './Grump2'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import AnimationPreview from './AnimationPreview'
import AppLaunch from './animations/AppLaunch'
import ScreenShake from './animations/ScreenShake'
import MessageSlam from './animations/MessageSlam'
import ParticleEffects from './ParticleEffects'
import ExportModal from './ExportModal'
import { MessageSkeleton } from './LoadingSkeleton'
import './ChatInterface.css'
import AngerMeter from './AngerMeter'
import Toast from './Toast'

interface ChatInterfaceProps {
  onNavigate?: (view: 'templates' | 'dashboard' | 'settings' | 'pricing' | 'chat' | 'gamedev') => void
}

export default function ChatInterface({ onNavigate }: ChatInterfaceProps = {}) {
  const { messages, isTyping, sendMessage, createNewSession } = useChat()
  const { transitionToState, triggerEyeRoll, triggerScreenShake } = useAnimation()
  const { recordInteraction } = useAchievements()
  const [messageText, setMessageText] = useState('')
  const [showExportModal, setShowExportModal] = useState(false)
  const [currentAnimation, setCurrentAnimation] = useState<Animation | null>(null)
  const [unlockToast, setUnlockToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [isRageMode, setIsRageMode] = useState(false)
  const [isAppLaunching, setIsAppLaunching] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const chatMessagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const toggleRageMode = () => {
    setIsRageMode(!isRageMode)
    if (!isRageMode) {
      transitionToState('maximumGrump')
      triggerScreenShake()
    } else {
      transitionToState('idle')
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!messageText.trim()) return

    const userMessage = messageText.trim()
    setMessageText('')

    // Analyze the message for emotional context
    const analysis = contextAwarenessService.analyzeMessage(userMessage)

    // Trigger emotional reactions based on analysis
    if (analysis.emotionalState === 'maximumGrump') {
      transitionToState('maximumGrump')
      triggerEyeRoll()
      triggerScreenShake()
      audioManager.grump.error()
    } else if (analysis.emotionalState === 'annoyed') {
      transitionToState('annoyed')
      triggerEyeRoll()
      audioManager.grump.grumble()
    } else if (analysis.emotionalState === 'skeptical') {
      transitionToState('skeptical')
      audioManager.grump.grumble()
    }

    // Record interaction and check for unlocks
    const unlocks = recordInteraction({ analysis, content: userMessage })
    if (unlocks.length > 0) {
      audioManager.grump.success()
      const unlockNames = unlocks.map(u => u.name).join(', ')
      setUnlockToast({
        message: `New unlock${unlocks.length > 1 ? 's' : ''}: ${unlockNames}!`,
        type: 'success'
      })
      setTimeout(() => setUnlockToast(null), 4000)
    }

    // Check if this is an animation request
    const isAnimationRequest = animationApi.isAnimationRequest(userMessage)

    // Send chat message and wait for response
    await sendMessage(userMessage)
    audioManager.grump.type()

    // If it's an animation request, create the animation after a short delay
    // This allows the chat response to come through first
    if (isAnimationRequest) {
      // Wait for chat response, then create animation
      setTimeout(async () => {
        try {
          const animation = await animationApi.createAnimation({
            prompt: userMessage,
            style: 'default',
            format: 'gif'
          })

          setCurrentAnimation(animation)
          audioManager.grump.success()
        } catch (error) {
          console.error('Failed to create animation:', error)
          audioManager.grump.error()
        }
      }, 1500) // Wait 1.5s for chat response
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNewChat = () => {
    createNewSession()
    setMessageText('')
    setUnlockToast({ message: 'New session started', type: 'info' })
    setTimeout(() => setUnlockToast(null), 2000)
  }

  if (isAppLaunching) {
    return (
      <AppLaunch onComplete={() => setIsAppLaunching(false)}>
        <div />
      </AppLaunch>
    )
  }

  return (
    <ScreenShake>
      <div className={`chat-interface ${isRageMode ? 'rage-mode-active' : ''}`}>
        <ParticleEffects />
        {/* Header */}
        <header className="chat-header">
        <div className="header-left">
          <span className="header-title text-3xl">g-rump</span>
          <button className="header-btn" onClick={handleNewChat}>New Chat</button>
        </div>
        <div className="header-right">
          <button 
            className={`header-btn ${isRageMode ? 'bg-red-500 text-white' : ''}`}
            onClick={toggleRageMode}
          >
            {isRageMode ? '😡 RAGE ON' : '😤 Rage Mode'}
          </button>
          <button className="header-btn" onClick={() => onNavigate?.('templates')}>Templates</button>
          <button className="header-btn" onClick={() => onNavigate?.('gamedev')}>Game Dev</button>
          <button className="header-btn" onClick={() => onNavigate?.('dashboard')}>Dashboard</button>
          <button className="header-btn" onClick={() => onNavigate?.('settings')}>Settings</button>
          <button className="header-btn pro" onClick={() => onNavigate?.('pricing')}>Pro ✨</button>
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="chat-main">
        {/* Left: Chat */}
        <div className="chat-panel">
          {/* Anger Meter */}
          <AngerMeter />

          {/* Grump2 - Always visible */}
          <div className="grump2-display-area">
            <Grump2 isRageMode={isRageMode} size={isRageMode ? 'large' : 'medium'} />
          </div>
          
          <div className="chat-messages" id="chatMessages" ref={chatMessagesRef}>
            {messages.length === 0 && (
              <div className="welcome-message">
                <p className="welcome-text">"What do you want?"</p>
                <div className="quick-replies flex gap-2 justify-center mt-4">
                  <button onClick={() => setMessageText("I'm bored")} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-600 transition-colors">I'm bored</button>
                  <button onClick={() => setMessageText("Make me laugh")} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-600 transition-colors">Make me laugh</button>
                  <button onClick={() => setMessageText("Roast my code")} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-600 transition-colors">Roast my code</button>
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <MessageSlam key={idx} isGrumpMessage={msg.sender === 'grump'}>
                <MessageBubble
                  message={msg}
                  index={idx}
                />
              </MessageSlam>
            ))}

            {isTyping && (
              <>
                <MessageSkeleton />
                <div className="typing-container">
                  <TypingIndicator />
                </div>
              </>
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
                id="chatInput"
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
                →
              </button>
            </div>
            <p className="input-footer">Made with g-rump</p>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="preview-panel">
          <AnimationPreview 
            animation={currentAnimation}
            onExport={() => setShowExportModal(true)}
          />
          
          {/* Interactive Widget Control */}
          {currentAnimation && (
            <div className="interactive-controls p-4 bg-gray-900 rounded-lg mt-4 border border-gray-800">
              <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-3">Live Parameters</h3>
              <div className="flex flex-col gap-3">
                <div className="control-group">
                  <label className="text-gray-500 text-xs">Speed</label>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="3" 
                    step="0.1" 
                    defaultValue="1"
                    onChange={(e) => {
                      const speed = parseFloat(e.target.value);
                      const el = document.querySelector('.animated-element') as HTMLElement;
                      if (el) el.style.animationDuration = `${1/speed}s`;
                      audioManager.grump.type(); // Click feedback
                    }}
                    className="w-full accent-indigo-500 bg-gray-800 h-2 rounded-full appearance-none"
                  />
                </div>
                <div className="control-group">
                  <label className="text-gray-500 text-xs">Scale</label>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="2" 
                    step="0.1" 
                    defaultValue="1"
                    onChange={(e) => {
                      const scale = parseFloat(e.target.value);
                      const el = document.querySelector('.animated-element') as HTMLElement;
                      if (el) el.style.transform = `scale(${scale})`;
                      audioManager.grump.type();
                    }}
                    className="w-full accent-purple-500 bg-gray-800 h-2 rounded-full appearance-none"
                  />
                </div>
                <button 
                  className="mt-2 bg-gray-800 hover:bg-gray-700 text-white text-xs py-2 px-4 rounded transition-colors"
                  onClick={() => {
                    const el = document.querySelector('.animated-element') as HTMLElement;
                    if (el) {
                      el.style.animation = 'none';
                      el.offsetHeight; /* trigger reflow */
                      el.style.animation = ''; 
                      audioManager.grump.success();
                    }
                  }}
                >
                  Replay Animation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          animation={currentAnimation}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Unlock Toast */}
      {unlockToast && (
        <Toast
          message={unlockToast.message}
          type={unlockToast.type}
          onClose={() => setUnlockToast(null)}
        />
      )}
      </div>
    </ScreenShake>
  )
}


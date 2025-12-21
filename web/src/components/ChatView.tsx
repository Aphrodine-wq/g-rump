import { useState, useEffect, useRef } from 'react'
import { useChat } from '../store/ChatStore'
import { useAnimation } from '../store/AnimationStore'
import { useWorkspace } from '../store/WorkspaceStore'
import GrumpFaceRig from './GrumpFaceRig'
import MessageBubble from './MessageBubble'
import InputBar from './InputBar'
import TypingIndicator from './TypingIndicator'
import ScreenShake from './animations/ScreenShake'
import ErrorBanner from './ErrorBanner'
import GrumpWorkspace from './GrumpWorkspace'
import { useMicroMovements } from '../hooks/useMicroMovements'
import { contextAwarenessService } from '../services/ContextAwareness'
import { easterEggsService } from '../services/EasterEggs'
import { statsService } from '../services/StatsService'
import { getRemainingMessages } from '../config/pricing'
import './ChatView.css'

const getHapticEnabled = () => {
  return localStorage.getItem('hapticFeedbackEnabled') !== 'false'
}

export default function ChatView() {
  const { messages, isTyping, errorMessage, sendMessage, createNewSession, retryLastMessage, clearError } = useChat()
  const { 
    state, 
    transitionToState, 
    triggerScreenShake, 
    triggerEyeRoll,
    setParticleType, 
    setAccessory,
    updateContext,
    updateEyeTracking
  } = useAnimation()
  const { state: workspaceState, exportAnimation } = useWorkspace()
  const [messageText, setMessageText] = useState('')
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') !== 'false'
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sessionStartTime = useRef<number>(Date.now())
  const messageCount = useRef<number>(0)

  // Initialize micro-movements
  useMicroMovements()

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Context awareness and animation triggers
  useEffect(() => {
    // Check time-based context
    const timeContext = contextAwarenessService.getTimeContext()
    const sessionContext = contextAwarenessService.getSessionContext()

    // Update context in animation store
    const patterns = contextAwarenessService.getConversationPatterns()
    updateContext({
      time: timeContext,
      sessionLength: sessionContext.sessionLength,
      messageCount: sessionContext.messageCount,
      lastMessageTime: Date.now(),
      conversationHistory: messages.map(m => ({
        sender: m.sender,
        content: m.content,
        timestamp: m.timestamp.getTime()
      })),
      detectedPatterns: {
        repeatQuestions: patterns.repeatQuestions,
        sentimentScore: patterns.sentimentTrajectory[patterns.sentimentTrajectory.length - 1] || 0,
        keywordMatches: []
      }
    })

    // Check easter eggs
    const easterEgg = easterEggsService.checkAllEasterEggs()
    if (easterEgg) {
      transitionToState(easterEgg.state)
      if (easterEgg.particleType) {
        setParticleType(easterEgg.particleType)
      }
      if (easterEgg.accessoryType) {
        setAccessory(easterEgg.accessoryType)
      }
    } else {
      // Time-based state
      if (timeContext.timeBasedState) {
        transitionToState(timeContext.timeBasedState)
        if (timeContext.is3AM) {
          setParticleType('coffeeSteam')
          setAccessory('coffeeMug')
        }
      } else if (sessionContext.sessionBasedState) {
        transitionToState(sessionContext.sessionBasedState)
        if (sessionContext.sessionLength > 45 * 60 * 1000) {
          setParticleType('sleepZ')
        }
      }
    }
  }, [messages, updateContext, transitionToState, setParticleType, setAccessory])

  // Handle typing state
  useEffect(() => {
    if (isTyping) {
      transitionToState('processing')
    } else if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.sender === 'grump') {
        transitionToState('responding')
        setTimeout(() => {
          transitionToState('idle')
        }, 2000)
      }
    } else {
      transitionToState('idle')
    }
  }, [isTyping, messages, transitionToState])

  // Handle error state
  useEffect(() => {
    if (errorMessage) {
      transitionToState('error')
      setParticleType('glitchRectangle')
      triggerScreenShake(0.3)
    }
  }, [errorMessage, transitionToState, setParticleType, triggerScreenShake])

  // Eye tracking while typing
  useEffect(() => {
    if (messageText.length > 0 && inputRef.current) {
      const cursorPosition = inputRef.current.selectionStart || 0
      const textLength = messageText.length
      const normalizedPosition = ((cursorPosition / textLength) * 12) - 6 // -6 to +6 range
      updateEyeTracking(normalizedPosition)
      transitionToState('listening')
    } else {
      updateEyeTracking(0)
    }
  }, [messageText, updateEyeTracking, transitionToState])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleTextChange = (text: string) => {
    setMessageText(text)
    
    if (text.length > 0) {
      transitionToState('listening')
    } else {
      transitionToState('idle')
    }
  }

  const handleSend = async () => {
    if (!messageText.trim()) return
    
    const text = messageText.trim()
    setMessageText('')
    
    // Analyze message for context awareness
    const analysis = contextAwarenessService.analyzeMessage(text)
    contextAwarenessService.addMessage('user', text)
    easterEggsService.updateInteraction()

    // Update stats - detect sarcasm in user message
    const sarcasmKeywords = ['obviously', 'clearly', 'sure', 'whatever', 'totally', 'definitely', 'of course', 'right', 'yeah right']
    const hasSarcasm = sarcasmKeywords.some(keyword => text.toLowerCase().includes(keyword))
    if (hasSarcasm) {
      const sarcasmPercentage = Math.min(100, statsService.getAllStats().sarcasmDetected + 5)
      statsService.updateSarcasmLevel(sarcasmPercentage)
    }

    // Update message count and patience level
    messageCount.current++
    const sessionLength = Date.now() - sessionStartTime.current
    const patienceLevel = statsService.calculatePatienceLevel(messageCount.current, sessionLength)
    statsService.updatePatienceLevel(patienceLevel)

    // Trigger appropriate emotional state
    if (analysis.emotionalState) {
      transitionToState(analysis.emotionalState)
      
      // Special triggers
      if (analysis.emotionalState === 'maximumGrump') {
        triggerScreenShake(0.5)
        setParticleType('angerParticle')
        setTimeout(() => setParticleType(null), 500)
        // Count as roast
        statsService.incrementRoasts()
      } else if (analysis.emotionalState === 'skeptical') {
        // Trigger eye roll for skeptical
        triggerEyeRoll('half')
        // Count as roast
        statsService.incrementRoasts()
      } else if (analysis.emotionalState === 'impressed') {
        // Rare sparkle (5% chance)
        if (Math.random() < 0.05) {
          setParticleType('sparkle')
          setTimeout(() => setParticleType(null), 400)
        }
      }
    } else {
      transitionToState('processing')
    }

    // Haptic feedback
    if (getHapticEnabled() && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }
    
    await sendMessage(text)
    
    // Add Grump's response to context and check for roasts
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && lastMessage.sender === 'grump') {
      contextAwarenessService.addMessage('grump', lastMessage.content)
      
      // Check if Grump's message is a roast (sarcastic/annoyed content)
      const roastKeywords = ['obviously', 'clearly', 'sure', 'whatever', 'fine', 'great', 'wonderful', 'fascinating', 'riveting', 'incredible']
      const isRoast = roastKeywords.some(keyword => lastMessage.content.toLowerCase().includes(keyword)) ||
                     lastMessage.content.includes('?') && lastMessage.content.length < 50 // Short sarcastic questions
      
      if (isRoast) {
        statsService.incrementRoasts()
      }
    }
  }

  const toggleTheme = () => {
    const newTheme = !darkMode
    setDarkMode(newTheme)
    localStorage.setItem('darkMode', String(newTheme))
  }

  // Get status text based on current state
  const getStatusText = (): string => {
    if (isTyping) return 'typing...'
    if (errorMessage) return 'something went wrong. great.'
    
    switch (state.currentState) {
      case 'listening':
        return 'you\'re typing. great.'
      case 'processing':
        return 'typing...'
      case 'responding':
        return 'hmph.'
      case 'skeptical':
        return 'really?'
      case 'annoyed':
        return 'ugh.'
      case 'maximumGrump':
        return 'i can\'t with this.'
      case 'impressed':
        return '...okay, that\'s actually good.'
      case 'suspicious':
        return 'what are you planning?'
      case 'softMode':
        return 'hey. that sucks.'
      case 'sleepy':
        return 'zzz...'
      case 'error':
        return 'technical difficulties.'
      case 'threeAM':
        return 'why are we awake?'
      case 'birthday':
        return 'fine. happy birthday.'
      default:
        return 'what do you want'
    }
  }

  return (
    <ScreenShake>
      {errorMessage && (
        <ErrorBanner
          message={errorMessage}
          onDismiss={clearError}
          onRetry={retryLastMessage}
        />
      )}
      <div className="chat-view">
        {/* Workspace - Left Side */}
        <div className="workspace-container">
          <GrumpWorkspace
            animation={workspaceState.animation}
            status={workspaceState.status}
            progress={workspaceState.progress}
            currentTask={workspaceState.currentTask}
            onExport={exportAnimation}
          />
        </div>

        {/* Main Chat Area */}
        <div className="chat-main-area">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <div className="logo">grump</div>
            {(() => {
              const remaining = getRemainingMessages()
              return remaining >= 0 && (
                <div className="message-count-badge">
                  {remaining} left
                </div>
              )
            })()}
          </div>
          <div className="header-actions">
            <button 
              className="icon-btn" 
              onClick={() => {
                // Check if user is ending chat due to frustration (short session with many messages)
                const sessionLength = Date.now() - sessionStartTime.current
                if (sessionLength < 60000 && messageCount.current > 3) {
                  // User ended chat quickly after many messages = Grump ended it
                  statsService.incrementGrumpEndedChat()
                }
                
                createNewSession()
                transitionToState('idle')
                contextAwarenessService.resetSession()
                easterEggsService.reset()
                sessionStartTime.current = Date.now()
                messageCount.current = 0
              }} 
              title="New chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
              </svg>
            </button>
            <button 
              className="icon-btn" 
              onClick={toggleTheme} 
              title="Toggle theme"
            >
              {darkMode ? '☀' : '☾'}
            </button>
          </div>
        </header>

        {/* Avatar Section */}
        <section className="avatar-section">
          <div className="avatar-container">
            <div className="avatar-face">
              <GrumpFaceRig size={180} />
            </div>
          </div>
          <p className="status-text">{getStatusText()}</p>
        </section>

        {/* Messages */}
        <div className="messages-container">
          <div className="messages-list">
            {messages.length === 0 && !isTyping ? (
              <div className="empty-state">
                <span>"Go ahead. I'm listening."</span>
                (reluctantly)
              </div>
            ) : (
              <>
                {messages.map((message, i) => (
                  <MessageBubble key={message.id} message={message} index={i} />
                ))}
                {isTyping && <TypingIndicator />}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>


        {/* Input Bar */}
        <InputBar
          ref={inputRef}
          value={messageText}
          onChange={handleTextChange}
          onSend={handleSend}
          disabled={isTyping}
        />
        </div>
      </div>
    </ScreenShake>
  )
}

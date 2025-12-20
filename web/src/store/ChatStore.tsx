import { createContext, useContext, useState, useCallback, useRef, useMemo, ReactNode } from 'react'
import axios from 'axios'
import { canSendMessage, incrementMessageCount, getRemainingMessages } from '../config/pricing'
import { logger } from '../utils/logger'

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000'

interface Message {
  id: string
  content: string
  sender: 'user' | 'grump'
  timestamp: Date
}

interface ChatContextType {
  messages: Message[]
  isTyping: boolean
  errorMessage: string | null
  sendMessage: (content: string) => Promise<void>
  createNewSession: () => void
  retryLastMessage: () => Promise<void>
  clearError: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const messagesRef = useRef<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const isSendingRef = useRef(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null)
  
  // Keep ref in sync with state
  messagesRef.current = messages
  
  // Expose setter for clearing error
  const clearError = useCallback(() => {
    setErrorMessage(null)
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return
    
    // Prevent duplicate sends while a message is being sent
    if (isSendingRef.current) {
      return
    }
    
    // Input validation
    const trimmedContent = content.trim()
    if (trimmedContent.length === 0) return
    if (trimmedContent.length > 2000) {
      setErrorMessage("Message is too long. Please keep it under 2000 characters. Grump is already annoyed enough.")
      return
    }

    // Check if user has messages remaining
    if (!canSendMessage()) {
      const remaining = getRemainingMessages()
      setErrorMessage(`You've reached your message limit for this month. Upgrade your plan to continue chatting. (${remaining} remaining)`)
      return
    }

    // Set sending flag after all validations pass
    isSendingRef.current = true

    const userMessage: Message = {
      id: Date.now().toString(),
      content: trimmedContent,
      sender: 'user',
      timestamp: new Date()
    }

      setMessages(prev => {
        // Create a new array reference to ensure React detects the change
        const updated = Array.from(prev)
        updated.push(userMessage)
        // Save to localStorage for history
        saveSessionToHistory(updated)
        return updated
      })
      
      setIsTyping(true)
      setErrorMessage(null)
      setLastFailedMessage(trimmedContent) // Store for retry

    try {
      // Include the user message we just added since React state updates are async
      // and messagesRef.current might not be updated yet
      const allMessagesForAPI = [...messagesRef.current, userMessage]
      const response = await axios.post(`${API_BASE_URL}/api/chat`, {
        message: content.trim(),
        conversationHistory: allMessagesForAPI.map(m => ({
          sender: m.sender,
          content: m.content,
          timestamp: m.timestamp.toISOString()
        }))
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      })
      
      if (!response.data || !response.data.response) {
        logger.error('Invalid response format:', response.data)
        throw new Error('Invalid response from server')
      }

      // Increment message count only after successful API response
      incrementMessageCount()

      const grumpMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.response,
        sender: 'grump',
        timestamp: new Date(response.data.timestamp)
      }

      setMessages(prev => {
        // Create a completely new array to ensure React detects the change
        const updated = Array.from(prev)
        updated.push(grumpMessage)
        // Save to localStorage for history
        saveSessionToHistory(updated)
        return updated
      })
    } catch (error: any) {
      logger.error('Error sending message:', error)
      logger.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config?.url
      })
      if (error.response?.status === 429) {
        setErrorMessage('Too many requests. Grump is tired. Try again later.')
      } else if (error.response?.status === 500) {
        setErrorMessage('Server error. Grump is having technical difficulties.')
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network')) {
        setErrorMessage('Network error. Check your connection and ensure the backend is running.')
      } else {
        setErrorMessage('An error occurred. Try again.')
      }
    } finally {
      setIsTyping(false)
      isSendingRef.current = false
    }
  }, [])

  const createNewSession = useCallback(() => {
    setMessages([])
    setErrorMessage(null)
  }, [])

  const retryLastMessage = useCallback(async () => {
    if (lastFailedMessage) {
      await sendMessage(lastFailedMessage)
    }
  }, [lastFailedMessage, sendMessage])

  const saveSessionToHistory = (messages: Message[]) => {
    if (messages.length === 0) return
    
    try {
      const session = {
        id: Date.now().toString(),
        messages: messages,
        updatedAt: new Date().toISOString()
      }
      
      const existing = localStorage.getItem('grumpSessions')
      const sessions = existing ? JSON.parse(existing) : []
      
      // Update or add session
      const index = sessions.findIndex((s: any) => s.id === session.id)
      if (index >= 0) {
        sessions[index] = session
      } else {
        sessions.unshift(session)
        // Keep only last 50 sessions
        if (sessions.length > 50) {
          sessions.pop()
        }
      }
      
      localStorage.setItem('grumpSessions', JSON.stringify(sessions))
    } catch (e) {
      logger.error('Error saving session:', e)
    }
  }

  // Create context value - memoized to prevent unnecessary re-renders
  // Only recreate when dependencies actually change
  const contextValue = useMemo(() => ({
    messages,
    isTyping,
    errorMessage,
    sendMessage,
    createNewSession,
    retryLastMessage,
    clearError
  }), [messages, isTyping, errorMessage, sendMessage, createNewSession, retryLastMessage, clearError])
  
  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within ChatProvider')
  }
  return context
}


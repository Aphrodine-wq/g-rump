import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import axios from 'axios'
import { canSendMessage, incrementMessageCount, getRemainingMessages } from '../config/pricing'

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
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null)
  
  // Expose setter for clearing error
  const clearError = useCallback(() => {
    setErrorMessage(null)
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return
    
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

    const userMessage: Message = {
      id: Date.now().toString(),
      content: trimmedContent,
      sender: 'user',
      timestamp: new Date()
    }

      setMessages(prev => {
        const updated = [...prev, userMessage]
        // Save to localStorage for history
        saveSessionToHistory(updated)
        return updated
      })
      
      setIsTyping(true)
      setErrorMessage(null)
      setLastFailedMessage(trimmedContent) // Store for retry

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat`, {
        message: content.trim(),
        conversationHistory: messages.map(m => ({
          sender: m.sender,
          content: m.content,
          timestamp: m.timestamp.toISOString()
        }))
      })

      // Increment message count only after successful API response
      incrementMessageCount()

      const grumpMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.response,
        sender: 'grump',
        timestamp: new Date(response.data.timestamp)
      }

      setMessages(prev => {
        const updated = [...prev, grumpMessage]
        // Save to localStorage for history
        saveSessionToHistory(updated)
        return updated
      })
    } catch (error: any) {
      console.error('Error sending message:', error)
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
    }
  }, [messages])

  const createNewSession = useCallback(() => {
    setMessages([])
    setErrorMessage(null)
  }, [])

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
      console.error('Error saving session:', e)
    }
  }

  return (
    <ChatContext.Provider value={{ messages, isTyping, errorMessage, sendMessage, createNewSession, retryLastMessage, clearError }}>
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


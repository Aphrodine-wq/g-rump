import { useState, useEffect } from 'react'
import './ChatHistoryView.css'

interface ChatSession {
  id: string
  messages: Array<{
    id: string
    content: string
    sender: 'user' | 'grump'
    timestamp: Date
  }>
  updatedAt: Date
}

export default function ChatHistoryView() {
  const [sessions, setSessions] = useState<ChatSession[]>([])

  useEffect(() => {
    // Load sessions from localStorage
    loadSessions()
  }, [])

  const loadSessions = () => {
    const stored = localStorage.getItem('grumpSessions')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setSessions(parsed.map((s: any) => ({
          ...s,
          updatedAt: new Date(s.updatedAt),
          messages: s.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        })))
      } catch (e) {
        console.error('Error loading sessions:', e)
      }
    }
  }

  const formatDate = (date: Date): string => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const sessionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    if (sessionDate.getTime() === today.getTime()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    } else if (sessionDate.getTime() === yesterday.getTime()) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
    }
  }

  const getPreviewText = (session: ChatSession): string => {
    if (session.messages.length === 0) return 'No messages'
    return session.messages[session.messages.length - 1].content
  }

  const handleSessionClick = (session: ChatSession) => {
    // Load session messages into chat
    // This would require updating the ChatStore to accept a session
    // For now, we'll show a message and the user can manually switch to chat tab
    console.log('Loading session:', session)
    // In a full implementation, you'd dispatch an action to load this session
  }

  if (sessions.length === 0) {
    return (
      <div className="chat-history-container">
        <div className="empty-history">
          <div className="empty-icon">📚</div>
          <h2>No Chat History</h2>
          <p>Start a conversation with Grump to see it here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-history-container">
      <div className="history-header">
        <h1>Chat History</h1>
      </div>
      
      <div className="history-list">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="history-item"
            onClick={() => handleSessionClick(session)}
          >
            <div className="history-content">
              <div className="history-title">Conversation</div>
              <div className="history-preview">{getPreviewText(session)}</div>
            </div>
            <div className="history-date">{formatDate(session.updatedAt)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}


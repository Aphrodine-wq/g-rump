import { EmotionalState } from '../store/AnimationStore'

export interface MessageAnalysis {
  emotionalState: EmotionalState | null
  sentimentScore: number
  keywordMatches: string[]
  isRepeatQuestion: boolean
  requiresSoftMode: boolean
}

/**
 * Context Awareness Service
 * Analyzes messages, time, session, and conversation history to trigger appropriate animations
 */
export class ContextAwarenessService {
  private conversationHistory: Array<{ sender: 'user' | 'grump'; content: string; timestamp: number }> = []
  private questionHistory: string[] = []
  private sessionStartTime: number = Date.now()

  /**
   * Analyze message content for emotional triggers
   */
  analyzeMessage(message: string): MessageAnalysis {
    const lowerMessage = message.toLowerCase()
    const keywordMatches: string[] = []
    let emotionalState: EmotionalState | null = null
    let sentimentScore = 0
    let requiresSoftMode = false

    // Keyword triggers for expressions
    const keywordMap: Record<string, EmotionalState> = {
      // Skeptical triggers
      'really?': 'skeptical',
      'seriously?': 'skeptical',
      'are you sure': 'skeptical',
      'that simple': 'skeptical',
      
      // Annoyed triggers
      'again': 'annoyed',
      'same thing': 'annoyed',
      'you just said': 'annoyed',
      'repeat': 'annoyed',
      
      // Suspicious triggers
      'you\'re great': 'suspicious',
      'i love you': 'suspicious',
      'you\'re amazing': 'suspicious',
      'thank you so much': 'suspicious',
      'compliment': 'suspicious',
      
      // Soft mode triggers (sensitive topics)
      'sad': 'softMode',
      'depressed': 'softMode',
      'anxious': 'softMode',
      'worried': 'softMode',
      'scared': 'softMode',
      'lonely': 'softMode',
      'struggling': 'softMode',
      'help me': 'softMode',
      'crisis': 'softMode',
      
      // Maximum grump triggers
      'monday': 'maximumGrump',
      'worst day': 'maximumGrump',
      'terrible': 'maximumGrump',
      'hate this': 'maximumGrump',
      'furious': 'furious',
      'angry': 'furious',

      // New Expanded Triggers
      'bored': 'bored',
      'boring': 'bored',
      'nothing to do': 'bored',
      
      'confused': 'confused',
      'what?': 'confused',
      'huh?': 'confused',
      'explain': 'confused',
      
      'yay': 'ecstatic',
      'awesome': 'ecstatic',
      'amazing': 'ecstatic',
      'best day': 'ecstatic',
      
      'omg': 'panicked',
      'help!': 'panicked',
      'broken': 'panicked',
      'crash': 'panicked',
      'emergency': 'panicked',
      
      'i did it': 'triumphant',
      'solved': 'triumphant',
      'fixed': 'triumphant',
      'winner': 'triumphant',
      
      'judge me': 'judging',
      'rate this': 'judging',
      'opinion': 'judging',
      
      'lol': 'mocking',
      'lmao': 'mocking',
      'funny': 'mocking',
      
      'yeah right': 'sarcastic',
      'sure': 'sarcastic',
      'whatever': 'sarcastic',
      
      'meh': 'deadpan',
      'okay': 'deadpan',
      'fine': 'deadpan',
      
      'coffee': 'caffeinated',
      'caffeine': 'caffeinated',
      'energy': 'wired',
      'fast': 'wired',
      
      'life': 'existentialDread',
      'meaning': 'existentialDread',
      'why are we here': 'existentialDread',
      'universe': 'kafkaesque',
      
      'calm': 'zen',
      'peace': 'zen',
      'relax': 'zen',

      // New Additions
      'slow': 'bored',
      'too slow': 'bored',
      'hurry': 'annoyed',
      'faster': 'wired',
      'joke': 'skeptical',
      'roast': 'mocking',
      'code': 'codeReview',
      'bug': 'debugMode',
      'fix': 'debugMode'
    }

    // Check for keyword matches
    for (const [keyword, state] of Object.entries(keywordMap)) {
      if (lowerMessage.includes(keyword)) {
        keywordMatches.push(keyword)
        if (!emotionalState) {
          emotionalState = state
        }
      }
    }

    // Sentiment analysis (simple keyword-based)
    const positiveWords = ['happy', 'great', 'good', 'awesome', 'wonderful', 'excited', 'love', 'thanks', 'thank you']
    const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'angry', 'frustrated', 'annoyed', 'worried', 'anxious']
    
    positiveWords.forEach(word => {
      if (lowerMessage.includes(word)) sentimentScore += 0.1
    })
    
    negativeWords.forEach(word => {
      if (lowerMessage.includes(word)) {
        sentimentScore -= 0.2
        if (word === 'sad' || word === 'depressed' || word === 'anxious' || word === 'worried') {
          requiresSoftMode = true
        }
      }
    })

    // Check for repeat questions
    const isRepeatQuestion = this.checkRepeatQuestion(message)

    // Determine if soft mode is needed
    if (sentimentScore < -0.3 || requiresSoftMode) {
      requiresSoftMode = true
      if (!emotionalState) {
        emotionalState = 'softMode'
      }
    }

    return {
      emotionalState,
      sentimentScore,
      keywordMatches,
      isRepeatQuestion,
      requiresSoftMode
    }
  }

  /**
   * Check if question has been asked before
   */
  private checkRepeatQuestion(message: string): boolean {
    const normalizedMessage = message.toLowerCase().trim()
    const isRepeat = this.questionHistory.some(q => {
      const similarity = this.calculateSimilarity(normalizedMessage, q)
      return similarity > 0.7
    })

    if (!isRepeat) {
      this.questionHistory.push(normalizedMessage)
      // Keep only last 10 questions
      if (this.questionHistory.length > 10) {
        this.questionHistory.shift()
      }
    }

    return isRepeat
  }

  /**
   * Simple similarity calculation (Jaccard similarity)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = new Set(str1.split(/\s+/))
    const words2 = new Set(str2.split(/\s+/))
    
    const intersection = new Set([...words1].filter(x => words2.has(x)))
    const union = new Set([...words1, ...words2])
    
    return intersection.size / union.size
  }

  /**
   * Get time-based context
   */
  getTimeContext(): {
    hour: number
    dayOfWeek: number
    is3AM: boolean
    isMonday: boolean
    timeBasedState: EmotionalState | null
  } {
    const now = new Date()
    const hour = now.getHours()
    const dayOfWeek = now.getDay()
    const is3AM = hour >= 2 && hour < 5
    const isMonday = dayOfWeek === 1

    let timeBasedState: EmotionalState | null = null

    if (is3AM) {
      timeBasedState = 'threeAM'
    } else if (isMonday && hour >= 8 && hour < 10) {
      // Monday morning
      timeBasedState = 'maximumGrump'
    } else if (hour >= 22 || hour < 6) {
      // Late night / early morning
      timeBasedState = 'sleepy'
    }

    return {
      hour,
      dayOfWeek,
      is3AM,
      isMonday,
      timeBasedState
    }
  }

  /**
   * Get session context
   */
  getSessionContext(): {
    sessionLength: number
    messageCount: number
    averageResponseTime: number
    sessionBasedState: EmotionalState | null
  } {
    const sessionLength = Date.now() - this.sessionStartTime
    const messageCount = this.conversationHistory.length
    const averageResponseTime = this.calculateAverageResponseTime()

    let sessionBasedState: EmotionalState | null = null

    // Session length effects
    if (sessionLength > 45 * 60 * 1000) {
      // 45+ minutes - "are you okay?"
      sessionBasedState = 'sleepy'
    } else if (sessionLength > 30 * 60 * 1000) {
      // 30+ minutes - getting tired
      sessionBasedState = 'sleepy'
    } else if (sessionLength < 5 * 60 * 1000) {
      // 0-5 minutes - fresh
      sessionBasedState = null
    }

    return {
      sessionLength,
      messageCount,
      averageResponseTime,
      sessionBasedState
    }
  }

  /**
   * Calculate average response time
   */
  private calculateAverageResponseTime(): number {
    if (this.conversationHistory.length < 2) return 0

    let totalTime = 0
    let count = 0

    for (let i = 1; i < this.conversationHistory.length; i++) {
      const prev = this.conversationHistory[i - 1]
      const curr = this.conversationHistory[i]

      if (prev.sender === 'user' && curr.sender === 'grump') {
        totalTime += curr.timestamp - prev.timestamp
        count++
      }
    }

    return count > 0 ? totalTime / count : 0
  }

  /**
   * Add message to conversation history
   */
  addMessage(sender: 'user' | 'grump', content: string): void {
    this.conversationHistory.push({
      sender,
      content,
      timestamp: Date.now()
    })

    // Keep only last 50 messages
    if (this.conversationHistory.length > 50) {
      this.conversationHistory.shift()
    }
  }

  /**
   * Get conversation patterns
   */
  getConversationPatterns(): {
    repeatQuestions: number
    sentimentTrajectory: number[]
    adviceFollowed: boolean
  } {
    const repeatQuestions = this.questionHistory.length - new Set(this.questionHistory).size
    const sentimentTrajectory: number[] = []
    let adviceFollowed = false

    // Analyze sentiment trajectory
    this.conversationHistory.forEach(msg => {
      if (msg.sender === 'user') {
        const analysis = this.analyzeMessage(msg.content)
        sentimentTrajectory.push(analysis.sentimentScore)
      }
    })

    // Check if user is following advice (simple heuristic)
    const grumpMessages = this.conversationHistory.filter(m => m.sender === 'grump')
    const userMessages = this.conversationHistory.filter(m => m.sender === 'user')
    
    if (grumpMessages.length > 0 && userMessages.length > 1) {
      // Check if user messages after grump's advice show positive sentiment
      // Find last grump message index (compatible with older JS)
      let lastGrumpIndex = -1
      for (let i = this.conversationHistory.length - 1; i >= 0; i--) {
        if (this.conversationHistory[i].sender === 'grump') {
          lastGrumpIndex = i
          break
        }
      }
      
      if (lastGrumpIndex >= 0 && lastGrumpIndex < this.conversationHistory.length - 1) {
        const nextUserMessage = this.conversationHistory[lastGrumpIndex + 1]
        if (nextUserMessage && nextUserMessage.sender === 'user') {
          const analysis = this.analyzeMessage(nextUserMessage.content)
          adviceFollowed = analysis.sentimentScore > 0.1
        }
      }
    }

    return {
      repeatQuestions,
      sentimentTrajectory,
      adviceFollowed
    }
  }

  /**
   * Reset session
   */
  resetSession(): void {
    this.sessionStartTime = Date.now()
    this.conversationHistory = []
    this.questionHistory = []
  }

  /**
   * Get recommended emotional state based on all context
   */
  getRecommendedState(message?: string): EmotionalState | null {
    const timeContext = this.getTimeContext()
    const sessionContext = this.getSessionContext()

    // Priority: time-based > message analysis > session-based
    if (timeContext.timeBasedState) {
      return timeContext.timeBasedState
    }

    if (message) {
      const analysis = this.analyzeMessage(message)
      if (analysis.emotionalState) {
        return analysis.emotionalState
      }
    }

    return sessionContext.sessionBasedState
  }
}

// Singleton instance
export const contextAwarenessService = new ContextAwarenessService()


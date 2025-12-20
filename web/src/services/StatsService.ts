/**
 * Stats Service
 * Tracks user stats using localStorage (SQLite equivalent for web)
 */

export interface UserStats {
  roastsReceived: number
  timesGrumpEndedChat: number
  sarcasmDetected: number // Percentage
  patienceLevel: 'critical' | 'low' | 'medium' | 'high'
  lastGripeDate: string // YYYY-MM-DD format
  lastGripeIndex: number
}

const STORAGE_KEY = 'grump_user_stats'

export class StatsService {
  private loadStats(): UserStats {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    return {
      roastsReceived: 0,
      timesGrumpEndedChat: 0,
      sarcasmDetected: 0,
      patienceLevel: 'critical' as const,
      lastGripeDate: '',
      lastGripeIndex: -1
    }
  }

  private saveStats(stats: UserStats): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  }

  incrementRoasts(): void {
    const stats = this.loadStats()
    stats.roastsReceived++
    this.saveStats(stats)
  }

  incrementGrumpEndedChat(): void {
    const stats = this.loadStats()
    stats.timesGrumpEndedChat++
    this.saveStats(stats)
  }

  updateSarcasmLevel(percentage: number): void {
    const stats = this.loadStats()
    // Average with existing (weighted average)
    stats.sarcasmDetected = Math.round((stats.sarcasmDetected * 0.7 + percentage * 0.3))
    this.saveStats(stats)
  }

  updatePatienceLevel(level: UserStats['patienceLevel']): void {
    const stats = this.loadStats()
    stats.patienceLevel = level
    this.saveStats(stats)
  }

  getAllStats(): UserStats {
    return this.loadStats()
  }

  // Calculate patience level based on interaction patterns
  calculatePatienceLevel(messageCount: number, sessionLength: number): UserStats['patienceLevel'] {
    // If user sends many messages quickly, patience is low
    const messagesPerMinute = messageCount / (sessionLength / 60000)
    
    if (messagesPerMinute > 10) return 'critical'
    if (messagesPerMinute > 5) return 'low'
    if (messagesPerMinute > 2) return 'medium'
    return 'high'
  }

  getPatienceEmoji(level: UserStats['patienceLevel']): string {
    switch (level) {
      case 'critical': return '🔴'
      case 'low': return '🟠'
      case 'medium': return '🟡'
      case 'high': return '🟢'
    }
  }
}

export const statsService = new StatsService()


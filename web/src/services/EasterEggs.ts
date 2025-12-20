import { EmotionalState } from '../store/AnimationStore'
import { contextAwarenessService } from './ContextAwareness'

export interface EasterEggTrigger {
  name: string
  condition: () => boolean
  state: EmotionalState
  particleType?: 'sleepZ' | 'confetti' | 'coffeeSteam' | 'angerParticle' | 'sparkle' | 'glitchRectangle' | null
  accessoryType?: 'coffeeMug' | 'partyHat' | null
  message?: string
}

/**
 * Easter Eggs Service
 * Handles all special easter egg triggers and conditions
 */
export class EasterEggsService {
  private lastInteractionTime: number = Date.now()
  private stareStartTime: number | null = null
  private heartEyesTriggered: boolean = false

  /**
   * Check for 3AM Grump
   */
  check3AMGrump(): EasterEggTrigger | null {
    const timeContext = contextAwarenessService.getTimeContext()
    
    if (timeContext.is3AM) {
      return {
        name: '3AM Grump',
        condition: () => timeContext.is3AM,
        state: 'threeAM',
        particleType: 'coffeeSteam',
        accessoryType: 'coffeeMug',
        message: "Why are either of us awake right now."
      }
    }
    
    return null
  }

  /**
   * Check for Birthday Grump
   */
  checkBirthdayGrump(userMessage?: string): EasterEggTrigger | null {
    if (!userMessage) return null
    
    const lowerMessage = userMessage.toLowerCase()
    const birthdayKeywords = ['birthday', 'born', 'birth date', 'my birthday is', 'turned']
    
    const hasBirthday = birthdayKeywords.some(keyword => lowerMessage.includes(keyword))
    
    if (hasBirthday) {
      return {
        name: 'Birthday Grump',
        condition: () => true,
        state: 'birthday',
        particleType: 'confetti',
        accessoryType: 'partyHat',
        message: "Fine. Happy birthday. I guess."
      }
    }
    
    return null
  }

  /**
   * Check for Shake to Wake
   */
  checkShakeToWake(): EasterEggTrigger | null {
    // Device shake detection (if supported)
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      // This would be handled by device motion event listeners
      // For now, return null as it requires device API
      return null
    }
    
    return null
  }

  /**
   * Check for The Stare (30+ second stalemate)
   */
  checkTheStare(): EasterEggTrigger | null {
    const now = Date.now()
    const timeSinceLastInteraction = now - this.lastInteractionTime
    
    if (timeSinceLastInteraction > 30000) { // 30 seconds
      if (!this.stareStartTime) {
        this.stareStartTime = now
      }
      
      const stareDuration = now - (this.stareStartTime || now)
      
      if (stareDuration > 30000) {
        return {
          name: 'The Stare',
          condition: () => true,
          state: 'idle',
          message: "..."
        }
      }
    } else {
      this.stareStartTime = null
    }
    
    return null
  }

  /**
   * Check for Love Confession
   */
  checkLoveConfession(userMessage: string): EasterEggTrigger | null {
    const lowerMessage = userMessage.toLowerCase()
    const loveKeywords = ['i love you', 'love you', 'i\'m in love', 'i love grump']
    
    const hasLove = loveKeywords.some(keyword => lowerMessage.includes(keyword))
    
    if (hasLove) {
      return {
        name: 'Love Confession',
        condition: () => true,
        state: 'suspicious',
        message: "That's concerning."
      }
    }
    
    return null
  }

  /**
   * Check for Heart Eyes (0.1% chance)
   */
  checkHeartEyes(): EasterEggTrigger | null {
    if (this.heartEyesTriggered) return null
    
    if (Math.random() < 0.001) { // 0.1% chance
      this.heartEyesTriggered = true
      
      // Reset after 5 seconds
      setTimeout(() => {
        this.heartEyesTriggered = false
      }, 5000)
      
      return {
        name: 'Heart Eyes',
        condition: () => true,
        state: 'impressed',
        particleType: 'sparkle',
        message: "..."
      }
    }
    
    return null
  }

  /**
   * Check for Monday Morning
   */
  checkMondayMorning(): EasterEggTrigger | null {
    const timeContext = contextAwarenessService.getTimeContext()
    
    if (timeContext.isMonday && timeContext.hour >= 8 && timeContext.hour < 10) {
      return {
        name: 'Monday Morning',
        condition: () => true,
        state: 'maximumGrump',
        message: "My condolences. It's Monday."
      }
    }
    
    return null
  }

  /**
   * Update last interaction time
   */
  updateInteraction(): void {
    this.lastInteractionTime = Date.now()
    this.stareStartTime = null
  }

  /**
   * Check all easter eggs and return the first match
   */
  checkAllEasterEggs(userMessage?: string): EasterEggTrigger | null {
    // Priority order
    const checks = [
      () => this.checkMondayMorning(),
      () => this.check3AMGrump(),
      () => userMessage ? this.checkBirthdayGrump(userMessage) : null,
      () => userMessage ? this.checkLoveConfession(userMessage) : null,
      () => this.checkTheStare(),
      () => this.checkHeartEyes(),
    ]

    for (const check of checks) {
      const result = check()
      if (result) {
        return result
      }
    }

    return null
  }

  /**
   * Reset all easter egg states
   */
  reset(): void {
    this.lastInteractionTime = Date.now()
    this.stareStartTime = null
    this.heartEyesTriggered = false
  }
}

// Singleton instance
export const easterEggsService = new EasterEggsService()


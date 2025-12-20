import { useEffect, useCallback } from 'react'
import { useAnimation, BlinkType } from '../store/AnimationStore'

/**
 * Blink System Hook
 * Manages all 6 blink types with expression-specific frequency modifiers
 */
export function useBlinkSystem() {
  const { state, triggerBlink } = useAnimation()

  // Expression-specific blink frequency modifiers
  const getBlinkFrequency = useCallback((): number => {
    const baseInterval = 3000 + Math.random() * 3000 // 3-6 seconds
    
    switch (state.currentState) {
      case 'sleepy':
      case 'softMode':
        return baseInterval * 1.5 // Slower blinks
      case 'annoyed':
      case 'maximumGrump':
        return baseInterval * 0.7 // More frequent blinks
      case 'processing':
      case 'thinkingDeep':
        return baseInterval * 0.8
      case 'sleep':
        return baseInterval * 3.0 // Very slow
      default:
        return baseInterval
    }
  }, [state.currentState])

  // Determine blink type based on state
  const getBlinkTypeForState = useCallback((): BlinkType => {
    switch (state.currentState) {
      case 'sleepy':
      case 'softMode':
        return 'slow'
      case 'annoyed':
        return 'heavy'
      case 'skeptical':
        return 'half'
      case 'impressed':
        // Rare wink (0.1% chance)
        if (Math.random() < 0.001) {
          return 'wink'
        }
        return 'standard'
      case 'sleep':
        return 'slow'
      default:
        return 'standard'
    }
  }, [state.currentState])

  // Auto-blink system
  useEffect(() => {
    if (state.isBlinking) return

    const interval = setInterval(() => {
      const blinkType = getBlinkTypeForState()
      triggerBlink(blinkType)
    }, getBlinkFrequency())

    return () => clearInterval(interval)
  }, [state.isBlinking, state.currentState, getBlinkFrequency, getBlinkTypeForState, triggerBlink])

  // Quick double-blink for surprise reactions
  const triggerSurpriseBlink = useCallback(() => {
    triggerBlink('quickDouble')
  }, [triggerBlink])

  // Heavy blink for annoyed states
  const triggerAnnoyedBlink = useCallback(() => {
    triggerBlink('heavy')
  }, [triggerBlink])

  // Slow blink for sleepy/soft states
  const triggerSlowBlink = useCallback(() => {
    triggerBlink('slow')
  }, [triggerBlink])

  // Half blink for skepticism
  const triggerSkepticalBlink = useCallback(() => {
    triggerBlink('half')
  }, [triggerBlink])

  // Rare wink
  const triggerWink = useCallback(() => {
    triggerBlink('wink')
  }, [triggerBlink])

  return {
    currentBlinkType: state.blinkType,
    isBlinking: state.isBlinking,
    triggerSurpriseBlink,
    triggerAnnoyedBlink,
    triggerSlowBlink,
    triggerSkepticalBlink,
    triggerWink
  }
}


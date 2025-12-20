import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export type EmotionalState = 
  | 'idle' | 'listening' | 'processing' | 'responding'
  | 'skeptical' | 'annoyed' | 'impressed' | 'suspicious'
  | 'softMode' | 'maximumGrump' | 'sleepy' | 'error'
  | 'thinkingDeep' | 'smug' | 'exasperatedSigh' | 'reluctantAgreement'
  | 'sleep' | 'jumpscare' | 'birthday' | 'threeAM'

export type BlinkType = 'standard' | 'slow' | 'heavy' | 'quickDouble' | 'half' | 'wink'
export type ParticleType = 'sleepZ' | 'confetti' | 'coffeeSteam' | 'angerParticle' | 'sparkle' | 'glitchRectangle' | null
export type AccessoryType = 'coffeeMug' | 'partyHat' | null
export type MouthState = 'flat' | 'frown' | 'slightFrown' | 'smirk' | 'open' | 'pursed' | 'tight' | 'almostSmile' | 'part' | 'muttering' | 'exaggeratedFrown' | 'neutral' | 'wavy'
export type GlowColor = 'red' | 'orange' | 'soft' | 'intense'

export interface MicroMovementState {
  pupilDrift: { x: number; y: number }
  eyebrowAdjust: { left: { rotation: number; y: number }; right: { rotation: number; y: number } }
  headTilt: number
  mouthMovement: { width: number; depth: number }
}

export interface ContextState {
  time: { hour: number; dayOfWeek: number; is3AM: boolean; isMonday: boolean }
  sessionLength: number
  messageCount: number
  lastMessageTime: number
  conversationHistory: Array<{ sender: 'user' | 'grump'; content: string; timestamp: number }>
  detectedPatterns: {
    repeatQuestions: number
    sentimentScore: number
    keywordMatches: string[]
  }
}

export interface AnimationState {
  // Core state
  currentState: EmotionalState
  lastStateChange: number
  
  // Blink system
  isBlinking: boolean
  blinkType: BlinkType
  blinkTimer: number
  
  // Face component states - full control
  leftEyebrowRotation: number
  rightEyebrowRotation: number
  leftEyebrowY: number
  rightEyebrowY: number
  leftEyebrowX: number
  rightEyebrowX: number
  
  // Eye scales (separate X and Y for deformation)
  leftEyeScaleX: number
  leftEyeScaleY: number
  rightEyeScaleX: number
  rightEyeScaleY: number
  
  // Pupil states
  leftPupilX: number
  leftPupilY: number
  leftPupilSize: number
  rightPupilX: number
  rightPupilY: number
  rightPupilSize: number
  
  // Eyelid positions
  leftEyelidTopY: number
  rightEyelidTopY: number
  leftEyelidBottomY: number
  rightEyelidBottomY: number
  
  // Mouth state
  mouthState: MouthState
  mouthWidth: number
  mouthHeight: number
  mouthCurveDepth: number
  
  // Glow ring
  glowIntensity: number
  glowPulseRate: number
  glowColor: GlowColor
  
  // Breathing
  breathingScale: number
  
  // Special animations
  eyeRollActive: boolean
  eyeRollProgress: number
  screenShake: boolean
  screenShakeIntensity: number
  
  // Particles and accessories
  particleType: ParticleType
  showAccessories: boolean
  accessoryType: AccessoryType
  
  // Micro-movements
  microMovementState: MicroMovementState
  
  // Context awareness
  contextState: ContextState
  
  // Idle tracking
  idleTime: number
}

interface AnimationContextType {
  state: AnimationState
  transitionToState: (newState: EmotionalState) => void
  triggerBlink: (type?: BlinkType) => void
  updateEyeTracking: (position: number) => void
  triggerEyeRoll: (variation?: 'full' | 'half' | 'double' | 'slow' | 'quick') => void
  triggerScreenShake: (intensity?: number) => void
  setParticleType: (type: ParticleType) => void
  setAccessory: (type: AccessoryType) => void
  updateContext: (updates: Partial<ContextState>) => void
  updateMicroMovements: (movements: Partial<MicroMovementState>) => void
}

const initialState: AnimationState = {
  currentState: 'idle',
  lastStateChange: Date.now(),
  isBlinking: false,
  blinkType: 'standard',
  blinkTimer: 0,
  leftEyebrowRotation: -5,
  rightEyebrowRotation: 5,
  leftEyebrowY: 0,
  rightEyebrowY: 0,
  leftEyebrowX: 0,
  rightEyebrowX: 0,
  leftEyeScaleX: 1.0,
  leftEyeScaleY: 1.0,
  rightEyeScaleX: 1.0,
  rightEyeScaleY: 1.0,
  leftPupilX: 0,
  leftPupilY: 0,
  leftPupilSize: 12.0,
  rightPupilX: 0,
  rightPupilY: 0,
  rightPupilSize: 12.0,
  leftEyelidTopY: -24,
  rightEyelidTopY: -24,
  leftEyelidBottomY: 20,
  rightEyelidBottomY: 20,
  mouthState: 'flat',
  mouthWidth: 40.0,
  mouthHeight: 2.0,
  mouthCurveDepth: 0.0,
  glowIntensity: 0.4,
  glowPulseRate: 2.0,
  glowColor: 'red',
  breathingScale: 1.0,
  eyeRollActive: false,
  eyeRollProgress: 0,
  screenShake: false,
  screenShakeIntensity: 0.5,
  particleType: null,
  showAccessories: false,
  accessoryType: null,
  microMovementState: {
    pupilDrift: { x: 0, y: 0 },
    eyebrowAdjust: { left: { rotation: 0, y: 0 }, right: { rotation: 0, y: 0 } },
    headTilt: 0,
    mouthMovement: { width: 0, depth: 0 }
  },
  contextState: {
    time: {
      hour: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      is3AM: new Date().getHours() >= 2 && new Date().getHours() < 5,
      isMonday: new Date().getDay() === 1
    },
    sessionLength: 0,
    messageCount: 0,
    lastMessageTime: Date.now(),
    conversationHistory: [],
    detectedPatterns: {
      repeatQuestions: 0,
      sentimentScore: 0,
      keywordMatches: []
    }
  },
  idleTime: 0
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined)

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AnimationState>(initialState)

  // Breathing animation
  useEffect(() => {
    let animationFrame: number
    let startTime = Date.now()

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      const breathingCycle = Math.sin(elapsed * (Math.PI / 3.0)) // 3s cycle
      setState(prev => ({
        ...prev,
        breathingScale: 1.0 + (breathingCycle * 0.02)
      }))
      animationFrame = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  // Blink timer
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        blinkTimer: (prev.blinkTimer + 16) % 4000
      }))
    }, 16)
    return () => clearInterval(interval)
  }, [])

  // Auto-blink
  useEffect(() => {
    const interval = setInterval(() => {
      if (!state.isBlinking && Math.random() > 0.7) {
        triggerBlink()
      }
    }, 3000 + Math.random() * 3000)

    return () => clearInterval(interval)
  }, [state.isBlinking])

  // Update context time
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setState(prev => ({
        ...prev,
        contextState: {
          ...prev.contextState,
          time: {
            hour: now.getHours(),
            dayOfWeek: now.getDay(),
            is3AM: now.getHours() >= 2 && now.getHours() < 5,
            isMonday: now.getDay() === 1
          },
          sessionLength: Date.now() - (prev.contextState.lastMessageTime || Date.now())
        },
        idleTime: Date.now() - prev.lastStateChange
      }))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const transitionToState = useCallback((newState: EmotionalState) => {
    setState(prev => {
      const newStateConfig = getStateConfig(newState)
      return {
        ...prev,
        currentState: newState,
        lastStateChange: Date.now(),
        ...newStateConfig
      }
    })
  }, [])

  const triggerBlink = useCallback((type: BlinkType = 'standard') => {
    const durations: Record<BlinkType, number> = {
      standard: 150,
      slow: 400,
      heavy: 600,
      quickDouble: 250,
      half: 100,
      wink: 200
    }

    setState(prev => ({ ...prev, isBlinking: true, blinkType: type }))
    setTimeout(() => {
      setState(prev => ({ ...prev, isBlinking: false }))
    }, durations[type])
  }, [])

  const updateEyeTracking = useCallback((position: number) => {
    setState(prev => ({
      ...prev,
      leftPupilX: Math.max(-6, Math.min(6, position)),
      rightPupilX: Math.max(-6, Math.min(6, position))
    }))
  }, [])

  const triggerEyeRoll = useCallback((variation: 'full' | 'half' | 'double' | 'slow' | 'quick' = 'full') => {
    setState(prev => ({ ...prev, eyeRollActive: true, eyeRollProgress: 0 }))
    
    const duration = variation === 'slow' ? 2000 : variation === 'quick' ? 500 : 1000
    const steps = 60
    const stepDuration = duration / steps
    
    let progress = 0
    const interval = setInterval(() => {
      progress += 1 / steps
      setState(prev => ({ ...prev, eyeRollProgress: progress }))
      
      if (progress >= 1) {
        clearInterval(interval)
        setState(prev => ({ ...prev, eyeRollActive: false, eyeRollProgress: 0 }))
      }
    }, stepDuration)
  }, [])

  const triggerScreenShake = useCallback((intensity: number = 0.5) => {
    setState(prev => ({ ...prev, screenShake: true, screenShakeIntensity: intensity }))
    setTimeout(() => {
      setState(prev => ({ ...prev, screenShake: false }))
    }, 300)
  }, [])

  const setParticleType = useCallback((type: ParticleType) => {
    setState(prev => ({ ...prev, particleType: type }))
  }, [])

  const setAccessory = useCallback((type: AccessoryType) => {
    setState(prev => ({
      ...prev,
      showAccessories: type !== null,
      accessoryType: type
    }))
  }, [])

  const updateContext = useCallback((updates: Partial<ContextState>) => {
    setState(prev => ({
      ...prev,
      contextState: { ...prev.contextState, ...updates }
    }))
  }, [])

  const updateMicroMovements = useCallback((movements: Partial<MicroMovementState>) => {
    setState(prev => ({
      ...prev,
      microMovementState: { ...prev.microMovementState, ...movements }
    }))
  }, [])

  return (
    <AnimationContext.Provider value={{
      state,
      transitionToState,
      triggerBlink,
      updateEyeTracking,
      triggerEyeRoll,
      triggerScreenShake,
      setParticleType,
      setAccessory,
      updateContext,
      updateMicroMovements
    }}>
      {children}
    </AnimationContext.Provider>
  )
}

export function useAnimation() {
  const context = useContext(AnimationContext)
  if (!context) {
    throw new Error('useAnimation must be used within AnimationProvider')
  }
  return context
}

function getStateConfig(state: EmotionalState): Partial<AnimationState> {
  const configs: Record<EmotionalState, Partial<AnimationState>> = {
    idle: {
      leftEyebrowRotation: -5,
      rightEyebrowRotation: 5,
      mouthState: 'flat',
      glowIntensity: 0.4,
      glowPulseRate: 2.0,
      glowColor: 'red'
    },
    listening: {
      leftEyebrowRotation: -3,
      rightEyebrowRotation: 3,
      mouthState: 'open',
      glowIntensity: 0.6,
      glowPulseRate: 1.0,
      glowColor: 'orange'
    },
    processing: {
      leftEyebrowRotation: -12,
      rightEyebrowRotation: 12,
      mouthState: 'pursed',
      glowIntensity: 0.5,
      glowPulseRate: 1.5,
      glowColor: 'orange'
    },
    responding: {
      leftEyebrowRotation: -5,
      rightEyebrowRotation: 5,
      mouthState: 'open',
      glowIntensity: 0.3,
      glowPulseRate: 2.0,
      glowColor: 'red'
    },
    skeptical: {
      leftEyebrowRotation: -5,
      rightEyebrowRotation: -18,
      mouthState: 'smirk',
      glowIntensity: 0.4,
      glowPulseRate: 1.5,
      glowColor: 'red'
    },
    annoyed: {
      leftEyebrowRotation: -18,
      rightEyebrowRotation: 18,
      mouthState: 'tight',
      glowIntensity: 0.6,
      glowPulseRate: 1.2,
      glowColor: 'red'
    },
    maximumGrump: {
      leftEyebrowRotation: -25,
      rightEyebrowRotation: 25,
      mouthState: 'exaggeratedFrown',
      glowIntensity: 0.8,
      glowPulseRate: 0.8,
      glowColor: 'intense'
    },
    impressed: {
      leftEyebrowRotation: 2,
      rightEyebrowRotation: -2,
      mouthState: 'almostSmile',
      glowIntensity: 0.5,
      glowPulseRate: 1.8,
      glowColor: 'orange'
    },
    suspicious: {
      leftEyebrowRotation: -20,
      rightEyebrowRotation: -8,
      mouthState: 'tight',
      glowIntensity: 0.4,
      glowPulseRate: 1.8,
      glowColor: 'red'
    },
    softMode: {
      leftEyebrowRotation: 5,
      rightEyebrowRotation: -5,
      mouthState: 'flat',
      glowIntensity: 0.2,
      glowPulseRate: 2.5,
      glowColor: 'soft'
    },
    sleepy: {
      leftEyebrowRotation: 8,
      rightEyebrowRotation: -8,
      mouthState: 'flat',
      glowIntensity: 0.2,
      glowPulseRate: 4.0,
      glowColor: 'soft'
    },
    error: {
      leftEyebrowRotation: -10,
      rightEyebrowRotation: 15,
      mouthState: 'frown',
      glowIntensity: 0.6,
      glowPulseRate: 0.5,
      glowColor: 'intense'
    },
    thinkingDeep: {
      leftEyebrowRotation: -15,
      rightEyebrowRotation: 15,
      mouthState: 'pursed',
      glowIntensity: 0.5,
      glowPulseRate: 1.2,
      glowColor: 'orange'
    },
    smug: {
      leftEyebrowRotation: -5,
      rightEyebrowRotation: -20,
      mouthState: 'smirk',
      glowIntensity: 0.5,
      glowPulseRate: 1.5,
      glowColor: 'red'
    },
    exasperatedSigh: {
      leftEyebrowRotation: -8,
      rightEyebrowRotation: 8,
      mouthState: 'open',
      glowIntensity: 0.4,
      glowPulseRate: 2.0,
      glowColor: 'red'
    },
    reluctantAgreement: {
      leftEyebrowRotation: -3,
      rightEyebrowRotation: 3,
      mouthState: 'flat',
      glowIntensity: 0.3,
      glowPulseRate: 2.0,
      glowColor: 'red'
    },
    sleep: {
      leftEyebrowRotation: 10,
      rightEyebrowRotation: -10,
      mouthState: 'flat',
      glowIntensity: 0.1,
      glowPulseRate: 5.0,
      glowColor: 'soft'
    },
    jumpscare: {
      leftEyebrowRotation: 0,
      rightEyebrowRotation: 0,
      mouthState: 'open',
      glowIntensity: 0.8,
      glowPulseRate: 0.3,
      glowColor: 'intense'
    },
    birthday: {
      leftEyebrowRotation: -15,
      rightEyebrowRotation: 15,
      mouthState: 'tight',
      glowIntensity: 0.5,
      glowPulseRate: 1.5,
      glowColor: 'orange'
    },
    threeAM: {
      leftEyebrowRotation: 5,
      rightEyebrowRotation: -5,
      mouthState: 'flat',
      glowIntensity: 0.2,
      glowPulseRate: 3.0,
      glowColor: 'soft'
    }
  }

  return configs[state] || configs.idle
}

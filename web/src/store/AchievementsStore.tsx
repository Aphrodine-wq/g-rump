import { createContext, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react'
import { MessageAnalysis } from '../services/ContextAwareness'
import { useAnimation } from './AnimationStore'

type UnlockId =
  | 'eyeRoll_full'
  | 'eyeRoll_double'
  | 'screenShake_intense'
  | 'rage_glow'
  | 'messageSlam_enhanced'
  | 'theme_dark'
  | 'theme_midnight'

interface Unlockable {
  id: UnlockId
  name: string
  minAnnoyance: number
  prerequisites?: UnlockId[]
}

interface AchievementsState {
  unlocked: UnlockId[]
  xp: number
  level: number
}

interface RecordArgs {
  analysis: MessageAnalysis
  content: string
}

interface UnlockInfo {
  id: UnlockId
  name: string
}

interface AchievementsContext {
  state: AchievementsState
  recordInteraction: (args: RecordArgs) => UnlockInfo[]
  reset: () => void
}

const STORAGE_KEY = 'grump_achievements_v2'

const AVAILABLE: Unlockable[] = [
  { id: 'eyeRoll_full', name: 'Eye Roll (Full)', minAnnoyance: 20 },
  { id: 'messageSlam_enhanced', name: 'Message Slam (Enhanced)', minAnnoyance: 40 },
  { id: 'eyeRoll_double', name: 'Eye Roll (Double)', minAnnoyance: 50, prerequisites: ['eyeRoll_full'] },
  { id: 'screenShake_intense', name: 'Screen Shake (Intense)', minAnnoyance: 60 },
  { id: 'rage_glow', name: 'Rage Glow', minAnnoyance: 80 },
]

function load(): AchievementsState {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) return JSON.parse(raw)
  return { unlocked: [], xp: 0, level: 1 }
}

function save(state: AchievementsState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const Ctx = createContext<AchievementsContext | undefined>(undefined)

export function AchievementsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AchievementsState>(() => load())
  const savingRef = useRef<number | null>(null)
  const { state: animationState, transitionToState } = useAnimation()

  useEffect(() => {
    if (savingRef.current) clearTimeout(savingRef.current)
    savingRef.current = window.setTimeout(() => save(state), 150)
    return () => {
      if (savingRef.current) clearTimeout(savingRef.current)
    }
  }, [state])
  
  // Calculate annoyance from animation state (heuristic)
  const annoyanceLevel = useMemo(() => {
     switch(animationState.currentState) {
         case 'maximumGrump': return 100
         case 'furious': return 90
         case 'error': return 80
         case 'annoyed': return 60
         case 'skeptical': return 30
         case 'suspicious': return 40
         default: return 0
     }
  }, [animationState.currentState])

  // Sync unlocks with Annoyance Level
  useEffect(() => {
    const newlyUnlocked: UnlockId[] = []
    const unlockedSet = new Set(state.unlocked)

    for (const item of AVAILABLE) {
      if (unlockedSet.has(item.id)) continue
      const prereqsOk = (item.prerequisites || []).every(p => unlockedSet.has(p))
      if (annoyanceLevel >= item.minAnnoyance && prereqsOk) {
        unlockedSet.add(item.id)
        newlyUnlocked.push(item.id)
      }
    }

    if (newlyUnlocked.length > 0) {
      setState(prev => ({ ...prev, unlocked: Array.from(unlockedSet) }))
    }
  }, [annoyanceLevel, state.unlocked])

  const recordInteraction = ({ analysis }: RecordArgs): UnlockInfo[] => {
    // Calculate XP
    let xpGain = 10
    if (analysis.emotionalState === 'annoyed') xpGain += 5
    if (analysis.emotionalState === 'maximumGrump') xpGain += 20
    
    // Level up logic
    const newXp = state.xp + xpGain
    const newLevel = Math.floor(newXp / 100) + 1

    setState(prev => ({
      ...prev,
      xp: newXp,
      level: newLevel
    }))

    return [] 
  }

  const reset = () => {
    setState({ unlocked: [], xp: 0, level: 1 })
    transitionToState('idle')
  }

  const value = useMemo(() => ({ state, recordInteraction, reset }), [state, recordInteraction])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAchievements() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAchievements must be used within AchievementsProvider')
  return ctx
}

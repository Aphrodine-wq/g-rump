import { useAnimation, EmotionalState } from '../store/AnimationStore'
import { useAchievements } from '../store/AchievementsStore'

export default function AngerMeter() {
  const { state: animationState } = useAnimation()
  const { state: achievementState } = useAchievements()
  
  // Derive annoyance percentage from emotional state
  const getAnnoyanceLevel = (state: EmotionalState): number => {
    switch (state) {
      case 'idle': return 0
      case 'softMode': return 0
      case 'ecstatic': return 0
      case 'impressed': return 10
      case 'thinkingDeep': return 20
      case 'skeptical': return 30
      case 'suspicious': return 40
      case 'annoyed': return 60
      case 'exasperatedSigh': return 70
      case 'maximumGrump': return 100
      case 'error': return 80
      default: return 0
    }
  }

  const pct = getAnnoyanceLevel(animationState.currentState)

  // Only show if anger > 0
  if (pct === 0) return null

  // Minimalist colors
  const color =
    pct < 25 ? '#34c759' : // Green
    pct < 50 ? '#ff9500' : // Orange
    pct < 75 ? '#ff3b30' : // Red
    '#af52de'              // Purple (Max)

  return (
    <div
      title={`Current Annoyance: ${pct}%`}
      style={{
        position: 'absolute',
        top: 20,
        right: 20,
        padding: '8px 16px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: 999,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
      }}
    >
      <div style={{ 
        fontSize: '0.85rem', 
        fontWeight: 600, 
        color: '#1d1d1f',
        letterSpacing: '-0.01em'
      }}>
        Grump Level
      </div>
      
      <div style={{ 
        width: 100, 
        height: 6, 
        background: '#f5f5f7', 
        borderRadius: 999, 
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{ 
          width: `${pct}%`, 
          height: '100%', 
          background: color, 
          borderRadius: 999, 
          transition: 'width 0.5s cubic-bezier(0.25, 1, 0.5, 1)' 
        }} />
      </div>

      <div style={{ 
        fontSize: '0.75rem', 
        color: '#86868b', 
        fontWeight: 500,
        minWidth: 60,
        textAlign: 'right'
      }}>
        Lvl {achievementState.level}
      </div>
    </div>
  )
}

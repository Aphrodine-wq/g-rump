import { motion } from 'framer-motion'
import { useAnimation } from '../store/AnimationStore'
import { useBlinkSystem } from '../hooks/useBlinkSystem'
import { useEyeRollAnimation } from './animations/EyeRollAnimation'
import ParticleEffects from './ParticleEffects'
import './GrumpFaceRig.css'

interface GrumpFaceRigProps {
  size?: number
}

/**
 * Full Face Rig Component
 * Complete control over all face components with animations
 */
export default function GrumpFaceRig({ size = 180 }: GrumpFaceRigProps) {
  const { state } = useAnimation()
  const { isBlinking, currentBlinkType } = useBlinkSystem()
  const { 
    isActive: eyeRollActive, 
    progress: eyeRollProgress, 
    getPupilPosition, 
    getEyelidPositions, 
    getEyebrowPositions, 
    getHeadTilt 
  } = useEyeRollAnimation()

  // Calculate eye scale based on blink
  const getEyeScaleY = (eye: 'left' | 'right') => {
    if (!isBlinking) return 1
    
    // Wink only affects one eye
    if (currentBlinkType === 'wink' && eye === 'right') return 1
    
    switch (currentBlinkType) {
      case 'slow':
        return 0.05
      case 'heavy':
        return 0.02
      case 'half':
        return 0.5
      default:
        return 0.1
    }
  }

  // Get pupil position (with eye roll support)
  const getPupilPos = (eye: 'left' | 'right') => {
    if (eyeRollActive) {
      const rollPos = getPupilPosition(eyeRollProgress, 'full')
      return {
        x: eye === 'left' ? state.leftPupilX + rollPos.x : state.rightPupilX + rollPos.x,
        y: eye === 'left' ? state.leftPupilY + rollPos.y : state.rightPupilY + rollPos.y
      }
    }
    return {
      x: eye === 'left' ? state.leftPupilX : state.rightPupilX,
      y: eye === 'left' ? state.leftPupilY : state.rightPupilY
    }
  }

  // Get eyelid positions (with eye roll support)
  const getEyelidPos = () => {
    if (eyeRollActive) {
      return getEyelidPositions(eyeRollProgress)
    }
    return {
      top: state.leftEyelidTopY,
      bottom: state.leftEyelidBottomY
    }
  }

  // Get eyebrow positions (with eye roll support)
  const getEyebrowPos = () => {
    if (eyeRollActive) {
      return getEyebrowPositions(eyeRollProgress)
    }
    return {
      leftRotation: state.leftEyebrowRotation,
      rightRotation: state.rightEyebrowRotation,
      leftY: state.leftEyebrowY,
      rightY: state.rightEyebrowY
    }
  }

  // Get head tilt (with eye roll support)
  const headTilt = eyeRollActive ? getHeadTilt(eyeRollProgress) : state.microMovementState.headTilt

  // Get glow color value
  const getGlowColor = (): string => {
    switch (state.glowColor) {
      case 'red':
        return 'rgba(255, 107, 107, 0.6)'
      case 'orange':
        return 'rgba(255, 165, 0, 0.6)'
      case 'soft':
        return 'rgba(255, 255, 255, 0.3)'
      case 'intense':
        return 'rgba(255, 0, 0, 0.9)'
      default:
        return 'rgba(255, 107, 107, 0.6)'
    }
  }

  // Get mouth path based on state
  const getMouthPath = (): string => {
    const baseX = 40
    const baseY = 58
    const width = state.mouthWidth + state.microMovementState.mouthMovement.width
    const height = state.mouthHeight + state.microMovementState.mouthMovement.depth
    const curve = state.mouthCurveDepth

    switch (state.mouthState) {
      case 'frown':
        return `M ${baseX - width/2} ${baseY} Q ${baseX} ${baseY + height + curve}, ${baseX + width/2} ${baseY}`
      case 'exaggeratedFrown':
        return `M ${baseX - width/2} ${baseY} Q ${baseX} ${baseY + height + curve * 1.5}, ${baseX + width/2} ${baseY}`
      case 'smirk':
        return `M ${baseX - width/2} ${baseY} Q ${baseX - width/4} ${baseY - height}, ${baseX + width/2} ${baseY}`
      case 'open':
        return `M ${baseX - width/2} ${baseY} Q ${baseX} ${baseY - height}, ${baseX + width/2} ${baseY}`
      case 'pursed':
        return `M ${baseX - width/2} ${baseY} Q ${baseX} ${baseY + height/2}, ${baseX + width/2} ${baseY}`
      case 'tight':
        return `M ${baseX - width/2} ${baseY} Q ${baseX} ${baseY + height}, ${baseX + width/2} ${baseY}`
      case 'almostSmile':
        return `M ${baseX - width/2} ${baseY} Q ${baseX} ${baseY - height - curve}, ${baseX + width/2} ${baseY}`
      case 'part':
        return `M ${baseX - width/2} ${baseY} Q ${baseX} ${baseY - height/2}, ${baseX + width/2} ${baseY}`
      case 'muttering':
        return `M ${baseX - width/2} ${baseY} Q ${baseX - width/4} ${baseY + height}, ${baseX + width/4} ${baseY + height}, ${baseX + width/2} ${baseY}`
      case 'wavy':
        return `M ${baseX - width/2} ${baseY} Q ${baseX - width/4} ${baseY - height}, ${baseX} ${baseY + height}, ${baseX + width/4} ${baseY - height}, ${baseX + width/2} ${baseY}`
      default: // flat, neutral, slightFrown
        return `M ${baseX - width/2} ${baseY} Q ${baseX} ${baseY + height}, ${baseX + width/2} ${baseY}`
    }
  }

  return (
    <motion.div
      className="grump-face-rig-container"
      style={{ width: size, height: size }}
      animate={{
        scale: state.breathingScale,
        rotateZ: headTilt,
      }}
      transition={{
        scale: { duration: 0.1, ease: 'linear' },
        rotateZ: { duration: 0.3, ease: 'easeInOut' }
      }}
    >
      {/* Glass container */}
      <div className="grump-glass-container">
        {/* Animated accent gradient border */}
        <motion.div
          className="grump-accent-border"
          animate={{
            opacity: state.currentState === 'processing' ? [0.15, 0.25, 0.15] : 0.1,
            borderColor: getGlowColor()
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Tech grid pattern */}
        <motion.div 
          className="grump-tech-grid"
          animate={{
            opacity: [0.03, 0.05, 0.03]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, var(--accent) 2px, var(--accent) 4px)',
            backgroundSize: '8px 8px',
          }} 
        />
        
        {/* Glow ring */}
        <motion.div
          className="grump-glow-ring"
          animate={{
            opacity: state.glowIntensity,
            scale: [1, 1 + (state.glowPulseRate * 0.05), 1]
          }}
          transition={{
            opacity: { duration: 0.3 },
            scale: {
              duration: 1 / state.glowPulseRate,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          }}
          style={{
            borderColor: getGlowColor(),
            boxShadow: `0 0 ${20 * state.glowIntensity}px ${getGlowColor()}`
          }}
        />
        
        {/* Face elements */}
        <div className="grump-face-inner">
          <svg 
            width={size * 0.7} 
            height={size * 0.7} 
            viewBox="0 0 80 80" 
            fill="none"
            className="grump-face-svg"
          >
            {/* Left eyebrow */}
            <motion.g
              style={{
                transform: `translate(${state.leftEyebrowX}px, ${getEyebrowPos().leftY + state.microMovementState.eyebrowAdjust.left.y}px)`,
                transformOrigin: '25px 28px'
              }}
              animate={{
                rotate: getEyebrowPos().leftRotation + state.microMovementState.eyebrowAdjust.left.rotation
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <line 
                x1="18" 
                y1="28" 
                x2="32" 
                y2="28" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round"
              />
            </motion.g>
            
            {/* Right eyebrow */}
            <motion.g
              style={{
                transform: `translate(${state.rightEyebrowX}px, ${getEyebrowPos().rightY + state.microMovementState.eyebrowAdjust.right.y}px)`,
                transformOrigin: '55px 28px'
              }}
              animate={{
                rotate: getEyebrowPos().rightRotation + state.microMovementState.eyebrowAdjust.right.rotation
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <line 
                x1="62" 
                y1="28" 
                x2="48" 
                y2="28" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round"
              />
            </motion.g>
            
            {/* Left eye */}
            <g>
              {/* Eyelid top */}
              <motion.rect
                x="15"
                y={getEyelidPos().top}
                width="20"
                height="15"
                fill="var(--bg)"
                animate={{
                  y: isBlinking ? 25 : getEyelidPos().top
                }}
                transition={{ duration: 0.15 }}
              />
              
              {/* Eye */}
              <motion.ellipse
                cx="25"
                cy="40"
                rx={state.leftEyeScaleX * 4}
                ry={state.leftEyeScaleY * 4 * getEyeScaleY('left')}
                fill="currentColor"
                animate={{
                  scaleX: state.leftEyeScaleX,
                  scaleY: state.leftEyeScaleY * getEyeScaleY('left')
                }}
              />
              
              {/* Pupil */}
              <motion.circle
                cx={25 + getPupilPos('left').x + state.microMovementState.pupilDrift.x}
                cy={40 + getPupilPos('left').y + state.microMovementState.pupilDrift.y}
                r={state.leftPupilSize / 2}
                fill="currentColor"
                animate={{
                  cx: 25 + getPupilPos('left').x + state.microMovementState.pupilDrift.x,
                  cy: 40 + getPupilPos('left').y + state.microMovementState.pupilDrift.y
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
              
              {/* Eyelid bottom */}
              <motion.rect
                x="15"
                y={getEyelidPos().bottom}
                width="20"
                height="15"
                fill="var(--bg)"
                animate={{
                  y: isBlinking ? 35 : getEyelidPos().bottom
                }}
                transition={{ duration: 0.15 }}
              />
            </g>
            
            {/* Right eye */}
            <g>
              {/* Eyelid top */}
              <motion.rect
                x="45"
                y={getEyelidPos().top}
                width="20"
                height="15"
                fill="var(--bg)"
                animate={{
                  y: isBlinking && currentBlinkType !== 'wink' ? 25 : getEyelidPos().top
                }}
                transition={{ duration: 0.15 }}
              />
              
              {/* Eye */}
              <motion.ellipse
                cx="55"
                cy="40"
                rx={state.rightEyeScaleX * 4}
                ry={state.rightEyeScaleY * 4 * getEyeScaleY('right')}
                fill="currentColor"
                animate={{
                  scaleX: state.rightEyeScaleX,
                  scaleY: state.rightEyeScaleY * getEyeScaleY('right')
                }}
              />
              
              {/* Pupil */}
              <motion.circle
                cx={55 + getPupilPos('right').x + state.microMovementState.pupilDrift.x}
                cy={40 + getPupilPos('right').y + state.microMovementState.pupilDrift.y}
                r={state.rightPupilSize / 2}
                fill="currentColor"
                animate={{
                  cx: 55 + getPupilPos('right').x + state.microMovementState.pupilDrift.x,
                  cy: 40 + getPupilPos('right').y + state.microMovementState.pupilDrift.y
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
              
              {/* Eyelid bottom */}
              <motion.rect
                x="45"
                y={getEyelidPos().bottom}
                width="20"
                height="15"
                fill="var(--bg)"
                animate={{
                  y: isBlinking && currentBlinkType !== 'wink' ? 35 : getEyelidPos().bottom
                }}
                transition={{ duration: 0.15 }}
              />
            </g>
            
            {/* Mouth */}
            <motion.path
              d={getMouthPath()}
              stroke={state.currentState === 'annoyed' || state.currentState === 'maximumGrump' ? 'var(--error)' : 'currentColor'}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              animate={{
                d: getMouthPath(),
                pathLength: [0, 1]
              }}
              transition={{
                d: { type: 'spring', stiffness: 500, damping: 20 },
                pathLength: { duration: 0.3 }
              }}
            />
          </svg>
          
          {/* Accessories */}
          {state.showAccessories && state.accessoryType && (
            <div className="grump-accessory">
              {state.accessoryType === 'coffeeMug' && (
                <div className="accessory coffee-mug">☕</div>
              )}
              {state.accessoryType === 'partyHat' && (
                <div className="accessory party-hat">🎩</div>
              )}
            </div>
          )}
          
          {/* Processing indicator */}
          {state.currentState === 'processing' && (
            <motion.div
              className="grump-processing-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="grump-processing-dot"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Particle Effects */}
      <ParticleEffects />
    </motion.div>
  )
}


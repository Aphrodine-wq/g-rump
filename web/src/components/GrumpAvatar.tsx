import { motion } from 'framer-motion'
import { AnimationState } from '../store/AnimationStore'
import './GrumpAvatar.css'

interface GrumpAvatarProps {
  state: AnimationState
  breathingScale: number
}

export default function GrumpAvatar({ state, breathingScale }: GrumpAvatarProps) {
  const glowColor = getGlowColor(state.glowColor)
  const glowOpacity = state.glowIntensity * (0.85 + Math.sin(Date.now() / 1000 * state.glowPulseRate) * 0.15)

  return (
    <div className="grump-avatar-container">
      {/* Mood Glow Ring */}
      <motion.div
        className="mood-glow-outer"
        style={{
          borderColor: glowColor,
          opacity: glowOpacity * 0.4
        }}
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 1 / state.glowPulseRate,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="mood-glow-inner"
        style={{
          borderColor: glowColor,
          opacity: glowOpacity * 0.6
        }}
        animate={{
          scale: [1, 1.01, 1],
        }}
        transition={{
          duration: 1 / state.glowPulseRate,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Face Base */}
      <motion.div
        className="face-base"
        animate={{
          scale: breathingScale
        }}
        transition={{
          duration: 0.1,
          ease: "linear"
        }}
      >
        {/* Eyes */}
        <div className="eyes-container">
          <div className="eye left-eye">
            <div 
              className="pupil"
              style={{
                transform: `translate(${state.leftPupilX * 2}px, ${state.leftPupilY * 2}px)`,
                opacity: state.isBlinking ? 0 : 1
              }}
            />
            {state.isBlinking && <div className="eyelid" />}
          </div>
          <div className="eye right-eye">
            <div 
              className="pupil"
              style={{
                transform: `translate(${state.rightPupilX * 2}px, ${state.rightPupilY * 2}px)`,
                opacity: state.isBlinking ? 0 : 1
              }}
            />
            {state.isBlinking && <div className="eyelid" />}
          </div>
        </div>

        {/* Eyebrows */}
        <div className="eyebrows-container">
          <div 
            className="eyebrow left-eyebrow"
            style={{
              transform: `rotate(${state.leftEyebrowRotation}deg)`
            }}
          />
          <div 
            className="eyebrow right-eyebrow"
            style={{
              transform: `rotate(${state.rightEyebrowRotation}deg)`
            }}
          />
        </div>

        {/* Mouth */}
        <div className="mouth-container">
          <MouthShape state={state.mouthState} />
        </div>
      </motion.div>
    </div>
  )
}

function MouthShape({ state }: { state: string }) {
  const mouthPaths: Record<string, string> = {
    flat: 'M -20 18 L 20 18',
    frown: 'M -20 18 Q 0 30 20 18',
    smirk: 'M -20 18 Q 2 14 20 16',
    open: 'M -6 18 A 6 4 0 0 1 6 18',
    pursed: 'M -8 18 A 8 3 0 0 1 8 18',
    tight: 'M -15 18 L 15 18',
    almostSmile: 'M -20 18 Q 0 12 20 18'
  }

  return (
    <svg width="40" height="40" viewBox="-20 -20 40 40" className="mouth-svg">
      <path
        d={mouthPaths[state] || mouthPaths.flat}
        stroke="var(--grump-text-primary)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

function getGlowColor(color: string): string {
  const colors: Record<string, string> = {
    red: '#FF6B6B',
    orange: '#FF8C42',
    soft: '#6B9BD1',
    intense: '#FF0000'
  }
  return colors[color] || colors.red
}


// G-Rump Avatar optimized for 200fps animations
// Uses requestAnimationFrame with high-frequency updates

import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'
import { AnimationState } from '../store/AnimationStore'
import './GrumpAvatar200fps.css'

interface GrumpAvatar200fpsProps {
  state: AnimationState
  breathingScale: number
  size?: 'small' | 'medium' | 'large'
}

export default function GrumpAvatar200fps({ 
  state, 
  breathingScale,
  size = 'medium'
}: GrumpAvatar200fpsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [frameCount, setFrameCount] = useState(0)
  const lastTimeRef = useRef(0)
  const targetFPS = 200
  const frameTime = 1000 / targetFPS // 5ms per frame

  // High-frequency animation loop for 200fps
  useAnimationFrame((time) => {
    if (time - lastTimeRef.current >= frameTime) {
      setFrameCount(prev => prev + 1)
      lastTimeRef.current = time
    }
  })

  // Blinking animation (random intervals, 200fps smooth)
  const [isBlinking, setIsBlinking] = useState(false)
  const blinkIntervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 2000 + Math.random() * 3000 // 2-5 seconds
      blinkIntervalRef.current = setTimeout(() => {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 100) // Blink duration
        scheduleBlink()
      }, delay)
    }
    scheduleBlink()
    return () => {
      if (blinkIntervalRef.current) clearTimeout(blinkIntervalRef.current)
    }
  }, [])

  // Eye tracking (smooth at 200fps)
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = (e.clientX - centerX) / rect.width
      const deltaY = (e.clientY - centerY) / rect.height
      
      // Smooth interpolation for 200fps
      setEyePosition(prev => ({
        x: prev.x + (deltaX * 0.3 - prev.x) * 0.1,
        y: prev.y + (deltaY * 0.3 - prev.y) * 0.1
      }))
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const glowColor = getGlowColor(state.glowColor)
  const glowOpacity = state.glowIntensity * (0.85 + Math.sin(frameCount * 0.01) * 0.15)

  // Size classes
  const sizeClass = `grump-avatar-${size}`

  return (
    <div 
      ref={containerRef}
      className={`grump-avatar-200fps ${sizeClass}`}
      style={{ 
        '--glow-color': glowColor,
        '--glow-opacity': glowOpacity,
      } as React.CSSProperties}
    >
      {/* Mood Glow Ring - 200fps smooth */}
      <motion.div
        className="mood-glow-outer"
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 1 / state.glowPulseRate,
          repeat: Infinity,
          ease: "easeInOut",
          type: "tween"
        }}
        style={{
          willChange: 'transform',
        }}
      />
      <motion.div
        className="mood-glow-inner"
        animate={{
          scale: [1, 1.01, 1],
        }}
        transition={{
          duration: 1 / state.glowPulseRate,
          repeat: Infinity,
          ease: "easeInOut",
          type: "tween"
        }}
        style={{
          willChange: 'transform',
        }}
      />

      {/* Face Base - 200fps breathing */}
      <motion.div
        className="face-base"
        animate={{
          scale: breathingScale
        }}
        transition={{
          duration: 0.005, // 5ms = 200fps
          ease: "linear",
          type: "tween"
        }}
        style={{
          willChange: 'transform',
        }}
      >
        {/* Eyes Container */}
        <div className="eyes-container">
          {/* Left Eye */}
          <div className="eye left-eye">
            <motion.div 
              className="pupil"
              animate={{
                x: (state.leftPupilX + eyePosition.x) * 8,
                y: (state.leftPupilY + eyePosition.y) * 8,
                opacity: (isBlinking || state.isBlinking) ? 0 : 1
              }}
              transition={{
                duration: 0.005, // 200fps
                ease: "linear",
                type: "tween"
              }}
              style={{
                willChange: 'transform, opacity',
              }}
            />
            {(isBlinking || state.isBlinking) && (
              <motion.div 
                className="eyelid"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 0.05 }}
              />
            )}
          </div>

          {/* Right Eye */}
          <div className="eye right-eye">
            <motion.div 
              className="pupil"
              animate={{
                x: (state.rightPupilX + eyePosition.x) * 8,
                y: (state.rightPupilY + eyePosition.y) * 8,
                opacity: (isBlinking || state.isBlinking) ? 0 : 1
              }}
              transition={{
                duration: 0.005, // 200fps
                ease: "linear",
                type: "tween"
              }}
              style={{
                willChange: 'transform, opacity',
              }}
            />
            {(isBlinking || state.isBlinking) && (
              <motion.div 
                className="eyelid"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 0.05 }}
              />
            )}
          </div>
        </div>

        {/* Eyebrows - 200fps smooth */}
        <div className="eyebrows-container">
          <motion.div 
            className="eyebrow left-eyebrow"
            animate={{
              rotate: state.leftEyebrowRotation
            }}
            transition={{
              duration: 0.005, // 200fps
              ease: "linear",
              type: "tween"
            }}
            style={{
              willChange: 'transform',
            }}
          />
          <motion.div 
            className="eyebrow right-eyebrow"
            animate={{
              rotate: state.rightEyebrowRotation
            }}
            transition={{
              duration: 0.005, // 200fps
              ease: "linear",
              type: "tween"
            }}
            style={{
              willChange: 'transform',
            }}
          />
        </div>

        {/* Mouth - 200fps smooth */}
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
    almostSmile: 'M -20 18 Q 0 12 20 18',
    smile: 'M -20 18 Q 0 8 20 18',
    bigSmile: 'M -20 18 Q 0 4 20 18',
  }

  return (
    <motion.svg 
      width="40" 
      height="40" 
      viewBox="-20 -20 40 40" 
      className="mouth-svg"
      animate={{
        d: mouthPaths[state] || mouthPaths.flat
      }}
      transition={{
        duration: 0.005, // 200fps
        ease: "linear",
        type: "tween"
      }}
      style={{
        willChange: 'd',
      }}
    >
      <motion.path
        d={mouthPaths[state] || mouthPaths.flat}
        stroke="#1a1a1a"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        animate={{
          pathLength: 1,
        }}
        transition={{
          duration: 0.005, // 200fps
          ease: "linear",
          type: "tween"
        }}
      />
    </motion.svg>
  )
}

function getGlowColor(color: string): string {
  const colors: Record<string, string> = {
    red: '#FF6B6B',
    orange: '#FF8C42',
    soft: '#6B9BD1',
    intense: '#FF0000',
    blue: '#3B82F6',
    green: '#10B981',
  }
  return colors[color] || colors.soft
}


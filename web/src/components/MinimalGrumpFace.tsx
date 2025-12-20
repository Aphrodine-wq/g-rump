import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './MinimalGrumpFace.css'

interface MinimalGrumpFaceProps {
  mood?: 'neutral' | 'typing' | 'annoyed'
  size?: number
}

export default function MinimalGrumpFace({ mood = 'annoyed', size = 120 }: MinimalGrumpFaceProps) {
  const [blinkTimer, setBlinkTimer] = useState(0)
  const isProcessing = mood === 'typing'
  const isIdle = mood === 'neutral' || mood === 'annoyed'

  // Blink animation timer
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkTimer(prev => (prev + 16) % 4000) // 4s cycle
    }, 16)
    return () => clearInterval(interval)
  }, [])

  // Get blink state (blinks for 100ms every 4s)
  const getBlinkState = (timer: number) => {
    const cycle = timer % 4000
    return cycle > 3800 && cycle < 3900 ? 0.1 : 1
  }

  // Pissed off look - more furrowed brows, deeper frown
  const eyeOffset = mood === 'typing' ? 1 : mood === 'annoyed' ? -2 : -2
  const browAngle = mood === 'annoyed' ? 20 : mood === 'typing' ? 12 : 18
  const eyeSize = mood === 'annoyed' ? 3.5 : mood === 'typing' ? 4 : 3.5
  const mouthPath = mood === 'typing' 
    ? "M 28 58 Q 40 54, 52 58"
    : mood === 'annoyed'
    ? "M 26 60 Q 40 56, 54 60"
    : "M 26 60 Q 40 56, 54 60"

  const blinkScale = getBlinkState(blinkTimer)

  return (
    <motion.div
      className="grump-avatar-container"
      style={{ width: size, height: size }}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        rotateX: -2,
      }}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: isIdle ? [1, 1.02, 1] : 1,
        rotateY: isIdle ? [0, 1, 0] : 0,
        rotateX: isIdle ? [0, -0.5, 0] : 0,
      }}
      transition={{
        duration: 3,
        repeat: isIdle ? Infinity : 0,
        ease: 'easeInOut',
      }}
    >
      {/* Glass container */}
      <div className="grump-glass-container">
        {/* Animated accent gradient border - very subtle */}
        <motion.div
          className="grump-accent-border"
          animate={{
            opacity: isProcessing ? [0.15, 0.25, 0.15] : 0.1,
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Tech grid pattern (subtle) */}
        <div 
          className="grump-tech-grid"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, var(--accent) 2px, var(--accent) 4px)',
            backgroundSize: '8px 8px',
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
            {/* Left eye */}
            <g 
              style={{ 
                transform: `translateY(${eyeOffset}px)`, 
                transition: 'transform 0.3s ease' 
              }}
            >
              {/* Brow */}
              <line 
                x1="18" 
                y1="28" 
                x2="32" 
                y2={28 + browAngle} 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round"
                style={{ transition: 'all 0.3s ease' }}
              />
              {/* Eye */}
              <motion.circle 
                cx="25" 
                cy="40" 
                r={eyeSize} 
                fill={isProcessing ? 'var(--accent)' : 'currentColor'}
                animate={{ 
                  scaleY: blinkScale,
                }}
                transition={{ duration: 0.12, ease: 'easeInOut' }}
              />
            </g>
            
            {/* Right eye */}
            <g 
              style={{ 
                transform: `translateY(${eyeOffset}px)`, 
                transition: 'transform 0.3s ease' 
              }}
            >
              {/* Brow */}
              <line 
                x1="62" 
                y1="28" 
                x2="48" 
                y2={28 + browAngle} 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round"
                style={{ transition: 'all 0.3s ease' }}
              />
              {/* Eye */}
              <motion.circle 
                cx="55" 
                cy="40" 
                r={eyeSize} 
                fill="currentColor"
                animate={{ scaleY: blinkScale }}
                transition={{ duration: 0.12, ease: 'easeInOut' }}
              />
            </g>
            
            {/* Mouth - pissed off frown */}
            <motion.path 
              d={mouthPath}
              stroke={mood === 'annoyed' ? 'var(--error)' : 'currentColor'}
              strokeWidth="3" 
              strokeLinecap="round"
              fill="none"
              animate={{
                opacity: mood === 'typing' ? 0.5 : 1,
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            />
          </svg>
          
          {/* Processing indicator (three dots) */}
          <AnimatePresence>
            {isProcessing && (
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
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}


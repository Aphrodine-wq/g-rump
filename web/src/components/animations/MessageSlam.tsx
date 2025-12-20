import { useState, useEffect, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface MessageSlamProps {
  children: ReactNode
  isGrumpMessage: boolean
}

/**
 * Message Slam Animation
 * Grump messages slam in from left with screen shake on impact
 */
export default function MessageSlam({ children, isGrumpMessage }: MessageSlamProps) {
  if (!isGrumpMessage) {
    // User messages slide in from right with bounce
    return (
      <motion.div
        initial={{ opacity: 0, x: 50, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          duration: 0.3
        }}
      >
        {children}
      </motion.div>
    )
  }

  // Grump messages slam from left
  return (
    <motion.div
      initial={{ opacity: 0, x: -100, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        scale: [0.8, 1.1, 1],
        rotate: [0, -2, 2, 0]
      }}
      transition={{
        x: { duration: 0.4, ease: 'easeOut' },
        scale: { 
          duration: 0.4,
          times: [0, 0.5, 1],
          ease: 'easeOut'
        },
        rotate: {
          duration: 0.4,
          times: [0, 0.3, 0.6, 1]
        }
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Character-by-character streaming effect
 */
export function useCharacterStreaming(
  text: string,
  speed: number = 30, // ms per character
  onComplete?: () => void
): { displayedText: string; isComplete: boolean } {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!text) {
      setDisplayedText('')
      setIsComplete(false)
      return
    }

    setDisplayedText('')
    setIsComplete(false)
    let currentIndex = 0
    let stream: ReturnType<typeof setInterval> | null = null

    const addNextChar = () => {
      if (currentIndex >= text.length) {
        if (stream) clearInterval(stream)
        setIsComplete(true)
        onComplete?.()
        return
      }

      const char = text[currentIndex]
      setDisplayedText(prev => prev + char)
      currentIndex++

      // Check for punctuation holds
      if (char === '.' || char === '!' || char === '?') {
        if (stream) clearInterval(stream)
        setTimeout(() => {
          stream = setInterval(addNextChar, speed)
        }, 100) // Hold for 100ms after punctuation
      } else if (currentIndex >= 3 && text.substring(currentIndex - 3, currentIndex) === '...') {
        // Ellipsis hold
        if (stream) clearInterval(stream)
        setTimeout(() => {
          stream = setInterval(addNextChar, speed)
        }, 300) // Hold for 300ms after ellipsis
      }
    }

    stream = setInterval(addNextChar, speed)

    return () => {
      if (stream) clearInterval(stream)
    }
  }, [text, speed, onComplete])

  return { displayedText, isComplete }
}


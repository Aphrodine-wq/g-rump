import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useAnimation } from '../../store/AnimationStore'

interface ScreenShakeProps {
  children: ReactNode
}

/**
 * Screen Shake Component
 * Applies shake animation to entire app container
 * Triggered by Maximum Grump and Message Slam
 */
export default function ScreenShake({ children }: ScreenShakeProps) {
  const { state } = useAnimation()

  return (
    <motion.div
      animate={{
        x: state.screenShake ? [0, -0.5, 0.5, -0.5, 0.5, 0] : 0,
        y: state.screenShake ? [0, 0.5, -0.5, 0.5, -0.5, 0] : 0,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      }}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </motion.div>
  )
}


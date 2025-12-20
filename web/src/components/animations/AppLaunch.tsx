import { useState, useEffect, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useAnimation } from '../../store/AnimationStore'
import GrumpFaceRig from '../GrumpFaceRig'
import './AppLaunch.css'

interface AppLaunchProps {
  children: ReactNode
  onComplete: () => void
}

type LaunchStage = 'darkness' | 'eyesAppear' | 'eyesOpen' | 'faceReveals' | 'uiSlides' | 'complete'

/**
 * App Launch Sequence (1800ms)
 * 5-stage sequence: Darkness → Eyes Appear → Eyes Open → Face Reveals → UI Slides Up
 */
export default function AppLaunch({ children, onComplete }: AppLaunchProps) {
  const [stage, setStage] = useState<LaunchStage>('darkness')
  const { transitionToState } = useAnimation()

  useEffect(() => {
    // Stage 1: Darkness (0-300ms)
    const timer1 = setTimeout(() => {
      setStage('eyesAppear')
    }, 300)

    // Stage 2: Eyes Appear (300-700ms)
    const timer2 = setTimeout(() => {
      setStage('eyesOpen')
    }, 700)

    // Stage 3: Eyes Open (700-1000ms)
    const timer3 = setTimeout(() => {
      setStage('faceReveals')
    }, 1000)

    // Stage 4: Face Reveals (1000-1400ms)
    const timer4 = setTimeout(() => {
      setStage('uiSlides')
    }, 1400)

    // Stage 5: UI Slides Up (1400-1800ms)
    const timer5 = setTimeout(() => {
      setStage('complete')
      transitionToState('idle')
      onComplete()
    }, 1800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearTimeout(timer5)
    }
  }, [transitionToState, onComplete])

  if (stage === 'complete') {
    return <>{children}</>
  }

  return (
    <div className="app-launch-container">
      {/* Stage 1: Darkness */}
      {stage === 'darkness' && (
        <motion.div
          className="launch-stage darkness"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Stage 2: Eyes Appear */}
      {stage === 'eyesAppear' && (
        <motion.div
          className="launch-stage eyes-appear"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="launch-eyes"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="eye-pupil left" />
            <div className="eye-pupil right" />
          </motion.div>
        </motion.div>
      )}

      {/* Stage 3: Eyes Open */}
      {stage === 'eyesOpen' && (
        <motion.div
          className="launch-stage eyes-open"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="launch-eyes"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="eye-pupil left" />
            <div className="eye-pupil right" />
            <motion.div
              className="eyelid top"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="eyelid bottom"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Stage 4: Face Reveals */}
      {stage === 'faceReveals' && (
        <motion.div
          className="launch-stage face-reveals"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
              duration: 0.4
            }}
          >
            <GrumpFaceRig size={180} />
          </motion.div>
        </motion.div>
      )}

      {/* Stage 5: UI Slides Up */}
      {stage === 'uiSlides' && (
        <motion.div
          className="launch-stage ui-slides"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
            duration: 0.4
          }}
        >
          <GrumpFaceRig size={180} />
          <motion.div
            className="launch-ui-content"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}


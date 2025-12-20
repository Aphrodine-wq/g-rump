import { useEffect } from 'react'
import { useAnimation } from '../store/AnimationStore'
import { pupilNoise, eyebrowNoise, headNoise, mouthNoise, getMicroMovement, getMicroMovement2D } from '../utils/PerlinNoise'

/**
 * Micro-Movement Hook
 * Generates natural, organic micro-movements using Perlin noise
 * - Pupil drift: ±2pt, 5s cycle
 * - Eyebrow micro-adjust: ±1° rotation, ±1pt Y, 8s cycle
 * - Head micro-tilt: ±0.5°, 10s cycle
 * - Mouth micro-movement: ±1pt width, ±0.5pt depth, 6s cycle
 */
export function useMicroMovements() {
  const { state, updateMicroMovements } = useAnimation()

  useEffect(() => {
    let startTime = Date.now()
    let animationFrame: number

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000

      // Only run micro-movements when idle or in appropriate states
      const shouldRunMicroMovements = 
        state.currentState === 'idle' ||
        state.currentState === 'listening' ||
        state.currentState === 'responding' ||
        state.currentState === 'softMode'

      if (!shouldRunMicroMovements) {
        // Reset micro-movements
        updateMicroMovements({
          pupilDrift: { x: 0, y: 0 },
          eyebrowAdjust: { left: { rotation: 0, y: 0 }, right: { rotation: 0, y: 0 } },
          headTilt: 0,
          mouthMovement: { width: 0, depth: 0 }
        })
        animationFrame = requestAnimationFrame(animate)
        return
      }

      // Pupil drift: ±2pt, 5s cycle
      const pupilDrift = getMicroMovement2D(pupilNoise, elapsed, 0.2, 2.0)

      // Eyebrow micro-adjust: ±1° rotation, ±1pt Y, 8s cycle
      const eyebrowLeftRotation = getMicroMovement(eyebrowNoise, elapsed, 0.125, 1.0)
      const eyebrowLeftY = getMicroMovement(eyebrowNoise, elapsed + 1, 0.125, 1.0)
      const eyebrowRightRotation = getMicroMovement(eyebrowNoise, elapsed + 2, 0.125, 1.0)
      const eyebrowRightY = getMicroMovement(eyebrowNoise, elapsed + 3, 0.125, 1.0)

      // Head micro-tilt: ±0.5°, 10s cycle
      const headTilt = getMicroMovement(headNoise, elapsed, 0.1, 0.5)

      // Mouth micro-movement: ±1pt width, ±0.5pt depth, 6s cycle
      const mouthWidth = getMicroMovement(mouthNoise, elapsed, 0.167, 1.0)
      const mouthDepth = getMicroMovement(mouthNoise, elapsed + 1, 0.167, 0.5)

      // Update micro-movements in store
      updateMicroMovements({
        pupilDrift,
        eyebrowAdjust: {
          left: { rotation: eyebrowLeftRotation, y: eyebrowLeftY },
          right: { rotation: eyebrowRightRotation, y: eyebrowRightY }
        },
        headTilt,
        mouthMovement: { width: mouthWidth, depth: mouthDepth }
      })
      
      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [state.currentState, updateMicroMovements])
}


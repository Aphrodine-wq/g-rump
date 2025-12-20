import { useAnimation } from '../../store/AnimationStore'

type EyeRollVariation = 'full' | 'half' | 'double' | 'slow' | 'quick'

/**
 * Eye Roll Animation Component
 * Handles full 360° pupil path, eyelid behavior, eyebrow accompaniment
 * Variations: full, half, double, slow, quick
 */
export function useEyeRollAnimation() {
  const { state } = useAnimation()

  // Calculate pupil position for eye roll
  const getPupilPosition = (_progress: number, variation: EyeRollVariation = 'full'): { x: number; y: number } => {
    if (!state.eyeRollActive) {
      return { x: state.leftPupilX, y: state.leftPupilY }
    }

    const normalizedProgress = state.eyeRollProgress
    let angle: number

    switch (variation) {
      case 'half':
        angle = normalizedProgress * Math.PI // 180°
        break
      case 'double':
        angle = normalizedProgress * Math.PI * 4 // 2 full rotations
        break
      case 'slow':
        angle = normalizedProgress * Math.PI * 2 // Full rotation, slower
        break
      case 'quick':
        angle = normalizedProgress * Math.PI * 2 // Full rotation, faster
        break
      default: // full
        angle = normalizedProgress * Math.PI * 2 // 360°
    }

    // Circular path within eye bounds (radius of 4pt)
    const radius = 4
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    return { x, y }
  }

  // Calculate eyelid positions during eye roll
  const getEyelidPositions = (progress: number): {
    top: number
    bottom: number
  } => {
    if (!state.eyeRollActive) {
      return { top: state.leftEyelidTopY, bottom: state.leftEyelidBottomY }
    }

    // Eyelids rise during upward phase, squint during peak, relax on way down
    const phase = progress % 1
    let topY: number
    let bottomY: number

    if (phase < 0.25) {
      // Rising phase
      topY = -24 + (phase * 4 * 10) // Rise up
      bottomY = 20 - (phase * 4 * 5)
    } else if (phase < 0.5) {
      // Peak phase - squint
      topY = -14
      bottomY = 15
    } else if (phase < 0.75) {
      // Relaxing phase
      topY = -14 - ((phase - 0.5) * 4 * 10)
      bottomY = 15 + ((phase - 0.5) * 4 * 5)
    } else {
      // Return to normal
      topY = -24
      bottomY = 20
    }

    return { top: topY, bottom: bottomY }
  }

  // Calculate eyebrow positions during eye roll
  const getEyebrowPositions = (progress: number): {
    leftRotation: number
    rightRotation: number
    leftY: number
    rightY: number
  } => {
    if (!state.eyeRollActive) {
      return {
        leftRotation: state.leftEyebrowRotation,
        rightRotation: state.rightEyebrowRotation,
        leftY: state.leftEyebrowY,
        rightY: state.rightEyebrowY
      }
    }

    const phase = progress % 1
    const baseRotation = state.leftEyebrowRotation
    const baseY = state.leftEyebrowY

    // Eyebrows raise during upward phase, furrow at peak, settle
    if (phase < 0.3) {
      // Raise
      return {
        leftRotation: baseRotation - (phase / 0.3) * 5,
        rightRotation: state.rightEyebrowRotation - (phase / 0.3) * 5,
        leftY: baseY - (phase / 0.3) * 2,
        rightY: state.rightEyebrowY - (phase / 0.3) * 2
      }
    } else if (phase < 0.6) {
      // Furrow at peak
      return {
        leftRotation: baseRotation - 5,
        rightRotation: state.rightEyebrowRotation - 5,
        leftY: baseY - 2,
        rightY: state.rightEyebrowY - 2
      }
    } else {
      // Settle back
      const settlePhase = (phase - 0.6) / 0.4
      return {
        leftRotation: baseRotation - 5 + (settlePhase * 5),
        rightRotation: state.rightEyebrowRotation - 5 + (settlePhase * 5),
        leftY: baseY - 2 + (settlePhase * 2),
        rightY: state.rightEyebrowY - 2 + (settlePhase * 2)
      }
    }
  }

  // Calculate head tilt during eye roll
  const getHeadTilt = (progress: number): number => {
    if (!state.eyeRollActive) return 0

    const phase = progress % 1
    // Head tilts -2° during upward phase
    if (phase < 0.3) {
      return -(phase / 0.3) * 2
    } else if (phase < 0.6) {
      return -2
    } else {
      const settlePhase = (phase - 0.6) / 0.4
      return -2 + (settlePhase * 2)
    }
  }

  return {
    isActive: state.eyeRollActive,
    progress: state.eyeRollProgress,
    getPupilPosition,
    getEyelidPositions,
    getEyebrowPositions,
    getHeadTilt
  }
}


// Wrapper component that bridges existing AnimationStore with new 200fps avatar
// Ensures compatibility with existing system

import { useEffect, useRef } from 'react'
import GrumpAvatar200fps from './GrumpAvatar200fps'
import { useAnimation } from '../store/AnimationStore'

interface GrumpAvatarWrapperProps {
  size?: 'small' | 'medium' | 'large'
  customState?: Partial<any>
}

export default function GrumpAvatarWrapper({ 
  size = 'medium',
  customState 
}: GrumpAvatarWrapperProps) {
  const { state, breathingScale, updateEyeTracking } = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)

  // Eye tracking - smooth at 200fps
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = (e.clientX - centerX) / rect.width
      
      // Update eye tracking (normalized to -1 to 1, then scaled to -6 to 6 for store)
      const trackingValue = Math.max(-1, Math.min(1, deltaX * 2))
      updateEyeTracking(trackingValue)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [updateEyeTracking])

  // Map existing state to new avatar format
  const mappedState = {
    glowColor: customState?.glowColor || state.glowColor || 'soft',
    glowIntensity: customState?.glowIntensity ?? state.glowIntensity ?? 0.3,
    glowPulseRate: state.glowPulseRate || 1,
    leftPupilX: state.leftPupilX || 0,
    leftPupilY: state.leftPupilY || 0,
    rightPupilX: state.rightPupilX || 0,
    rightPupilY: state.rightPupilY || 0,
    isBlinking: state.isBlinking || false,
    leftEyebrowRotation: state.leftEyebrowRotation || 0,
    rightEyebrowRotation: state.rightEyebrowRotation || 0,
    mouthState: state.mouthState || 'flat',
    ...customState
  }

  return (
    <div ref={containerRef} style={{ display: 'inline-block' }}>
      <GrumpAvatar200fps
        state={mappedState}
        breathingScale={breathingScale || 1}
        size={size}
      />
    </div>
  )
}


// Grump 2.0 - Mega Expansion
// 800+ idle anims + multiple mega-sequences + advanced autonomous chat
// The grump2.js script is loaded globally in index.html and auto-initializes when elements are ready

import { useAnimation } from '../store/AnimationStore'
import './Grump2.css'

interface Grump2Props {
  size?: 'small' | 'medium' | 'large' | number
  className?: string
  style?: React.CSSProperties
  isRageMode?: boolean
  isCoding?: boolean
}

export default function Grump2({ size = 'medium', className = '', style = {}, isRageMode = false, isCoding = false }: Grump2Props) {
  const { state } = useAnimation()
  const BASE_SIZE = 300
  
  const getSizeInPixels = () => {
    if (typeof size === 'number') return size
    switch (size) {
      case 'small': return 120
      case 'medium': return 250
      case 'large': return 400
      default: return 250
    }
  }

  const targetSize = getSizeInPixels()
  const scale = targetSize / BASE_SIZE

  // Map store state to CSS variables
  const animationStyle = {
    '--eyebrow-left-rotate': `${state.leftEyebrowRotation}deg`,
    '--eyebrow-right-rotate': `${state.rightEyebrowRotation}deg`,
    '--eyebrow-left-y': `${state.leftEyebrowY}px`,
    '--eyebrow-right-y': `${state.rightEyebrowY}px`,
    '--pupil-x': `${state.leftPupilX}px`, 
    '--pupil-y': `${state.leftPupilY}px`,
    '--mouth-open': state.mouthState === 'open' ? '20px' : state.mouthState === 'pursed' ? '5px' : '0px',
    '--face-scale': state.breathingScale,
    '--head-tilt': `${state.microMovementState?.headTilt || 0}deg`,
    // Add other mappings as needed
  } as React.CSSProperties

  return (
    <div 
      className={`grump2-wrapper ${className} ${isRageMode ? 'rage-mode' : ''} ${isCoding ? 'coding-mode' : ''}`} 
      style={{ 
        width: targetSize, 
        height: targetSize, 
        position: 'relative',
        transform: `rotate(var(--head-tilt))`,
        ...animationStyle,
        ...style 
      }}
    >
      <div 
        className="grump2-container" 
        style={{
          width: BASE_SIZE,
          height: BASE_SIZE,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0
        } as React.CSSProperties}
      >
        {isCoding && (
          <div className="coding-overlay absolute inset-0 flex items-center justify-center opacity-50 pointer-events-none">
          </div>
        )}
        {/* Arms */}
        <div className="arm left" />
        <div className="arm right" />
        
        {/* Hands */}
        <div className="hand left">
          <div className="hand-inner">
            <div className="finger" />
            <div className="finger" />
            <div className="finger" />
            <div className="finger" />
            <div className="thumb" />
          </div>
        </div>
        <div className="hand right">
          <div className="hand-inner">
            <div className="finger" />
            <div className="finger" />
            <div className="finger" />
            <div className="finger" />
            <div className="thumb" />
          </div>
        </div>

        {/* Face */}
        <div className="face">
          <div className="eyebrow left" />
          <div className="eyebrow right" />
          
          <div className="eye left">
            <div className="pupil" />
          </div>
          <div className="eye right">
            <div className="pupil" />
          </div>
          
          <div className="nose" />
          
          <div className="mouth">
            <div className="mouth-line top" />
            <div className="mouth-line bottom" />
          </div>
        </div>
      </div>
    </div>
  )
}

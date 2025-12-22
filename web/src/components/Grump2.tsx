// Grump 2.0 - Mega Expansion
// 800+ idle anims + multiple mega-sequences + advanced autonomous chat
// The grump2.js script is loaded globally in index.html and auto-initializes when elements are ready

import './Grump2.css'

interface Grump2Props {
  size?: 'small' | 'medium' | 'large' | number
  className?: string
  style?: React.CSSProperties
}

export default function Grump2({ size = 'medium', className = '', style = {} }: Grump2Props) {
  const BASE_SIZE = 300
  
  const getSizeInPixels = () => {
    if (typeof size === 'number') return size
    switch (size) {
      case 'small': return 150
      case 'medium': return 300
      case 'large': return 450
      default: return 300
    }
  }

  const targetSize = getSizeInPixels()
  const scale = targetSize / BASE_SIZE

  return (
    <div 
      className={`grump2-wrapper ${className}`} 
      style={{ 
        width: targetSize, 
        height: targetSize, 
        position: 'relative',
        overflow: 'hidden',
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
        <div className="face">
          <div className="eyes-container">
            <div className="eye left-eye">
              <div className="pupil" />
            </div>
            <div className="eye right-eye">
              <div className="pupil" />
            </div>
          </div>
          <div className="eyebrows-container">
            <div className="eyebrow left-eyebrow" />
            <div className="eyebrow right-eyebrow" />
          </div>
          <div className="mouth" />
          <div className="nose" />
        </div>
      </div>
    </div>
  )
}

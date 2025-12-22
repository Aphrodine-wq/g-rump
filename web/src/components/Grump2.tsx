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
      case 'small': return 120
      case 'medium': return 250
      case 'large': return 400
      default: return 250
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

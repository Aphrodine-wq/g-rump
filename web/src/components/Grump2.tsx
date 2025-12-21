// Grump 2.0 - Mega Expansion
// 800+ idle anims + multiple mega-sequences + advanced autonomous chat
// The grump2.js script is loaded globally in index.html and auto-initializes when elements are ready

import './Grump2.css'

export default function Grump2() {
  // Script handles its own initialization - just render the DOM structure
  return (
    <div className="grump2-container">
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
  )
}

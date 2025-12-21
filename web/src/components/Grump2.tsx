// Grump 2.0 - Mega Expansion
// 800+ idle anims + multiple mega-sequences + advanced autonomous chat

import { useEffect, useRef } from 'react'
import './Grump2.css'

interface Grump2Props {
  chatMessagesId?: string
  chatInputId?: string
}

export default function Grump2({ chatMessagesId = 'chatMessages', chatInputId = 'chatInput' }: Grump2Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Wait for face element to be rendered, then load Grump 2.0
    const initGrump = () => {
      const face = containerRef.current?.querySelector('.face')
      if (!face) {
        setTimeout(initGrump, 50)
        return
      }

      // Check if script already loaded
      if (document.querySelector('script[src="/grump2.js"]')) {
        return
      }

      // Load the full Grump 2.0 script from public folder
      const script = document.createElement('script')
      script.src = '/grump2.js'
      script.type = 'text/javascript'
      script.async = true
      
      script.onload = () => {
        console.log('Grump 2.0 loaded successfully')
      }
      
      script.onerror = () => {
        console.warn('Failed to load grump2.js, using minimal version')
        // Minimal fallback
        const fallback = document.createElement('script')
        fallback.textContent = `
          (() => {
            const face = document.querySelector('.grump2-container .face');
            if (!face) return;
            console.log('Grump 2.0 (minimal fallback) initialized');
          })();
        `
        document.head.appendChild(fallback)
      }
      
      document.head.appendChild(script)
    }

    initGrump()

    return () => {
      // Cleanup handled by script itself
    }
  }, [chatMessagesId, chatInputId])

  return (
    <div ref={containerRef} className="grump2-container">
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

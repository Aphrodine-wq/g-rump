import { KeyboardEvent, forwardRef } from 'react'
import './InputBar.css'

interface InputBarProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled: boolean
}

const InputBar = forwardRef<HTMLInputElement, InputBarProps>(({ value, onChange, onSend, disabled }, ref) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="input-bar">
      <div className="input-container">
        <input
          ref={ref}
          type="text"
          className="input-field"
          placeholder="say something..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          autoFocus
        />
        <button
          className="send-button"
          onClick={onSend}
          disabled={disabled || !value.trim()}
          title="Send message"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
})

InputBar.displayName = 'InputBar'

export default InputBar


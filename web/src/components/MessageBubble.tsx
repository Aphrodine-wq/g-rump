import { motion } from 'framer-motion'
import MessageSlam, { useCharacterStreaming } from './animations/MessageSlam'
import { useAnimation } from '../store/AnimationStore'
import './MessageBubble.css'

interface Message {
  id: string
  content: string
  sender: 'user' | 'grump'
  timestamp: Date
}

interface MessageBubbleProps {
  message: Message
  index?: number
}

export default function MessageBubble({ message, index = 0 }: MessageBubbleProps) {
  const isGrump = message.sender === 'grump'
  const { triggerScreenShake } = useAnimation()
  
  // Character-by-character streaming for Grump messages
  const { displayedText, isComplete } = useCharacterStreaming(
    isGrump ? message.content : '',
    isGrump ? 30 : 0, // 30ms per character for Grump
    () => {
      // On complete, trigger screen shake for slam effect
      if (isGrump && index === 0) {
        triggerScreenShake(0.3)
      }
    }
  )

  const textToDisplay = isGrump ? displayedText : message.content

  return (
    <MessageSlam isGrumpMessage={isGrump}>
      <motion.div
        className={`message-bubble ${isGrump ? 'grump-message' : 'user-message'}`}
        initial={isGrump ? false : { 
          opacity: 0,
          y: 10
        }}
        animate={isGrump ? {} : { 
          opacity: 1,
          y: 0
        }}
        transition={isGrump ? {} : {
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1],
          delay: index * 0.05
        }}
      >
        <div className="message-content">
          {textToDisplay}
          {isGrump && !isComplete && (
            <span className="typing-cursor">|</span>
          )}
        </div>
        <div className="message-timestamp">
          {formatTime(message.timestamp)}
        </div>
      </motion.div>
    </MessageSlam>
  )
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date)
}


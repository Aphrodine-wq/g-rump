import { useState } from 'react'
import GrumpFaceRig from './GrumpFaceRig'
import './OnboardingView.css'

interface OnboardingViewProps {
  onComplete: () => void
}

interface OnboardingPage {
  title: string
  description: string
  showAvatar: boolean
}

export default function OnboardingView({ onComplete }: OnboardingViewProps) {
  const [currentPage, setCurrentPage] = useState(0)

  const pages: OnboardingPage[] = [
    {
      title: "Oh good. You're here.",
      description: "I'm Grump. The world's crankiest AI. I'll help, but I won't be happy about it.",
      showAvatar: true
    },
    {
      title: "I'm not mean.",
      description: "Just perpetually unimpressed. But I'll help anyway.",
      showAvatar: true
    },
    {
      title: "Ready? I guess.",
      description: "Ask me anything. I'll complain, but I'll help.",
      showAvatar: true
    }
  ]

  const handleContinue = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1)
    } else {
      onComplete()
    }
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-skip">
        <button onClick={onComplete} className="skip-button">
          Skip
        </button>
      </div>

      <div className="onboarding-content">
        {pages[currentPage].showAvatar && (
          <div className="onboarding-avatar">
            <GrumpFaceRig size={120} />
          </div>
        )}

        <div className="onboarding-text">
          <h1>{pages[currentPage].title}</h1>
          <p>{pages[currentPage].description}</p>
        </div>

        <div className="onboarding-indicators">
          {pages.map((_, index) => (
            <div
              key={index}
              className={`indicator ${index === currentPage ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="onboarding-footer">
        <button onClick={handleContinue} className="continue-button">
          {currentPage < pages.length - 1 ? 'Continue' : 'Get Started'}
        </button>
      </div>
    </div>
  )
}


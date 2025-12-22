// Onboarding Flow - 3-step introduction to G-Rump

import { useState, useEffect } from 'react'
import Grump2 from './Grump2'
import './OnboardingFlow.css'

interface OnboardingFlowProps {
  onComplete: () => void
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = [
    { id: 'ui', name: '📱 UI/UX', desc: 'Buttons, loaders, transitions' },
    { id: 'gaming', name: '🎮 Games', desc: 'Sprites, effects, characters' },
    { id: 'social', name: '📣 Social', desc: 'Posts, stories, thumbnails' },
    { id: 'streaming', name: '🎥 Streaming', desc: 'Alerts, overlays, emotes' },
    { id: 'business', name: '💼 Business', desc: 'Logos, presentations, charts' },
    { id: 'other', name: '🎨 Other', desc: 'Just exploring' },
  ]

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="onboarding-flow">
      <div className="onboarding-container">
        {/* Step 1: Meet G-Rump */}
        {currentStep === 1 && (
          <div className="onboarding-step">
            <div className="step-header">
              <span className="step-number">STEP 1 OF 3</span>
            </div>
            <div className="step-content">
              <div className="step-grump">
                <Grump2 size="large" />
              </div>
              <h1>Meet G-Rump</h1>
              <div className="step-text">
                <p>I'm an AI that creates animations.</p>
                <p>I'm also brutally honest about your ideas.</p>
                <p>Don't take it personally. I'm like this with everyone.</p>
                <p>But I'm REALLY good at what I do.</p>
                <p>So you'll put up with me.</p>
              </div>
            </div>
            <div className="step-footer">
              <div className="step-indicators">
                <span className={`indicator ${currentStep === 1 as number ? 'active' : ''}`} />
                <span className={`indicator ${currentStep === 2 as number ? 'active' : ''}`} />
                <span className={`indicator ${currentStep === 3 as number ? 'active' : ''}`} />
              </div>
              <button className="step-button" onClick={handleNext}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: How It Works */}
        {currentStep === 2 && (
          <div className="onboarding-step">
            <div className="step-header">
              <span className="step-number">STEP 2 OF 3</span>
            </div>
            <div className="step-content">
              <h1>How It Works</h1>
              <div className="how-it-works">
                <div className="work-step">
                  <div className="work-number">1</div>
                  <h3>Tell Me What You Want</h3>
                  <div className="work-example">
                    <div className="example-bubble">"Make me a bouncing logo"</div>
                  </div>
                </div>
                <div className="work-arrow">↓</div>
                <div className="work-step">
                  <div className="work-number">2</div>
                  <h3>I'll Create It (And Judge You)</h3>
                  <div className="work-grump">
                    <Grump2 size="small" />
                    <p>"A bouncing logo. How original. Fine, here's your bounce. I added anticipation because I have standards."</p>
                  </div>
                </div>
                <div className="work-arrow">↓</div>
                <div className="work-step">
                  <div className="work-number">3</div>
                  <h3>Download & Use Anywhere</h3>
                  <div className="work-exports">
                    <button className="export-badge">GIF</button>
                    <button className="export-badge">MP4</button>
                    <button className="export-badge">Lottie</button>
                    <button className="export-badge">CSS</button>
                    <button className="export-badge">More</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="step-footer">
              <div className="step-indicators">
                <span className={`indicator ${currentStep === 1 as number ? 'active' : ''}`} />
                <span className={`indicator ${currentStep === 2 as number ? 'active' : ''}`} />
                <span className={`indicator ${currentStep === 3 as number ? 'active' : ''}`} />
              </div>
              <button className="step-button" onClick={handleNext}>
                Let's Go →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: What Do You Want to Make? */}
        {currentStep === 3 && (
          <div className="onboarding-step">
            <div className="step-header">
              <span className="step-number">STEP 3 OF 3</span>
            </div>
            <div className="step-content">
              <h1>What Do You Want to Make?</h1>
              <p className="step-subtitle">(I need to know what I'm working with)</p>
              <div className="category-grid">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`category-card ${selectedCategory === cat.id ? 'selected' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <div className="category-icon">{cat.name.split(' ')[0]}</div>
                    <h3>{cat.name.split(' ').slice(1).join(' ')}</h3>
                    <p>{cat.desc}</p>
                  </button>
                ))}
              </div>
              <div className="step-grump-small">
                <Grump2 size="small" />
                <p>"Pick one. Or don't. I'll still help you either way."</p>
              </div>
            </div>
            <div className="step-footer">
              <div className="step-indicators">
                <span className={`indicator ${currentStep === 1 as number ? 'active' : ''}`} />
                <span className={`indicator ${currentStep === 2 as number ? 'active' : ''}`} />
                <span className={`indicator ${currentStep === 3 as number ? 'active' : ''}`} />
              </div>
              <div className="step-actions">
                <button className="step-button secondary" onClick={handleSkip}>
                  Skip →
                </button>
                <button className="step-button" onClick={handleNext}>
                  Get Started →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


// Main App - New White Design with Landing Page and Chat Interface

import { useState, useEffect } from 'react'
import { ChatProvider, useChat } from './store/ChatStore'
import { AnimationProvider } from './store/AnimationStore'
import { WorkspaceProvider } from './store/WorkspaceStore'
import LandingPage from './components/LandingPage'
import ChatInterface from './components/ChatInterface'
import MobileChatView from './components/MobileChatView'
import TemplateGallery from './components/TemplateGallery'
import UserDashboard from './components/UserDashboard'
import SettingsPage from './components/SettingsPage'
import PricingPage from './components/PricingPage'
import OnboardingFlow from './components/OnboardingFlow'
import './App.css'

type View = 'landing' | 'chat' | 'templates' | 'dashboard' | 'settings' | 'pricing' | 'onboarding'

function App() {
  const [currentView, setCurrentView] = useState<View>(() => {
    const hasOnboarded = localStorage.getItem('hasCompletedOnboarding') === 'true'
    return hasOnboarded ? 'landing' : 'onboarding'
  })
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [pendingTemplatePrompt, setPendingTemplatePrompt] = useState<string | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleGetStarted = () => {
    setCurrentView('chat')
  }

  const handleLogin = () => {
    setCurrentView('chat')
  }

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true')
    setCurrentView('landing')
  }

  return (
    <ChatProvider>
      <AnimationProvider>
        <WorkspaceProvider>
          <div className="app">
            {currentView === 'onboarding' && (
              <OnboardingFlow onComplete={handleOnboardingComplete} />
            )}
            {currentView === 'landing' && (
              <LandingPage 
                onGetStarted={handleGetStarted}
                onLogin={handleLogin}
                onNavigate={(view) => setCurrentView(view)}
              />
            )}
            {currentView === 'chat' && (
              <ChatViewWithTemplate 
                isMobile={isMobile}
                templatePrompt={pendingTemplatePrompt}
                onTemplateSent={() => setPendingTemplatePrompt(null)}
              />
            )}
            {currentView === 'templates' && (
              <TemplateGallery 
                onNavigateToChat={(templatePrompt) => {
                  setPendingTemplatePrompt(templatePrompt || null)
                  setCurrentView('chat')
                }}
                onNavigate={(view) => setCurrentView(view)}
              />
            )}
            {currentView === 'dashboard' && <UserDashboard onNavigate={(view) => setCurrentView(view)} />}
            {currentView === 'settings' && <SettingsPage onNavigate={(view) => setCurrentView(view)} />}
            {currentView === 'pricing' && <PricingPage onNavigate={(view) => setCurrentView(view)} />}
          </div>
        </WorkspaceProvider>
      </AnimationProvider>
    </ChatProvider>
  )
}

// Helper component to handle template prompts
function ChatViewWithTemplate({ 
  isMobile, 
  templatePrompt, 
  onTemplateSent,
  onNavigate
}: { 
  isMobile: boolean
  templatePrompt: string | null
  onTemplateSent: () => void
  onNavigate?: (view: 'templates' | 'dashboard' | 'settings' | 'pricing' | 'chat') => void
}) {
  const { sendMessage, createNewSession } = useChat()
  
  useEffect(() => {
    if (templatePrompt) {
      createNewSession()
      setTimeout(() => {
        sendMessage(templatePrompt)
        onTemplateSent()
      }, 200)
    }
  }, [templatePrompt, sendMessage, createNewSession, onTemplateSent])
  
  return isMobile ? <MobileChatView onNavigate={onNavigate} /> : <ChatInterface onNavigate={onNavigate} />
}

export default App

// Main App - New White Design with Landing Page and Chat Interface

import { useState, useEffect } from 'react'
import { ChatProvider } from './store/ChatStore'
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

  // Navigation helper
  const navigate = (view: View) => {
    setCurrentView(view)
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
              />
            )}
            {currentView === 'chat' && (
              isMobile ? <MobileChatView /> : <ChatInterface />
            )}
            {currentView === 'templates' && <TemplateGallery />}
            {currentView === 'dashboard' && <UserDashboard />}
            {currentView === 'settings' && <SettingsPage />}
            {currentView === 'pricing' && <PricingPage />}
          </div>
        </WorkspaceProvider>
      </AnimationProvider>
    </ChatProvider>
  )
}

export default App

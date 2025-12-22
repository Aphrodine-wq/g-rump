// Main App - Modern Glassmorphic Design with Smooth Page Transitions

import { useState, useEffect } from 'react'
import { ChatProvider, useChat } from './store/ChatStore'
import { WorkspaceProvider } from './store/WorkspaceStore'
import { AnimationProvider } from './store/AnimationStore'
import { AchievementsProvider } from './store/AchievementsStore'
import { AuthProvider, useAuth } from './context/AuthContext'
import { PageTransition } from './components/PageTransition'
import LandingPage from './components/LandingPage'
import ChatInterface from './components/ChatInterface'
import MobileChatView from './components/MobileChatView'
import TemplateGallery from './components/TemplateGallery'
import UserDashboard from './components/UserDashboard'
import SettingsPage from './components/SettingsPage'
import PricingPage from './components/PricingPage'
import EducationView from './components/EducationView'
import OnboardingFlow from './components/OnboardingFlow'
import GameDevWorkspace from './components/GameDevWorkspace'
import ErrorBoundary from './components/ErrorBoundary'
import { LoginScreen } from './components/Auth/LoginScreen'
import './App.css'

type View = 'landing' | 'chat' | 'templates' | 'dashboard' | 'settings' | 'pricing' | 'onboarding' | 'gamedev' | 'education'

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()
  const [currentView, setCurrentView] = useState<View>(() => {
    const hasOnboarded = localStorage.getItem('hasCompletedOnboarding') === 'true'
    return hasOnboarded ? 'landing' : 'onboarding'
  })
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [pendingTemplatePrompt, setPendingTemplatePrompt] = useState<string | null>(null)
  const [currentGameTemplate, setCurrentGameTemplate] = useState<string | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      setShowLoginModal(false)
    }
  }, [isAuthenticated])

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
    } else {
      setCurrentView('chat')
    }
  }

  const handleLogin = () => {
    if (isAuthenticated) {
      setCurrentView('dashboard')
    } else {
      setShowLoginModal(true)
    }
  }

  const handleNavigate = (view: View) => {
    // Protected routes
    if (!isAuthenticated && ['chat', 'dashboard', 'settings', 'gamedev'].includes(view)) {
      setShowLoginModal(true)
      return
    }
    setCurrentView(view)
  }

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true')
    setCurrentView('landing')
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-white">Loading...</div>
  }

  return (
    <div className="app">
      {showLoginModal && !isAuthenticated && <LoginScreen />}
      
      <PageTransition key={currentView}>
        {currentView === 'onboarding' && (
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        )}
        {currentView === 'landing' && (
          <LandingPage
            onGetStarted={handleGetStarted}
            onLogin={handleLogin}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'chat' && (
          <ChatViewWithTemplate
            isMobile={isMobile}
            templatePrompt={pendingTemplatePrompt}
            onTemplateSent={() => setPendingTemplatePrompt(null)}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'templates' && (
          <TemplateGallery
            onNavigateToChat={(templatePrompt) => {
              setPendingTemplatePrompt(templatePrompt || null)
              if (!isAuthenticated) {
                setShowLoginModal(true)
              } else {
                setCurrentView('chat')
              }
            }}
            onNavigate={handleNavigate}
            onNavigateToGameDev={(templateCode) => {
              setCurrentGameTemplate(templateCode || null)
              if (!isAuthenticated) {
                setShowLoginModal(true)
              } else {
                setCurrentView('gamedev')
              }
            }}
          />
        )}
        {currentView === 'dashboard' && <UserDashboard onNavigate={handleNavigate} />}
        {currentView === 'settings' && <SettingsPage onNavigate={handleNavigate} />}
        {currentView === 'pricing' && <PricingPage onNavigate={handleNavigate} />}
        {currentView === 'gamedev' && (
          <GameDevWorkspace
            templateCode={currentGameTemplate || undefined}
            onNavigate={(view) => handleNavigate(view as View)}
            onExport={(code, target) => {
              console.log('Export game:', code, target)
              // Handle export
            }}
          />
        )}
        {currentView === 'education' && <EducationView onNavigate={(view) => handleNavigate(view as View)} />}
      </PageTransition>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AchievementsProvider>
          <AnimationProvider>
            <ChatProvider>
              <WorkspaceProvider>
                <AppContent />
              </WorkspaceProvider>
            </ChatProvider>
          </AnimationProvider>
        </AchievementsProvider>
      </AuthProvider>
    </ErrorBoundary>
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
  onNavigate?: (view: 'templates' | 'dashboard' | 'settings' | 'pricing' | 'chat' | 'gamedev') => void
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

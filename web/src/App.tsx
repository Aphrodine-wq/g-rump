import { useState } from 'react'
import ChatView from './components/ChatView'
import ChatHistoryView from './components/ChatHistoryView'
import SettingsView from './components/SettingsView'
import StatsView from './components/StatsView'
import OnboardingView from './components/OnboardingView'
import AppLaunch from './components/animations/AppLaunch'
import { ChatProvider } from './store/ChatStore'
import { AnimationProvider } from './store/AnimationStore'
import './App.css'

type Tab = 'chat' | 'history' | 'stats' | 'settings' | 'pricing'

function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('chat')
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('hasCompletedOnboarding') === 'true'
  })
  const [showLaunchSequence, setShowLaunchSequence] = useState(() => {
    return localStorage.getItem('hasSeenLaunchSequence') !== 'true'
  })

  const handleCompleteOnboarding = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true')
    setHasCompletedOnboarding(true)
  }

  const handleLaunchComplete = () => {
    localStorage.setItem('hasSeenLaunchSequence', 'true')
    setShowLaunchSequence(false)
  }

  if (!hasCompletedOnboarding) {
    return (
      <ChatProvider>
        <AnimationProvider>
          <OnboardingView onComplete={handleCompleteOnboarding} />
        </AnimationProvider>
      </ChatProvider>
    )
  }

  const mainContent = (
    <div className="app-container">
      <div className="main-content">
        {currentTab === 'chat' && <ChatView />}
        {currentTab === 'history' && <ChatHistoryView />}
        {currentTab === 'stats' && <StatsView />}
        {currentTab === 'settings' && <SettingsView />}
      </div>
      
      <div className="tab-bar">
        <button
          className={`tab-item ${currentTab === 'chat' ? 'active' : ''}`}
          onClick={() => setCurrentTab('chat')}
        >
          <div className="tab-icon">
            {currentTab === 'chat' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            )}
          </div>
          <span>Chat</span>
        </button>
        <button
          className={`tab-item ${currentTab === 'history' ? 'active' : ''}`}
          onClick={() => setCurrentTab('history')}
        >
          <div className="tab-icon">
            {currentTab === 'history' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            )}
          </div>
          <span>History</span>
        </button>
        <button
          className={`tab-item ${currentTab === 'stats' ? 'active' : ''}`}
          onClick={() => setCurrentTab('stats')}
        >
          <div className="tab-icon">
            {currentTab === 'stats' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="20" x2="12" y2="10"/>
                <line x1="18" y1="20" x2="18" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="16"/>
              </svg>
            )}
          </div>
          <span>Stats</span>
        </button>
        <button
          className={`tab-item ${currentTab === 'settings' ? 'active' : ''}`}
          onClick={() => setCurrentTab('settings')}
        >
          <div className="tab-icon">
            {currentTab === 'settings' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
              </svg>
            )}
          </div>
          <span>Settings</span>
        </button>
      </div>
    </div>
  )

  return (
    <ChatProvider>
      <AnimationProvider>
        {showLaunchSequence ? (
          <AppLaunch onComplete={handleLaunchComplete}>
            {mainContent}
          </AppLaunch>
        ) : (
          mainContent
        )}
      </AnimationProvider>
    </ChatProvider>
  )
}

export default App


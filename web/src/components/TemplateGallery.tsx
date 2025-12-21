// Template Gallery - Browse animation templates

import { useState, useEffect } from 'react'
import GrumpAvatarWrapper from './GrumpAvatarWrapper'
import { useAnimation } from '../store/AnimationStore'
import { useChat } from '../store/ChatStore'
import { gameTemplates, GameTemplate } from '../data/gameTemplates'
import './TemplateGallery.css'

interface Template {
  id: string
  name: string
  icon: string
  category: string
  rating: number
  uses: number
}

const templates: Template[] = [
  { id: '1', name: 'Loading Dots', icon: '◠◡◠', category: 'ui', rating: 5, uses: 2300 },
  { id: '2', name: 'Logo Reveal', icon: '◇', category: 'logo', rating: 5, uses: 1800 },
  { id: '3', name: 'Button Hover', icon: '┌─────┐', category: 'ui', rating: 4, uses: 1200 },
  { id: '4', name: 'Spinner', icon: '⟳', category: 'ui', rating: 5, uses: 987 },
  { id: '5', name: 'Progress Bar', icon: '████████', category: 'ui', rating: 4, uses: 845 },
  { id: '6', name: 'Slide Trans.', icon: '← SWIPE →', category: 'ui', rating: 5, uses: 723 },
  { id: '7', name: 'Like Heart', icon: '♥ +1', category: 'social', rating: 5, uses: 698 },
  { id: '8', name: 'Star Burst', icon: '★ ★', category: 'ui', rating: 4, uses: 542 },
  { id: '9', name: 'Bounce Collect', icon: '╭───╮', category: 'gaming', rating: 5, uses: 456 },
  { id: '10', name: 'Health Bar', icon: '♥ ♥ ♥', category: 'gaming', rating: 5, uses: 432 },
  { id: '11', name: 'Coin Spin', icon: '✦', category: 'gaming', rating: 4, uses: 398 },
  { id: '12', name: 'Run Cycle', icon: '🏃 →', category: 'gaming', rating: 5, uses: 367 },
  { id: '13', name: 'Follow Alert', icon: 'NEW FOLLOW!', category: 'streaming', rating: 5, uses: 234 },
  { id: '14', name: 'Donation Pop', icon: '$5 DONATION', category: 'streaming', rating: 4, uses: 198 },
  { id: '15', name: 'Sub Alert', icon: 'SUBSCRIBER', category: 'streaming', rating: 5, uses: 187 },
  { id: '16', name: 'Raid Alert', icon: 'RAID! x150', category: 'streaming', rating: 4, uses: 156 },
]

const categories = [
  { id: 'all', name: 'All' },
  { id: 'ui', name: 'UI/UX' },
  { id: 'logo', name: 'Logos' },
  { id: 'social', name: 'Social' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'streaming', name: 'Streaming' },
  { id: 'text', name: 'Text' },
  { id: 'shapes', name: 'Shapes' },
  { id: 'games', name: 'Games' },
]

interface TemplateGalleryProps {
  onNavigateToChat?: (templatePrompt?: string) => void
  onNavigate?: (view: 'chat' | 'dashboard' | 'settings' | 'pricing' | 'gamedev') => void
  onNavigateToGameDev?: (templateCode?: string) => void
}

export default function TemplateGallery({ onNavigateToChat, onNavigate, onNavigateToGameDev }: TemplateGalleryProps) {
  const { transitionToState } = useAnimation()
  const { createNewSession, sendMessage } = useChat()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showGameTemplates, setShowGameTemplates] = useState(false)

  useEffect(() => {
    transitionToState('idle')
  }, [transitionToState])

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const filteredGameTemplates = gameTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || selectedCategory === 'games' || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleUseTemplate = async (template: Template) => {
    // Create a prompt based on the template
    const templatePrompt = `Create a ${template.name.toLowerCase()} animation`
    
    // Navigate to chat and send template prompt
    if (onNavigateToChat) {
      onNavigateToChat(templatePrompt)
    } else {
      // Fallback: create new session and send message
      createNewSession()
      // Small delay to ensure session is created
      setTimeout(() => {
        sendMessage(templatePrompt)
      }, 100)
    }
  }

  const handleUseGameTemplate = (template: GameTemplate) => {
    if (onNavigateToGameDev) {
      onNavigateToGameDev(template.code)
      onNavigate?.('gamedev')
    } else if (onNavigate) {
      onNavigate('gamedev')
    }
  }

  return (
    <div className="template-gallery">
      {/* Header */}
      <header className="gallery-header">
        <button className="back-btn" onClick={() => onNavigate?.('chat')}>← Back to Chat</button>
        <div className="header-right">
          <button onClick={() => onNavigate?.('dashboard')}>Dashboard</button>
          <button onClick={() => onNavigate?.('settings')}>Settings</button>
          <button className="pro-btn" onClick={() => onNavigate?.('pricing')}>Pro ✨</button>
        </div>
      </header>

      {/* Main Content */}
      <div className="gallery-content">
        <div className="gallery-intro">
          <GrumpAvatarWrapper size="small" />
          <p>"Pick one. Or don't. I'll still judge whatever you end up making."</p>
        </div>

        {/* Search */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Categories */}
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(cat.id)
                setShowGameTemplates(cat.id === 'games' || cat.id === 'all')
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Game Templates Section */}
        {(showGameTemplates || selectedCategory === 'games') && (
          <div className="templates-section">
            <h2 className="section-title">Game Templates</h2>
            <div className="templates-grid">
              {filteredGameTemplates.map(template => (
                <div key={template.id} className="template-card game-template-card">
                  <div className="template-preview">
                    <div className="template-icon">{template.icon}</div>
                    <div className="template-difficulty-badge">{template.difficulty}</div>
                  </div>
                  <div className="template-info">
                    <h3>{template.name}</h3>
                    <p className="template-description">{template.description}</p>
                    <div className="template-tags">
                      {template.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="template-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <button 
                    className="use-template-btn"
                    onClick={() => handleUseGameTemplate(template)}
                  >
                    Start Game
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Animation Templates Grid */}
        <div className="templates-section">
          <h2 className="section-title">Animation Templates</h2>
          <div className="templates-grid">
            {filteredTemplates.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-preview">
                  <div className="template-icon">{template.icon}</div>
                </div>
                <div className="template-info">
                  <h3>{template.name}</h3>
                  <div className="template-stats">
                    <span className="rating">
                      {'★'.repeat(template.rating)}{'☆'.repeat(5 - template.rating)}
                    </span>
                    <span className="uses">({template.uses})</span>
                  </div>
                </div>
                <button 
                  className="use-template-btn"
                  onClick={() => handleUseTemplate(template)}
                >
                  Use This
                </button>
              </div>
            ))}
          </div>
        </div>

        <button className="load-more-btn" onClick={() => console.log('Load more templates - feature coming soon')}>Load More Templates</button>
      </div>
    </div>
  )
}


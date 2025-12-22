import { useState } from 'react'
import { getCurrentTier } from '../config/pricing'
import Grump2 from './Grump2'
import './EducationView.css'

interface EducationViewProps {
  onNavigate?: (view: 'dashboard' | 'pricing') => void
}

interface Course {
  id: string
  title: string
  description: string
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  price: number
  isProIncluded: boolean
  thumbnail: string
  locked: boolean
}

export default function EducationView({ onNavigate }: EducationViewProps) {
  const currentTier = getCurrentTier()
  const isPro = currentTier.id !== 'free'
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const courses: Course[] = [
    {
      id: 'basics-101',
      title: 'Animation Basics: Squash & Stretch',
      description: 'Learn the fundamental principle of animation. Grump explains (impatiently) why your current animations look stiff.',
      duration: '45 mins',
      level: 'Beginner',
      price: 0,
      isProIncluded: true,
      thumbnail: '🎾',
      locked: false
    },
    {
      id: 'timing-201',
      title: 'Timing & Spacing: Stop Being Linear',
      description: 'Linear interpolation is boring. Learn how to ease in, ease out, and actually make things feel alive.',
      duration: '1h 15m',
      level: 'Intermediate',
      price: 29.99,
      isProIncluded: true,
      thumbnail: '⏱️',
      locked: !isPro
    },
    {
      id: 'character-301',
      title: 'Character Rigging Fundamentals',
      description: 'Build your own custom characters. Warning: Involves math and patience.',
      duration: '2h 30m',
      level: 'Advanced',
      price: 49.99,
      isProIncluded: true,
      thumbnail: '🦴',
      locked: !isPro
    },
    {
      id: 'physics-401',
      title: 'Advanced Physics Simulation',
      description: 'Make particles collide without crashing your browser. (Hopefully).',
      duration: '3h 00m',
      level: 'Advanced',
      price: 59.99,
      isProIncluded: true,
      thumbnail: '💥',
      locked: !isPro
    }
  ]

  const handleCourseClick = (course: Course) => {
    if (course.locked) {
      // Show upgrade modal or redirect
      return
    }
    setSelectedCourse(course)
  }

  return (
    <div className="education-container">
      {/* Header */}
      <header className="education-header">
        <button className="back-btn" onClick={() => onNavigate?.('dashboard')}>
          ← Dashboard
        </button>
        <h1>Grump Academy</h1>
        {!isPro && (
          <button className="upgrade-btn-small" onClick={() => onNavigate?.('pricing')}>
            Unlock All Courses (Pro)
          </button>
        )}
      </header>

      <div className="education-content">
        {/* Hero Section */}
        <div className="education-hero">
          <div className="hero-text">
            <h2>Learn from the Master (Me)</h2>
            <p>
              "I'm tired of fixing your terrible animations. Watch these videos and try to be less bad."
            </p>
          </div>
          <div className="hero-grump">
            <Grump2 size="medium" />
          </div>
        </div>

        {/* Course Grid */}
        <div className="courses-grid">
          {courses.map(course => (
            <div 
              key={course.id} 
              className={`course-card ${course.locked ? 'locked' : ''}`}
              onClick={() => handleCourseClick(course)}
            >
              <div className="course-thumbnail">
                <span className="thumbnail-icon">{course.thumbnail}</span>
                {course.locked && (
                  <div className="lock-overlay">
                    <span className="lock-icon">🔒</span>
                    <span className="lock-text">Pro Only</span>
                  </div>
                )}
                {!course.locked && course.price === 0 && (
                  <div className="free-badge">FREE</div>
                )}
              </div>
              
              <div className="course-info">
                <div className="course-meta">
                  <span className={`level-tag ${course.level.toLowerCase()}`}>{course.level}</span>
                  <span className="duration">🕒 {course.duration}</span>
                </div>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                
                <div className="course-footer">
                  {course.locked ? (
                    <button className="course-action-btn upgrade" onClick={(e) => {
                      e.stopPropagation()
                      onNavigate?.('pricing')
                    }}>
                      Upgrade to Unlock
                    </button>
                  ) : (
                    <button className="course-action-btn start">
                      Start Learning
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Player Modal (Placeholder) */}
      {selectedCourse && (
        <div className="video-modal-overlay" onClick={() => setSelectedCourse(null)}>
          <div className="video-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedCourse.title}</h3>
              <button onClick={() => setSelectedCourse(null)}>×</button>
            </div>
            <div className="video-player-placeholder">
              <div className="play-icon">▶</div>
              <p>Video Player Placeholder</p>
            </div>
            <div className="modal-body">
              <p>{selectedCourse.description}</p>
              <button className="mark-complete-btn" onClick={() => setSelectedCourse(null)}>
                Mark as Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

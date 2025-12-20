import { useEffect, useState } from 'react'
import { statsService, UserStats } from '../services/StatsService'
import { dailyGripeService } from '../services/DailyGripeService'
import './StatsView.css'

export default function StatsView() {
  const [stats, setStats] = useState<UserStats>(statsService.getAllStats())
  const [dailyGripe, setDailyGripe] = useState('')

  useEffect(() => {
    // Load stats
    setStats(statsService.getAllStats())
    
    // Load daily gripe
    setDailyGripe(dailyGripeService.getTodaysGripe())
  }, [])

  const patienceEmoji = statsService.getPatienceEmoji(stats.patienceLevel)
  const patienceLabel = stats.patienceLevel.charAt(0).toUpperCase() + stats.patienceLevel.slice(1)

  return (
    <div className="stats-view">
      {/* Header */}
      <header className="stats-header">
        <div className="logo">grump</div>
      </header>

      {/* Your Stats Section */}
      <section className="stats-section">
        <h2 className="stats-title">Your Stats</h2>
        
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Roasts Received</span>
            <div className="stat-value">{stats.roastsReceived}</div>
          </div>

          <div className="stat-item">
            <span className="stat-label">Times Grump Ended Chat</span>
            <div className="stat-value">{stats.timesGrumpEndedChat}</div>
          </div>

          <div className="stat-item">
            <span className="stat-label">Sarcasm Detected in YOU</span>
            <div className="stat-value">{stats.sarcasmDetected}%</div>
          </div>

          <div className="stat-item">
            <span className="stat-label">Patience Level</span>
            <div className="stat-value">
              <span className="patience-emoji">{patienceEmoji}</span>
              <span className="patience-label">{patienceLabel}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Gripe Section */}
      <section className="gripe-section">
        <h2 className="gripe-title">Daily Gripe</h2>
        <div className="gripe-content">
          <p className="gripe-text">{dailyGripe}</p>
        </div>
      </section>
    </div>
  )
}


import { useEffect } from 'react'
import GrumpAvatarWrapper from './GrumpAvatarWrapper'
import { useAnimation } from '../store/AnimationStore'
import './LandingPage.css'

interface LandingPageProps {
  onGetStarted: () => void
  onLogin: () => void
  onNavigate?: (view: 'pricing' | 'templates' | 'dashboard' | 'settings') => void
}

export default function LandingPage({ onGetStarted, onLogin, onNavigate }: LandingPageProps) {
  const { transitionToState } = useAnimation()

  useEffect(() => {
    // Set G-Rump to idle state
    transitionToState('idle')
    // Eye tracking is handled by GrumpAvatarWrapper internally
  }, [transitionToState])

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <span className="brand-name">G-RUMP</span>
        </div>
        <div className="nav-links">
          <button className="nav-link-btn" onClick={() => onNavigate?.('templates')}>Templates</button>
          <button className="nav-link-btn" onClick={() => onNavigate?.('pricing')}>Pricing</button>
          <button className="nav-link-btn" onClick={() => onNavigate?.('dashboard')}>Dashboard</button>
          <button className="nav-link-btn" onClick={onLogin}>Login</button>
          <button className="nav-link-btn primary" onClick={onGetStarted}>Sign Up</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="grump-hero">
            <GrumpAvatarWrapper size="large" />
          </div>
          
          <h1 className="hero-title">
            The AI That Animates
            <br />
            <span className="subtitle">(Reluctantly)</span>
          </h1>
          
          <p className="hero-description">
            Tell me what you want. I'll make it move.
            <br />
            Try not to waste my time.
          </p>

          <div className="hero-input">
            <input 
              type="text" 
              placeholder="Make me a bouncing logo"
              className="hero-input-field"
            />
            <button className="hero-cta" onClick={onGetStarted}>
              Try G-Rump Free →
            </button>
          </div>

          <p className="hero-note">No credit card required</p>
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section">
        <h2 className="section-title">Watch G-Rump in Action</h2>
        <div className="video-container">
          <div className="video-placeholder">
            <button className="play-button">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
            <p>"Make me a loading spinner"</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-icon">💬</div>
            <h3>Chat</h3>
            <p>Tell G-Rump what you want (he'll judge)</p>
          </div>
          <div className="step">
            <div className="step-icon">🎬</div>
            <h3>Animate</h3>
            <p>Watch him create it (while judging)</p>
          </div>
          <div className="step">
            <div className="step-icon">📦</div>
            <h3>Export</h3>
            <p>Download in any format (still judging)</p>
          </div>
        </div>
      </section>

      {/* What Can G-Rump Make */}
      <section className="examples-section">
        <h2 className="section-title">What Can G-Rump Make?</h2>
        <div className="examples-grid">
          {[
            { icon: '○ ○ ○', name: 'Loading Animations' },
            { icon: '◇', name: 'Logo Reveals' },
            { icon: '┌─────┐', name: 'Button Effects' },
            { icon: '⟳', name: 'Spinner & More' },
            { icon: '★ ☆ ★', name: 'Particles & Effects' },
            { icon: '╔═══╗', name: 'Stream Alerts' },
            { icon: '👤 → 🏃', name: 'Game Sprites' },
            { icon: '♪ ♫ ♪', name: 'Audio Visualizer' },
            { icon: '│ ↑ │', name: 'Scroll Indicators' },
            { icon: '│ │ │', name: 'Chart Animations' }
          ].map((example, i) => (
            <div key={i} className="example-card">
              <div className="example-icon">{example.icon}</div>
              <p>{example.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2 className="section-title">What People Are Saying</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <p>"I asked for a simple bounce and G-Rump gave me a physics-perfect animation with squash and stretch I didn't even know I needed. Then he called my original idea 'mid'. 10/10"</p>
            <p className="testimonial-author">— @indie_dev_sarah</p>
          </div>
          <div className="testimonial-card">
            <p>"This grumpy frog has saved me hours of After Effects work. And the roasts are honestly the best part."</p>
            <p className="testimonial-author">— @motion_mike</p>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="pricing-preview">
        <h2 className="section-title">Pricing</h2>
        <div className="pricing-cards">
          <div className="pricing-card">
            <h3>FREE</h3>
            <div className="price">$0</div>
            <ul>
              <li>10 anims/day</li>
              <li>Basic exports</li>
              <li>720p</li>
              <li>Watermark</li>
            </ul>
            <button onClick={onGetStarted}>Get Started</button>
          </div>
          <div className="pricing-card featured">
            <div className="badge">★ MOST POPULAR ★</div>
            <h3>PRO</h3>
            <div className="price">$12<span>/month</span></div>
            <ul>
              <li>Unlimited</li>
              <li>All exports</li>
              <li>4K resolution</li>
              <li>No watermark</li>
              <li>API access</li>
            </ul>
            <button className="primary" onClick={onGetStarted}>Go Pro →</button>
          </div>
          <div className="pricing-card">
            <h3>TEAM</h3>
            <div className="price">$29<span>/seat</span></div>
            <ul>
              <li>Everything in Pro</li>
              <li>Team workspace</li>
              <li>Brand kit</li>
              <li>Collaboration</li>
              <li>SSO</li>
            </ul>
            <button onClick={onGetStarted}>Contact Us</button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="grump-cta">
          <GrumpAvatarWrapper size="medium" />
        </div>
        <p>"Look, are you gonna sign up or what? I don't have all day."</p>
        <button className="cta-button" onClick={onGetStarted}>Start Creating →</button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span>G-RUMP</span>
          </div>
          <div className="footer-links">
            <button className="footer-link-btn" onClick={() => onNavigate?.('templates')}>Templates</button>
            <button className="footer-link-btn" onClick={() => onNavigate?.('pricing')}>Pricing</button>
            <button className="footer-link-btn" onClick={() => onNavigate?.('dashboard')}>Dashboard</button>
            <button className="footer-link-btn" onClick={() => onNavigate?.('settings')}>Settings</button>
          </div>
        </div>
        <p className="footer-copyright">
          © 2024 G-Rump · Terms · Privacy · "Stop reading the footer and make something"
        </p>
      </footer>
    </div>
  )
}


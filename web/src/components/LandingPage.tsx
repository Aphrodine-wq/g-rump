import Grump2 from './Grump2'
import './LandingPage.css'

interface LandingPageProps {
  onGetStarted: () => void
  onLogin: () => void
  onNavigate?: (view: 'pricing' | 'templates' | 'dashboard' | 'settings' | 'gamedev') => void
}

export default function LandingPage({ onGetStarted, onLogin, onNavigate }: LandingPageProps) {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <span className="brand-name">g-rump</span>
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
            <Grump2 size="large" />
          </div>
          
          <h1 className="hero-title">
            The AI That Animates
          </h1>
          
          <p className="hero-description">
            Tell me what you want. I'll make it move.
          </p>

          <div className="hero-input">
            <input 
              type="text" 
              placeholder="Make me a bouncing logo..."
              className="hero-input-field"
            />
            <button className="hero-cta" onClick={onGetStarted}>
              Start →
            </button>
          </div>
        </div>
      </section>

      {/* Simplified Features Grid */}
      <section className="features-minimal">
        <div className="features-grid">
           <div className="feature-item" onClick={() => onNavigate?.('gamedev')}>
             <span className="feature-icon">🎮</span>
             <h3>Game Dev</h3>
             <p>Create games instantly</p>
           </div>
           <div className="feature-item" onClick={() => onNavigate?.('templates')}>
             <span className="feature-icon">✨</span>
             <h3>Templates</h3>
             <p>Start from scratch</p>
           </div>
           <div className="feature-item" onClick={() => onNavigate?.('pricing')}>
             <span className="feature-icon">💎</span>
             <h3>Pro</h3>
             <p>Unlock everything</p>
           </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2 className="section-title">What People Are Saying</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <p>"I asked for a simple bounce and g-rump gave me a physics-perfect animation with squash and stretch I didn't even know I needed. Then he called my original idea 'mid'. 10/10"</p>
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
              <li>1 anim/day</li>
              <li>Basic exports</li>
              <li>Watermark</li>
              <li>Free assets</li>
            </ul>
            <button onClick={onGetStarted}>Get Started</button>
          </div>
          <div className="pricing-card featured">
            <div className="badge">★ MOST POPULAR ★</div>
            <h3>PRO</h3>
            <div className="price">$49<span>/month</span></div>
            <ul>
              <li>200 anims/day</li>
              <li>4K + No watermark</li>
              <li>Character Creator</li>
              <li>Timeline Editor</li>
              <li>Sell Marketplace</li>
            </ul>
            <button className="primary" onClick={onGetStarted}>Go Pro →</button>
          </div>
          <div className="pricing-card">
            <h3>TEAM</h3>
            <div className="price">$199<span>/seat</span></div>
            <ul>
              <li>500 anims/day</li>
              <li>Team workspace</li>
              <li>Unlimited Chars</li>
              <li>Enterprise API</li>
              <li>Priority Support</li>
            </ul>
            <button onClick={onGetStarted}>Contact Us</button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="grump-cta">
          <Grump2 size="medium" />
        </div>
        <p>"Look, are you gonna sign up or what? I don't have all day."</p>
        <button className="cta-button" onClick={onGetStarted}>Start Creating →</button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span>g-rump</span>
          </div>
          <div className="footer-links">
            <button className="footer-link-btn" onClick={() => onNavigate?.('templates')}>Templates</button>
            <button className="footer-link-btn" onClick={() => onNavigate?.('pricing')}>Pricing</button>
            <button className="footer-link-btn" onClick={() => onNavigate?.('dashboard')}>Dashboard</button>
            <button className="footer-link-btn" onClick={() => onNavigate?.('settings')}>Settings</button>
          </div>
        </div>
        <p className="footer-copyright">
          © 2024 g-rump · Terms · Privacy · "Stop reading the footer and make something"
        </p>
      </footer>
    </div>
  )
}

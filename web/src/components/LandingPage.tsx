import Grump2 from './Grump2'
import './LandingPage.css'

interface LandingPageProps {
  onGetStarted: () => void
  onLogin: () => void
  onNavigate?: (view: 'pricing' | 'templates' | 'dashboard' | 'settings') => void
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
              Try g-rump Free →
            </button>
          </div>

          <p className="hero-note">No credit card required</p>
        </div>
      </section>

      {/* Showcase Section (New) */}
      <section className="showcase-section">
        <h2 className="section-title">See It In Action</h2>
        <div className="showcase-container">
          <div className="showcase-grid">
            {/* Demo 1: Bounce */}
            <div className="showcase-item">
              <div className="demo-box bounce-demo">
                <div className="demo-circle"></div>
              </div>
              <p className="demo-label">"Make it bounce"</p>
            </div>
            
            {/* Demo 2: Spinner */}
            <div className="showcase-item">
              <div className="demo-box">
                <div className="demo-spinner"></div>
              </div>
              <p className="demo-label">"I need a loader"</p>
            </div>

            {/* Demo 3: Morph */}
            <div className="showcase-item">
              <div className="demo-box">
                <div className="demo-morph"></div>
              </div>
              <p className="demo-label">"Morph circle to square"</p>
            </div>

            {/* Demo 4: Glow */}
            <div className="showcase-item">
              <div className="demo-box">
                <button className="demo-btn-glow">Hover Me</button>
              </div>
              <p className="demo-label">"Make a glowing button"</p>
            </div>
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
            <p>Tell g-rump what you want (he'll judge)</p>
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
        <h2 className="section-title">What Can g-rump Make?</h2>
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

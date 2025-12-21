// Pricing Page - Subscription plans and pricing

import { useState, useEffect } from 'react'
import GrumpAvatarWrapper from './GrumpAvatarWrapper'
import { useAnimation } from '../store/AnimationStore'
import './PricingPage.css'

interface PricingPageProps {
  onNavigate?: (view: 'chat' | 'templates' | 'dashboard' | 'settings' | 'pricing') => void
}

export default function PricingPage({ onNavigate }: PricingPageProps = {}) {
  const { transitionToState } = useAnimation()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  useEffect(() => {
    transitionToState('idle')
  }, [transitionToState])

  const plans = [
    {
      name: 'FREE',
      price: 0,
      period: 'forever',
      features: [
        '10 animations/day',
        'Basic exports (GIF, MP4)',
        '720p resolution',
        'Community support',
        'G-Rump watermark'
      ],
      cta: 'Get Started',
      highlight: false
    },
    {
      name: 'PRO',
      price: billingCycle === 'monthly' ? 12 : 99,
      period: billingCycle === 'monthly' ? '/month' : '/year',
      savings: billingCycle === 'yearly' ? 'Save 31%' : null,
      features: [
        'Unlimited animations',
        'All export formats (Lottie, CSS, etc)',
        '4K resolution',
        'No watermark',
        'Priority rendering',
        'Animation history',
        'API access (100 calls/day)',
        'Email support'
      ],
      cta: 'Start Free Trial',
      highlight: true,
      trial: '14-day free trial'
    },
    {
      name: 'TEAM',
      price: 29,
      period: '/seat/month',
      features: [
        'Everything in Pro',
        'Team workspace',
        'Brand kit (colors, fonts, logos)',
        'Collaboration',
        'Admin controls',
        'SSO integration',
        'Priority support',
        'Invoice billing'
      ],
      cta: 'Contact Sales',
      highlight: false
    }
  ]

  const faqs = [
    {
      question: 'Can I use G-Rump animations commercially?',
      answer: 'Yes! All animations you create are yours to use however you want, including commercial projects. G-Rump might judge your projects, but he won\'t sue you.',
      open: true
    },
    {
      question: 'What happens when my free animations run out?',
      answer: 'You can wait until the next day for your limit to reset, or upgrade to Pro for unlimited animations.',
      open: false
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.',
      open: false
    },
    {
      question: 'Is there a student discount?',
      answer: 'We offer student discounts! Contact us with your student email for more information.',
      open: false
    }
  ]

  return (
    <div className="pricing-page">
      {/* Navigation */}
      <nav className="pricing-nav">
        <div className="nav-brand">
          <span className="brand-name">G-RUMP</span>
        </div>
        <div className="nav-links">
          <button className="nav-link-btn" onClick={() => onNavigate?.('templates')}>Templates</button>
          <button className="nav-link-btn" onClick={() => onNavigate?.('dashboard')}>Dashboard</button>
          <button className="nav-link-btn" onClick={() => onNavigate?.('chat')}>Login</button>
          <button className="nav-link-btn primary" onClick={() => onNavigate?.('chat')}>Sign Up</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pricing-hero">
        <h1>Pricing</h1>
        <div className="grump-hero">
          <GrumpAvatarWrapper size="medium" />
          <p>"Look, I'll make your animations either way. But if you want the good stuff..."</p>
        </div>

        {/* Billing Toggle */}
        <div className="billing-toggle">
          <button
            className={`toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={`toggle-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly - Save 31%
          </button>
        </div>
      </section>

      {/* Plans */}
      <section className="plans-section">
        <div className="plans-grid">
          {plans.map((plan, idx) => (
            <div key={idx} className={`plan-card ${plan.highlight ? 'featured' : ''}`}>
              {plan.highlight && <div className="plan-badge">★ MOST POPULAR ★</div>}
              <h3>{plan.name}</h3>
              <div className="plan-price">
                ${plan.price}
                <span className="plan-period">{plan.period}</span>
              </div>
              {plan.savings && (
                <p className="plan-savings">{plan.savings}</p>
              )}
              <ul className="plan-features">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx}>✓ {feature}</li>
                ))}
              </ul>
              <button 
                className={`plan-cta ${plan.highlight ? 'primary' : ''}`}
                onClick={() => {
                  if (plan.name === 'FREE') {
                    onNavigate?.('chat')
                  } else {
                    onNavigate?.('pricing')
                  }
                }}
              >
                {plan.cta}
              </button>
              {plan.trial && (
                <p className="plan-trial">{plan.trial}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* API Pricing */}
      <section className="api-section">
        <h2>API Pricing</h2>
        <div className="api-card">
          <p>For developers who want to integrate G-Rump into their own apps</p>
          <div className="api-pricing">
            <div className="api-price">$0.05 per animation generated</div>
            <div className="api-discounts">
              <p>Volume discounts:</p>
              <ul>
                <li>10,000+ animations: $0.04 each</li>
                <li>100,000+ animations: $0.03 each</li>
                <li>1,000,000+ animations: Contact us</li>
              </ul>
            </div>
            <div className="api-actions">
              <button className="api-btn">View API Docs</button>
              <button className="api-btn primary">Get API Key</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <h2>FAQ</h2>
        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div key={idx} className="faq-item">
              <button className="faq-question">
                {faq.open ? '▼' : '▶'} {faq.question}
              </button>
              {faq.open && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="pricing-cta">
        <GrumpAvatarWrapper size="medium" />
        <p>"Still thinking? The free tier is right there. I'll be waiting. Judgmentally."</p>
        <button className="cta-button" onClick={() => onNavigate?.('chat')}>Start Free →</button>
      </section>

      {/* Footer */}
      <footer className="pricing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span>G-RUMP</span>
          </div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#examples">Examples</a>
            <a href="#blog">Blog</a>
            <a href="#api">API</a>
            <a href="#discord">Discord</a>
          </div>
        </div>
        <p className="footer-copyright">
          © 2024 G-Rump · Terms · Privacy · "Stop reading the footer and make something"
        </p>
      </footer>
    </div>
  )
}


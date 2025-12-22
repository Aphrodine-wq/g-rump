import { useState } from 'react'
import { PRICING_TIERS, PricingTier, getCurrentTier } from '../config/pricing'
import PaymentView from './PaymentView'
import './PricingView.css'

export default function PricingView() {
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [showPayment, setShowPayment] = useState(false)

  const handleSelectTier = (tier: PricingTier) => {
    if (tier.id === 'free') {
      // Free tier - no payment needed
      localStorage.setItem('subscriptionTier', tier.id)
      window.location.reload()
      return
    }
    
    setSelectedTier(tier)
    setShowPayment(true)
  }

  const handlePaymentComplete = () => {
    window.location.reload()
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
    setSelectedTier(null)
  }

  const getYearlyPrice = (monthlyPrice: number): number => {
    return monthlyPrice * 12 * 0.83 // 17% discount for yearly (2 months free)
  }

  if (showPayment && selectedTier) {
    return (
      <PaymentView
        tier={selectedTier}
        billingCycle={billingCycle}
        onComplete={handlePaymentComplete}
        onCancel={handlePaymentCancel}
      />
    )
  }

  return (
    <div className="pricing-container">
      <div className="pricing-header">
        <h1>Choose Your Plan</h1>
        <p className="pricing-subtitle">
          Pick the perfect plan for how much you want to chat with Grump
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="billing-toggle">
        <button
          className={`billing-option ${billingCycle === 'monthly' ? 'active' : ''}`}
          onClick={() => setBillingCycle('monthly')}
        >
          Monthly
        </button>
        <button
          className={`billing-option ${billingCycle === 'yearly' ? 'active' : ''}`}
          onClick={() => setBillingCycle('yearly')}
        >
          Yearly
          <span className="discount-badge">Save 17%</span>
        </button>
      </div>

      {/* Pricing Cards */}
      <div className="pricing-grid">
        {PRICING_TIERS.map((tier) => {
          const pricePerMonth = billingCycle === 'yearly' && tier.price > 0
            ? `$${(getYearlyPrice(tier.price) / 12).toFixed(2)}/mo`
            : tier.priceDisplay + '/mo'

          return (
            <div
              key={tier.id}
              className={`pricing-card ${tier.popular ? 'popular' : ''} ${selectedTier?.id === tier.id ? 'selected' : ''}`}
              onClick={() => handleSelectTier(tier)}
            >
              {tier.popular && (
                <div className="popular-badge">Most Popular</div>
              )}
              
              <div className="pricing-card-header">
                <h3 className="tier-name">{tier.name}</h3>
                <div className="tier-price">
                  <span className="price-amount">{pricePerMonth}</span>
                  {billingCycle === 'yearly' && tier.price > 0 && (
                    <span className="price-billing">billed annually</span>
                  )}
                </div>
                <p className="tier-description">{tier.description}</p>
              </div>

              <div className="tier-limits">
                <div className="limit-item">
                  <span className="limit-value">
                    {tier.messagesPerMonth >= 1000000 ? 'Unlimited' : tier.messagesPerMonth.toLocaleString()}
                  </span>
                  <span className="limit-label">messages/month</span>
                </div>
              </div>

              <ul className="tier-features">
                {tier.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 4L6 11L3 8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`tier-button ${getCurrentTier().id === tier.id ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelectTier(tier)
                }}
              >
                {getCurrentTier().id === tier.id ? 'Current Plan' : tier.id === 'enterprise' ? 'Contact Sales' : tier.price === 0 ? 'Get Started' : 'Subscribe'}
              </button>
            </div>
          )
        })}
      </div>

      {/* FAQ Section */}
      <div className="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>What happens if I exceed my message limit?</h3>
            <p>You can upgrade your plan at any time. Unused messages don't roll over to the next month.</p>
          </div>
          <div className="faq-item">
            <h3>Can I change plans later?</h3>
            <p>Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div className="faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major credit cards, PayPal, and other secure payment methods.</p>
          </div>
          <div className="faq-item">
            <h3>Is there a refund policy?</h3>
            <p>Yes, we offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

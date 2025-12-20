import { useState } from 'react'
import { PricingTier } from '../config/pricing'
import './PaymentView.css'

interface PaymentViewProps {
  tier: PricingTier
  billingCycle: 'monthly' | 'yearly'
  onComplete: () => void
  onCancel: () => void
}

export default function PaymentView({ tier, billingCycle, onComplete, onCancel }: PaymentViewProps) {
  const [step, setStep] = useState<'details' | 'payment'>('details')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple'>('card')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [email, setEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const getYearlyPrice = (monthlyPrice: number): number => {
    return monthlyPrice * 12 * 0.83 // 17% discount
  }

  const finalPrice = billingCycle === 'yearly' && tier.price > 0
    ? getYearlyPrice(tier.price)
    : tier.price

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (paymentMethod === 'card') {
      if (!cardName.trim()) {
        newErrors.cardName = 'Cardholder name is required'
      }
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Please enter a valid card number'
      }
      if (!expiryDate || expiryDate.length < 5) {
        newErrors.expiryDate = 'Please enter expiry date (MM/YY)'
      }
      if (!cvv || cvv.length < 3) {
        newErrors.cvv = 'Please enter CVV'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (validateForm()) {
      setStep('payment')
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In production, this would call your payment API
    // For now, just save the tier selection
    localStorage.setItem('subscriptionTier', tier.id)
    localStorage.setItem('subscriptionBillingCycle', billingCycle)
    localStorage.setItem('subscriptionEmail', email)
    
    setIsProcessing(false)
    onComplete()
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setCardNumber(formatted)
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value)
    setExpiryDate(formatted)
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, '').substring(0, 4)
    setCvv(v)
  }

  return (
    <div className="payment-container">
      <div className="payment-header">
        <button className="payment-back-btn" onClick={step === 'details' ? onCancel : () => setStep('details')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1>{step === 'details' ? 'Checkout' : 'Payment'}</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="payment-content">
        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-item">
            <div className="summary-label">
              <span className="summary-tier-name">{tier.name} Plan</span>
              <span className="summary-billing">{billingCycle === 'yearly' ? 'Annual' : 'Monthly'} billing</span>
            </div>
            <div className="summary-price">
              {tier.price === 0 ? (
                <span>Free</span>
              ) : (
                <>
                  <span className="price-amount">${finalPrice.toFixed(2)}</span>
                  {billingCycle === 'yearly' && (
                    <span className="price-savings">Save 17%</span>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="summary-features">
            <div className="feature-item">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 4L6 11L3 8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{tier.messagesPerMonth.toLocaleString()} messages per month</span>
            </div>
            {tier.features.slice(1, 3).map((feature, idx) => (
              <div key={idx} className="feature-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 4L6 11L3 8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {step === 'details' ? (
          <>
            {/* Email Input */}
            <div className="payment-section">
              <label className="payment-label">Email Address</label>
              <input
                type="email"
                className={`payment-input ${errors.email ? 'error' : ''}`}
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* Payment Method Selection */}
            <div className="payment-section">
              <label className="payment-label">Payment Method</label>
              <div className="payment-methods">
                <button
                  className={`payment-method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  <span>Credit Card</span>
                </button>
                <button
                  className={`payment-method-btn ${paymentMethod === 'paypal' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <span style={{ fontWeight: 600, fontSize: '18px' }}>PayPal</span>
                </button>
                <button
                  className={`payment-method-btn ${paymentMethod === 'apple' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('apple')}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <span>Apple Pay</span>
                </button>
              </div>
            </div>

            {/* Card Details (if card selected) */}
            {paymentMethod === 'card' && (
              <div className="payment-section">
                <label className="payment-label">Card Information</label>
                <input
                  type="text"
                  className={`payment-input ${errors.cardName ? 'error' : ''}`}
                  placeholder="Cardholder Name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
                {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                
                <input
                  type="text"
                  className={`payment-input ${errors.cardNumber ? 'error' : ''}`}
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                />
                {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                
                <div className="card-row">
                  <input
                    type="text"
                    className={`payment-input ${errors.expiryDate ? 'error' : ''}`}
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    maxLength={5}
                  />
                  <input
                    type="text"
                    className={`payment-input ${errors.cvv ? 'error' : ''}`}
                    placeholder="CVV"
                    value={cvv}
                    onChange={handleCvvChange}
                    maxLength={4}
                  />
                </div>
                {(errors.expiryDate || errors.cvv) && (
                  <span className="error-message">{errors.expiryDate || errors.cvv}</span>
                )}
              </div>
            )}

            {/* Continue Button */}
            <button className="payment-primary-btn" onClick={handleContinue}>
              Continue to Payment
            </button>
          </>
        ) : (
          <>
            {/* Payment Confirmation */}
            <div className="payment-section">
              <div className="confirmation-box">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>Review Your Order</h3>
                <p className="confirmation-text">
                  You'll be charged <strong>${finalPrice.toFixed(2)}</strong> {billingCycle === 'yearly' ? 'annually' : 'monthly'} for the <strong>{tier.name}</strong> plan.
                </p>
                <p className="confirmation-subtext">
                  You can cancel anytime from your account settings.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              className="payment-primary-btn" 
              onClick={handleSubmit}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"/>
                  </svg>
                  Processing...
                </>
              ) : (
                `Complete Payment - $${finalPrice.toFixed(2)}`
              )}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Lock, CreditCard } from 'lucide-react';

export default function PaymentScreen({ grandTotal, user, onBack, onCompletePayment }) {
  const [secondsLeft, setSecondsLeft] = useState(570); // 09:30
  const [cardNumber, setCardNumber] = useState('1234 5678 9012 3456');
  const [cardHolder, setCardHolder] = useState(user ? user.name : 'Alex Rivera');
  const [expiry, setExpiry] = useState('08/27');
  const [cvv, setCvv] = useState('123');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handlePay = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onCompletePayment();
    }, 1000);
  };

  return (
    <div className="seat-booking-container">
      {/* Back Link */}
      <button type="button" className="back-link-btn" onClick={onBack}>
        <ArrowLeft size={16} />
        Order Summary
      </button>

      <div className="order-summary-wrapper">
        {/* Header Row */}
        <div className="order-header-row">
          <h1 className="seat-movie-title" style={{ margin: 0 }}>Payment</h1>

          <div className="seats-held-timer-badge">
            <Clock size={16} />
            <span>Seats held for <strong>{formatTimer(secondsLeft)}</strong></span>
          </div>
        </div>

        {/* Credit Card Graphic Card (Matching Image 5) */}
        <div className="payment-graphic-card">
          <div className="payment-card-label">PAYMENT CARD</div>
          <div className="payment-card-dots">
            {cardNumber ? cardNumber.replace(/.(?=.{4})/g, '•') : '••••  ••••  ••••  ••••'}
          </div>
          <div className="payment-card-bottom">
            <div>
              <div style={{ fontSize: '0.65rem', color: '#606684', fontWeight: 700, letterSpacing: '1px' }}>CARD HOLDER</div>
              <div className="payment-holder-name">{cardHolder || 'ALEX RIVERA'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.65rem', color: '#606684', fontWeight: 700, letterSpacing: '1px' }}>EXPIRES</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>{expiry || 'MM/YY'}</div>
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handlePay} className="auth-form">
          <div className="form-group">
            <label className="form-label">CARD NUMBER</label>
            <div className="input-wrapper">
              <input
                type="text"
                className="form-input"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">CARDHOLDER NAME</label>
            <div className="input-wrapper">
              <input
                type="text"
                className="form-input"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                placeholder="Alex Rivera"
                required
              />
            </div>
          </div>

          <div className="modal-form-grid-2">
            <div className="form-group">
              <label className="form-label">EXPIRY (MM/YY)</label>
              <input
                type="text"
                className="form-input"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="08/27"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">CVV</label>
              <input
                type="password"
                className="form-input"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="•••"
                maxLength={4}
                required
              />
            </div>
          </div>

          {/* Security Notice Box */}
          <div className="security-box-notice">
            <Lock size={18} style={{ flexShrink: 0 }} />
            <span>Payments are end-to-end encrypted and processed securely. (Demo — no real charge.)</span>
          </div>

          {/* Submit Pay Button */}
          <button type="submit" className="submit-btn" style={{ padding: '1rem', fontSize: '1.05rem' }} disabled={loading}>
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Processing Payment...</span>
              </>
            ) : (
              <span>Pay ${grandTotal} & Confirm</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

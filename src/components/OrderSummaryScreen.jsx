import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';

export default function OrderSummaryScreen({ film, theaterName, timeStr, selectedSeats, subtotal, onBack, onProceed }) {
  const [secondsLeft, setSecondsLeft] = useState(594); // 09:54

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

  const serviceFee = Number((subtotal * 0.05).toFixed(1));
  const grandTotal = Number((subtotal + serviceFee).toFixed(1));

  return (
    <div className="seat-booking-container">
      {/* Back Link */}
      <button type="button" className="back-link-btn" onClick={onBack}>
        <ArrowLeft size={16} />
        Edit Seats
      </button>

      <div className="order-summary-wrapper">
        {/* Header Row with Timer */}
        <div className="order-header-row">
          <h1 className="seat-movie-title" style={{ margin: 0 }}>Order Summary</h1>

          <div className="seats-held-timer-badge">
            <Clock size={16} />
            <span>Seats held for <strong>{formatTimer(secondsLeft)}</strong></span>
          </div>
        </div>

        {/* Order Card (Matching Image 4) */}
        <div className="order-card">
          <div className="order-movie-header">
            <img src={film.poster} alt={film.title} className="order-poster-thumb" />
            <div className="order-movie-details">
              <div className="order-movie-name">{film.title}</div>
              <div className="order-venue-text">{theaterName || 'Grand Hall'}</div>
              <div className="order-venue-text">Sat, Jul 25 · {timeStr || '11:00 AM'}</div>
            </div>
          </div>

          <div className="order-breakdown-table">
            <div className="order-line-item">
              <span>Seats</span>
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{selectedSeats.join(', ')}</span>
            </div>
            <div className="order-line-item">
              <span>{selectedSeats.length} × $14</span>
              <span>${subtotal}</span>
            </div>
            <div className="order-line-item">
              <span>Service fee (5%)</span>
              <span>${serviceFee}</span>
            </div>
            <div className="order-line-item total">
              <span>Total</span>
              <span>${grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          className="submit-btn"
          style={{ padding: '1rem', fontSize: '1.05rem' }}
          onClick={() => onProceed({ grandTotal, serviceFee })}
        >
          Proceed to Payment →
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import { Check } from 'lucide-react';

export default function BookingConfirmedScreen({ booking, onGoToBookings, onBrowseFilms }) {
  if (!booking) return null;

  const serviceFee = (booking.subtotal * 0.05).toFixed(1);
  const totalCharged = booking.totalAmount || (booking.subtotal * 1.05).toFixed(1);

  return (
    <div
      style={{
        padding: '3rem 1.5rem 6rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        {/* Green Circle Checkmark Icon */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#16281E',
            border: '1px solid #284A35',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4CAF50',
            marginBottom: '1.75rem',
            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.15)'
          }}
        >
          <Check size={28} strokeWidth={2.5} />
        </div>

        {/* Title & Subtitle */}
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.8rem',
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: '0.6rem',
            lineHeight: 1.1
          }}
        >
          Booking Confirmed
        </h1>
        <p style={{ color: '#8E95B3', fontSize: '0.98rem', marginBottom: '2.25rem' }}>
          Your seats are reserved. Enjoy the film.
        </p>

        {/* Card Container (Exact Figma Spec) */}
        <div
          style={{
            width: '100%',
            background: '#12141D',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.4rem',
            textAlign: 'left',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
          }}
        >
          {/* Reference Header */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1.5px', color: '#606684', textTransform: 'uppercase' }}>
              BOOKING REFERENCE
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '2.5px' }}>
              {booking.bookingRef}
            </div>
          </div>

          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />

          {/* Breakdown Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: '#8E95B3' }}>
              <span>Film</span>
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{booking.film.title}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: '#8E95B3' }}>
              <span>Date & Time</span>
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>Sat, Jul 25 · {booking.timeStr}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: '#8E95B3' }}>
              <span>Seats</span>
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{booking.seats.join(', ')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: '#8E95B3' }}>
              <span>Subtotal</span>
              <span>${booking.subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: '#8E95B3' }}>
              <span>Service fee</span>
              <span>${serviceFee}</span>
            </div>

            <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '0.3rem 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>
              <span>Total Charged</span>
              <span style={{ color: 'var(--accent-gold)' }}>${totalCharged}</span>
            </div>
          </div>
        </div>

        {/* Dual Action Buttons (Exact Figma Spec) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', marginTop: '1.75rem' }}>
          <button
            type="button"
            style={{
              padding: '0.9rem',
              backgroundColor: '#181A26',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.95rem',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
            onClick={onGoToBookings}
          >
            My Bookings
          </button>

          <button
            type="button"
            style={{
              padding: '0.9rem',
              backgroundColor: 'var(--accent-gold)',
              border: 'none',
              color: '#10121A',
              fontWeight: 700,
              fontSize: '0.95rem',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
            onClick={onBrowseFilms}
          >
            Browse Films
          </button>
        </div>
      </div>
    </div>
  );
}

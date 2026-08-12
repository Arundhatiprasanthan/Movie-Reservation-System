import React from 'react';

export default function MyBookings({ bookings = [], onBrowseClick, onCancelBooking }) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="my-bookings-container">
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '2rem',
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: '3rem',
            letterSpacing: '-0.5px'
          }}
        >
          My Bookings
        </h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: '35vh',
            gap: '0.4rem'
          }}
        >
          <div style={{ fontSize: '1.25rem', fontWeight: 500, color: '#3E4460' }}>
            No bookings yet
          </div>
          <button
            type="button"
            onClick={onBrowseClick}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#2B3147',
              fontSize: '0.95rem',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--accent-gold)'}
            onMouseLeave={(e) => e.target.style.color = '#2B3147'}
          >
            Browse films and reserve your seats.
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-bookings-container">
      <h1
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '2rem',
          fontWeight: 700,
          color: '#FFFFFF',
          marginBottom: '2.5rem',
          letterSpacing: '-0.5px'
        }}
      >
        My Bookings
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
        {bookings.map((b) => (
          <div
            key={b.id}
            style={{
              background: '#12141D',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.4rem 1.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              width: '100%'
            }}
          >
            <div style={{ display: 'flex', gap: '1.4rem', alignItems: 'center', flex: 1 }}>
              <img
                src={b.film.poster}
                alt={b.film.title}
                style={{ width: '64px', height: '90px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255, 255, 255, 0.1)' }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1.15rem' }}>
                  {b.film.title}
                </div>
                <div style={{ color: '#8E95B3', fontSize: '0.88rem' }}>
                  {b.theaterName || 'Grand Hall'} · Sat, Jul 25 · {b.timeStr}
                </div>
                <div style={{ color: '#8E95B3', fontSize: '0.88rem' }}>
                  {b.seats.join(', ')}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.35rem' }}>
                  <span
                    style={{
                      background: '#1B3B2B',
                      color: '#4CAF50',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 9px',
                      borderRadius: '5px',
                      letterSpacing: '0.5px'
                    }}
                  >
                    CONFIRMED
                  </span>
                  <span
                    style={{
                      color: 'var(--accent-gold)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {b.bookingRef}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
              <div style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '1.25rem' }}>
                ${b.totalAmount}
              </div>
              <button
                type="button"
                style={{ background: 'none', border: 'none', color: '#6C728F', fontSize: '0.85rem', cursor: 'pointer', transition: 'color 0.15s ease' }}
                onClick={() => onCancelBooking && onCancelBooking(b.id)}
                onMouseEnter={(e) => e.target.style.color = '#E57373'}
                onMouseLeave={(e) => e.target.style.color = '#6C728F'}
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

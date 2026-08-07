import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function SeatSelectionScreen({ film, theaterName, timeStr, onBack, onContinue }) {
  const pricePerSeat = 14;
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const cols = Array.from({ length: 14 }, (_, i) => i + 1);

  // Preset reserved and blocked seats for realistic demo (matching Figma)
  const reservedSeats = new Set(['C5', 'C6', 'C7', 'F8', 'F9', 'F10', 'H4', 'H5']);
  const blockedSeats = new Set(['B2', 'D13', 'G1']);

  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seatId) => {
    if (reservedSeats.has(seatId) || blockedSeats.has(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const totalPrice = selectedSeats.length * pricePerSeat;

  return (
    <div className="seat-booking-container">
      {/* Back Link */}
      <button type="button" className="back-link-btn" onClick={onBack}>
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Header Info */}
      <div>
        <h1 className="seat-movie-title">Seat Selection</h1>
        <div className="seat-movie-sub">
          {film?.title || 'Ember & Ash'} · {theaterName || 'Grand Hall'} · Sat, Jul 25 · {timeStr || '11:00 AM'} · <span className="price-tag">${pricePerSeat}</span> / seat
        </div>
      </div>

      {/* Curved Screen Indicator */}
      <div className="screen-indicator-wrapper">
        <div className="screen-arc-line" />
        <div className="screen-text">SCREEN</div>
      </div>

      {/* Seat Matrix Grid */}
      <div className="seat-matrix-wrapper">
        {rows.map(row => (
          <div key={row} className="seat-row">
            <div className="row-label">{row}</div>
            <div className="seat-grid-row">
              {cols.map(col => {
                const seatId = `${row}${col}`;
                const isSelected = selectedSeats.includes(seatId);
                const isReserved = reservedSeats.has(seatId);
                const isBlocked = blockedSeats.has(seatId);

                let statusClass = 'available';
                if (isSelected) statusClass = 'selected';
                else if (isReserved) statusClass = 'reserved';
                else if (isBlocked) statusClass = 'blocked';

                return (
                  <button
                    key={seatId}
                    type="button"
                    title={`Seat ${seatId}`}
                    className={`seat-pill ${statusClass}`}
                    onClick={() => toggleSeat(seatId)}
                    disabled={isReserved || isBlocked}
                  />
                );
              })}
            </div>
            <div className="row-label">{row}</div>
          </div>
        ))}
      </div>

      {/* Seat Legend Bar */}
      <div className="seat-legend-bar">
        <div className="legend-item">
          <div className="legend-sample available" />
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-sample selected" />
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-sample reserved" />
          <span>Reserved</span>
        </div>
        <div className="legend-item">
          <div className="legend-sample blocked" />
          <span>Blocked</span>
        </div>
      </div>

      {/* Bottom Action Footer (Matching Images 2 & 3) */}
      <div className="seat-bottom-bar">
        {selectedSeats.length === 0 ? (
          <div className="selection-info-text">Click seats to select them</div>
        ) : (
          <div className="selection-total-info">
            <div className="seat-codes-highlight">
              {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'}: <span>{selectedSeats.join(', ')}</span>
            </div>
            <div className="seat-total-price">
              Total: <span>${totalPrice}</span>
            </div>
          </div>
        )}

        <button
          type="button"
          className={`btn-continue-pill ${selectedSeats.length === 0 ? 'disabled' : ''}`}
          disabled={selectedSeats.length === 0}
          onClick={() => selectedSeats.length > 0 && onContinue(selectedSeats, totalPrice)}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

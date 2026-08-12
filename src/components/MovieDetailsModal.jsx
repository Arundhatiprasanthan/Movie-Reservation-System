import React, { useState } from 'react';
import { X, Clock, Calendar, Star, Film, Ticket, ShieldCheck } from 'lucide-react';

export default function MovieDetailsModal({ film, onClose, onBookSeats }) {
  const [selectedTheater, setSelectedTheater] = useState(1);
  const [selectedTime, setSelectedTime] = useState('06:45 PM');

  if (!film) return null;

  const theaters = [
    { id: 1, name: 'Grand Hall', sub: 'Dolby Atmos · Screen 1', times: ['10:30 AM', '02:15 PM', '06:45 PM', '09:30 PM'] },
    { id: 2, name: 'Premiere Suite', sub: 'VIP Recliners · Screen 2', times: ['11:45 AM', '03:30 PM', '07:15 PM', '10:15 PM'] },
    { id: 3, name: 'Studio Screen', sub: 'Arthouse · Screen 3', times: ['01:00 PM', '05:00 PM', '08:45 PM'] }
  ];

  const currentTheaterObj = theaters.find(t => t.id === selectedTheater) || theaters[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="movie-details-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Banner Backdrop */}
        <div
          className="details-banner-backdrop"
          style={{ backgroundImage: `url(${film.banner || film.poster})` }}
        >
          <div className="details-banner-overlay" />
          <button type="button" className="details-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Details Content Body */}
        <div className="details-body-content">
          {/* Main Info Header Row */}
          <div className="details-main-info-row">
            <img src={film.poster} alt={film.title} className="details-poster-img" />

            <div className="details-title-group">
              <div className="details-meta-row">
                <span className="details-rating-badge">{film.rating}</span>
                <span>{film.genre}</span>
                <span>•</span>
                <span>{film.duration}</span>
                <span>•</span>
                <span>{film.year || '2026'}</span>
              </div>
              <h1 className="details-movie-title">{film.title}</h1>
              <p className="details-synopsis">{film.description}</p>
            </div>
          </div>

          {/* Credits Row */}
          <div className="details-credits-row">
            <div>
              <div className="credits-label">DIRECTOR</div>
              <div className="credits-value">{film.director || 'Alex Rivera'}</div>
            </div>
            <div>
              <div className="credits-label">CAST</div>
              <div className="credits-value">{film.cast || 'David Chen, Sarah Jenkins'}</div>
            </div>
          </div>

          {/* Theater & Showtime Selector */}
          <div className="showtime-selector-section">
            <div className="section-label">SELECT THEATER & SHOWTIME</div>

            <div className="theaters-choice-grid">
              {theaters.map(t => (
                <div
                  key={t.id}
                  className={`theater-choice-card ${selectedTheater === t.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedTheater(t.id);
                    setSelectedTime(t.times[0]);
                  }}
                >
                  <div className="theater-choice-name">{t.name}</div>
                  <div className="theater-choice-sub">{t.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#606684', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                AVAILABLE SHOW TIMES
              </div>
              <div className="times-pills-row">
                {currentTheaterObj.times.map(timeStr => (
                  <button
                    key={timeStr}
                    type="button"
                    className={`time-pill-btn ${selectedTime === timeStr ? 'active' : ''}`}
                    onClick={() => setSelectedTime(timeStr)}
                  >
                    {timeStr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            className="submit-btn"
            style={{ padding: '1rem', fontSize: '1.05rem', marginTop: '0.5rem' }}
            onClick={() => onBookSeats(film, currentTheaterObj.name, selectedTime)}
          >
            <Ticket size={20} />
            Select Seats & Book Tickets
          </button>
        </div>
      </div>
    </div>
  );
}

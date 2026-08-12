import React, { useState } from 'react';
import { Plus, X, Image as ImageIcon } from 'lucide-react';

export default function AdminDashboard({ films: externalFilms, setFilms: externalSetFilms, onShowToast }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'movies' | 'theaters' | 'showtimes'

  // Default fallback films if external state is not provided
  const [internalFilms, setInternalFilms] = useState([
    {
      id: 1,
      title: 'Neon Frontier',
      genre: 'Sci-Fi',
      duration: '142m',
      rating: 'PG-13',
      shows: 3,
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=300&auto=format&fit=crop',
      banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop',
      year: '2026',
      director: 'Alex Rivera',
      cast: 'David Chen, Sarah Jenkins, Lucas Vance',
      description: 'In a neon-drenched metropolis controlled by artificial intelligence, a rogue operative discovers a dark conspiracy that threatens to erase human consciousness.'
    },
    {
      id: 2,
      title: 'The Venetian Heist',
      genre: 'Thriller',
      duration: '118m',
      rating: 'R',
      shows: 3,
      poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=300&auto=format&fit=crop',
      banner: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200&auto=format&fit=crop',
      year: '2026',
      director: 'Marco Rossi',
      cast: 'Elena Vance, Lucas Thorne, Roberto Blanc',
      description: 'An international team of master thieves plan an audacious robbery during the high tide festival in Venice, navigating treacherous waters and betrayal.'
    },
    {
      id: 3,
      title: 'Ember & Ash',
      genre: 'Drama',
      duration: '126m',
      rating: 'PG-13',
      shows: 2,
      poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=300&auto=format&fit=crop',
      banner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
      year: '2025',
      director: 'Sofia Al-Mansoor',
      cast: 'Claire Redfield, Julian Vance, Hannah Kim',
      description: 'A powerful family saga following two estranged siblings fighting to protect their ancestral vineyard amidst environmental challenges.'
    },
    {
      id: 4,
      title: 'Razorback',
      genre: 'Action',
      duration: '108m',
      rating: 'R',
      shows: 2,
      poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300&auto=format&fit=crop',
      banner: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop',
      year: '2026',
      director: 'Jaxom Steele',
      cast: 'Marcus Stone, Amanda Drake, Ray Jackson',
      description: 'Stranded in the unforgiving Australian wilderness, a former special ops officer must outsmart a ruthless mercenary syndicate.'
    },
    {
      id: 5,
      title: 'The Laughing Fox',
      genre: 'Comedy',
      duration: '95m',
      rating: 'PG',
      shows: 2,
      poster: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=300&auto=format&fit=crop',
      banner: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=1200&auto=format&fit=crop',
      year: '2026',
      director: 'Oliver Hayes',
      cast: 'Benny Hill, Zoe Cooper, Charles Sterling',
      description: 'An eccentric estate manager accidentally hosts three competing wedding parties at the exact same English manor on the same weekend.'
    },
    {
      id: 6,
      title: 'Whispers in the Deep',
      genre: 'Horror',
      duration: '112m',
      rating: 'R',
      shows: 2,
      poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300&auto=format&fit=crop',
      banner: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
      year: '2026',
      director: 'Naomi Watts',
      cast: 'Ethan Hawke, Maya Lin, Sam Rockwell',
      description: 'Deep sea oceanographers investigating an unmapped trench discover an ancient underwater structure harboring horrors from beyond time.'
    }
  ]);

  const films = externalFilms || internalFilms;
  const setFilms = externalSetFilms || setInternalFilms;

  // Theaters list (Includes Grand Hall, Premiere Suite, Studio Screen, + Custom)
  const [theaters, setTheaters] = useState([
    {
      id: 1,
      name: 'Grand Hall',
      capacity: '126 seats (9×14)',
      description: 'Our flagship 126-seat auditorium with Dolby Atmos.',
      activeShows: 5
    },
    {
      id: 2,
      name: 'Premiere Suite',
      capacity: '84 seats (7×12)',
      description: 'Premium 84-seat hall with reclining seats.',
      activeShows: 5
    },
    {
      id: 3,
      name: 'Studio Screen',
      capacity: '60 seats (6×10)',
      description: 'Intimate 60-seat arthouse screen.',
      activeShows: 4
    }
  ]);

  // Exact 14 Showtimes from Screenshot 1
  const [showtimes, setShowtimes] = useState([
    { id: 1, film: 'Neon Frontier', theater: 'Grand Hall', dateTime: 'Fri, Jul 24 · 2:30 PM', price: '$16', occupancy: '126/126' },
    { id: 2, film: 'Neon Frontier', theater: 'Premiere Suite', dateTime: 'Fri, Jul 24 · 7:00 PM', price: '$18', occupancy: '84/84' },
    { id: 3, film: 'Neon Frontier', theater: 'Grand Hall', dateTime: 'Sat, Jul 25 · 11:00 AM', price: '$14', occupancy: '126/126' },
    { id: 4, film: 'The Venetian Heist', theater: 'Premiere Suite', dateTime: 'Fri, Jul 24 · 4:45 PM', price: '$18', occupancy: '84/84' },
    { id: 5, film: 'The Venetian Heist', theater: 'Studio Screen', dateTime: 'Fri, Jul 24 · 9:00 PM', price: '$16', occupancy: '60/60' },
    { id: 6, film: 'The Venetian Heist', theater: 'Grand Hall', dateTime: 'Sat, Jul 25 · 6:30 PM', price: '$18', occupancy: '126/126' },
    { id: 7, film: 'Ember & Ash', theater: 'Studio Screen', dateTime: 'Fri, Jul 24 · 1:00 PM', price: '$14', occupancy: '60/60' },
    { id: 8, film: 'Ember & Ash', theater: 'Premiere Suite', dateTime: 'Sat, Jul 25 · 8:15 PM', price: '$18', occupancy: '84/84' },
    { id: 9, film: 'Razorback', theater: 'Grand Hall', dateTime: 'Fri, Jul 24 · 5:00 PM', price: '$16', occupancy: '126/126' },
    { id: 10, film: 'Razorback', theater: 'Premiere Suite', dateTime: 'Sat, Jul 25 · 2:00 PM', price: '$16', occupancy: '84/84' },
    { id: 11, film: 'The Laughing Fox', theater: 'Studio Screen', dateTime: 'Fri, Jul 24 · 3:30 PM', price: '$14', occupancy: '60/60' },
    { id: 12, film: 'The Laughing Fox', theater: 'Grand Hall', dateTime: 'Sun, Jul 26 · 12:00 PM', price: '$14', occupancy: '126/126' },
    { id: 13, film: 'Whispers in the Deep', theater: 'Premiere Suite', dateTime: 'Fri, Jul 24 · 10:30 PM', price: '$18', occupancy: '84/84' },
    { id: 14, film: 'Whispers in the Deep', theater: 'Studio Screen', dateTime: 'Sat, Jul 25 · 9:45 PM', price: '$16', occupancy: '60/60' }
  ]);

  const [bookings] = useState([]);

  // Modal State for Add / Edit Film
  const [isAddFilmModalOpen, setIsAddFilmModalOpen] = useState(false);
  const [editingFilmId, setEditingFilmId] = useState(null);

  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('Sci-Fi');
  const [rating, setRating] = useState('PG-13');
  const [duration, setDuration] = useState('120');
  const [year, setYear] = useState('2026');
  const [director, setDirector] = useState('');
  const [cast, setCast] = useState('');
  const [description, setDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

  // Modal State for Add Theater
  const [isAddTheaterModalOpen, setIsAddTheaterModalOpen] = useState(false);
  const [tName, setTName] = useState('');
  const [rowsCount, setRowsCount] = useState(8);
  const [seatsPerRow, setSeatsPerRow] = useState(12);
  const [tDescription, setTDescription] = useState('');

  // Modal State for Add Showtime
  const [isAddShowtimeModalOpen, setIsAddShowtimeModalOpen] = useState(false);
  const [selectedFilmForShow, setSelectedFilmForShow] = useState('');
  const [selectedTheaterForShow, setSelectedTheaterForShow] = useState('');
  const [showDateTime, setShowDateTime] = useState('');
  const [ticketPrice, setTicketPrice] = useState('16');

  // Modal State for Admin Seat Map View (Matching User Screenshot)
  const [selectedSeatMapShowtime, setSelectedSeatMapShowtime] = useState(null);
  const [blockedSeatsMap, setBlockedSeatsMap] = useState({
    5: ['A4', 'B5', 'B6', 'C7', 'D8', 'E1', 'E2', 'F9']
  });

  const openAddModal = () => {
    setEditingFilmId(null);
    setTitle('');
    setGenre('Sci-Fi');
    setRating('PG-13');
    setDuration('120');
    setYear('2026');
    setDirector('');
    setCast('');
    setDescription('');
    setPosterUrl('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop');
    setBannerUrl('https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop');
    setIsAddFilmModalOpen(true);
  };

  const openEditModal = (film) => {
    setEditingFilmId(film.id);
    setTitle(film.title);
    setGenre(film.genre);
    setRating(film.rating);
    setDuration((film.duration || '120m').replace('m', ''));
    setYear(film.year || '2026');
    setDirector(film.director || '');
    setCast(film.cast || '');
    setDescription(film.description || '');
    setPosterUrl(film.poster || '');
    setBannerUrl(film.banner || film.poster || '');
    setIsAddFilmModalOpen(true);
  };

  const openAddTheaterModal = () => {
    setTName('');
    setRowsCount(8);
    setSeatsPerRow(12);
    setTDescription('');
    setIsAddTheaterModalOpen(true);
  };

  const openAddShowtimeModal = () => {
    setSelectedFilmForShow(films[0]?.title || 'Neon Frontier');
    setSelectedTheaterForShow(theaters[0]?.name || 'Grand Hall');
    setShowDateTime('');
    setTicketPrice('16');
    setIsAddShowtimeModalOpen(true);
  };

  const openSeatMapModal = (showtime) => {
    setSelectedSeatMapShowtime(showtime);
  };

  const toggleBlockSeat = (showtimeId, seatCode) => {
    const currentBlocked = blockedSeatsMap[showtimeId] || [];
    let updated;
    if (currentBlocked.includes(seatCode)) {
      updated = currentBlocked.filter(s => s !== seatCode);
      if (onShowToast) onShowToast(`Unblocked seat ${seatCode}`);
    } else {
      updated = [...currentBlocked, seatCode];
      if (onShowToast) onShowToast(`Blocked seat ${seatCode} for maintenance`);
    }
    setBlockedSeatsMap({
      ...blockedSeatsMap,
      [showtimeId]: updated
    });
  };

  const handleSaveFilm = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formattedDuration = duration.includes('m') ? duration : `${duration}m`;

    if (editingFilmId) {
      setFilms(films.map(f => f.id === editingFilmId ? {
        ...f,
        title,
        genre,
        rating,
        duration: formattedDuration,
        year,
        director,
        cast,
        description,
        poster: posterUrl || f.poster,
        banner: bannerUrl || posterUrl || f.banner
      } : f));
      if (onShowToast) onShowToast(`Updated "${title}" successfully`);
    } else {
      const newFilm = {
        id: Date.now(),
        title,
        genre,
        rating,
        duration: formattedDuration,
        shows: 0,
        poster: posterUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
        banner: bannerUrl || posterUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop',
        year,
        director,
        cast,
        description
      };
      setFilms([newFilm, ...films]);
      if (onShowToast) onShowToast(`Added "${title}" to film catalog`);
    }

    setIsAddFilmModalOpen(false);
  };

  const handleSaveTheater = (e) => {
    e.preventDefault();
    if (!tName.trim()) return;

    const r = parseInt(rowsCount) || 0;
    const s = parseInt(seatsPerRow) || 0;
    const total = r * s;

    const newTheater = {
      id: Date.now(),
      name: tName,
      capacity: `${total} seats (${r}×${s})`,
      description: tDescription || 'Modern cinema hall',
      activeShows: 0
    };

    setTheaters([...theaters, newTheater]);
    setIsAddTheaterModalOpen(false);
    if (onShowToast) onShowToast(`Added "${tName}" theater hall`);
  };

  const handleSaveShowtime = (e) => {
    e.preventDefault();
    let dateFormatted = 'Sat, Jul 25 · 7:30 PM';
    if (showDateTime) {
      const d = new Date(showDateTime);
      if (!isNaN(d.getTime())) {
        dateFormatted = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) +
          ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      }
    }

    const selectedTObj = theaters.find(t => t.name === selectedTheaterForShow);
    const capStr = selectedTObj ? selectedTObj.capacity.split(' ')[0] : '126';

    const newShowtime = {
      id: Date.now(),
      film: selectedFilmForShow,
      theater: selectedTheaterForShow,
      dateTime: dateFormatted,
      price: ticketPrice.startsWith('$') ? ticketPrice : `$${ticketPrice}`,
      occupancy: `${capStr}/${capStr}`
    };

    setShowtimes([newShowtime, ...showtimes]);
    setIsAddShowtimeModalOpen(false);
    if (onShowToast) onShowToast(`Scheduled showtime for "${selectedFilmForShow}" at ${selectedTheaterForShow}`);
  };

  const handleRemoveFilm = (id, filmTitle) => {
    setFilms(films.filter(f => f.id !== id));
    if (onShowToast) onShowToast(`Removed "${filmTitle}" from catalog`);
  };

  const handleRemoveTheater = (id, tName) => {
    setTheaters(theaters.filter(t => t.id !== id));
    if (onShowToast) onShowToast(`Removed "${tName}" theater hall`);
  };

  const handleRemoveShowtime = (id, filmName) => {
    setShowtimes(showtimes.filter(s => s.id !== id));
    if (onShowToast) onShowToast(`Removed showtime schedule for "${filmName}"`);
  };

  return (
    <div className="admin-dashboard-container">
      {/* Title & Administrator Badge Row (Image 2) */}
      <div className="dashboard-header-row">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="administrator-badge">Administrator</div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-cards-grid">
        <div className="kpi-card">
          <div className="kpi-label">FILMS</div>
          <div className="kpi-value">{films.length}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">THEATERS</div>
          <div className="kpi-value">{theaters.length}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">CONFIRMED BOOKINGS</div>
          <div className="kpi-value">{bookings.length}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">REVENUE</div>
          <div className="kpi-value">$0.00</div>
        </div>
      </div>

      {/* Underline Tabs Navigation */}
      <div className="admin-tab-bar">
        <button
          className={`admin-tab-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`admin-tab-item ${activeTab === 'movies' ? 'active' : ''}`}
          onClick={() => setActiveTab('movies')}
        >
          Movies
        </button>
        <button
          className={`admin-tab-item ${activeTab === 'theaters' ? 'active' : ''}`}
          onClick={() => setActiveTab('theaters')}
        >
          Theaters
        </button>
        <button
          className={`admin-tab-item ${activeTab === 'showtimes' ? 'active' : ''}`}
          onClick={() => setActiveTab('showtimes')}
        >
          Showtimes
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#FFF', marginBottom: '0.75rem' }}>
            All Bookings
          </h3>
          <div style={{ color: '#555A75', fontSize: '0.95rem' }}>No bookings yet.</div>
        </div>
      )}

      {/* TAB 2: MOVIES */}
      {activeTab === 'movies' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#FFFFFF' }}>Films Management</h2>
            <button className="btn-gold-pill" onClick={openAddModal}>
              + Add Film
            </button>
          </div>

          <div className="films-table-card">
            <table className="films-table">
              <thead>
                <tr>
                  <th>TITLE</th>
                  <th>GENRE</th>
                  <th>DURATION</th>
                  <th>RATING</th>
                  <th>SHOWS</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {films.map(film => (
                  <tr key={film.id}>
                    <td>
                      <div className="movie-thumb-cell">
                        <img src={film.poster} alt={film.title} className="movie-poster-thumb" />
                        <span className="movie-title-text">{film.title}</span>
                      </div>
                    </td>
                    <td>{film.genre}</td>
                    <td>{film.duration}</td>
                    <td><span className="rating-badge">{film.rating}</span></td>
                    <td>{film.shows || 2}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="table-action-link edit" onClick={() => openEditModal(film)}>Edit</button>
                      <button className="table-action-link remove" onClick={() => handleRemoveFilm(film.id, film.title)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: THEATERS */}
      {activeTab === 'theaters' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#FFFFFF' }}>Theaters</h2>
            <button className="btn-gold-pill" onClick={openAddTheaterModal}>
              + Add Theater
            </button>
          </div>

          <div className="films-table-card">
            <table className="films-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>CAPACITY</th>
                  <th>DESCRIPTION</th>
                  <th>ACTIVE SHOWS</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {theaters.map(t => (
                  <tr key={t.id}>
                    <td className="movie-title-text">{t.name}</td>
                    <td>{t.capacity}</td>
                    <td style={{ color: '#9EA6C6' }}>{t.description}</td>
                    <td>{t.activeShows}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="table-action-link remove" onClick={() => handleRemoveTheater(t.id, t.name)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SHOWTIMES (Matching Screenshot 1) */}
      {activeTab === 'showtimes' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#FFFFFF' }}>Showtimes</h2>
            <button className="btn-gold-pill" onClick={openAddShowtimeModal}>
              + Add Showtime
            </button>
          </div>

          <div className="films-table-card">
            <table className="films-table">
              <thead>
                <tr>
                  <th>FILM</th>
                  <th>THEATER</th>
                  <th>DATE & TIME</th>
                  <th>PRICE</th>
                  <th>OCCUPANCY</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {showtimes.map(st => (
                  <tr key={st.id}>
                    <td className="movie-title-text">{st.film}</td>
                    <td style={{ color: '#9EA6C6' }}>{st.theater}</td>
                    <td style={{ color: '#9EA6C6' }}>{st.dateTime}</td>
                    <td style={{ color: '#FFFFFF', fontWeight: '700' }}>{st.price}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '140px' }}>
                        <div style={{ flex: 1, height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: '100%', height: '100%', background: 'rgba(255, 255, 255, 0.2)' }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#606684', fontWeight: '600' }}>{st.occupancy}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="table-action-link edit" style={{ color: '#7E85A6' }} onClick={() => openSeatMapModal(st)}>
                        Seats
                      </button>
                      <button className="table-action-link remove" onClick={() => handleRemoveShowtime(st.id, st.film)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FULL FEATURED EDIT / ADD FILM MODAL */}
      {isAddFilmModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddFilmModalOpen(false)}>
          <div className="add-film-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="add-film-modal-header">
              <h2 className="add-film-title">{editingFilmId ? 'Edit Film Details & Images' : 'Add New Film'}</h2>
              <button type="button" className="close-modal-btn" onClick={() => setIsAddFilmModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveFilm} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="form-group">
                <label className="form-label">MOVIE TITLE</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Neon Frontier"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="modal-form-grid-2">
                <div className="form-group">
                  <label className="form-label">GENRE</label>
                  <select className="form-select" value={genre} onChange={(e) => setGenre(e.target.value)}>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Drama">Drama</option>
                    <option value="Action">Action</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Horror">Horror</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">RATING</label>
                  <select className="form-select" value={rating} onChange={(e) => setRating(e.target.value)}>
                    <option value="PG-13">PG-13</option>
                    <option value="R">R</option>
                    <option value="PG">PG</option>
                    <option value="G">G</option>
                  </select>
                </div>
              </div>

              <div className="modal-form-grid-2">
                <div className="form-group">
                  <label className="form-label">DURATION (MINUTES)</label>
                  <input type="number" className="form-input" placeholder="120" value={duration} onChange={(e) => setDuration(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">RELEASE YEAR</label>
                  <input type="number" className="form-input" placeholder="2026" value={year} onChange={(e) => setYear(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">DIRECTOR</label>
                <input type="text" className="form-input" placeholder="Director full name" value={director} onChange={(e) => setDirector(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">CAST (COMMA-SEPARATED)</label>
                <input type="text" className="form-input" placeholder="David Chen, Sarah Jenkins, Lucas Vance" value={cast} onChange={(e) => setCast(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">SYNOPSIS / DESCRIPTION</label>
                <textarea className="form-textarea" placeholder="Movie storyline..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>

              {/* POSTER IMAGE URL + PREVIEW */}
              <div className="form-group">
                <label className="form-label">MOVIE POSTER IMAGE URL (VERTICAL POSTER)</label>
                <input type="text" className="form-input" placeholder="https://images.unsplash.com/..." value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} />
                {posterUrl && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#161824', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <img src={posterUrl} alt="Poster preview" style={{ width: '45px', height: '65px', borderRadius: '6px', objectFit: 'cover' }} />
                    <span style={{ fontSize: '0.8rem', color: '#9EA6C6' }}>Live Poster Image Preview</span>
                  </div>
                )}
              </div>

              {/* BANNER BACKDROP IMAGE URL + PREVIEW (Modals & Hero Backdrops) */}
              <div className="form-group">
                <label className="form-label">BANNER / BACKDROP BACKGROUND IMAGE URL (MODAL BACKDROP)</label>
                <input type="text" className="form-input" placeholder="https://images.unsplash.com/..." value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} />
                {bannerUrl && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', background: '#161824', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <img src={bannerUrl} alt="Banner preview" style={{ width: '100%', height: '90px', borderRadius: '6px', objectFit: 'cover' }} />
                    <span style={{ fontSize: '0.8rem', color: '#9EA6C6' }}>Live Modal Background Banner Preview</span>
                  </div>
                )}
              </div>

              <div className="modal-actions-row">
                <button type="button" className="btn-cancel-modal" onClick={() => setIsAddFilmModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-submit-modal">{editingFilmId ? 'Save All Changes' : 'Add Film to Catalog'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD THEATER MODAL */}
      {isAddTheaterModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddTheaterModalOpen(false)}>
          <div className="add-film-modal-card" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
            <div className="add-film-modal-header">
              <h2 className="add-film-title">Add Theater</h2>
              <button type="button" className="close-modal-btn" onClick={() => setIsAddTheaterModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTheater} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="form-group">
                <label className="form-label">THEATER NAME</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Screen 4 — IMAX"
                  value={tName}
                  onChange={(e) => setTName(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="modal-form-grid-2">
                  <div className="form-group">
                    <label className="form-label">ROWS</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="8"
                      value={rowsCount}
                      onChange={(e) => setRowsCount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">SEATS PER ROW</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="12"
                      value={seatsPerRow}
                      onChange={(e) => setSeatsPerRow(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div style={{ marginTop: '0.45rem', fontSize: '0.82rem', color: '#606684', fontWeight: '500' }}>
                  Total capacity: {(parseInt(rowsCount) || 0) * (parseInt(seatsPerRow) || 0)} seats
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">DESCRIPTION</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Brief description"
                  value={tDescription}
                  onChange={(e) => setTDescription(e.target.value)}
                />
              </div>

              <div className="modal-actions-row" style={{ marginTop: '0.5rem' }}>
                <button type="button" className="btn-cancel-modal" style={{ flex: 1 }} onClick={() => setIsAddTheaterModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit-modal" style={{ flex: 1 }}>
                  Add Theater
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SHOWTIME MODAL */}
      {isAddShowtimeModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddShowtimeModalOpen(false)}>
          <div className="add-film-modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="add-film-modal-header">
              <h2 className="add-film-title">Add Showtime</h2>
              <button type="button" className="close-modal-btn" onClick={() => setIsAddShowtimeModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveShowtime} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="form-group">
                <label className="form-label">FILM</label>
                <select
                  className="form-select"
                  value={selectedFilmForShow}
                  onChange={(e) => setSelectedFilmForShow(e.target.value)}
                >
                  {films.map(f => (
                    <option key={f.id} value={f.title}>{f.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">THEATER</label>
                <select
                  className="form-select"
                  value={selectedTheaterForShow}
                  onChange={(e) => setSelectedTheaterForShow(e.target.value)}
                >
                  {theaters.map(t => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">DATE & TIME</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={showDateTime}
                  onChange={(e) => setShowDateTime(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">TICKET PRICE ($)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="16"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions-row" style={{ marginTop: '0.5rem' }}>
                <button type="button" className="btn-cancel-modal" style={{ flex: 1 }} onClick={() => setIsAddShowtimeModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit-modal" style={{ flex: 1 }}>
                  Add Showtime
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEAT MAP MODAL FOR ADMIN (Matching exact user screenshot) */}
      {selectedSeatMapShowtime && (
        <div className="modal-overlay" onClick={() => setSelectedSeatMapShowtime(null)}>
          <div
            className="add-film-modal-card"
            style={{ maxWidth: '580px', padding: '2rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="add-film-modal-header" style={{ marginBottom: '0.75rem' }}>
              <h2 className="add-film-title" style={{ fontSize: '1.6rem' }}>
                Seat Map — {selectedSeatMapShowtime.theater}
              </h2>
              <button type="button" className="close-modal-btn" onClick={() => setSelectedSeatMapShowtime(null)}>
                <X size={20} />
              </button>
            </div>

            <p style={{ color: '#7E85A6', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Click available seats to block/unblock them for maintenance.
            </p>

            {/* Screen Line Indicator */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '2px',
                color: '#4E5370',
                marginBottom: '0.6rem',
                textTransform: 'uppercase'
              }}>
                SCREEN
              </div>
              <div style={{
                height: '3px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(200, 153, 69, 0.4) 50%, transparent 100%)',
                borderRadius: '50%',
                width: '80%',
                margin: '0 auto'
              }} />
            </div>

            {/* Seat Matrix Grid (Rows A to F, 10 Seats per Row) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', alignItems: 'center', marginBottom: '2rem' }}>
              {['A', 'B', 'C', 'D', 'E', 'F'].map((rowLetter) => {
                const blockedList = blockedSeatsMap[selectedSeatMapShowtime.id] || [];
                return (
                  <div key={rowLetter} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#606684', width: '15px', textAlign: 'center' }}>
                      {rowLetter}
                    </span>
                    <div style={{ display: 'flex', gap: '0.45rem' }}>
                      {Array.from({ length: 10 }).map((_, idx) => {
                        const seatNum = idx + 1;
                        const seatCode = `${rowLetter}${seatNum}`;
                        const isBlocked = blockedList.includes(seatCode);

                        // Mock some reserved seats to match screenshot layout
                        const isReserved = ['B4', 'B5', 'C6', 'D7', 'E1', 'E2', 'F9'].includes(seatCode) && !isBlocked;

                        let bgColor = '#363B54'; // Available (Dark Purple/Blue)
                        if (isBlocked) bgColor = '#4A1E26'; // Blocked (Dark Red)
                        else if (isReserved) bgColor = '#181A26'; // Reserved/Sold

                        return (
                          <button
                            key={seatCode}
                            type="button"
                            title={isBlocked ? `Seat ${seatCode} (Blocked for maintenance)` : `Seat ${seatCode}`}
                            onClick={() => toggleBlockSeat(selectedSeatMapShowtime.id, seatCode)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              backgroundColor: bgColor,
                              border: isBlocked ? '1px solid #7E2A38' : '1px solid rgba(255, 255, 255, 0.05)',
                              cursor: 'pointer',
                              transition: 'transform 0.15s ease, background-color 0.15s ease'
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Seat Map Legend (Matching Screenshot) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '2rem',
              marginBottom: '2rem',
              fontSize: '0.85rem',
              color: '#8E95B3'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: '#363B54', display: 'inline-block' }} />
                <span>Available</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: '#4A1E26', border: '1px solid #7E2A38', display: 'inline-block' }} />
                <span>Blocked</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: '#181A26', display: 'inline-block' }} />
                <span>Reserved/Sold</span>
              </div>
            </div>

            {/* Full-width Close Button (Matching Screenshot) */}
            <button
              type="button"
              onClick={() => setSelectedSeatMapShowtime(null)}
              style={{
                width: '100%',
                padding: '0.9rem',
                backgroundColor: '#1B1D2A',
                color: '#FFFFFF',
                fontWeight: '700',
                fontSize: '0.95rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

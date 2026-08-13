import { useState } from "react";
import { Plus, Trash2, Film, Monitor, Clock, List, LogOut, DollarSign, Users, CheckCircle, Video } from "lucide-react";

export default function AdminDashboard({ 
  user, 
  onLogout,
  movies, 
  setMovies, 
  theaters, 
  setTheaters, 
  showtimes, 
  setShowtimes, 
  bookings,
  setBookings 
}) {
  const [activeTab, setActiveTab] = useState("Overview"); // Overview, Movies, Theaters, Showtimes

  // Form states
  const [newMovie, setNewMovie] = useState({
    title: "", genre: "Sci-Fi", duration: "", rating: "", certificate: "PG-13", year: 2026, ticketPrice: 350, director: "", cast: "", poster: "", description: ""
  });
  const [newTheater, setNewTheater] = useState({
    name: "", rows: 6, cols: 10
  });
  const [newShowtime, setNewShowtime] = useState({
    movieId: "", theaterId: "", time: "", date: "Today", type: "Standard", priceMultiplier: 1.0
  });

  // Calculate statistics
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

  // Handlers
  const handleAddMovie = (e) => {
    e.preventDefault();
    if (!newMovie.title || !newMovie.duration || !newMovie.rating) return;
    
    const createdMovie = {
      ...newMovie,
      id: movies.length + 1,
      poster: newMovie.poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60"
    };
    
    setMovies([...movies, createdMovie]);
    // Reset form
    setNewMovie({
      title: "", genre: "Sci-Fi", duration: "", rating: "", certificate: "PG-13", year: 2026, ticketPrice: 350, director: "", cast: "", poster: "", description: ""
    });
  };

  const handleDeleteMovie = (id) => {
    setMovies(movies.filter(m => m.id !== id));
    setShowtimes(showtimes.filter(s => s.movieId !== id));
  };

  const handleAddTheater = (e) => {
    e.preventDefault();
    if (!newTheater.name) return;
    
    const createdTheater = {
      id: theaters.length + 1,
      name: newTheater.name,
      rows: Number(newTheater.rows),
      cols: Number(newTheater.cols),
      capacity: Number(newTheater.rows) * Number(newTheater.cols)
    };
    
    setTheaters([...theaters, createdTheater]);
    setNewTheater({ name: "", rows: 6, cols: 10 });
  };

  const handleAddShowtime = (e) => {
    e.preventDefault();
    if (!newShowtime.movieId || !newShowtime.theaterId || !newShowtime.time) return;
    
    const createdShowtime = {
      id: showtimes.length + 101,
      movieId: Number(newShowtime.movieId),
      theaterId: Number(newShowtime.theaterId),
      time: newShowtime.time,
      date: newShowtime.date,
      type: newShowtime.type,
      priceMultiplier: Number(newShowtime.priceMultiplier)
    };
    
    setShowtimes([...showtimes, createdShowtime]);
    setNewShowtime({
      movieId: "", theaterId: "", time: "", date: "Today", type: "Standard", priceMultiplier: 1.0
    });
  };

  const handleDeleteBooking = (id) => {
    setBookings(bookings.filter(b => b.id !== id));
  };

  return (
    <div style={styles.dashboardContainer} className="animate-fade-in">
      {/* Top Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>
          <Film size={24} color="var(--primary)" />
          <span style={styles.brandText}>CINÉ<span style={{ color: "var(--primary)" }}>VAULT</span></span>
        </div>
        <div style={styles.navActions}>
          <span className="gold-badge" style={{ marginRight: "16px" }}>
            <Users size={12} />
            ADMIN
          </span>
          <button onClick={onLogout} style={styles.signOutBtn}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </nav>

      {/* Header and Title */}
      <div style={styles.dashboardHeader}>
        <div style={styles.headerTitleGroup}>
          <h1 style={styles.mainTitle}>Admin Dashboard</h1>
          <span className="gold-badge" style={{ fontSize: "12px", padding: "6px 12px" }}>
            {user.role}
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Films</span>
          <span className="stat-value">{movies.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Theaters</span>
          <span className="stat-value">{theaters.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Confirmed Bookings</span>
          <span className="stat-value">{bookings.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Revenue</span>
          <span className="stat-value">₹{totalRevenue.toLocaleString()}</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="tab-headers">
        <button 
          className={`tab-link ${activeTab === "Overview" ? "active" : ""}`}
          onClick={() => setActiveTab("Overview")}
        >
          Overview
        </button>
        <button 
          className={`tab-link ${activeTab === "Movies" ? "active" : ""}`}
          onClick={() => setActiveTab("Movies")}
        >
          Movies
        </button>
        <button 
          className={`tab-link ${activeTab === "Theaters" ? "active" : ""}`}
          onClick={() => setActiveTab("Theaters")}
        >
          Theaters
        </button>
        <button 
          className={`tab-link ${activeTab === "Showtimes" ? "active" : ""}`}
          onClick={() => setActiveTab("Showtimes")}
        >
          Showtimes
        </button>
      </div>

      {/* Tab Body */}
      <div style={styles.tabContent}>
        {activeTab === "Overview" && (
          <div className="animate-fade-in" style={styles.gridSplit}>
            {/* Recent Bookings Table */}
            <div className="premium-card" style={{ flex: 2 }}>
              <h3 style={styles.cardTitle}>Recent Bookings</h3>
              {bookings.length === 0 ? (
                <p style={styles.emptyText}>No bookings found.</p>
              ) : (
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Booking ID</th>
                        <th style={styles.th}>Movie</th>
                        <th style={styles.th}>Customer</th>
                        <th style={styles.th}>Seats</th>
                        <th style={styles.th}>Amount</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => {
                        const movie = movies.find(m => m.id === booking.movieId);
                        return (
                          <tr key={booking.id} style={styles.tr}>
                            <td style={styles.td}><code style={{ color: "var(--primary-light)" }}>{booking.id}</code></td>
                            <td style={styles.td}>{movie ? movie.title : "Unknown Movie"}</td>
                            <td style={styles.td}>
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>{booking.userName}</span>
                                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{booking.userEmail}</span>
                              </div>
                            </td>
                            <td style={styles.td}>{booking.seats.join(", ")}</td>
                            <td style={styles.td}><span style={{ color: "var(--primary-light)" }}>₹{booking.totalAmount}</span></td>
                            <td style={styles.td}>
                              <button 
                                onClick={() => handleDeleteBooking(booking.id)}
                                style={styles.deleteActionBtn}
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Quick Actions Panel */}
            <div className="premium-card" style={{ flex: 1, height: "fit-content" }}>
              <h3 style={styles.cardTitle}>System Activity</h3>
              <div style={styles.activityList}>
                <div style={styles.activityItem}>
                  <CheckCircle size={16} color="var(--success)" style={{ minWidth: "16px" }} />
                  <div>
                    <p style={{ fontSize: "13px" }}>Database Online</p>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>System loaded all core modules</span>
                  </div>
                </div>
                <div style={styles.activityItem}>
                  <Monitor size={16} color="var(--primary)" style={{ minWidth: "16px" }} />
                  <div>
                    <p style={{ fontSize: "13px" }}>Vite Fronted Active</p>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Running on port 5173</span>
                  </div>
                </div>
                <div style={styles.activityItem}>
                  <Video size={16} color="var(--primary)" style={{ minWidth: "16px" }} />
                  <div>
                    <p style={{ fontSize: "13px" }}>Member Portal Available</p>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Ready for seat reservations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Movies" && (
          <div className="animate-fade-in" style={styles.gridSplit}>
            {/* Movies List */}
            <div className="premium-card" style={{ flex: 1.8 }}>
              <h3 style={styles.cardTitle}>Manage Films</h3>
              <div style={styles.movieGrid}>
                {movies.map((movie) => (
                  <div key={movie.id} style={styles.movieListItem}>
                    <img src={movie.poster} alt={movie.title} style={styles.movieListPoster} />
                    <div style={styles.movieListInfo}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h4 style={styles.movieListTitle}>{movie.title}</h4>
                        <button 
                          onClick={() => handleDeleteMovie(movie.id)}
                          style={styles.deleteActionBtn}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p style={styles.movieListMeta}>
                        <span>{movie.genre}</span> • <span>{movie.duration}</span> • <span style={{ color: "var(--primary-light)" }}>★ {movie.rating}</span>
                      </p>
                      <p style={styles.movieListDesc}>{movie.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Movie Form */}
            <div className="premium-card" style={{ flex: 1.2, height: "fit-content" }}>
              <h3 style={styles.cardTitle}>Add Film</h3>
              <form onSubmit={handleAddMovie}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Inception"
                    value={newMovie.title}
                    onChange={(e) => setNewMovie({...newMovie, title: e.target.value})}
                    required
                  />
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Genre</label>
                    <select 
                      className="form-input" 
                      value={newMovie.genre}
                      onChange={(e) => setNewMovie({...newMovie, genre: e.target.value})}
                      style={{ appearance: "none" }}
                    >
                      <option value="Sci-Fi">Sci-Fi</option>
                      <option value="Action">Action</option>
                      <option value="Thriller">Thriller</option>
                      <option value="Romance">Romance</option>
                      <option value="Horror">Horror</option>
                      <option value="Drama">Drama</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Rating</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 8.8"
                      value={newMovie.rating}
                      onChange={(e) => setNewMovie({...newMovie, rating: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Duration</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 2h 20m"
                      value={newMovie.duration}
                      onChange={(e) => setNewMovie({...newMovie, duration: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Ticket Price</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={newMovie.ticketPrice}
                      onChange={(e) => setNewMovie({...newMovie, ticketPrice: Number(e.target.value)})}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Poster URL (Optional)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="https://unsplash.com/..."
                    value={newMovie.poster}
                    onChange={(e) => setNewMovie({...newMovie, poster: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-input" 
                    rows="3" 
                    placeholder="A brief summary..."
                    value={newMovie.description}
                    onChange={(e) => setNewMovie({...newMovie, description: e.target.value})}
                    style={{ resize: "none" }}
                  />
                </div>
                <button type="submit" className="btn-primary">
                  <Plus size={16} />
                  <span>Add Movie</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "Theaters" && (
          <div className="animate-fade-in" style={styles.gridSplit}>
            {/* Theaters List */}
            <div className="premium-card" style={{ flex: 1.5 }}>
              <h3 style={styles.cardTitle}>Screens & Seating</h3>
              <div style={styles.theatersGrid}>
                {theaters.map((theater) => (
                  <div key={theater.id} style={styles.theaterCard}>
                    <div style={styles.theaterHeader}>
                      <h4 style={styles.theaterName}>{theater.name}</h4>
                      <span className="gold-badge">{theater.capacity} Seats</span>
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>
                      Seating configuration: {theater.rows} rows × {theater.cols} columns
                    </p>
                    
                    {/* Visual Mini Seating Map */}
                    <div style={styles.miniSeatingGrid}>
                      {Array.from({ length: Math.min(theater.rows, 5) }).map((_, r) => (
                        <div key={r} style={{ display: "flex", gap: "3px", justifyContent: "center" }}>
                          {Array.from({ length: Math.min(theater.cols, 10) }).map((_, c) => (
                            <div 
                              key={c} 
                              style={{ 
                                width: "6px", 
                                height: "6px", 
                                background: "var(--border-color)", 
                                borderRadius: "1px" 
                              }}
                            />
                          ))}
                        </div>
                      ))}
                      {(theater.rows > 5 || theater.cols > 10) && (
                        <span style={{ fontSize: "9px", color: "var(--text-muted)", marginTop: "4px" }}>+ more seats</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Screen Form */}
            <div className="premium-card" style={{ flex: 1, height: "fit-content" }}>
              <h3 style={styles.cardTitle}>Add Screen</h3>
              <form onSubmit={handleAddTheater}>
                <div className="form-group">
                  <label className="form-label">Screen Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Screen 4 - Ultra VIP"
                    value={newTheater.name}
                    onChange={(e) => setNewTheater({...newTheater, name: e.target.value})}
                    required
                  />
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Rows</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={newTheater.rows}
                      onChange={(e) => setNewTheater({...newTheater, rows: e.target.value})}
                      min="4"
                      max="12"
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Columns</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={newTheater.cols}
                      onChange={(e) => setNewTheater({...newTheater, cols: e.target.value})}
                      min="6"
                      max="15"
                      required
                    />
                  </div>
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>
                  Total Capacity: {newTheater.rows * newTheater.cols} seats
                </p>
                <button type="submit" className="btn-primary">
                  <Plus size={16} />
                  <span>Create Screen</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "Showtimes" && (
          <div className="animate-fade-in" style={styles.gridSplit}>
            {/* Showtimes List */}
            <div className="premium-card" style={{ flex: 1.8 }}>
              <h3 style={styles.cardTitle}>Schedule List</h3>
              {showtimes.length === 0 ? (
                <p style={styles.emptyText}>No shows scheduled.</p>
              ) : (
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Film</th>
                        <th style={styles.th}>Screen</th>
                        <th style={styles.th}>Date & Time</th>
                        <th style={styles.th}>Type</th>
                        <th style={styles.th}>Price Factor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {showtimes.map((showtime) => {
                        const movie = movies.find(m => m.id === showtime.movieId);
                        const theater = theaters.find(t => t.id === showtime.theaterId);
                        return (
                          <tr key={showtime.id} style={styles.tr}>
                            <td style={styles.td}><strong style={{ color: "#ffffff" }}>{movie ? movie.title : "Unknown Film"}</strong></td>
                            <td style={styles.td}>{theater ? theater.name : "Unknown Screen"}</td>
                            <td style={styles.td}>
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <span>{showtime.time}</span>
                                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{showtime.date}</span>
                              </div>
                            </td>
                            <td style={styles.td}><span className="gold-badge" style={{ textTransform: "none" }}>{showtime.type}</span></td>
                            <td style={styles.td}><span style={{ color: "var(--primary-light)" }}>{showtime.priceMultiplier}x</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Schedule Form */}
            <div className="premium-card" style={{ flex: 1.2, height: "fit-content" }}>
              <h3 style={styles.cardTitle}>Schedule Show</h3>
              <form onSubmit={handleAddShowtime}>
                <div className="form-group">
                  <label className="form-label">Select Film</label>
                  <select 
                    className="form-input"
                    value={newShowtime.movieId}
                    onChange={(e) => setNewShowtime({...newShowtime, movieId: e.target.value})}
                    required
                  >
                    <option value="">-- Choose Movie --</option>
                    {movies.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Select Screen</label>
                  <select 
                    className="form-input"
                    value={newShowtime.theaterId}
                    onChange={(e) => setNewShowtime({...newShowtime, theaterId: e.target.value})}
                    required
                  >
                    <option value="">-- Choose Screen --</option>
                    {theaters.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Time</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 07:00 PM"
                      value={newShowtime.time}
                      onChange={(e) => setNewShowtime({...newShowtime, time: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Date</label>
                    <select 
                      className="form-input"
                      value={newShowtime.date}
                      onChange={(e) => setNewShowtime({...newShowtime, date: e.target.value})}
                    >
                      <option value="Today">Today</option>
                      <option value="Tomorrow">Tomorrow</option>
                      <option value="This Friday">This Friday</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Screen Type</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Premiere Suite"
                      value={newShowtime.type}
                      onChange={(e) => setNewShowtime({...newShowtime, type: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Price Multiplier</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      min="1.0" 
                      max="3.0"
                      className="form-input" 
                      value={newShowtime.priceMultiplier}
                      onChange={(e) => setNewShowtime({...newShowtime, priceMultiplier: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary">
                  <Plus size={16} />
                  <span>Add Show to Calendar</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  dashboardContainer: {
    padding: "24px 40px",
    maxWidth: "1280px",
    margin: "0 auto",
    color: "var(--text-primary)"
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "20px",
    borderBottom: "1px solid var(--border-color)",
    marginBottom: "32px"
  },
  navBrand: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  brandText: {
    fontSize: "20px",
    fontWeight: "bold",
    letterSpacing: "1px",
    fontFamily: "var(--font-serif)"
  },
  navActions: {
    display: "flex",
    alignItems: "center"
  },
  signOutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "transparent",
    color: "var(--text-secondary)",
    border: "none",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "color 0.2s ease"
  },
  dashboardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px"
  },
  headerTitleGroup: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  mainTitle: {
    fontSize: "36px",
    fontFamily: "var(--font-serif)",
    color: "#ffffff"
  },
  tabContent: {
    marginTop: "24px"
  },
  gridSplit: {
    display: "flex",
    gap: "28px",
    alignItems: "flex-start"
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#ffffff",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "10px"
  },
  emptyText: {
    color: "var(--text-muted)",
    fontSize: "14px",
    textAlign: "center",
    padding: "32px 0"
  },
  tableWrapper: {
    overflowX: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left"
  },
  th: {
    padding: "12px 16px",
    borderBottom: "2px solid var(--border-color)",
    color: "var(--text-secondary)",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },
  tr: {
    borderBottom: "1px solid var(--border-color)",
    transition: "background 0.2s ease"
  },
  td: {
    padding: "16px",
    fontSize: "13px",
    color: "var(--text-primary)"
  },
  deleteActionBtn: {
    background: "transparent",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
    transition: "color 0.2s ease",
    padding: "4px"
  },
  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  },
  activityItem: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start"
  },
  movieGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  movieListItem: {
    display: "flex",
    gap: "18px",
    background: "rgba(10, 10, 15, 0.4)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--border-radius-sm)",
    padding: "16px",
    transition: "border-color 0.2s ease"
  },
  movieListPoster: {
    width: "60px",
    height: "90px",
    objectFit: "cover",
    borderRadius: "4px",
    border: "1px solid var(--border-color)"
  },
  movieListInfo: {
    flex: 1
  },
  movieListTitle: {
    fontSize: "16px",
    color: "#ffffff",
    fontWeight: "600"
  },
  movieListMeta: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    margin: "4px 0 8px 0"
  },
  movieListDesc: {
    fontSize: "12px",
    color: "var(--text-muted)",
    lineHeight: "1.4",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  },
  theatersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px"
  },
  theaterCard: {
    background: "rgba(10, 10, 15, 0.4)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--border-radius-sm)",
    padding: "20px"
  },
  theaterHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px"
  },
  theaterName: {
    fontSize: "15px",
    color: "#ffffff",
    fontWeight: "600"
  },
  miniSeatingGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    padding: "12px",
    background: "rgba(0, 0, 0, 0.2)",
    borderRadius: "4px",
    alignItems: "center"
  }
};

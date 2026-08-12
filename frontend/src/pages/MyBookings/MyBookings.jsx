import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import LoginModal from "../../components/LoginModal/LoginModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { fetchMyBookings, cancelBooking } from "../../api/bookings";
import "./MyBookings.css";

function MyBookings({ isLoggedIn, setIsLoggedIn, user, setUser, isAdmin, setIsAdmin }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [busyCancel, setBusyCancel] = useState(false);
  const [qrModalTicket, setQrModalTicket] = useState(null);
const movieImages = import.meta.glob(
  "../../assets/images/movies/*",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);
const getMoviePoster = (movie) => {
  if (!movie) return "";

  const posterPath = movie.posterUrl || movie.poster;

  if (!posterPath) {
    return "";
  }

  // If backend already provides a complete URL
  if (
    posterPath.startsWith("http://") ||
    posterPath.startsWith("https://")
  ) {
    return posterPath;
  }

  // Extract filename from paths such as:
  // /src/assets/images/movies/eclipse.png
  // assets/images/movies/eclipse.png
  // eclipse.png
  const filename = posterPath.split("/").pop();

  const matchingKey = Object.keys(movieImages).find((key) =>
    key.endsWith(`/${filename}`)
  );

  if (matchingKey) {
    return movieImages[matchingKey];
  }

  return "";
};
  const loadBookings = async () => {
    setLoading(true);
    try {
      const list = await fetchMyBookings();
      if (list && list.length >= 0) {
        setBookings(list);
      }
    } catch (err) {
      console.warn("Failed to fetch user bookings from API:", err.message);
      // Fallback mock bookings
      setBookings([
        {
          _id: "bk-seed-1",
          bookingId: "BK-SEED123",
          seats: ["C5", "C6"],
          totalCost: 876,
          status: "confirmed",
          createdAt: new Date().toISOString(),
          showtime: {
            movie: {
              title: "Eclipse",
              genre: ["Sci-Fi"],
              posterUrl: "/src/assets/images/movies/eclipse.png",
            },
            theater: { name: "CineVault IMAX Grand" },
            screen: { name: "Screen 1 - Grand Hall" },
            startTime: new Date().toISOString(),
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadBookings();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    setBusyCancel(true);
    try {
      await cancelBooking(cancelTarget._id);
      await loadBookings();
      setCancelTarget(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setBusyCancel(false);
    }
  };

  return (
    <div className="my-bookings-page">
      <Navbar
        isLoggedIn={isLoggedIn}
        user={user}
        setUser={setUser}
        setIsLoggedIn={setIsLoggedIn}
        onSignIn={() => setShowLogin(true)}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          setUser={setUser}
          setIsAdmin={setIsAdmin}
          onLogin={() => {
            setIsLoggedIn(true);
            setShowLogin(false);
          }}
        />
      )}

      <div className="bookings-container">
        <div className="bookings-header">
          <h1>My Movie Bookings</h1>
        </div>

        {!isLoggedIn ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#a0a5b5" }}>
            <h3>Sign in to view your tickets</h3>
            <button
              onClick={() => setShowLogin(true)}
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1.5rem",
                background: "#c5a880",
                color: "#0b0c10",
                border: "none",
                borderRadius: "8px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Sign In Now
            </button>
          </div>
        ) : loading ? (
          <div style={{ textAlign: "center", padding: "3rem 0", color: "#c5a880" }}>
            <p>Loading your tickets...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#a0a5b5" }}>
            <h3>No bookings found</h3>
            <p>You haven't booked any movie tickets yet.</p>
          </div>
        ) : (
          <div className="tickets-grid">
            {bookings.map((b) => {
              const movieObj = b.showtime?.movie || {};
              const theaterObj = b.showtime?.theater || {};
              const screenObj = b.showtime?.screen || {};
const poster = getMoviePoster(movieObj);
              const startTimeStr = b.showtime?.startTime
                ? new Date(b.showtime.startTime).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })
                : "Upcoming Showtime";

              return (
                <div key={b._id} className="ticket-card">
                  <img
                    src={poster}
                    alt={movieObj.title || "Movie"}
                    className="ticket-poster"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";
                    }}
                  />

                  <div className="ticket-info">
                    <div>
                      <div className="ticket-top">
                        <h3 className="ticket-title">{movieObj.title || "Movie Title"}</h3>
                        <span className={`status-badge ${b.status}`}>{b.status}</span>
                      </div>

                      <p className="ticket-meta">
                        📍 {theaterObj.name || "Cinema"} {screenObj.name ? `(${screenObj.name})` : ""}
                      </p>

                      <div className="ticket-details">
                        <div className="detail-block">
                          <span>DATE & TIME</span>
                          <strong>{startTimeStr}</strong>
                        </div>

                        <div className="detail-block">
                          <span>SEATS</span>
                          <strong style={{ color: "#c5a880" }}>{b.seats?.join(", ")}</strong>
                        </div>

                        <div className="detail-block">
                          <span>TOTAL PAID</span>
                          <strong>₹{b.totalCost}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="ticket-footer">
                      <span className="booking-code">ID: {b.bookingId}</span>

                      <div className="ticket-actions">
                        <button
                          className="qr-ticket-btn"
                          onClick={() => setQrModalTicket(b)}
                        >
                          📱 Show QR
                        </button>
                        {b.status === "confirmed" && (
                          <button
                            className="cancel-ticket-btn"
                            onClick={() => setCancelTarget(b)}
                          >
                            Cancel Ticket
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Modal */}
      {qrModalTicket && (
        <div className="modal-overlay" onClick={() => setQrModalTicket(null)}>
          <div className="ticket-modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>
              {qrModalTicket.showtime?.movie?.title || "Movie Ticket"}
            </h3>
            <p style={{ color: "#a0a5b5", fontSize: "0.85rem" }}>
              Seats: <span style={{ color: "#c5a880" }}>{qrModalTicket.seats?.join(", ")}</span>
            </p>

            <div className="ticket-code">{qrModalTicket.bookingId}</div>

            <div className="qr-box">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrModalTicket.bookingId}`}
                alt="Ticket QR Code"
              />
            </div>

            <button
              className="modal-btn-secondary"
              style={{ width: "100%", marginTop: "1rem" }}
              onClick={() => setQrModalTicket(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Cancel Confirm Dialog */}
      {cancelTarget && (
        <ConfirmDialog
          title="Cancel Booking"
          message={`Are you sure you want to cancel booking ${cancelTarget.bookingId}? Reserved seats (${cancelTarget.seats?.join(", ")}) will be released.`}
          onConfirm={handleCancelConfirm}
          onCancel={() => setCancelTarget(null)}
          busy={busyCancel}
        />
      )}
    </div>
  );
}

export default MyBookings;

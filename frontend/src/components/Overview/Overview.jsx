import { useState, useEffect } from "react";
import { fetchAdminBookings, fetchAdminBookingStats } from "../../api/bookings";
import { fetchAdminMovies } from "../../api/movies";
import "../AdminTabs/AdminPanel.css";
import "./Overview.css";

export default function Overview() {
  const [stats, setStats] = useState({ totalBookings: 0, totalCancelled: 0, totalRevenue: 0 });
  const [bookings, setBookings] = useState([]);
  const [movieCount, setMovieCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [s, bk, mv] = await Promise.all([
          fetchAdminBookingStats(), fetchAdminBookings(), fetchAdminMovies(),
        ]);
        setStats(s || { totalBookings: 0, totalCancelled: 0, totalRevenue: 0 });
        setBookings((bk || []).slice(0, 10));
        setMovieCount((mv || []).length);
      } catch (e) {
        console.warn("Could not load overview stats:", e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="admin-panel">
      {/* Stats row */}
      <div className="overview-stats">
        <div className="overview-stat-card">
          <p className="overview-stat-label">Active Films</p>
          <h3>{loading ? "—" : movieCount}</h3>
        </div>
        <div className="overview-stat-card">
          <p className="overview-stat-label">Confirmed Bookings</p>
          <h3 style={{ color: "#22c55e" }}>{loading ? "—" : stats.totalBookings}</h3>
        </div>
        <div className="overview-stat-card">
          <p className="overview-stat-label">Cancellations</p>
          <h3 style={{ color: "#ef4444" }}>{loading ? "—" : stats.totalCancelled}</h3>
        </div>
        <div className="overview-stat-card">
          <p className="overview-stat-label">Total Revenue</p>
          <h3 style={{ color: "#c5a880" }}>₹{loading ? "—" : stats.totalRevenue?.toLocaleString("en-IN") || 0}</h3>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="admin-panel-header" style={{ marginTop: "2rem" }}>
        <h2>Recent Bookings</h2>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Film</th>
              <th>Customer</th>
              <th>Seats</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="admin-empty-row"><td colSpan={6}>Loading bookings…</td></tr>
            ) : bookings.length === 0 ? (
              <tr className="admin-empty-row"><td colSpan={6}>No bookings yet.</td></tr>
            ) : (
              bookings.map((b) => (
                <tr key={b._id}>
                  <td className="admin-td-gold" style={{ fontFamily: "monospace" }}>{b.bookingId}</td>
                  <td className="admin-td-title">{b.showtime?.movie?.title || "—"}</td>
                  <td>{b.user?.name || "—"}</td>
                  <td className="admin-td-muted">{(b.seats || []).join(", ")}</td>
                  <td>₹{b.totalCost}</td>
                  <td>
                    <span className={`status-pill ${b.status}`}>{b.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
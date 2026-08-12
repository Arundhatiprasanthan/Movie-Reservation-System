import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import ConfirmDialog from "../common/ConfirmDialog";
import { fetchAdminShowtimes, createShowtime, deleteShowtime, toggleSeatBlockedStatus } from "../../api/showtimes";
import { fetchAdminMovies } from "../../api/movies";
import { fetchAdminTheaters, fetchScreensByTheater } from "../../api/theaters";
import "../AdminTabs/AdminPanel.css";
import "./ShowtimesTab.css";

function fmt(iso) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

export default function ShowtimesTab() {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [seatMapFor, setSeatMapFor] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    movieId: "", theaterId: "", screenId: "", startTime: "", price: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const [sts, mvs, ths] = await Promise.all([
        fetchAdminShowtimes(), fetchAdminMovies(), fetchAdminTheaters(),
      ]);
      setShowtimes(sts || []);
      setMovies(mvs || []);
      setTheaters(ths || []);
    } catch (e) {
      console.warn("Failed to load showtimes data:", e.message);
      setShowtimes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const loadScreensForTheater = async (theaterId) => {
    try {
      const s = await fetchScreensByTheater(theaterId);
      setScreens(s || []);
    } catch {
      setScreens([]);
    }
  };

  const handleTheaterChange = (tid) => {
    setForm((f) => ({ ...f, theaterId: tid, screenId: "" }));
    if (tid) loadScreensForTheater(tid);
    else setScreens([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await createShowtime({
        movieId: form.movieId,
        theaterId: form.theaterId,
        screenId: form.screenId,
        startTime: form.startTime,
        price: Number(form.price),
      });
      setShowForm(false);
      load();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create showtime");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await deleteShowtime(deleteTarget._id);
      setDeleteTarget(null);
      load();
    } catch (e) {
      alert(e.response?.data?.message || "Failed to delete showtime");
    } finally {
      setBusy(false);
    }
  };

  const handleToggleSeat = async (seatLabel, currentStatus) => {
    const blocked = currentStatus !== "blocked";
    try {
      await toggleSeatBlockedStatus(seatMapFor._id, seatLabel, blocked);
      // Refresh seat map
      const updated = await fetchAdminShowtimes();
      const freshSt = updated.find((s) => s._id === seatMapFor._id);
      setSeatMapFor(freshSt || null);
      setShowtimes(updated || []);
    } catch (e) {
      alert(e.response?.data?.message || "Failed to update seat");
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Showtimes</h2>
        <button className="btn-primary" onClick={() => { setForm({ movieId: "", theaterId: "", screenId: "", startTime: "", price: "" }); setError(""); setShowForm(true); }}>
          + Add Showtime
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Film</th>
              <th>Theater</th>
              <th>Screen</th>
              <th>Date & Time</th>
              <th>Price</th>
              <th>Occupancy</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="admin-empty-row"><td colSpan={7}>Loading showtimes…</td></tr>
            ) : showtimes.length === 0 ? (
              <tr className="admin-empty-row"><td colSpan={7}>No showtimes yet. Add your first showtime to get started.</td></tr>
            ) : (
              showtimes.map((s) => {
                const reserved = (s.seats || []).filter((seat) => seat.status === "reserved").length;
                const total = (s.seats || []).length;
                const pct = total ? Math.round((reserved / total) * 100) : 0;
                return (
                  <tr key={s._id}>
                    <td className="admin-td-title">{s.movie?.title || "—"}</td>
                    <td className="admin-td-gold">{s.theater?.name || "—"}</td>
                    <td className="admin-td-muted">{s.screen?.name || "—"}</td>
                    <td className="admin-td-muted">{fmt(s.startTime)}</td>
                    <td>₹{s.price}</td>
                    <td>
                      <div className="occ-bar-wrap">
                        <div className="occ-bar-bg"><div className="occ-bar-fill" style={{ width: `${pct}%` }} /></div>
                        <span className="occ-text">{reserved}/{total}</span>
                      </div>
                    </td>
                    <td>
                      <button className="btn-action-edit" onClick={() => setSeatMapFor(s)}>Seats</button>
                      <button className="btn-action-delete" onClick={() => setDeleteTarget(s)}>Remove</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Showtime Form */}
      {showForm && (
        <Modal title="Add Showtime" onClose={() => setShowForm(false)}>
          <form className="admin-form" onSubmit={handleSubmit}>
            {error && <p style={{ color: "#ef4444", fontSize: "0.85rem" }}>{error}</p>}
            <div className="admin-form-group">
              <label>Movie</label>
              <select value={form.movieId} onChange={(e) => setForm({ ...form, movieId: e.target.value })} required>
                <option value="">— Select Movie —</option>
                {movies.filter((m) => m.isActive).map((m) => <option key={m._id} value={m._id}>{m.title}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label>Theater</label>
              <select value={form.theaterId} onChange={(e) => handleTheaterChange(e.target.value)} required>
                <option value="">— Select Theater —</option>
                {theaters.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label>Screen</label>
              <select value={form.screenId} onChange={(e) => setForm({ ...form, screenId: e.target.value })} required disabled={!form.theaterId}>
                <option value="">— Select Screen —</option>
                {screens.map((s) => <option key={s._id} value={s._id}>{s.name} ({s.screenType})</option>)}
              </select>
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Start Date & Time</label>
                <input type="datetime-local" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
              </div>
              <div className="admin-form-group">
                <label>Ticket Price (₹)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} min={1} required />
              </div>
            </div>
            <div className="admin-form-actions">
              <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={busy}>{busy ? "Creating…" : "Create Showtime"}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Seat Map Modal */}
      {seatMapFor && (
        <Modal title={`Seat Map — ${seatMapFor.movie?.title || ""}`} onClose={() => setSeatMapFor(null)}>
          <p style={{ color: "#a0a5b5", fontSize: "0.82rem", marginBottom: "1rem" }}>
            Click any available seat to block it for maintenance. Click a blocked seat to unblock.
          </p>
          <div className="seat-map-grid">
            {(seatMapFor.seats || []).map((seat) => (
              <div
                key={seat.seatLabel}
                title={`${seat.seatLabel} — ${seat.status}`}
                className={`sm-seat sm-seat-${seat.status}`}
                onClick={() => seat.status !== "reserved" && handleToggleSeat(seat.seatLabel, seat.status)}
              >
                {seat.seatLabel}
              </div>
            ))}
          </div>
          <div className="seat-map-legend">
            <span className="sm-legend-item"><span className="sm-dot sm-seat-available" />Available</span>
            <span className="sm-legend-item"><span className="sm-dot sm-seat-reserved" />Reserved</span>
            <span className="sm-legend-item"><span className="sm-dot sm-seat-blocked" />Blocked</span>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Remove Showtime"
          message={`Remove this showtime for "${deleteTarget.movie?.title}"? This cannot be undone.`}
          confirmLabel="Remove"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          busy={busy}
        />
      )}
    </div>
  );
}

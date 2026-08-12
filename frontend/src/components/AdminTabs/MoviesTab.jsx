import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import ConfirmDialog from "../common/ConfirmDialog";
import { fetchAdminMovies, createMovie, updateMovie, deleteMovie } from "../../api/movies";
import "../AdminTabs/AdminPanel.css";

const EMPTY_FORM = {
  title: "",
  genre: "",
  duration: "",
  description: "",
  rating: "PG-13",
  releaseDate: "",
  posterUrl: "",
};

export default function MoviesTab() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const list = await fetchAdminMovies();
      setMovies(list || []);
    } catch (e) {
      console.warn("Could not load admin movies:", e.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditTarget(null);
    setError("");
    setShowForm(true);
  };

  const openEdit = (movie) => {
    setForm({
      title: movie.title || "",
      genre: Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre || "",
      duration: movie.duration || "",
      description: movie.description || "",
      rating: movie.rating || "PG-13",
      releaseDate: movie.releaseDate ? movie.releaseDate.slice(0, 10) : "",
      posterUrl: movie.posterUrl || "",
    });
    setEditTarget(movie);
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const payload = {
        ...form,
        genre: form.genre.split(",").map((g) => g.trim()).filter(Boolean),
        duration: Number(form.duration),
      };
      if (editTarget) {
        await updateMovie(editTarget._id, payload);
      } else {
        await createMovie(payload);
      }
      setShowForm(false);
      load();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to save movie");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await deleteMovie(deleteTarget._id);
      setDeleteTarget(null);
      load();
    } catch (e) {
      alert(e.response?.data?.message || "Failed to deactivate movie");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Movies</h2>
        <button className="btn-primary" onClick={openCreate}>+ Add Movie</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th>Duration</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="admin-empty-row"><td colSpan={6}>Loading movies…</td></tr>
            ) : movies.length === 0 ? (
              <tr className="admin-empty-row"><td colSpan={6}>No movies yet. Click "+ Add Movie" to get started.</td></tr>
            ) : (
              movies.map((m) => (
                <tr key={m._id}>
                  <td className="admin-td-title">{m.title}</td>
                  <td className="admin-td-muted">{Array.isArray(m.genre) ? m.genre.join(", ") : m.genre}</td>
                  <td>{m.duration} mins</td>
                  <td className="admin-td-gold">{m.rating}</td>
                  <td>
                    <span className={`status-pill ${m.isActive ? "active" : "inactive"}`}>
                      {m.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button className="btn-action-edit" onClick={() => openEdit(m)}>Edit</button>
                    <button className="btn-action-delete" onClick={() => setDeleteTarget(m)}>
                      {m.isActive ? "Deactivate" : "Deleted"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <Modal title={editTarget ? "Edit Movie" : "Add Movie"} onClose={() => setShowForm(false)}>
          <form className="admin-form" onSubmit={handleSubmit}>
            {error && <p style={{ color: "#ef4444", fontSize: "0.85rem" }}>{error}</p>}
            <div className="admin-form-group">
              <label>Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Genre (comma-separated)</label>
                <input value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} placeholder="Sci-Fi, Action" required />
              </div>
              <div className="admin-form-group">
                <label>Duration (mins)</label>
                <input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} min="30" max="300" required />
              </div>
            </div>
            <div className="admin-form-group">
              <label>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Rating</label>
                <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
                  {["G", "U", "UA", "PG-13", "A", "R", "NR"].map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="admin-form-group">
                <label>Release Date</label>
                <input type="date" value={form.releaseDate} onChange={(e) => setForm({ ...form, releaseDate: e.target.value })} />
              </div>
            </div>
            <div className="admin-form-group">
              <label>Poster URL</label>
              <input value={form.posterUrl} onChange={(e) => setForm({ ...form, posterUrl: e.target.value })} placeholder="https://…" />
            </div>
            <div className="admin-form-actions">
              <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={busy}>
                {busy ? "Saving…" : editTarget ? "Save Changes" : "Create Movie"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Deactivate Movie"
          message={`Deactivate "${deleteTarget.title}"? It will be hidden from the public but past bookings remain intact.`}
          confirmLabel="Deactivate"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          busy={busy}
        />
      )}
    </div>
  );
}

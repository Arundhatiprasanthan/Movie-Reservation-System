import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import ConfirmDialog from "../common/ConfirmDialog";
import {
  fetchAdminMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../../api/movies";
import "../AdminTabs/AdminPanel.css";

const EMPTY_FORM = {
  title: "",
  genre: "",
  duration: "",
  description: "",
  director: "",
  cast: "",
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

  useEffect(() => {
    load();
  }, []);

  // Open Add Movie form
  const openCreate = () => {
    setForm({ ...EMPTY_FORM });
    setEditTarget(null);
    setError("");
    setShowForm(true);
  };

  // Open Edit Movie form
  const openEdit = (movie) => {
    setForm({
      title: movie.title || "",

      genre: Array.isArray(movie.genre)
        ? movie.genre.join(", ")
        : movie.genre || "",

      duration: movie.duration || "",

      description: movie.description || "",

      director: movie.director || "",

      cast: Array.isArray(movie.cast)
        ? movie.cast.join(", ")
        : movie.cast || "",

      rating: movie.rating || "PG-13",

      releaseDate: movie.releaseDate
        ? movie.releaseDate.slice(0, 10)
        : "",

      posterUrl: movie.posterUrl || "",
    });

    setEditTarget(movie);
    setError("");
    setShowForm(true);
  };

  // Create / Update Movie
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setBusy(true);

    try {
      const payload = {
        ...form,

        genre: form.genre
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean),

        cast: form.cast
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),

        duration: Number(form.duration),
      };

      if (editTarget) {
        await updateMovie(editTarget._id, payload);
      } else {
        await createMovie(payload);
      }

      setShowForm(false);
      setForm({ ...EMPTY_FORM });
      setEditTarget(null);

      await load();
    } catch (e) {
      setError(
        e.response?.data?.message || "Failed to save movie"
      );
    } finally {
      setBusy(false);
    }
  };

  // Delete / Deactivate Movie
  const handleDelete = async () => {
    if (!deleteTarget) return;

    setBusy(true);

    try {
      await deleteMovie(deleteTarget._id);

      setDeleteTarget(null);

      await load();
    } catch (e) {
      alert(
        e.response?.data?.message ||
          "Failed to deactivate movie"
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-panel">

      {/* Header */}
      <div className="admin-panel-header">
        <h2>Movies</h2>

        <button
          className="btn-primary"
          onClick={openCreate}
        >
          + Add Movie
        </button>
      </div>

      {/* Movies Table */}
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

            {/* Loading */}
            {loading ? (
              <tr className="admin-empty-row">
                <td colSpan={6}>
                  Loading movies…
                </td>
              </tr>

            ) : movies.length === 0 ? (

              /* No movies */
              <tr className="admin-empty-row">
                <td colSpan={6}>
                  No movies yet. Click "+ Add Movie" to get started.
                </td>
              </tr>

            ) : (

              /* Movie list */
              movies.map((m) => (
                <tr key={m._id}>

                  <td className="admin-td-title">
                    {m.title}
                  </td>

                  <td className="admin-td-muted">
                    {Array.isArray(m.genre)
                      ? m.genre.join(", ")
                      : m.genre}
                  </td>

                  <td>
                    {m.duration} mins
                  </td>

                  <td className="admin-td-gold">
                    {m.rating}
                  </td>

                  <td>
                    <span
                      className={`status-pill ${
                        m.isActive
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {m.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td>

                    <button
                      className="btn-action-edit"
                      onClick={() => openEdit(m)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn-action-delete"
                      onClick={() =>
                        setDeleteTarget(m)
                      }
                    >
                      {m.isActive
                        ? "Deactivate"
                        : "Deleted"}
                    </button>

                  </td>

                </tr>
              ))

            )}

          </tbody>
        </table>
      </div>

      {/* Add / Edit Movie Modal */}
      {showForm && (
        <Modal
          title={
            editTarget
              ? "Edit Movie"
              : "Add Movie"
          }
          onClose={() => {
            if (!busy) {
              setShowForm(false);
            }
          }}
        >

          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >

            {/* Error */}
            {error && (
              <p
                style={{
                  color: "#ef4444",
                  fontSize: "0.85rem",
                }}
              >
                {error}
              </p>
            )}

            {/* Title */}
            <div className="admin-form-group">
              <label>Title</label>

              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                placeholder="Spider-Man: No Way Home"
                required
              />
            </div>

            {/* Genre + Duration */}
            <div className="admin-form-row">

              <div className="admin-form-group">
                <label>
                  Genre (comma-separated)
                </label>

                <input
                  type="text"
                  value={form.genre}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      genre: e.target.value,
                    })
                  }
                  placeholder="Action, Adventure, Sci-Fi"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>
                  Duration (mins)
                </label>

                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      duration: e.target.value,
                    })
                  }
                  min="30"
                  max="300"
                  required
                />
              </div>

            </div>

            {/* Description */}
            <div className="admin-form-group">

              <label>Description</label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Enter movie description"
                required
              />

            </div>

            {/* Director */}
            <div className="admin-form-group">

              <label>Director</label>

              <input
                type="text"
                value={form.director}
                onChange={(e) =>
                  setForm({
                    ...form,
                    director: e.target.value,
                  })
                }
                placeholder="Jon Watts"
                required
              />

            </div>

            {/* Cast */}
            <div className="admin-form-group">

              <label>
                Cast (comma-separated)
              </label>

              <input
                type="text"
                value={form.cast}
                onChange={(e) =>
                  setForm({
                    ...form,
                    cast: e.target.value,
                  })
                }
                placeholder="Tom Holland, Zendaya, Benedict Cumberbatch"
                required
              />

            </div>

            {/* Rating + Release Date */}
            <div className="admin-form-row">

              <div className="admin-form-group">

                <label>Rating</label>

                <select
                  value={form.rating}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      rating: e.target.value,
                    })
                  }
                >
                  {[
                    "G",
                    "U",
                    "UA",
                    "PG-13",
                    "A",
                    "R",
                    "NR",
                  ].map((r) => (
                    <option
                      key={r}
                      value={r}
                    >
                      {r}
                    </option>
                  ))}
                </select>

              </div>

              <div className="admin-form-group">

                <label>Release Date</label>

                <input
                  type="date"
                  value={form.releaseDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      releaseDate: e.target.value,
                    })
                  }
                />

              </div>

            </div>

            {/* Poster URL */}
            <div className="admin-form-group">

              <label>Poster URL</label>

              <input
                type="url"
                value={form.posterUrl}
                onChange={(e) =>
                  setForm({
                    ...form,
                    posterUrl: e.target.value,
                  })
                }
                placeholder="https://image.tmdb.org/..."
              />

            </div>

            {/* Buttons */}
            <div className="admin-form-actions">

              <button
                type="button"
                className="btn-cancel"
                onClick={() =>
                  setShowForm(false)
                }
                disabled={busy}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-primary"
                disabled={busy}
              >
                {busy
                  ? "Saving…"
                  : editTarget
                  ? "Save Changes"
                  : "Create Movie"}
              </button>

            </div>

          </form>

        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <ConfirmDialog
          title="Deactivate Movie"
          message={`Deactivate "${deleteTarget.title}"? It will be hidden from the public but past bookings remain intact.`}
          confirmLabel="Deactivate"
          onConfirm={handleDelete}
          onCancel={() =>
            setDeleteTarget(null)
          }
          busy={busy}
        />
      )}

    </div>
  );
}
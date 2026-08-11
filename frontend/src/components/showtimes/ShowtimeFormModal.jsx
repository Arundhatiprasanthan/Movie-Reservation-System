import { useState } from "react";
import Modal from "../common/Modal.jsx";

export default function ShowtimeFormModal({ movies, theaters, onClose, onSubmit }) {
  const [form, setForm] = useState({
    movieId: movies[0]?.id || "",
    theaterId: theaters[0]?.id || "",
    date: "",
    time: "",
    price: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.movieId || !form.theaterId || !form.date || !form.time) {
      setError("Please fill in every field.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        movieId: form.movieId,
        theaterId: form.theaterId,
        startTime: `${form.date}T${form.time}:00`,
        price: Number(form.price),
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't save the showtime. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <Modal title="Add Showtime" onClose={onClose} width="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label mb-1.5 block">Film</label>
          <select className="input" value={form.movieId} onChange={(e) => update("movieId", e.target.value)}>
            {movies.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label mb-1.5 block">Theater</label>
          <select className="input" value={form.theaterId} onChange={(e) => update("theaterId", e.target.value)}>
            {theaters.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label mb-1.5 block">Date</label>
            <input
              type="date"
              className="input"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label mb-1.5 block">Time</label>
            <input
              type="time"
              className="input"
              value={form.time}
              onChange={(e) => update("time", e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="label mb-1.5 block">Price ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="input"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            required
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Saving…" : "Add Showtime"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

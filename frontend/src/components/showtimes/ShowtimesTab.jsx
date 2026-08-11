import { useState } from "react";
import ShowtimeFormModal from "./ShowtimeFormModal.jsx";
import SeatMapModal from "./SeatMapModal.jsx";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import { createShowtime, deleteShowtime } from "../../api/showtimes.js";

function formatDateTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ShowtimesTab({ movies, theaters, showtimes, onChanged }) {
  const [adding, setAdding] = useState(false);
  const [seatMapFor, setSeatMapFor] = useState(null);
  const [pendingRemove, setPendingRemove] = useState(null);
  const [busy, setBusy] = useState(false);

  const movieById = (id) => movies.find((m) => m.id === id);
  const theaterById = (id) => theaters.find((t) => t.id === id);

  async function handleSubmit(payload) {
    await createShowtime(payload);
    setAdding(false);
    onChanged();
  }

  async function handleRemove() {
    setBusy(true);
    try {
      await deleteShowtime(pendingRemove.id);
      setPendingRemove(null);
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ivory">Showtimes</h2>
        <button className="btn-primary" onClick={() => setAdding(true)} disabled={!movies.length || !theaters.length}>
          + Add Showtime
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-700 text-muted">
              <th className="label px-4 py-3 font-medium">Film</th>
              <th className="label px-4 py-3 font-medium">Theater</th>
              <th className="label px-4 py-3 font-medium">Date &amp; Time</th>
              <th className="label px-4 py-3 font-medium">Price</th>
              <th className="label px-4 py-3 font-medium">Occupancy</th>
              <th className="label px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {showtimes.map((s) => {
              const movie = movieById(s.movieId);
              const theater = theaterById(s.theaterId);
              const bookedCount = s.bookedSeats?.length || 0;
              const pct = s.capacity ? Math.round((bookedCount / s.capacity) * 100) : 0;
              return (
                <tr key={s.id} className="border-b border-ink-700 last:border-0">
                  <td className="px-4 py-3 font-medium text-ivory">{movie?.title || "—"}</td>
                  <td className="px-4 py-3 text-gold-400">{theater?.name || "—"}</td>
                  <td className="px-4 py-3 text-muted">{formatDateTime(s.startTime)}</td>
                  <td className="px-4 py-3 text-ivory">${s.price}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ink-700">
                        <div className="h-full bg-gold-500" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-muted">
                        {bookedCount}/{s.capacity}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="mr-3 text-sm text-gold-400 hover:text-gold-300"
                      onClick={() => setSeatMapFor(s)}
                    >
                      Seats
                    </button>
                    <button className="text-sm text-muted hover:text-red-400" onClick={() => setPendingRemove(s)}>
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
            {showtimes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-muted">
                  No showtimes yet. Add your first showtime to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {adding && (
        <ShowtimeFormModal
          movies={movies}
          theaters={theaters}
          onClose={() => setAdding(false)}
          onSubmit={handleSubmit}
        />
      )}

      {seatMapFor && (
        <SeatMapModal
          showtime={seatMapFor}
          theater={theaterById(seatMapFor.theaterId)}
          movie={movieById(seatMapFor.movieId)}
          onClose={() => setSeatMapFor(null)}
        />
      )}

      {pendingRemove && (
        <ConfirmDialog
          title="Remove showtime"
          message="Remove this showtime? This can't be undone."
          onConfirm={handleRemove}
          onCancel={() => setPendingRemove(null)}
          busy={busy}
        />
      )}
    </div>
  );
}

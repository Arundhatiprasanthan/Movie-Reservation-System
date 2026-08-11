import { useEffect, useState } from "react";
import Modal from "../common/Modal.jsx";
import { getShowtimeSeats } from "../../api/showtimes.js";

const seatLabel = (row, col) => `${String.fromCharCode(65 + row)}${col + 1}`;

export default function SeatMapModal({ showtime, theater, movie, onClose }) {
  const [seatData, setSeatData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getShowtimeSeats(showtime.id)
      .then((data) => active && setSeatData(data))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [showtime.id]);

  const rows = theater?.rows || 0;
  const seatsPerRow = theater?.seatsPerRow || 0;
  const booked = new Set(seatData?.bookedSeats || []);
  const held = new Set(seatData?.heldSeats || []);

  return (
    <Modal
      title={`${movie?.title || "Showtime"} — ${theater?.name || ""}`}
      onClose={onClose}
      width="max-w-2xl"
    >
      {loading ? (
        <p className="text-sm text-muted">Loading seat map…</p>
      ) : (
        <>
          <div className="mb-5 flex items-center justify-center gap-6 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-ink-600 bg-ink-800" /> Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-gold-500" /> Reserved
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-red-500/70" /> Blocked
            </span>
          </div>

          <div className="mb-4 rounded-md bg-ink-800 py-2 text-center text-xs uppercase tracking-label text-muted">
            Screen
          </div>

          <div className="flex flex-col items-center gap-1.5 overflow-x-auto pb-2">
            {Array.from({ length: rows }).map((_, row) => (
              <div key={row} className="flex items-center gap-1.5">
                <span className="w-4 text-xs text-muted">{String.fromCharCode(65 + row)}</span>
                {Array.from({ length: seatsPerRow }).map((_, col) => {
                  const label = seatLabel(row, col);
                  const isBooked = booked.has(label);
                  const isHeld = held.has(label);
                  return (
                    <span
                      key={label}
                      title={label}
                      className={`h-5 w-5 rounded-sm border text-[9px] ${
                        isBooked
                          ? "border-gold-500 bg-gold-500"
                          : isHeld
                          ? "border-red-500/70 bg-red-500/70"
                          : "border-ink-600 bg-ink-800"
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <p className="mt-4 text-center text-xs text-muted">
            {booked.size} / {seatData?.capacity ?? theater ? theater.rows * theater.seatsPerRow : "—"} seats reserved
          </p>
        </>
      )}

      <div className="mt-6 flex justify-end">
        <button className="btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}

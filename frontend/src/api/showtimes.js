import { client } from "./client.js";
import { mockShowtimes, mockTheaters, nextId } from "./mockData.js";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

/**
 * BACKEND CONTRACT
 * -----------------
 * GET    /showtimes                 -> Showtime[]
 * POST   /showtimes  { movieId, theaterId, startTime, price } -> Showtime
 * DELETE /showtimes/:id             -> 204
 * GET    /showtimes/:id/seats       -> { capacity, bookedSeats: string[], heldSeats: string[] }
 *
 * Showtime = { id, movieId, theaterId, startTime (ISO), price, capacity, bookedSeats }
 *
 * CONCURRENCY NOTE FOR THE BACKEND DEV:
 * The seat grid (SeatMapModal) is read-only in this admin build — it only
 * displays booked vs. available seats per showtime. The actual seat-hold /
 * confirm-booking flow (with locking to prevent double-booking) belongs to
 * the member-facing booking screen, not this admin dashboard, and should
 * hit something like POST /showtimes/:id/hold and POST /bookings.
 */

function withCapacity(showtime) {
  const theater = mockTheaters.find((t) => t.id === showtime.theaterId);
  return { ...showtime, capacity: theater ? theater.rows * theater.seatsPerRow : showtime.capacity };
}

export async function listShowtimes() {
  if (USE_MOCKS) return mockShowtimes.map(withCapacity);
  const { data } = await client.get("/showtimes");
  return data;
}

export async function createShowtime(payload) {
  if (USE_MOCKS) {
    const showtime = withCapacity({ id: nextId(), bookedSeats: [], ...payload });
    mockShowtimes.push(showtime);
    return showtime;
  }
  const { data } = await client.post("/showtimes", payload);
  return data;
}

export async function deleteShowtime(id) {
  if (USE_MOCKS) {
    const idx = mockShowtimes.findIndex((s) => s.id === id);
    if (idx !== -1) mockShowtimes.splice(idx, 1);
    return;
  }
  await client.delete(`/showtimes/${id}`);
}

export async function getShowtimeSeats(id) {
  if (USE_MOCKS) {
    const showtime = mockShowtimes.find((s) => s.id === id);
    if (!showtime) throw new Error("Showtime not found");
    return { capacity: withCapacity(showtime).capacity, bookedSeats: showtime.bookedSeats, heldSeats: [] };
  }
  const { data } = await client.get(`/showtimes/${id}/seats`);
  return data;
}

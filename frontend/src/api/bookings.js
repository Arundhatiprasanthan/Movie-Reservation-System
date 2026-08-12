import { client } from "./client.js";

// User: create booking
export async function createBooking(showtimeId, seats) {
  const { data } = await client.post("/bookings", {
    showtimeId,
    seats,
  });

  return data;
}

// User: get own bookings
export async function fetchMyBookings() {
  const { data } = await client.get("/bookings/my-bookings");
  return data.bookings;
}

// User: cancel booking
export async function cancelBooking(id) {
  const { data } = await client.post(`/bookings/${id}/cancel`);
  return data;
}

// Admin: get all bookings
export async function fetchAdminBookings() {
  const { data } = await client.get("/admin/bookings");
  return data.bookings;
}

// Admin: booking statistics
export async function fetchAdminBookingStats() {
  const { data } = await client.get("/admin/bookings/stats");
  return data;
}
import { client } from "./client.js";

// Get all showtimes for admin
export async function fetchAdminShowtimes() {
  const { data } = await client.get("/admin/showtimes");
  return data.showtimes;
}

// Get one public showtime with its seat map
export async function fetchPublicShowtimeById(id) {
  const { data } = await client.get(`/showtimes/${id}`);
  return data.showtime;
}

// Create showtime
export async function createShowtime(showtimeData) {
  const { data } = await client.post(
    "/admin/showtimes",
    showtimeData
  );

  return data.showtime;
}

// Update showtime
export async function updateShowtime(id, showtimeData) {
  const { data } = await client.put(
    `/admin/showtimes/${id}`,
    showtimeData
  );

  return data.showtime;
}

// Delete showtime
export async function deleteShowtime(id) {
  const { data } = await client.delete(
    `/admin/showtimes/${id}`
  );

  return data;
}

// Block / unblock a seat
export async function toggleSeatBlockedStatus(
  showtimeId,
  seatLabel,
  blocked
) {
  const { data } = await client.patch(
    `/admin/showtimes/${showtimeId}/seats/${seatLabel}/block`,
    {
      blocked,
    }
  );

  return data;
}

// Backward compatibility
export async function listShowtimes() {
  return fetchAdminShowtimes();
}
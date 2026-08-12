import { client } from "./client.js";

export async function fetchAdminTheaters() {
  const { data } = await client.get("/admin/theaters");
  return data.theaters;
}

export async function createTheater(theaterObj) {
  const { data } = await client.post("/admin/theaters", theaterObj);
  return data.theater;
}

export async function updateTheater(id, theaterObj) {
  const { data } = await client.put(`/admin/theaters/${id}`, theaterObj);
  return data.theater;
}

export async function deleteTheater(id) {
  const { data } = await client.delete(`/admin/theaters/${id}`);
  return data;
}

export async function fetchScreensByTheater(theaterId) {
  const { data } = await client.get(`/admin/theaters/${theaterId}/screens`);
  return data.screens;
}

export async function createScreen(theaterId, screenObj) {
  const { data } = await client.post(`/admin/theaters/${theaterId}/screens`, screenObj);
  return data.screen;
}

export async function updateScreen(id, screenObj) {
  const { data } = await client.put(`/admin/screens/${id}`, screenObj);
  return data.screen;
}

export async function deleteScreen(id) {
  const { data } = await client.delete(`/admin/screens/${id}`);
  return data;
}

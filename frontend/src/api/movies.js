import { client } from "./client.js";

export async function fetchPublicMovies(search = "", genre = "All") {
  const params = {};
  if (search) params.search = search;
  if (genre && genre !== "All") params.genre = genre;
  const { data } = await client.get("/movies", { params });
  return data.movies;
}

export async function fetchPublicMovieById(id) {
  const { data } = await client.get(`/movies/${id}`);
  return data;
}

export async function fetchAdminMovies() {
  const { data } = await client.get("/admin/movies");
  return data.movies;
}

export async function createMovie(movieData) {
  const { data } = await client.post("/admin/movies", movieData);
  return data.movie;
}

export async function updateMovie(id, movieData) {
  const { data } = await client.put(`/admin/movies/${id}`, movieData);
  return data.movie;
}

export async function deleteMovie(id) {
  const { data } = await client.delete(`/admin/movies/${id}`);
  return data.movie;
}

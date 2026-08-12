const Movie = require("../models/Movie");

// @route  POST /api/admin/movies
const createMovie = async (req, res) => {
  try {
    const { title, genre, duration, description, posterUrl, rating, releaseDate } = req.body;

    if (!title || !genre || !duration || !description) {
      return res.status(400).json({ message: "title, genre, duration, and description are required" });
    }

    const movie = await Movie.create({
      title,
      genre,
      duration,
      description,
      posterUrl,
      rating,
      releaseDate,
    });

    res.status(201).json({ message: "Movie created", movie });
  } catch (err) {
    res.status(500).json({ message: "Failed to create movie", error: err.message });
  }
};

// @route  GET /api/admin/movies
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.status(200).json({ count: movies.length, movies });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch movies", error: err.message });
  }
};

// @route  GET /api/admin/movies/:id
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.status(200).json({ movie });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch movie", error: err.message });
  }
};

// @route  PUT /api/admin/movies/:id
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.status(200).json({ message: "Movie updated", movie });
  } catch (err) {
    res.status(500).json({ message: "Failed to update movie", error: err.message });
  }
};

// @route  DELETE /api/admin/movies/:id
// Soft-delete: flips isActive to false instead of removing the document,
// since past showtimes/bookings still need to reference this movie
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.status(200).json({ message: "Movie deactivated", movie });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete movie", error: err.message });
  }
};

module.exports = { createMovie, getMovies, getMovieById, updateMovie, deleteMovie };

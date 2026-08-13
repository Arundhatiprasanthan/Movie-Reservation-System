const Movie = require("../models/Movie");
const Showtime = require("../models/Showtime");

// @route  GET /api/movies
// Returns all active movies, supporting optional ?search= and ?genre= filters
const getPublicMovies = async (req, res) => {
  try {
    const { search, genre } = req.query;
    const query = { isActive: true };

    if (genre && genre !== "All") {
      query.genre = { $in: [genre] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const movies = await Movie.find(query).sort({ createdAt: -1 });
    res.status(200).json({ count: movies.length, movies });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch movies", error: err.message });
  }
};

// @route  GET /api/movies/:id
// Returns single movie by ID along with its upcoming showtimes
const getPublicMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie || !movie.isActive) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Fetch upcoming showtimes for this movie
    const now = new Date();
    const showtimes = await Showtime.find({
      movie: movie._id,
      startTime: { $gte: new Date(now.getTime() - 2 * 3600000) }, // showtimes starting within 2 hours or in future
    })
      .populate("theater", "name location")
      .populate("screen", "name screenType")
      .sort({ startTime: 1 });

    res.status(200).json({ movie, showtimes });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch movie details", error: err.message });
  }
};

module.exports = { getPublicMovies, getPublicMovieById };

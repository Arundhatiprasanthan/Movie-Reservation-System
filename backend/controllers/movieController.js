const Movie = require("../models/Movie");
const Showtime = require("../models/Showtime");

// GET /api/movies
const getPublicMovies = async (req, res) => {
  try {
    const { search, genre } = req.query;

    const filter = {
      isActive: true,
    };

    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (genre && genre !== "All") {
      filter.genre = {
        $regex: genre,
        $options: "i",
      };
    }

    const movies = await Movie.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      count: movies.length,
      movies,
    });
  } catch (err) {
    console.error("Failed to fetch public movies:", err);

    res.status(500).json({
      message: "Failed to fetch movies",
      error: err.message,
    });
  }
};

// GET /api/movies/:id
const getPublicMovieById = async (req, res) => {
  try {
    const movie = await Movie.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    const showtimes = await Showtime.find({
      movie: movie._id,
      startTime: { $gte: new Date() },
    })
      .populate("theater", "name location")
      .populate("screen", "name")
      .sort({ startTime: 1 });

    res.status(200).json({
      movie,
      showtimes,
    });
  } catch (err) {
    console.error("Failed to fetch public movie:", err);

    res.status(500).json({
      message: "Failed to fetch movie",
      error: err.message,
    });
  }
};

module.exports = {
  getPublicMovies,
  getPublicMovieById,
};
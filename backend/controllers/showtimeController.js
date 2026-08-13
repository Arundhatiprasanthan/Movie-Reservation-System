const Showtime = require("../models/Showtime");

// GET /api/showtimes/movie/:movieId
const getShowtimesByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    const showtimes = await Showtime.find({
      movie: movieId,
      startTime: { $gte: new Date() },
    })
      .populate("movie", "title genre duration posterUrl")
      .populate("theater", "name location")
      .populate("screen", "name screenType")
      .sort({ startTime: 1 });

    res.status(200).json({
      count: showtimes.length,
      showtimes,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch showtimes",
      error: err.message,
    });
  }
};

// GET /api/showtimes/:id
const getShowtimeById = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id)
      .populate("movie", "title genre duration posterUrl")
      .populate("theater", "name location")
      .populate("screen", "name screenType");

    if (!showtime) {
      return res.status(404).json({
        message: "Showtime not found",
      });
    }

    res.status(200).json({
      showtime,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch showtime",
      error: err.message,
    });
  }
};

module.exports = {
  getShowtimesByMovie,
  getShowtimeById,
};
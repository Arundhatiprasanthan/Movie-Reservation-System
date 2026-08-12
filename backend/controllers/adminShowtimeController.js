const Showtime = require("../models/Showtime");
const Movie = require("../models/Movie");
const Screen = require("../models/Screen");

// Turns a row count + seats-per-row into labels like A1, A2, ... B1, B2...
const generateSeatGrid = (rows, seatsPerRow) => {
  const seats = [];
  for (let r = 0; r < rows; r++) {
    const rowLetter = String.fromCharCode(65 + r); // A, B, C, ...
    for (let s = 1; s <= seatsPerRow; s++) {
      seats.push({ seatLabel: `${rowLetter}${s}`, status: "available" });
    }
  }
  return seats;
};

// @route  POST /api/admin/showtimes
// Creates a showtime and auto-generates its seat map from the screen's layout
const createShowtime = async (req, res) => {
  try {
    const { movieId, theaterId, screenId, startTime, price } = req.body;

    if (!movieId || !theaterId || !screenId || !startTime || price == null) {
      return res
        .status(400)
        .json({ message: "movieId, theaterId, screenId, startTime, and price are required" });
    }

    const [movie, screen] = await Promise.all([
      Movie.findById(movieId),
      Screen.findById(screenId),
    ]);

    if (!movie) return res.status(404).json({ message: "Movie not found" });
    if (!screen) return res.status(404).json({ message: "Screen not found" });

    const start = new Date(startTime);
    const end = new Date(start.getTime() + movie.duration * 60000);

    // Prevent overlapping showtimes on the same screen
    const overlap = await Showtime.findOne({
      screen: screenId,
      startTime: { $lt: end },
      endTime: { $gt: start },
    });
    if (overlap) {
      return res.status(409).json({ message: "This screen already has a showtime in that time slot" });
    }

    const seats = generateSeatGrid(screen.rows, screen.seatsPerRow);

    const showtime = await Showtime.create({
      movie: movieId,
      theater: theaterId,
      screen: screenId,
      startTime: start,
      endTime: end,
      price,
      seats,
    });

    res.status(201).json({ message: "Showtime created", showtime });
  } catch (err) {
    res.status(500).json({ message: "Failed to create showtime", error: err.message });
  }
};

// @route  GET /api/admin/showtimes
const getShowtimes = async (req, res) => {
  try {
    const showtimes = await Showtime.find()
      .populate("movie", "title genre duration")
      .populate("theater", "name location")
      .populate("screen", "name screenType")
      .sort({ startTime: 1 });

    res.status(200).json({ count: showtimes.length, showtimes });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch showtimes", error: err.message });
  }
};

// @route  GET /api/admin/showtimes/:id
const getShowtimeById = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id)
      .populate("movie", "title genre duration")
      .populate("theater", "name location")
      .populate("screen", "name screenType");

    if (!showtime) return res.status(404).json({ message: "Showtime not found" });
    res.status(200).json({ showtime });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch showtime", error: err.message });
  }
};

// @route  PUT /api/admin/showtimes/:id
// Only allows editing startTime/price directly; seat map is managed separately
const updateShowtime = async (req, res) => {
  try {
    const { startTime, price } = req.body;
    const update = {};
    if (startTime) update.startTime = new Date(startTime);
    if (price != null) update.price = price;

    const showtime = await Showtime.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!showtime) return res.status(404).json({ message: "Showtime not found" });
    res.status(200).json({ message: "Showtime updated", showtime });
  } catch (err) {
    res.status(500).json({ message: "Failed to update showtime", error: err.message });
  }
};

// @route  DELETE /api/admin/showtimes/:id
const deleteShowtime = async (req, res) => {
  try {
    const showtime = await Showtime.findByIdAndDelete(req.params.id);
    if (!showtime) return res.status(404).json({ message: "Showtime not found" });
    res.status(200).json({ message: "Showtime deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete showtime", error: err.message });
  }
};

// @route  PATCH /api/admin/showtimes/:id/seats/:seatLabel/block
// Lets an admin block a seat (e.g. for maintenance) or unblock it back to available
const setSeatBlockedStatus = async (req, res) => {
  try {
    const { id, seatLabel } = req.params;
    const { blocked } = req.body; // true to block, false to unblock

    const showtime = await Showtime.findById(id);
    if (!showtime) return res.status(404).json({ message: "Showtime not found" });

    const seat = showtime.seats.find((s) => s.seatLabel === seatLabel);
    if (!seat) return res.status(404).json({ message: "Seat not found on this showtime" });

    if (seat.status === "reserved") {
      return res.status(400).json({ message: "Cannot block a seat that is already reserved" });
    }

    seat.status = blocked ? "blocked" : "available";
    seat.heldBy = null;
    seat.holdExpiresAt = null;

    await showtime.save();
    res.status(200).json({ message: `Seat ${seatLabel} updated`, seat });
  } catch (err) {
    res.status(500).json({ message: "Failed to update seat", error: err.message });
  }
};

module.exports = {
  createShowtime,
  getShowtimes,
  getShowtimeById,
  updateShowtime,
  deleteShowtime,
  setSeatBlockedStatus,
};

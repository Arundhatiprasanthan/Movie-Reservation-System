const Booking = require("../models/Booking");
const Showtime = require("../models/Showtime");

// @route POST /api/bookings
// Create a booking for the logged-in user
const createBooking = async (req, res) => {
  try {
    const { showtimeId, seats } = req.body;

    if (!showtimeId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        message: "showtimeId and at least one seat are required",
      });
    }

    const showtime = await Showtime.findById(showtimeId);

    if (!showtime) {
      return res.status(404).json({
        message: "Showtime not found",
      });
    }

    // Remove duplicate seats from the request
    const requestedSeats = [...new Set(seats)];

    // Find all requested seats
    const selectedSeats = showtime.seats.filter((seat) =>
      requestedSeats.includes(seat.seatLabel)
    );

    // Check whether all requested seat labels exist
    if (selectedSeats.length !== requestedSeats.length) {
      const foundLabels = selectedSeats.map((seat) => seat.seatLabel);

      const invalidSeats = requestedSeats.filter(
        (seat) => !foundLabels.includes(seat)
      );

      return res.status(400).json({
        message: "One or more selected seats are invalid",
        invalidSeats,
      });
    }

    // Check whether seats are already reserved
    const unavailableSeats = selectedSeats.filter(
      (seat) => seat.status !== "available"
    );

    if (unavailableSeats.length > 0) {
      return res.status(409).json({
        message: "One or more selected seats are not available",
        unavailableSeats: unavailableSeats.map((seat) => seat.seatLabel),
      });
    }

    // Reserve the seats
    showtime.seats.forEach((seat) => {
      if (requestedSeats.includes(seat.seatLabel)) {
        seat.status = "reserved";
        seat.heldBy = null;
        seat.holdExpiresAt = null;
      }
    });

    await showtime.save();

    // Calculate total cost
    const totalCost = requestedSeats.length * showtime.price;

    // Generate a unique booking ID
    const bookingId = `BK-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const booking = await Booking.create({
      bookingId,
      user: req.user._id,
      showtime: showtime._id,
      seats: requestedSeats,
      totalCost,
      status: "confirmed",
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("user", "name email")
      .populate({
        path: "showtime",
        select: "startTime endTime price movie theater screen",
        populate: [
          { path: "movie", select: "title" },
          { path: "theater", select: "name" },
          { path: "screen", select: "name" },
        ],
      });

    return res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (err) {
    console.error("Create booking error:", err);

    return res.status(500).json({
      message: "Failed to create booking",
      error: err.message,
    });
  }
};


// @route GET /api/bookings/my-bookings
// Get bookings belonging to the logged-in user
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate({
        path: "showtime",
        select: "startTime endTime price movie theater screen",
        populate: [
          { path: "movie", select: "title" },
          { path: "theater", select: "name" },
          { path: "screen", select: "name" },
        ],
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    console.error("Get my bookings error:", err);

    return res.status(500).json({
      message: "Failed to fetch bookings",
      error: err.message,
    });
  }
};


// @route DELETE /api/bookings/:id
// Cancel a user's booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Booking is already cancelled",
      });
    }

    const showtime = await Showtime.findById(booking.showtime);

    if (showtime) {
      showtime.seats.forEach((seat) => {
        if (booking.seats.includes(seat.seatLabel)) {
          seat.status = "available";
          seat.heldBy = null;
          seat.holdExpiresAt = null;
        }
      });

      await showtime.save();
    }

    booking.status = "cancelled";
    await booking.save();

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (err) {
    console.error("Cancel booking error:", err);

    return res.status(500).json({
      message: "Failed to cancel booking",
      error: err.message,
    });
  }
};


module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
};
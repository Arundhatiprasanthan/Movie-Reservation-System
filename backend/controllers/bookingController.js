const Booking = require("../models/Booking");
const Showtime = require("../models/Showtime");

// @route  POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { showtimeId, seats } = req.body;

    if (!showtimeId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: "showtimeId and seats array are required" });
    }

    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    // Check if all requested seats are available
    const unavailableSeats = [];
    seats.forEach((label) => {
      const seat = showtime.seats.find((s) => s.seatLabel === label);
      if (!seat || seat.status !== "available") {
        unavailableSeats.push(label);
      }
    });

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: `Seats ${unavailableSeats.join(", ")} are no longer available`,
      });
    }

    // Reserve seats in showtime document
    seats.forEach((label) => {
      const seat = showtime.seats.find((s) => s.seatLabel === label);
      if (seat) {
        seat.status = "reserved";
        seat.heldBy = req.user._id;
      }
    });

    await showtime.save();

    // Calculate total cost
    const subtotal = seats.length * showtime.price;
    const convenienceFee = 50;
    const gst = Math.round(subtotal * 0.18);
    const totalCost = subtotal + convenienceFee + gst;

    const bookingId = `BK-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const booking = await Booking.create({
      bookingId,
      user: req.user._id,
      showtime: showtimeId,
      seats,
      totalCost,
      status: "confirmed",
    });

    const populatedBooking = await Booking.findById(booking._id).populate({
      path: "showtime",
      populate: [{ path: "movie" }, { path: "theater" }, { path: "screen" }],
    });

    res.status(201).json({
      message: "Booking confirmed successfully",
      booking: populatedBooking,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create booking", error: err.message });
  }
};

// @route  GET /api/bookings/my-bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: "showtime",
        populate: [{ path: "movie" }, { path: "theater" }, { path: "screen" }],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user bookings", error: err.message });
  }
};

// @route  POST /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify ownership or admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: cannot cancel another user's booking" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    // Release seats back to available in Showtime
    const showtime = await Showtime.findById(booking.showtime);
    if (showtime) {
      booking.seats.forEach((label) => {
        const seat = showtime.seats.find((s) => s.seatLabel === label);
        if (seat) {
          seat.status = "available";
          seat.heldBy = null;
          seat.holdExpiresAt = null;
        }
      });
      await showtime.save();
    }

    res.status(200).json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel booking", error: err.message });
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking };

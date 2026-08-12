const Booking = require("../models/Booking");

// GET /api/admin/bookings
const getAdminBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate({
        path: "showtime",
        populate: [
          { path: "movie", select: "title" },
          { path: "theater", select: "name location" },
          { path: "screen", select: "name" },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch admin bookings",
      error: err.message,
    });
  }
};

// GET /api/admin/bookings/stats
const getAdminBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments({
      status: "confirmed",
    });

    const totalCancelled = await Booking.countDocuments({
      status: "cancelled",
    });

    const revenueResult = await Booking.aggregate([
      {
        $match: {
          status: "confirmed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalCost",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    res.status(200).json({
      totalBookings,
      totalCancelled,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch booking statistics",
      error: err.message,
    });
  }
};

module.exports = {
  getAdminBookings,
  getAdminBookingStats,
};
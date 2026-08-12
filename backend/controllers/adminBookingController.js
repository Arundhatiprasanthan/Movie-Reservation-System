const Booking = require("../models/Booking");

// @route  GET /api/admin/bookings
// Supports optional query filters: ?status=confirmed&showtime=<id>
const getAllBookings = async (req, res) => {
  try {
    const { status, showtime } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (showtime) filter.showtime = showtime;

    const bookings = await Booking.find(filter)
      .populate("user", "name email")
      .populate({
        path: "showtime",
        select: "startTime price movie theater screen",
        populate: [
          { path: "movie", select: "title" },
          { path: "theater", select: "name" },
          { path: "screen", select: "name" },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
};

// @route  GET /api/admin/bookings/stats
// Returns overall totals for a quick admin dashboard view
const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments({ status: "confirmed" });
    const totalCancelled = await Booking.countDocuments({ status: "cancelled" });

    const revenueAgg = await Booking.aggregate([
      { $match: { status: "confirmed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalCost" } } },
    ]);

    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    res.status(200).json({
      totalBookings,
      totalCancelled,
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch booking stats", error: err.message });
  }
};

module.exports = { getAllBookings, getBookingStats };

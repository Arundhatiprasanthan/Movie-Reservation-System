const express = require("express");

const {
  getAdminBookings,
  getAdminBookingStats,
} = require("../controllers/adminBookingController");

const { protect } = require("../middleware/auth");

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};

router.use(protect);
router.use(adminOnly);

router.get("/", getAdminBookings);
router.get("/stats", getAdminBookingStats);

module.exports = router;
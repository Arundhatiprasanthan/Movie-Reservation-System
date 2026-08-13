const express = require("express");
const Showtime = require("../models/Showtime");

const router = express.Router();

// @route GET /api/showtimes/:id
router.get("/:id", async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id)
      .populate("movie")
      .populate("theater")
      .populate("screen");

    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    res.status(200).json({ showtime });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch showtime details", error: err.message });
  }
});

module.exports = router;

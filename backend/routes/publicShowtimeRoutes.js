const express = require("express");
const router = express.Router();

const {
  getShowtimesByMovie,
  getShowtimeById,
} = require("../controllers/showtimeController");

router.get("/movie/:movieId", getShowtimesByMovie);
router.get("/:id", getShowtimeById);

module.exports = router;
const express = require("express");
const router = express.Router();

const {
  createShowtime,
  getShowtimes,
  getShowtimeById,
  updateShowtime,
  deleteShowtime,
  setSeatBlockedStatus,
} = require("../controllers/adminShowtimeController");

router.post("/", createShowtime);
router.get("/", getShowtimes);
router.get("/:id", getShowtimeById);
router.put("/:id", updateShowtime);
router.delete("/:id", deleteShowtime);

router.patch(
  "/:id/seats/:seatLabel/block",
  setSeatBlockedStatus
);

module.exports = router;
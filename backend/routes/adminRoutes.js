const express = require("express");
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/adminAuth");

const {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} = require("../controllers/adminMovieController");

const {
  createTheater,
  getTheaters,
  updateTheater,
  deleteTheater,
  createScreen,
  getScreensByTheater,
  updateScreen,
  deleteScreen,
} = require("../controllers/adminTheaterController");

const {
  createShowtime,
  getShowtimes,
  getShowtimeById,
  updateShowtime,
  deleteShowtime,
  setSeatBlockedStatus,
} = require("../controllers/adminShowtimeController");

const { getAllBookings, getBookingStats } = require("../controllers/adminBookingController");
const { getAllUsers, updateUserRole } = require("../controllers/adminUserController");

const router = express.Router();

// Every route below requires a valid token AND an admin role
router.use(protect, isAdmin);

// ----- Movies -----
router.post("/movies", createMovie);
router.get("/movies", getMovies);
router.get("/movies/:id", getMovieById);
router.put("/movies/:id", updateMovie);
router.delete("/movies/:id", deleteMovie);

// ----- Theaters -----
router.post("/theaters", createTheater);
router.get("/theaters", getTheaters);
router.put("/theaters/:id", updateTheater);
router.delete("/theaters/:id", deleteTheater);

// ----- Screens (nested under theaters) -----
router.post("/theaters/:theaterId/screens", createScreen);
router.get("/theaters/:theaterId/screens", getScreensByTheater);
router.put("/screens/:id", updateScreen);
router.delete("/screens/:id", deleteScreen);

// ----- Showtimes -----
router.post("/showtimes", createShowtime);
router.get("/showtimes", getShowtimes);
router.get("/showtimes/:id", getShowtimeById);
router.put("/showtimes/:id", updateShowtime);
router.delete("/showtimes/:id", deleteShowtime);
router.patch("/showtimes/:id/seats/:seatLabel/block", setSeatBlockedStatus);

// ----- Bookings (read-only for admins) -----
router.get("/bookings", getAllBookings);
router.get("/bookings/stats", getBookingStats);

// ----- Users (role management) -----
router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);

module.exports = router;

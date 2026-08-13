const express = require("express");
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/adminAuth");
const validateObjectId = require("../middleware/validateObjectId");

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
  getShowtimeSeats,
} = require("../controllers/adminShowtimeController");

const { getAllUsers, updateUserRole } = require("../controllers/adminUserController");

const router = express.Router();

// Every route below requires a valid token AND an admin role
router.use(protect, isAdmin);

// ----- Movies -----
router.post("/movies", createMovie);
router.get("/movies", getMovies);
router.get("/movies/:id", validateObjectId(), getMovieById);
router.put("/movies/:id", validateObjectId(), updateMovie);
router.delete("/movies/:id", validateObjectId(), deleteMovie);

// ----- Theaters -----
router.post("/theaters", createTheater);
router.get("/theaters", getTheaters);
router.put("/theaters/:id", validateObjectId(), updateTheater);
router.delete("/theaters/:id", validateObjectId(), deleteTheater);

// ----- Screens (nested under theaters) -----
router.post("/theaters/:theaterId/screens", validateObjectId("theaterId"), createScreen);
router.get("/theaters/:theaterId/screens", validateObjectId("theaterId"), getScreensByTheater);
router.put("/screens/:id", validateObjectId(), updateScreen);
router.delete("/screens/:id", validateObjectId(), deleteScreen);

// ----- Showtimes -----
router.post("/showtimes", createShowtime);
router.get("/showtimes", getShowtimes);
router.get("/showtimes/:id", validateObjectId(), getShowtimeById);
router.get("/showtimes/:id/seats", validateObjectId(), getShowtimeSeats);
router.put("/showtimes/:id", validateObjectId(), updateShowtime);
router.delete("/showtimes/:id", validateObjectId(), deleteShowtime);
router.patch("/showtimes/:id/seats/:seatLabel/block", validateObjectId(), setSeatBlockedStatus);



// ----- Users (role management) -----
router.get("/users", getAllUsers);
router.patch("/users/:id/role", validateObjectId(), updateUserRole);

module.exports = router;
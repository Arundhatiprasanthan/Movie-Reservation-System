const express = require("express");

const {
  getPublicMovies,
  getPublicMovieById,
} = require("../controllers/movieController");

const router = express.Router();

router.get("/", getPublicMovies);
router.get("/:id", getPublicMovieById);

module.exports = router;
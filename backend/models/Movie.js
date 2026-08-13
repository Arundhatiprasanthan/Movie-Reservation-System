const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    genre: {
      type: [String],
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    director: {
      type: String,
      required: true,
      trim: true,
    },

    cast: {
      type: [String],
      required: true,
    },

    posterUrl: {
      type: String,
      default: "",
    },

    rating: {
      type: String,
      default: "NR",
    },

    releaseDate: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Movie", movieSchema);
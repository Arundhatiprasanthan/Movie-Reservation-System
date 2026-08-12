const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    genre: { type: [String], required: true },
    duration: { type: Number, required: true }, // in minutes
    description: { type: String, required: true },
    posterUrl: { type: String, default: "" },
    rating: { type: String, default: "NR" }, // e.g. PG-13, R
    releaseDate: { type: Date },
    isActive: { type: Boolean, default: true }, // soft-delete / "now showing" toggle
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);

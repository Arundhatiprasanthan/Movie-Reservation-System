const mongoose = require("mongoose");

const screenSchema = new mongoose.Schema(
  {
    theater: { type: mongoose.Schema.Types.ObjectId, ref: "Theater", required: true },
    name: { type: String, required: true, trim: true }, // e.g. "Screen 1"
    rows: { type: Number, required: true }, // number of seat rows
    seatsPerRow: { type: Number, required: true },
    screenType: { type: String, enum: ["2D", "3D", "IMAX", "4DX"], default: "2D" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Screen", screenSchema);

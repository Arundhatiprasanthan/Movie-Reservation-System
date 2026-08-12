const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
  {
    seatLabel: { type: String, required: true }, // e.g. "A1"
    status: {
      type: String,
      enum: ["available", "held", "reserved", "blocked"],
      default: "available",
    },
    heldBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    holdExpiresAt: { type: Date, default: null },
  },
  { _id: false }
);

const showtimeSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    theater: { type: mongoose.Schema.Types.ObjectId, ref: "Theater", required: true },
    screen: { type: mongoose.Schema.Types.ObjectId, ref: "Screen", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    price: { type: Number, required: true },
    seats: { type: [seatSchema], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Showtime", showtimeSchema);

const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/movie_reservation";
  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected: ${uri}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    console.warn("Starting backend server in disconnected mode. Reconnect MongoDB to persist data.");
  }
};

module.exports = connectDB;


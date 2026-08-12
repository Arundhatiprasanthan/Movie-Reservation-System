const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));

// Fallback 404
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

module.exports = app;

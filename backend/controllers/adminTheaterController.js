const Theater = require("../models/Theater");
const Screen = require("../models/Screen");

// ----- Theaters -----

// @route  POST /api/admin/theaters
const createTheater = async (req, res) => {
  try {
    const { name, location } = req.body;
    if (!name || !location) {
      return res.status(400).json({ message: "name and location are required" });
    }
    const theater = await Theater.create({ name, location });
    res.status(201).json({ message: "Theater created", theater });
  } catch (err) {
    res.status(500).json({ message: "Failed to create theater", error: err.message });
  }
};

// @route  GET /api/admin/theaters
const getTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find().sort({ createdAt: -1 });
    res.status(200).json({ count: theaters.length, theaters });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch theaters", error: err.message });
  }
};

// @route  PUT /api/admin/theaters/:id
const updateTheater = async (req, res) => {
  try {
    const theater = await Theater.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!theater) return res.status(404).json({ message: "Theater not found" });
    res.status(200).json({ message: "Theater updated", theater });
  } catch (err) {
    res.status(500).json({ message: "Failed to update theater", error: err.message });
  }
};

// @route  DELETE /api/admin/theaters/:id
const deleteTheater = async (req, res) => {
  try {
    const screenCount = await Screen.countDocuments({ theater: req.params.id });
    if (screenCount > 0) {
      return res.status(400).json({
        message: "Cannot delete theater with existing screens. Remove its screens first.",
      });
    }
    const theater = await Theater.findByIdAndDelete(req.params.id);
    if (!theater) return res.status(404).json({ message: "Theater not found" });
    res.status(200).json({ message: "Theater deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete theater", error: err.message });
  }
};

// ----- Screens -----

// @route  POST /api/admin/theaters/:theaterId/screens
const createScreen = async (req, res) => {
  try {
    const { theaterId } = req.params;
    const { name, rows, seatsPerRow, screenType } = req.body;

    const theater = await Theater.findById(theaterId);
    if (!theater) return res.status(404).json({ message: "Theater not found" });

    if (!name || !rows || !seatsPerRow) {
      return res.status(400).json({ message: "name, rows, and seatsPerRow are required" });
    }

    const screen = await Screen.create({
      theater: theaterId,
      name,
      rows,
      seatsPerRow,
      screenType,
    });

    res.status(201).json({ message: "Screen created", screen });
  } catch (err) {
    res.status(500).json({ message: "Failed to create screen", error: err.message });
  }
};

// @route  GET /api/admin/theaters/:theaterId/screens
const getScreensByTheater = async (req, res) => {
  try {
    const screens = await Screen.find({ theater: req.params.theaterId });
    res.status(200).json({ count: screens.length, screens });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch screens", error: err.message });
  }
};

// @route  PUT /api/admin/screens/:id
const updateScreen = async (req, res) => {
  try {
    const screen = await Screen.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!screen) return res.status(404).json({ message: "Screen not found" });
    res.status(200).json({ message: "Screen updated", screen });
  } catch (err) {
    res.status(500).json({ message: "Failed to update screen", error: err.message });
  }
};

// @route  DELETE /api/admin/screens/:id
const deleteScreen = async (req, res) => {
  try {
    const screen = await Screen.findByIdAndDelete(req.params.id);
    if (!screen) return res.status(404).json({ message: "Screen not found" });
    res.status(200).json({ message: "Screen deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete screen", error: err.message });
  }
};

module.exports = {
  createTheater,
  getTheaters,
  updateTheater,
  deleteTheater,
  createScreen,
  getScreensByTheater,
  updateScreen,
  deleteScreen,
};

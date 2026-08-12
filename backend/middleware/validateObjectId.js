const mongoose = require("mongoose");

// Checks any :id-style route param is a valid MongoDB ObjectId before it
// reaches the controller. Put the param name first if it's not "id".
const validateObjectId = (paramName = "id") => (req, res, next) => {
  const value = req.params[paramName];
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return res.status(400).json({ message: `Invalid ${paramName} format` });
  }
  next();
};

module.exports = validateObjectId;
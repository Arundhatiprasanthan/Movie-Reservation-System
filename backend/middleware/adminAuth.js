// Must run AFTER `protect`, since it relies on req.user being set
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: admin privileges required" });
  }
  next();
};

module.exports = { isAdmin };

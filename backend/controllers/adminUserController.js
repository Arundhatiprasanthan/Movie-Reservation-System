const User = require("../models/User");

// @route  GET /api/admin/users
// Lists all registered users so an admin can see who exists and pick someone to promote
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// @route  PATCH /api/admin/users/:id/role
// Lets an existing admin promote a user to admin, or demote an admin back to user
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "role must be either 'user' or 'admin'" });
    }

    // Prevent an admin from accidentally demoting themselves and locking themselves out
    if (req.params.id === req.user.id.toString() && role !== "admin") {
      return res.status(400).json({ message: "You cannot demote your own account" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: `User role updated to ${role}`, user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user role", error: err.message });
  }
};

module.exports = { getAllUsers, updateUserRole };
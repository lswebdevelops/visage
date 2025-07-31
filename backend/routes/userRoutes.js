import express from "express";
const router = express.Router();
import User from "../models/userModel.js"; // Import the User model
import { forgotPassword, resetPassword } from "../controllers/userController.js";

import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// NEW ROUTE: Define /email-list BEFORE any dynamic routes
router.get("/email-list", protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select("email"); // Get only the email field
    const emailList = users.map((user) => user.email);
    res.status(200).json({ emails: emailList });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve emails" });
  }
});

// Existing routes
router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Note: This dynamic route is declared AFTER /email-list
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword); // <-- NEW LINE

export default router;

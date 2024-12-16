import express, { Request, Response, NextFunction } from "express";
import {
  register,
  login,
  getUsers,
  resetpassword,
  verifyOTP,
  changePassword
} from "../controllers/users";

import User from "../models/User";


const router = express.Router();
// Define route handlers with types for request and response
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/users").get(getUsers);

// GET user details for editing
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// Update user info
router.put("/:id", async (req, res) => {
  const { username, email } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { username, email },
    { new: true }
  );
  res.json(updatedUser);
});

// Delete user
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Reset password
router.route('/reset-password').post(resetpassword);
router.route('/verify-otp').post(verifyOTP);
router.route('/change-password').post(changePassword);


export default router;

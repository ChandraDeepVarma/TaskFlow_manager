import express from "express";
import { signup, login } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/signup
router.post(`/signup`, signup);

// POST /api/auth/login
router.post("/login", login);

// Protected route → only works with token
router.get("/profile", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Wellcome !!", user: req.user });
});
export default router;

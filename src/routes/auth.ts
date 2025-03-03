import express from "express";
import {
  register,
  login,
  handleRefreshToken,
  logout,
} from "../controllers/authController";
import { authRateLimiter } from "../middleware/rateLimit";

const router = express.Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/refresh-token", authRateLimiter, handleRefreshToken);
router.post("/logout", logout);

export default router;

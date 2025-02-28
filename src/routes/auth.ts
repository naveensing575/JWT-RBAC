import express from "express";
import {
  register,
  login,
  handleRefreshToken,
  logout,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", handleRefreshToken);
router.post("/logout", logout);

export default router;

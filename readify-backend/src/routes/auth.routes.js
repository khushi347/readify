import express from "express";
import {
  signup,
  login,
  refreshAccessToken,
  logout,
  getMe
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);

router.get("/me", protect, getMe);

export default router;
import express from "express";
import {
  addToShelf,
  getUserShelf,
  removeShelf,
  updateProgress,
  updateStatus,
} from "../controllers/userBook.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", protect, addToShelf);
router.get("/", protect, getUserShelf);
router.patch("/:id/status", protect, updateStatus);
router.patch("/:id/progress", protect, updateProgress);
router.delete("/:id", protect, removeShelf);

export default router;
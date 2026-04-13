import express from "express";
import { getReadingAnalytics } from "../controllers/analytics.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/reading", protect, getReadingAnalytics);

export default router;
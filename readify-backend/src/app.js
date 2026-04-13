import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userBookRoutes from "./routes/userBook.routes.js";
import bookRoutes from "./routes/book.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js"; // ✅ FIXED

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, try again later",
});

app.use(limiter);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/shelf", userBookRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/analytics", analyticsRoutes);

// health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server running",
  });
});

export default app;
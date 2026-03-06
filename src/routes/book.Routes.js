import express from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
  rateBook
} from "../controllers/book.controller.js";

const router = express.Router();

router.post("/create", createBook);

router.get("/", getAllBooks);

router.get("/:bookId", getBookById);

router.post("/:bookId/rate", rateBook);

export default router;
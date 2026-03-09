import express from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
  rateBook,
  searchBooks
} from "../controllers/book.controller.js";

const router = express.Router();

router.get("/search", searchBooks);
router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/create", createBook);
router.post("/:bookId/rate", rateBook);


export default router;
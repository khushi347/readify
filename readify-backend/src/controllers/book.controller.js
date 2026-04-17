import Book from "../models/book.js";
import BookRating from "../models/bookRating.js";
import { importBooksFromGoogle } from "../services/bookImport.service.js";

export const createBook = async (req, res) => {
  try {
    const { title, author, totalPages, description, coverImage } = req.body;

    if (!title || !author || !totalPages) {
      return res.status(400).json({
        message: "Title, author and total pages are required",
      });
    }

    const book = await Book.create({
      title,
      author,
      totalPages,
      description,
      coverImage,
    });

    return res.status(201).json(book);

  } catch (error) {
    return res.status(500).json({
      message: "Failed to create book",
      error: error.message,
    });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find()
    .sort({ createdAt: -1 })
    .limit(20);
    return res.status(200).json(books);

  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch books",
      error: error.message,
    });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    return res.status(200).json(book);

  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch book",
      error: error.message,
    });
  }
};

export const rateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating } = req.body;
    const userId = req.userId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const existingRating = await BookRating.findOne({
      user: userId,
      book: bookId,
    });

    if (existingRating) {
      // User is updating rating
      book.rating.total =
        book.rating.total - existingRating.rating + rating;

      existingRating.rating = rating;
      await existingRating.save();

    } else {
      // First time rating
      await BookRating.create({
        user: userId,
        book: bookId,
        rating,
      });

      book.rating.total += rating;
      book.rating.count += 1;
    }

    await book.save();

    return res.status(200).json({
      message: "Rating submitted successfully",
      averageRating: book.averageRating,
      ratingCount: book.rating.count,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to update rating",
      error: error.message,
    });
  }
};

export const searchBooks=async(req,res)=>{
  try{
    const {q}=req.query;
    if(!q || q.trim()===" "){
      return res.status(400).json({message:"Search query required"});
    }

    let books=await Book.find({
      $text:{$search:q}
    }).limit(10);

    if(books.length===0){
      books=await importBooksFromGoogle(q) || [];
    }

    return res.status(200).json({
      success:true,
      books
    }); 
  }
  catch(error){
    return res.status(500).json({message:"Failed to fetch books",error:error.message});
  }
}
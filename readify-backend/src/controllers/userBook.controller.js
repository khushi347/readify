import UserBook from "../models/userBook.js";
import Book from "../models/book.js";

//  Add Book to Shelf
export const addToShelf = async (req, res) => {
  try {
    const { bookId, status } = req.body;

    if (!bookId) {
      return res.status(400).json({
        message: "Book ID is required",
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const alreadyExists = await UserBook.findOne({
      user: req.user._id, 
      book: bookId,
    });

    if (alreadyExists) {
      return res.status(400).json({
        message: "Book already in shelf",
      });
    }

    const userBook = await UserBook.create({
      user: req.user._id, 
      book: bookId,
      status,
    });

    const populated = await userBook.populate(
      "book",
      "title author coverImage totalPages"
    );

    return res.status(201).json({
      success: true,
      userBook: populated,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to add book to shelf",
      error: error.message,
    });
  }
};

//  Get User Shelf
export const getUserShelf = async (req, res) => {
  try {
    const shelf = await UserBook.find({
      user: req.user._id,
    })
      .populate("book", "title author coverImage totalPages")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      shelf,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch shelf",
      error: error.message,
    });
  }
};

// Update Reading Status

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["want", "reading", "completed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const updateData = { status };

    if (status === "completed") {
      updateData.progress = 100;
    }

    const userBook = await UserBook.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, 
      updateData,
      { new: true }
    );

    if (!userBook) {
      return res.status(404).json({
        message: "Book not found in shelf",
      });
    }

    return res.status(200).json(userBook);

  } catch (error) {
    return res.status(500).json({
      message: "Failed to update status",
      error: error.message,
    });
  }
};

// 📊 Update Progress
export const updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;

    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        message: "Progress must be between 0 and 100",
      });
    }

    const updateData = { progress };

    if (progress === 100) {
      updateData.status = "completed";
    }

    const userBook = await UserBook.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, 
      updateData,
      { new: true }
    );

    if (!userBook) {
      return res.status(404).json({
        message: "Book not found in shelf",
      });
    }

    return res.status(200).json(userBook);

  } catch (error) {
    return res.status(500).json({
      message: "Failed to update progress",
      error: error.message,
    });
  }
};

// Remove Book from Shelf
export const removeShelf = async (req, res) => {
  try {
    const deleted = await UserBook.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, 
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Book not found in shelf",
      });
    }

    return res.status(200).json({
      message: "Book removed from shelf",
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to remove book",
      error: error.message,
    });
  }
};
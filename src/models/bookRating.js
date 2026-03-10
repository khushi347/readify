import mongoose from "mongoose";

const bookRatingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate rating per user per book
bookRatingSchema.index({ user: 1, book: 1 }, { unique: true });

const BookRating = mongoose.model("BookRating", bookRatingSchema);

export default BookRating;
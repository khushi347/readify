import axios from "axios";
import Book from "../models/book.js";

export const importBooksFromGoogle = async (query) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}`
    );

    const items = response.data.items || [];

    const books = [];

    for (let item of items) {
      const volumeInfo = item.volumeInfo;

      if (!volumeInfo.title) continue;

      // 🔥 CLEAN GENRE LOGIC
      let genreValue =
        volumeInfo.categories?.[0] ||
        (volumeInfo.title.includes("Code")
          ? "Technology"
          : volumeInfo.title.includes("Money")
          ? "Finance"
          : volumeInfo.title.includes("Habit")
          ? "Self-help"
          : volumeInfo.title.includes("Harry")
          ? "Fiction"
          : "General");

      const book = {
        title: volumeInfo.title,
        author: volumeInfo.authors?.join(", ") || "Unknown",
        totalPages: volumeInfo.pageCount || 100,
        description: volumeInfo.description || "",
        coverImage: volumeInfo.imageLinks?.thumbnail || "",
        genre: [genreValue], // ✅ IMPORTANT: array
        googleBooksId: item.id, // optional but useful
      };

      books.push(book);
    }

    // 🔥 SAVE TO DB (ignore duplicates)
    const savedBooks = await Book.insertMany(books, {
      ordered: false,
    });

    return savedBooks;

  } catch (error) {
    console.log("GOOGLE API ERROR:", error.message);
    return []; // ✅ never crash
  }
};
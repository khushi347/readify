import axios from "axios";
import Book from "../models/book.js";

export const importBooksFromGoogle = async (query) => {
    const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10&key=${process.env.GOOGLE_BOOKS_API_KEY}`
    );

    const books = response.data.items;

    const savedBooks = [];

    for (const item of books) {

        const info = item.volumeInfo;

        const googleBooksId = item.id;

        const existingBook = await Book.findOne({ googleBooksId });

        if (existingBook) {
            savedBooks.push(existingBook);
            continue;
        }

        const newBook = await Book.create({
            title: info.title || "Unknown Title",
            author: info.authors ? info.authors[0] : "Unknown Author",
            description: info.description || "",
            coverImage: info.imageLinks?.thumbnail || "",
            totalPages: info.pageCount || 100,
            genres: info.categories || [],
            googleBooksId
        });

        savedBooks.push(newBook);
    }

    return savedBooks;
};
const axios = require("axios");

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

const fetchBooks = async (query) => {
    const response = await axios.get(BASE_URL, {
        params: {
            q: query,
            key: process.env.GOOGLE_BOOKS_API_KEY,
            maxResults: 10,
        },
    });

    return (response.data.items || []).map((book) => ({
        bookId: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || [],
        thumbnail: book.volumeInfo.imageLinks?.thumbnail || null,
        genre: book.volumeInfo.categories?.[0] || "Unknown",
        totalPages: book.volumeInfo.pageCount || null,
        synopsis: book.volumeInfo.description || "",
    }));
};


const searchBooks = (query) => fetchBooks(query);

const currentYear = new Date().getFullYear() - 5; // last 5 years

const searchBooksByGenre = (genre) =>
    fetchBooks(`subject:${genre} after:${currentYear}`);

module.exports = {
    searchBooks,
    searchBooksByGenre,
};
import { useEffect, useState } from "react";
import API from "../api/axios";
import BookCard from "../components/BookCard";
import { Link } from "react-router-dom";

function Explore() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");

  // 🔹 Fetch all books on load
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await API.get("/book");
      setBooks(res.data.book);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // 🔍 Search books
  const searchBooks = async () => {
    try {
      if (query.trim() === "") return;

      const res = await API.get(`/books/search?q=${query}`);
      setBooks(res.data.books);
    } catch (error) {
      console.error("Error searching books:", error);
    }
  };

  // 🔄 Clear search
  const clearSearch = () => {
    setQuery("");
    fetchBooks();
  };

  return (
    <div className="explore-page">
      <div className="explore-container">

        {/* 🔥 Hero Section */}
        <div className="explore-hero">
          <h1>📚 Discover Your Next Book</h1>

          <div style={{ marginTop: "20px" }}>
            <input
              type="text"
              placeholder="Search books..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchBooks();
                }
              }}
              style={{
                padding: "10px",
                width: "250px",
                borderRadius: "6px",
                border: "1px solid #ccc"
              }}
            />

            <button
              onClick={searchBooks}
              style={{
                marginLeft: "10px",
                padding: "10px 14px",
                borderRadius: "6px",
                backgroundColor: "#5BC0BE",
                color: "white",
                border: "none",
                cursor: "pointer"
              }}
            >
              Search
            </button>

            <button
              onClick={clearSearch}
              style={{
                marginLeft: "10px",
                padding: "10px 14px",
                borderRadius: "6px",
                backgroundColor: "#ccc",
                border: "none",
                cursor: "pointer"
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* 📚 Books Grid */}
        <div
          className="books-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "20px",
            marginTop: "40px"
          }}
        >
          {books.length > 0 ? (
            books.map((book) => (
              <Link key={book._id} to={`/book/${book._id}`}>
                <BookCard book={book} />
              </Link>
            ))
          ) : (
            <p>No books found</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Explore;
import { useEffect, useState } from "react";
import axios from "axios";
import { gsap } from "gsap";

import BookCard from "../components/BookCard";
import "./Explore.css";

function Explore() {

  const [books, setBooks] = useState([]);

  // Fetch books
  useEffect(() => {
    fetchBooks();

    // Animate hero section
    gsap.from(".explore-hero", {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });

  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Animate cards AFTER books render
  useEffect(() => {

    if (books.length === 0) return;

    gsap.from(".book-card", {
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out"
    });

  }, [books]);

  return (
    <div className="explore-page">
  <div className="explore-container">

    <div className="explore-hero">
      <h1>Discover Your Next Book</h1>
      <input className="search-bar" placeholder="Search books..." />
    </div>

    <div className="books-grid">
      {books.map((book) => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>

  </div>
</div>
  );
}

export default Explore;
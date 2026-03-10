import { Link } from "react-router-dom";
import gsap from "gsap";
import "./BookCard.css";

function BookCard({ book }) {

  const hoverIn = (e) => {
    gsap.to(e.currentTarget, {
      y: -10,
      scale: 1.03,
      duration: 0.25
    });
  };

  const hoverOut = (e) => {
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      duration: 0.25
    });
  };

  return (
    <Link
      to={`/book/${book._id}`}
      className="book-card"
      onMouseEnter={hoverIn}
      onMouseLeave={hoverOut}
    >

      <img src={book.coverImage} alt={book.title} />

      <div className="book-info">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
      </div>

    </Link>
  );
}


export default BookCard;
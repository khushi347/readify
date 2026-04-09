
function BookCard({ book }) {
  return (
    <div className="book-card">

      <div className="book-image">
        <img src={book.coverImage} alt={book.title} />
      </div>

      <div className="book-info">
        <h3>{book.title}</h3>
        <p className="author">{book.author}</p>
      </div>
    </div>
  );
}

export default BookCard;
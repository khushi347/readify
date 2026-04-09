import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";

const BookPage = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        fetchBook();
    }, [id]);

    const fetchBook = async () => {
        try {
            const res = await API.get(`http://localhost:5000/api/books/${id}`);
            setBook(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const addToShelf = async (status) => {
        try {
            await API.post("http://localhost:5000/api/shelf/add", { bookId: book._id, status }, { withCredentials: true });
            alert("Added to shelf");
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    }

    if (!book) return <p>Loading...</p>

    return (
        <div>
            <h1>{book.title}</h1>
            <p>Author: {book.author}</p>
            <p>Book description: {book.description}</p>
            <img src={book.coverImage || "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"} alt="{book.title}" />
            <div style={{ marginTop: "20px" }}>
                <button onClick={() => addToShelf("want_to_read")}>
                    Want to Read
                </button>

                <button onClick={() => addToShelf("currently_reading")}>
                    Currently Reading
                </button>

                <button onClick={() => addToShelf("completed")}>
                    Completed
                </button>
            </div>
        </div>
    );
}

export default BookPage;
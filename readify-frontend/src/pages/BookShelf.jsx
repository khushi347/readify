import { useEffect, useState } from "react";
import API from "../api/axios";

const BookShelf = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,setFilter]=useState("all");

  useEffect(() => {
    fetchShelf();
  }, []);

  const fetchShelf = async () => {
    try {
      const res = await API.get("/shelf");
      setBooks(res.data.shelf);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const wantBooks=books.filter((item)=>item.status==="want");
  const readingBooks=books.filter((item)=>item.status==="reading");
  const completedBooks=books.filter((item)=>item.status==="completed")
  
  if (loading) return <p>Loading bookshelf...</p>;

  let displayedBooks;

  if(filter==="all"){
    displayedBooks=books;
  }else if(filter==="want"){
    displayedBooks=wantBooks;
  }else if(filter==="reading"){
    displayedBooks=readingBooks;
  }else{
    displayedBooks=completedBooks;
  }

  const updateProgress = async (id, progress) => {
  try {
    await API.patch(`/shelf/${id}/progress`, {
      progress: Number(progress),
    });
    fetchShelf(); // refresh UI
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-6">My Bookshelf</h1>

      <div className="flex gap-4 mb-6">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("want")}>Want</button>
          <button onClick={() => setFilter("reading")}>Reading</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
       </div>
      {books.length === 0 ? (
        <p className="text-gray-500">No books in your shelf yet 📚</p>
      ) : (
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedBooks.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow rounded-xl p-4"
            >
              <h2 className="font-medium">{item.book?.title}</h2>
              <p className="text-sm text-gray-500">
                {item.book?.author}
              </p>
              <p className="text-sm mt-2">
                Progress: {item.progress}%
              </p>

              <input
                type="range"
                min="0"
                max="100"
                value={item.progress || 0}
                onChange={(e) => updateProgress(item._id, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookShelf;
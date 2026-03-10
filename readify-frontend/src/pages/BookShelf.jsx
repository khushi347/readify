import { useEffect,useState } from "react";
import API from "../api/axios";

const BookShelf=()=>{
    const [books,setBooks]=useState([]);

    useEffect(()=>{
        fetchShelf();
    },[]);

    const fetchShelf=async()=>{
        try{
            const res=await API.get("/shelf");
            setBooks(res.data.books);
            console.log("Bookshelf",res.data)
        }
        catch(error){
            console.error(error);
        }
    };

    return(
        <div className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-6">My Bookshelf</h1>

      <div className="grid grid-cols-4 gap-6">
        {books.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow rounded-xl p-4"
          >
            <h2 className="font-medium">{item.book.title}</h2>
            <p className="text-sm text-gray-500">
              {item.book.author}
            </p>
            <p className="text-sm mt-2">
              Progress: {item.progress}%
            </p>
          </div>
        ))}
      </div>
    </div>
    );
};

export default BookShelf;

import { BrowserRouter,Routes,Route,Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import BookShelf from "./pages/BookShelf";
import Explore from "./pages/Explore";
import Navbar from "./components/Navbar";
import Logo from "./components/Logo";
import BookPage from "./pages/BookPage"

function Dashboard(){
    return <h1>Dashboard</h1>
}

function App(){
    return (
       <>
       
       <BrowserRouter>
        <Navbar/>
        
        <div className="app-content">
        <Routes>

            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" />} />

            <Route path="/login" element={<Login/>}/>

            <Route
             path="/dashboard" 
             element={
                <ProtectedRoute>
                <Dashboard/>
                </ProtectedRoute>
                }
            />

            <Route
             path="/bookshelf"
             element={
                <ProtectedRoute>
                    <BookShelf/>
                </ProtectedRoute>
             }
            />

            <Route
             path="/explore"
              element={
              <Explore/>
              }/>

              <Route path="/book/:id" element={<BookPage/>}/>

        </Routes>
        </div>
       </BrowserRouter>
       
      
       </>
        
    );
}

export default App;
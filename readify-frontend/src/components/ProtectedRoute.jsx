import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate,useLocation} from "react-router-dom";

const ProtectedRoute=({children})=>{
    const {user,loading}=useContext(AuthContext);
    const location=useLocation();

    if(loading){
        return <div>Loading...</div>;
    }

    if(!user){
        return (
            <Navigate
            to="/login"
            state={{from:location}}
            replace
            />
        ) 
    }
    return children;
};

export default ProtectedRoute;
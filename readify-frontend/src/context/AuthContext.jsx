import { createContext,useState,useEffect} from "react";
import API from "../api/axios";

export const AuthContext=createContext();

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null);
    const [accessToken,setAccessToken]=useState(null);
    const [loading,setLoading]=useState(true);

    const login=async(email,password)=>{
        const res=await API.post("/auth/login",{email,password});
        const token=res.data.accessToken;
        setAccessToken(token);
        setUser(res.data.user);
        API.defaults.headers.common["Authorization"]=`Bearer ${token}`;
    }

    useEffect(()=>{
        const refreshUser=async()=>{
            try{
                const res=await API.post("/auth/refresh");
                const newToken=res.data.accessToken;

                setAccessToken(newToken);
                API.defaults.headers.common["Authorization"]=`Bearer ${newToken}`;

                const userRes=await API.get("/auth/me");
                setUser(userRes.data.user);
            }
            catch(error){
                setUser(null);
                setAccessToken(null);
            }
            finally{
                setLoading(false);
            }
        };
        refreshUser();
    },[]);

    return(
        <AuthContext.Provider
        value={{
            user,
            accessToken,
            login,
            loading
        }}
        >
            {children}
        </AuthContext.Provider>  
    );
}
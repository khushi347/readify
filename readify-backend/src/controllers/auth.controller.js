import User from "../models/user.model.js"
import jwt from "jsonwebtoken";

export const signup=async(req,res)=>{
    try{
        const {name,email,password}=req.body;

        if(!name|| !email|| !password){
            return res.status(400).json({
                message:"All fields are required"
            });
        }

        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Invalid email format"});
        }

        const existingUser=await User.findOne({email});

        if(existingUser){
            return res.status(400).json({message:"Email already registered"});
        }

        const user=await User.create({
            name,
            email,
            password
        });

        const accessToken=jwt.sign(
            {id:user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:"15m"}
        )

        const refreshToken=jwt.sign(
            {id:user._id},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:"7d"}
        )

        user.refreshToken= refreshToken;
        await user.save();

        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
            maxAge:7*24*60*60*1000
        })
         
        const userResponse=user.toObject();
        delete userResponse.password;
        delete userResponse.refreshToken;

        return res.status(201).json({message:"User registered successfully",
            accessToken,
            user:userResponse
        });
        
    } catch(error){
        console.log("Signup Error: ",error);
        res.status(500).json({message:"Internal server error"});
    }
}

export const login=async (req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"Email and password are required"})
        }

        const user=await User.findOne({email}).select("+password");

        if(!user){
        return res.status(401).json({message:"Invalid email or password"});
        }

        const isPasswordValid=await user.comparePassword(password);

        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid email or password"});
        }

        const accessToken=jwt.sign(
            {id:user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:"15m"}
        );

        const refreshToken=jwt.sign(
            {id:user._id},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:"7d"}
        )

        user.refreshToken=refreshToken;
        await user.save();

        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:false,
            sameSite:"lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const userResponse=user.toObject();
        delete userResponse.password;
        delete userResponse.refreshToken;

        return res.status(200).json({message:"Login Successful",accessToken,user:userResponse})
    }
    catch(error){
        console.error("Login error",error);
        return res.status(500).json({message:"Internal server error"})
    }
};

export const refreshAccessToken=async(req,res)=>{
    try{
        const refreshToken=req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(401).json({message:"No refresh token"});
        }

        const decoded=jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user=await User.findOne({
            _id:decoded.id,
            refreshToken
        });

        if(!user){
            return res.status(403).json({message:"Forbidden"})
        }

        const newAccessToken=jwt.sign(
            {id:user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:"15m"}
        );

        const newRefreshToken=jwt.sign(
            {id:user._id},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:"7d"}
        );

        user.refreshToken=newRefreshToken;
        await user.save();

        res.cookie("refreshToken",newRefreshToken,{
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        });

        return res.status(200).json({accessToken:newAccessToken});
    }

    catch(error){
        res.clearCookie("refreshToken");
        return res.status(403).json({message:"Invalid refresh token"});
    }
};

export const logout=async(req,res)=>{
    try{
        const refreshToken=req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(204).send();
        }

        const user=await User.findOne({refreshToken});

        if(user){
            user.refreshToken=null;
            await user.save();
        }

        res.clearCookie("refreshToken",{
            httpOnly:true,
            sameSite:"strict",
            secure:false
        });

        return res.status(200).json({message:"Logged Out Successfully"});
    }
    catch(error){
        return res.status(500).json({message:"Logout Failed"})
    }
}

export const getMe=async(req,res)=>{
    try{
        const user=await User.findById(req.userId).select("-password -refreshToken");

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        return res.status(200).json({ user });
    }catch(error){
        return res.status(500).json({message:"Server error"});
    }
}
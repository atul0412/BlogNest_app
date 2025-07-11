import {User} from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Authentication 

export const isAuthenticated = async(req , res, next) =>{
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "You must be logged in" });
        }
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if(!user){
            return res.status(401).json({ error: "User not found" });
        }
        req.user = user;
        next()
}catch(error){
    console.log("error accuring in Authentication:"+ error)
    return res.status(401).json({message : "user not authenticated "})
}
};

// Authorization 

export const  isAdmin = (...roles) =>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({error : `User with given role ${req.user.role} not allowed`}); 
       }
       next()
    }
}

import jwt from 'jsonwebtoken'; // ✅ correct

import {User} from "../models/user.model.js"

const createTokenSaveCookies = async(userId, res) =>{
    const  token  = jwt.sign({userId}, process.env.JWT_SECRET_KEY,{
       expireIn: "7d"
    })
    res.cookie("token", token,{
        httpOnly : true,
        secure: true,
        sameSite: "strict",
    });
    await User.findByIdAndUpdate(userId, {token});
    return token;
}


export default createTokenSaveCookies;
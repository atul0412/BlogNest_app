import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";

const createTokenSaveCookies = async (userId, res) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } // ✅ Corrected key
    );

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });

    await User.findByIdAndUpdate(userId, { token });
    return token;
};

export default createTokenSaveCookies;

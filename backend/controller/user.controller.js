import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from 'bcrypt';
import createTokenSaveCookies from "../auth/authtoken.js"
import jwt from 'jsonwebtoken'; // ✅ correct




export const register = async (req, res) => {
    if (!req.files || !req.files.photo) {
        return res.status(400).json({ message: "User photo is required" });
    }

    const { photo } = req.files;
    const allowedFormats = ["image/jpg", "image/jpeg", "image/png"];

    if (!allowedFormats.includes(photo.mimetype)) {
        return res.status(400).json({ message: "Invalid photo format. Only jpg and png are allowed." });
    }

    const { email, name, password, education, role, phone } = req.body;

    if (!email || !name || !password || !education || !role || !phone) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath);
        
        if (!cloudinaryResponse || cloudinaryResponse.error) {
            console.log(cloudinaryResponse.error);
            return res.status(500).json({ message: "Photo upload failed" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            name,
            password: hashedPassword,
            education,
            role,
            phone,
            photo: {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.url,
            }
        });

        await newUser.save();
        if (newUser){
            const token = createTokenSaveCookies(newUser._id, res)
        }
        res.status(201).json({ message: "User registered successfully", newUser, token: token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

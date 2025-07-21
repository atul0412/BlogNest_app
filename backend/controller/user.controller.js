import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// user register

export const register = async (req, res) => {
  try {
    if (!req.files || !req.files.photo) {
      return res.status(400).json({ message: "User photo is required" });
    }

    const { photo } = req.files;
    const allowedFormats = ["image/jpg", "image/jpeg", "image/png"];

    if (!allowedFormats.includes(photo.mimetype)) {
      return res
        .status(400)
        .json({
          message: "Invalid photo format. Only jpg and png are allowed.",
        });
    }

    const { email, name, password, education, role, phone } = req.body;

    if (!email || !name || !password || !education || !role || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      photo.tempFilePath
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
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
      },
    });

   

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7h" }
    );
     await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      newUser,
      token,
    });
  } catch (error) {
    console.log("Register error:", error); // helpful for debugging
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// user login
export const login = async (req, res) => {
  const { email, password} = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user.password) {
      return res.status(400).json({ message: "User Pasword is missing" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7h" }
    );
    return res.status(200).json({
      massage: "User logedin successfuly",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server error", error: error.message });
  }
};

// user logout
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};
//user profile

export const getMyprofile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server error", error: error.message });
  }
};

// get admins
export const getAdmins = async (req, res) => {
  try {
    const user = await User.find({ role: "admin" }).select("-password");
    return res.status(200).json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server error", error: error.message });
  }
};

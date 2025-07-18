import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Authentication Middleware
export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "You must be logged in" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Authentication Error:", error);
    return res.status(401).json({ message: "User not authenticated" });
  }
};

// Authorization Middleware
export const isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: `User with role '${req.user?.role}' not allowed` });
    }
    next();
  };
};

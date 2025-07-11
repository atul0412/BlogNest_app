import express from 'express';
import { createBlog, deleteBlog, getAllBlogs, getMyBlog, getSingleBlog, updateBlog } from '../controller/blog.controller.js';
import { isAdmin, isAuthenticated } from '../middleware/auth.user.js';

const router = express.Router()

router.post("/create", isAuthenticated, isAdmin("admin"), createBlog);
router.delete("/delete/:id", isAuthenticated, isAdmin("admin"), deleteBlog);
router.get("/all-blogs", isAuthenticated, getAllBlogs);
router.get("/single-blog/:id",isAuthenticated,getSingleBlog);
router.get("/my-blog", isAuthenticated, isAdmin("admin"),getMyBlog);
router.put("/update-blog/:id", isAuthenticated, isAdmin("admin"), updateBlog);

export default router;
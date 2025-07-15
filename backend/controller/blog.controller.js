import mongoose from "mongoose";
import { Blog } from "../models/blog.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createBlog = async (req, res) => {
  try {
    // Validate file
    if (!req.files || !req.files.blogImage) {
      return res.status(400).json({ message: "Blog image is required" });
    }

    const blogImage = req.files.blogImage;
    const allowedFormats = ["image/jpg", "image/jpeg", "image/png"];
    if (!allowedFormats.includes(blogImage.mimetype)) {
      return res.status(400).json({ message: "Invalid image format. Only jpg and png are allowed." });
    }

    // Validate fields
    const { title, category, about } = req.body;
    if (!title || !category || !about) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Extract user info
    const adminName = req.user?.name;
    const adminPhoto = req.user?.photo?.url;
    const createdBy = req.user?._id;

    // Upload image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(blogImage.tempFilePath);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log(cloudinaryResponse.error);
      return res.status(500).json({ message: "Photo upload failed" });
    }

    // Create blog
    const blogData = {
      title,
      about,
      category,
      adminName,
      adminPhoto,
      createdBy,
      blogImage: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      }
    };

    const blog = await Blog.create(blogData);

    return res.status(201).json({
      message: "Blog created successfully",
      blog
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//delete the blog
export const deleteBlog = async(req, res) =>{
  try {
    const {id}= req.params;
    const blog = await Blog.findById(id);
    if(!blog){
      return res.status(404).json({message: "Blog not found"});
    }
    await blog.deleteOne();
    return res.status(200).json({message: "Blog deleted successfully"});
 }catch{
  return res.status(404).json({ message: "delete server error" });
 }

};

// get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const AllBlogs = await Blog.find().populate("category");
    return res.status(200).json({ AllBlogs });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
      }
};

// get single blog
export const getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({ message: "Invalid blog id" });
    }
    const blog = await Blog.findById(id).populate("category");
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
      }
      return res.status(200).json({ blog });
      } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
        }
};

// get my blog
export const getMyBlog = async(req, res)=>{
  try {
    const createdBy = req.user._id;
    const myBlog = await Blog.find({createdBy}).populate("category");
    if(!myBlog){
      return res.status(404).json({message: "Blog not found"});
      }
      return res.status(200).json({myBlog});
      } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
      }
};

//update blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({ message: "Invalid blog id" });
      }
      const updateBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
      if (!updateBlog) {
        return res.status(404).json({ message: "Blog not found" });
        }
        return res.status(200).json({ updateBlog });
        } catch (error) {
          return res.status(500).json({ message: "Server error", error: error.message });
          }
        };

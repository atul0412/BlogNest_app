import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

function UpdateBlog() {
  const navigateTo = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [about, setAbout] = useState("");

  const [blogImage, setBlogImage] = useState(""); // will hold File
  const [blogImagePreview, setBlogImagePreview] = useState(""); // for preview
  const [existingImageUrl, setExistingImageUrl] = useState(""); // image from DB
  const [loading, setLoading] = useState(false); // loader state

  const token = localStorage.getItem("jwt");

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setBlogImagePreview(reader.result);
      setBlogImage(file);
    };
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/blogs/single-blog/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const blog = data.blog || data;
        setTitle(blog?.title || "");
        setCategory(blog?.category || "");
        setAbout(blog?.about || "");
        setExistingImageUrl(blog?.blogImage?.url || "");
      } catch (error) {
        console.log("Fetch error:", error);
        toast.error("Failed to load blog data");
      }
    };

    fetchBlog();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("about", about);

    if (blogImage) {
      formData.append("blogImage", blogImage);
    }

    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/blogs/update-blog/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(data.message || "Blog updated successfully");
      navigateTo("/dashboard");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Update failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-12 p-4">
      <section className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-6">UPDATE BLOG</h3>

        {loading && (
          <div className="text-center mb-4 text-blue-600 font-medium">
            Updating blog...
          </div>
        )}

        <form>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Category</label>
            <select
              className="w-full p-2 border rounded-md"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
            >
              <option value="">Select Category</option>
              <option value="Devotion">Devotion</option>
              <option value="Sports">Sports</option>
              <option value="Coding">Coding</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="BLOG MAIN TITLE"
            className="w-full p-2 mb-4 border rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />

          <div className="mb-4">
            <label className="block mb-2 font-semibold">BLOG IMAGE</label>
            <img
              src={
                blogImagePreview
                  ? blogImagePreview
                  : existingImageUrl
                  ? existingImageUrl
                  : "/imgPL.webp"
              }
              alt="Blog Main"
              className="w-full h-48 object-cover mb-4 rounded-md"
            />
            <input
              type="file"
              className="w-full p-2 border rounded-md"
              onChange={changePhotoHandler}
              disabled={loading}
            />
          </div>

          <textarea
            rows="6"
            className="w-full p-2 mb-4 border rounded-md"
            placeholder="Something about your blog at least 200 characters!"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            disabled={loading}
          />

          <button
            className={`w-full p-3 text-white rounded-md ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "UPDATE"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default UpdateBlog;

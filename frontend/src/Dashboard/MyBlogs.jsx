import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function MyBlogs() {
  const [myBlogs, setMyBlogs] = useState([]);
  const token = localStorage.getItem("jwt");
  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const { data } = await axios.get(
          "`${`${import.meta.env.BASE_URL}}/api/blogs/my-blog",
         {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
        );
        console.log("Fetched blogs:", data);
        setMyBlogs(data.myBlog);
      } catch (error) {
        console.log("Error fetching blogs:", error);
        toast.error("Failed to fetch blogs");
      }
    };

    fetchMyBlogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        ``${`${import.meta.env.BASE_URL}}/api/blogs/delete/${id}`,
       {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
      );
      toast.success(res.data.message || "Blog deleted successfully");
      setMyBlogs((prev) => prev.filter((blog) => blog._id !== id));
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete blog"
      );
    }
  };

  return (
    <div>
      <div className="container mx-auto my-12 p-4">
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 md:ml-20">
          {myBlogs && myBlogs.length > 0 ? (
            myBlogs.map((element) => (
              <div
                className="bg-white shadow-lg rounded-lg overflow-hidden"
                key={element._id}
              >
                <Link to={`/blog/${element._id}`}>
                  {element?.blogImage?.url && (
                    <img
                      src={element.blogImage.url}
                      alt="blogImg"
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <span className="text-sm text-gray-600">
                      {element.category}
                    </span>
                    <h4 className="text-xl font-semibold my-2">
                      {element.title}
                    </h4>
                  </div>
                </Link>

                <div className="flex justify-between px-4 pb-4">
                  <Link
                    to={`/blog/update/${element._id}`}
                    className="text-blue-500 bg-white rounded-md shadow-lg px-3 py-1 border border-gray-400 hover:underline"
                  >
                    UPDATE
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(element._id);
                    }}
                    className="text-red-500 bg-white rounded-md shadow-lg px-3 py-1 border border-gray-400 hover:underline"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              You have not posted any blog to see!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyBlogs;

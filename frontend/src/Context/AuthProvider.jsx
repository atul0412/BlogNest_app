import axios from "axios";
import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext"; // 👈 import context from split file

export const AuthProvider = ({ children }) => {
  const [blogs, setBlogs] = useState();
  const [profile, setProfile] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("jwt"));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (token) {
          const { data } = await axios.get(
            "http://localhost:5000/api/users/my-profile",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setProfile(data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchBlogs = async () => {
      try {
        if (token) {
          const { data } = await axios.get(
            "http://localhost:5000/api/blogs/all-blogs",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setBlogs(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
    fetchBlogs();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        blogs,
        profile,
        setProfile,
        isAuthenticated,
        setIsAuthenticated,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

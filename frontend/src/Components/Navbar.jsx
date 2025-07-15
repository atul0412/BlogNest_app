import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";

function Navbar() {
  const [show, setShow] = useState(false);
  const { profile, isAuthenticated, setIsAuthenticated } = useAuth();
  const navigateTo = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/users/logout",
        { withCredentials: true }
      );
      localStorage.removeItem("jwt");
      toast.success(data.message);
      setIsAuthenticated(false);
      navigateTo("/login");
    } catch (error) {
      console.log(error);
      toast.error("Failed to logout");
    }
  };

  console.log("ytrgfhgfhg",profile)

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-lg px-4 py-2">
        <div className="flex items-center justify-between container mx-auto">
          <div className="font-semibold text-xl">
            Blog<span className="text-blue-500">Nest</span>
          </div>

          {/* Desktop Menu */}
          <div className="mx-6">
            <ul className="hidden md:flex space-x-6">
              <Link to="/" className="hover:text-blue-500">HOME</Link>
              <Link to="/blogs" className="hover:text-blue-500">BLOGS</Link>
              <Link to="/creators" className="hover:text-blue-500">CREATORS</Link>
              <Link to="/about" className="hover:text-blue-500">ABOUT</Link>
              <Link to="/contact" className="hover:text-blue-500">CONTACT</Link>
            </ul>

            {/* Mobile Toggle */}
            <div className="md:hidden" onClick={() => setShow(!show)}>
              {show ? <IoCloseSharp size={24} /> : <AiOutlineMenu size={24} />}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex space-x-2">
            {isAuthenticated && profile?.role == "admin" && (
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white font-semibold hover:bg-blue-800 duration-300 px-4 py-2 rounded"
              >
                DASHBOARD
              </Link>
            )}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="bg-red-600 text-white font-semibold hover:bg-red-800 duration-300 px-4 py-2 rounded"
              >
                LOGIN
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white font-semibold hover:bg-red-800 duration-300 px-4 py-2 rounded"
              >
                LOGOUT
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {show && (
          <div className="bg-white">
            <ul className="flex flex-col h-screen items-center justify-center space-y-3 md:hidden text-xl">
              <Link to="/" onClick={() => setShow(false)} className="hover:text-blue-500">HOME</Link>
              <Link to="/blogs" onClick={() => setShow(false)} className="hover:text-blue-500">BLOGS</Link>
              <Link to="/creators" onClick={() => setShow(false)} className="hover:text-blue-500">CREATORS</Link>
              <Link to="/about" onClick={() => setShow(false)} className="hover:text-blue-500">ABOUT</Link>
              <Link to="/contact" onClick={() => setShow(false)} className="hover:text-blue-500">CONTACT</Link>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;

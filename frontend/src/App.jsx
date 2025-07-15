import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "../src/Components/navbar";
import Footer from "../src/Components/footer";
import Home from "../src/Components/home";
import About from "../src/Pages/About";
import Contact from "../src/Pages/Contact";
import Login from "../src/Pages/Login";
import Register from "../src/Pages/Register";
import Dashboard from "../src/Pages/Dashboard";
import Creators from "./pages/Creators";
import { useAuth } from "./context/AuthProvider";
import { Toaster } from "react-hot-toast";

function App() {
  const location = useLocation();
  const hideNavbarFooter = ["/dashboard", "/login", "/register"].includes(location.pathname);

  const { Blogs } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbarFooter && <Navbar />}
      
      {/* Main content should grow to fill space */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/creators" element={<Creators />} />
        </Routes>
        <Toaster />
      </main>

      {!hideNavbarFooter && <Footer />}
    </div>
  );
}

export default App;

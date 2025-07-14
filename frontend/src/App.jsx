import React from "react";
import {Routes , Route, useLocation } from "react-router-dom";
import Navbar  from "../src/Components/navbar";
import Footer from "../src/Components/footer";
import Home from "../src/Components/home";
import About from "../src/Pages/About";
import Contact from "../src/Pages/Contact";
import Login from "../src/Pages/Login";  
import Register from "../src/Pages/Register";
import Dashboard from "../src/Pages/Dashboard";
import { useAuth } from "./context/AuthProvider";
import { Toaster } from "react-hot-toast";


function App() {
  const location = useLocation()
  const hideNavbarFooter = ["/dashboard", "/login", "/register",].includes(location.pathname);

  const {Blogs} =  useAuth()
  console.log(Blogs?.length);

 return (
    <div>
      {!hideNavbarFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/Login" element= {<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Toaster />
      {!hideNavbarFooter && <Footer />}
    </div>
  )
}

export default App

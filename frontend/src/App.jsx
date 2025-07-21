import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "../src/Components/navbar";
import Footer from "../src/Components/footer";
import Home from "../src/Components/Home";
import About from "../src/pages/About";
import Contact from "../src/pages/Contact";
import Login from "../src/Pages/Login";
import Register from "../src/Pages/Register";
import Dashboard from "../src/pages/Dashboard";
import Creators from "./pages/Creators";
import { Toaster } from "react-hot-toast";
import UpdateBlog from "./Dashboard/UpdateBlog";
import Blogs from "./pages/Blogs";
import Detail from "./pages/Detail";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./utils/ProtectRoutes";
function App() {
  const location = useLocation();
  const hideNavbarFooter = ["/dashboard", "/login", "/register"].includes(location.pathname);


  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbarFooter && <Navbar />}

      {/* Main content should grow to fill space */}
      <main className="flex-grow">
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/blog/update/:id" element={< UpdateBlog />} />
          <Route path="/blog/:id" element={<Detail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </main>

      {!hideNavbarFooter && <Footer />}
    </div>
  );
}

export default App;

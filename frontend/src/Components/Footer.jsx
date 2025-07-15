import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { BsYoutube } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="bg-slate-200 py-5">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-xl font-semibold hidden md:flex">
          Blog<span className="text-blue-500 font-bold">Nest</span>
        </div>
        <div className="text-gray-400 text-sm hidden md:flex">
          <p>&copy; 2025 ATUL PANDEY All rights reserved</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-4">
          <a href="#"><FaGithub className="h-6" /></a>
          <a href="#"><BsYoutube className="h-6" /></a>
          <a href="#"><FaLinkedin className="h-6" /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

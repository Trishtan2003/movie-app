
import React from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaHome } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 flex justify-around items-center">
      <Link to="/" className="flex flex-col items-center">
        <FaHome size={24} />
        <span>Home</span>
      </Link>
      <Link to="/search" className="flex flex-col items-center">
        <FaSearch size={24} />
        <span>Search</span>
      </Link>
    </div>
  );
};

export default Navbar;

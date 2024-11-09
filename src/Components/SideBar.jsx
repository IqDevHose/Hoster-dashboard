import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication data (e.g., token)
    localStorage.removeItem("authToken");

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      {/* Logo Section */}
      <div className="p-4 flex items-center justify-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col flex-grow mt-4">
        <Link
          to="/users"
          className="flex items-center px-4 py-3 hover:bg-gray-700"
        >
          <FaHome className="mr-3" />
          <span>Users</span>
        </Link>
        <Link
          to="/subscriptions"
          className="flex items-center px-4 py-3 hover:bg-gray-700"
        >
          <FaUser className="mr-3" />
          <span>Subscriptions</span>
        </Link>
        <Link
          to="/settings"
          className="flex items-center px-4 py-3 hover:bg-gray-700"
        >
          <FaCog className="mr-3" />
          <span>Settings</span>
        </Link>
      </nav>

      {/* Logout */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 hover:bg-red-700 w-full"
        >
          <FaSignOutAlt className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

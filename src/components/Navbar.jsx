import { FiBell, FiMenu, FiUser, FiLogOut, FiEdit } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* HAMBURGER */}
        <button
          className="lg:hidden p-2 rounded hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          <FiMenu size={22} />
        </button>

        <div>
          <h2 className="font-semibold text-lg">
            Hi, {user?.name || "Macha"} 👋
          </h2>
          <p className="text-xs text-gray-500 hidden sm:block">
            Financial overview
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative" ref={menuRef}>
        <button className="p-2 rounded hover:bg-gray-100">
          <FiBell />
        </button>

        {/* PROFILE */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <img
            src={user?.profileImage || "https://via.placeholder.com/40"}
            className="w-9 h-9 rounded-full border object-cover"
          />
          <div className="hidden md:block text-sm">
            <div className="font-medium">{user?.name}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
        </div>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow z-50">
            <button
              onClick={() => navigate("/profile")}
              className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-100 text-sm"
            >
              <FiUser /> Profile
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-100 text-sm"
            >
              <FiEdit /> Edit Profile
            </button>
            <button
              onClick={logout}
              className="w-full px-4 py-3 flex items-center gap-2 hover:bg-red-50 text-red-600 text-sm"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

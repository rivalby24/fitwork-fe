import React, { useEffect, useState } from "react";
import { LogOut, UserIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import { securedApi } from "@/api";

export default function NavbarUser() {
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();

  // Fetch user info when component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await securedApi.get("http://127.0.0.1:8000/api/v1/me/");
        setUsername(res.data.username);
      } catch (error) {
        console.error("Failed to fetch user info", error);
      }
    };

    fetchUser();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    navigate("/login");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Assessment", path: "/assessment" },
    { name: "AI Chat", path: "/ai-chat" },
    { name: "Compare", path: "/compare" },
  ];

  return (
    <header className="w-full h-16 bg-indigo-500 border-b border-neutral-200">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/src/assets/fwok2.svg" alt="Logo" className="h-8" />
        </Link>

        {/* Navigation */}
        <nav className="ml-8">
          <ul className="flex space-x-5">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="font-normal text-white text-base hover:text-opacity-80 transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-4 text-white">
          {/* Username and icon */}
          <div className="flex items-center space-x-2">
            <UserIcon className="h-5 w-5" />
            <span className="text-sm font-medium">{username}</span>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center text-white hover:text-opacity-80 transition-colors"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5 mr-1" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

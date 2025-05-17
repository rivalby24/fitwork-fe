import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import { UserIcon } from "lucide-react";
import { securedApi } from "@/api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState<string>("");

  const isLoggedIn = Boolean(localStorage.getItem(ACCESS_TOKEN));

  useEffect(() => {
    if (isLoggedIn) {
      const fetchUser = async () => {
        try {
          const res = await securedApi.get("http://127.0.0.1:8000/api/v1/me/");
          setUsername(res.data.username);
        } catch (error) {
          console.error("Failed to fetch user info", error);
          setUsername("");
        }
      };

      fetchUser();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    navigate("/login");
  };

  const handleAnchorClick = (hash: string) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: hash } });
    } else {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Features", href: "#feature" },
    { name: "How it Works", href: "#how" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-[65px] bg-indigo-500 border-b border-neutral-200">
      <div className="h-16 mx-auto px-4 lg:px-48">
        <div className="flex items-center justify-between h-full">
          {/* Logo - left */}
          <Link to="/">
            <div className="flex items-center">
              <img className="h-8" alt="Logo" src="src/assets/fwok2.svg" />
            </div>
          </Link>

          {/* Navigation - center */}
          <NavigationMenu className="flex-1 flex justify-center">
            <NavigationMenuList className="flex space-x-8">
              {navLinks.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuLink asChild>
                    {item.href.startsWith("#") ? (
                      <button
                        onClick={() => handleAnchorClick(item.href)}
                        className="font-normal text-white text-base hover:text-white hover:bg-indigo-600 px-2 py-1 rounded"
                      >
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        to={item.href}
                        className="font-normal text-white text-base hover:text-white hover:bg-indigo-600 px-2 py-1 rounded"
                      >
                        {item.name}
                      </Link>
                    )}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side - auth */}
          <div className="flex items-center space-x-3 text-white">
            {isLoggedIn ? (
              <>
                <Link
                  to="/u/dashboard"
                  className="flex items-center space-x-2 cursor-pointer hover:opacity-80"
                  aria-label="Dashboard"
                >
                  <UserIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">{username}</span>
                </Link>

                <Button
                  variant="ghost"
                  className="text-white hover:text-white hover:bg-indigo-600"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="h-10 text-white hover:text-white hover:bg-indigo-600"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="secondary"
                    className="h-10 bg-gray-200 text-black hover:bg-gray-300"
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

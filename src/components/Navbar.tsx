import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { securedApi } from "@/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import { LogOut, UserIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState<string>("");
  const [isCompanyAdmin, setIsCompanyAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isLoggedIn = Boolean(localStorage.getItem(ACCESS_TOKEN));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await securedApi.get("http://127.0.0.1:8000/api/v1/me/");
        setUsername(res.data.username);
        setIsCompanyAdmin(res.data.is_company_admin);
      } catch (error) {
        console.error("Failed to fetch user info", error);
        setUsername("");
        setIsCompanyAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchUser();
    } else {
      setIsCompanyAdmin(false);
      setIsLoading(false);
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

  const dashboardLink = isCompanyAdmin ? "/c/dashboard" : "/u/dashboard";

  // Konsisten styling untuk nav link/button
  const navLinkClass =
    "font-normal text-white text-base px-2 py-1 rounded hover:bg-indigo-600";

  const PublicNavbar = () => {
    const navLinks = [
      { name: "About", href: "/about" },
      { name: "Features", href: "#feature" },
      { name: "How it Works", href: "#how" },
      { name: "FAQ", href: "#faq" },
    ];

    return (
      <header className="sticky top-0 z-50 w-full h-[65px] bg-indigo-500 border-b border-neutral-200">
        <div className="h-full mx-auto px-4 lg:px-48 flex items-center justify-between">
          <button
            onClick={() => {
              if (location.pathname !== "/") navigate("/");
              else window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center"
          >
            <img className="h-8" alt="Logo" src="/src/assets/fwok2.svg" />
          </button>

          <NavigationMenu className="flex-1 flex justify-center">
            <NavigationMenuList className="flex space-x-8">
              {navLinks.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuLink asChild>
                    {item.href.startsWith("#") ? (
                      <button
                        onClick={() => handleAnchorClick(item.href)}
                        className={navLinkClass}
                      >
                        {item.name}
                      </button>
                    ) : (
                      <Link to={item.href} className={navLinkClass}>
                        {item.name}
                      </Link>
                    )}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {isLoggedIn ? (
            <div className="flex items-center space-x-4 text-white">
              <Link
                to={dashboardLink}
                className="flex items-center space-x-2 hover:opacity-80"
              >
                <UserIcon className="w-5 h-5" />
                <span className="text-sm font-medium">{username}</span>
              </Link>
              <button onClick={handleLogout} className="hover:opacity-80">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3 text-white">
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
            </div>
          )}
        </div>
      </header>
    );
  };

  const CompanyNavbar = () => {
    const navItems = [
      { label: "Home", href: "/" },
      { label: "Assessment", href: "#" },
      { label: "EVP", href: "#" },
      { label: "Reports", href: "#" },
    ];

    return (
      <header className="sticky top-0 z-50 w-full h-[65px] bg-indigo-500 border-b border-neutral-200">
        <div className="container mx-auto h-full px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img className="h-8" alt="Logo" src="/src/assets/fwok2.svg" />
          </Link>

          <NavigationMenu className="flex-1 ml-12">
            <NavigationMenuList className="flex space-x-6">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuLink
                    href={item.href}
                    className={navLinkClass}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center space-x-4 text-white">
            <Link
              to={dashboardLink}
              className="flex items-center space-x-2 hover:opacity-80"
            >
              <UserIcon className="w-5 h-5" />
              <span className="text-sm font-medium">{username}</span>
            </Link>
            <button onClick={handleLogout} className="hover:opacity-80">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
    );
  };

  const UserNavbar = () => {
    const navItems = [
      { name: "Home", path: "/" },
      { name: "Assessment", path: "/assessment" },
      { name: "AI Chat", path: "/ai-chat" },
      { name: "Compare", path: "/compare" },
    ];

    return (
      <header className="sticky top-0 z-50 w-full h-[65px] bg-indigo-500 border-b border-neutral-200">
        <div className="container mx-auto h-full px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/src/assets/fwok2.svg" alt="Logo" className="h-8" />
          </Link>

          <nav className="ml-8">
            <ul className="flex space-x-5">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={navLinkClass.replace("rounded", "") + " hover:text-opacity-80"}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center space-x-4 text-white">
            <Link
              to={dashboardLink}
              className="flex items-center space-x-2 hover:opacity-80"
            >
              <UserIcon className="h-5 w-5" />
              <span className="text-sm font-medium">{username}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center hover:text-opacity-80"
            >
              <LogOut className="h-5 w-5 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>
    );
  };

if (isLoading) return null;

const publicPaths = ["/", "/about", "/faq", "/features", "/how"];
const isPublicPath = publicPaths.some((path) =>
  location.pathname === path || location.pathname.startsWith(path + "/")
);

// Kalau belum login atau status belum diketahui, anggap public
if (!isLoggedIn || isCompanyAdmin === null) {
  return <PublicNavbar />;
}

// Kalau company admin dan berada di halaman public seperti '/', render PublicNavbar
if (isCompanyAdmin) {
  if (isPublicPath) {
    return <PublicNavbar />;
  } else {
    return <CompanyNavbar />;
  }
}

// User biasa
if (isPublicPath) {
  return <PublicNavbar />;
}

return <UserNavbar />;


}

export default Navbar;

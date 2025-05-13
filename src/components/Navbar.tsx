import React from 'react'
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
function Navbar() {
    const navLinks = [
        { name: "About", href: "#" },
        { name: "Features", href: "#" },
        { name: "How it Works", href: "#" },
        { name: "FAQ", href: "#faq" },
      ];
  return (
    <header className="w-full bg-[#6366F1] text-white">
          <div className="container mx-auto flex items-center justify-between py-3 px-4">
            <div className="text-xl font-bold">FitWork</div>
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm hover:text-blue-200"
                >
                  {link.name}
                </a>
              ))}
            </nav>
            <div className="flex items-center space-x-2">
                <Link to="login">
              <Button variant="link" className="text-white">
                Login
              </Button>
              </Link>
              <Link to="/register">
              <Button
                variant="outline"
                className="bg-white text-blue-900 hover:bg-blue-50"
              >
                Sign Up
              </Button>
              </Link>
            </div>
          </div>
        </header>
  )
}

export default Navbar
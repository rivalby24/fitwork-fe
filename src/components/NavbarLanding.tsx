import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";

const LandingNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navLinkClass =
    "font-normal text-white text-base px-2 py-1 rounded hover:bg-indigo-600 cursor-pointer";

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
    <header className="sticky top-0 z-50 w-full h-[65px] bg-indigo-500 border-b border-indigo-500">
      <div className="h-full mx-auto px-4 lg:px-10 flex items-center justify-between">
        <button
          onClick={() => {
            if (location.pathname !== "/") navigate("/");
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center cursor-pointer"
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

        <div className="flex items-center space-x-3 text-white">
          <Link to="/login">
            <Button
              variant="ghost"
              className="h-10 text-white hover:text-white hover:bg-indigo-600 cursor-pointer"
            >
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button
              variant="secondary"
              className="h-10 bg-gray-200 text-black hover:bg-gray-300 cursor-pointer"
            >
              Register
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, UserIcon } from "lucide-react";
import { useUserStore } from "@/stores/useUserStore";

const NavbarDashboard = () => {
  const {
    username,
    isCompanyAdmin,
    isFetched,
    fetchUser,
    logout,
  } = useUserStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isFetched) fetchUser();
  }, [isFetched, fetchUser]);

  const dashboardLink = isCompanyAdmin ? "/app/c/dashboard" : "/app/u/dashboard";
  const navLinkClass = "font-normal text-white text-base px-2 py-1 hover:opacity-80";

  if (!isFetched) return null;

  const navItems = isCompanyAdmin
    ? [
        { label: "Home", href: "/app/c/dashboard" },
        { label: "Assessment", href: "/app/c/dashboard" },
        { label: "EVP", href: "/app/c/dashboard" },
        { label: "Reports", href: "/app/c/dashboard" },
      ]
    : [
        { name: "Home", path: "/app/u/dashboard" },
        { name: "Assessment", path: "/app/u/assessment" },
        { name: "AI Chat", path: "/app/u/ai-chat" },
        { name: "Compare", path: "/app/u/compare" },
      ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full h-[65px] bg-indigo-500 border-b border-indigo-200">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <div className="flex gap-8 items-center">
          <Link to={dashboardLink} className="flex items-center">
            <img className="h-8" alt="Logo" src="/src/assets/fwok2.svg" />
          </Link>

          <nav className="ml-8">
            <ul className="flex space-x-6">
              {navItems.map((item) => (
                <li key={"label" in item ? item.label : item.name}>
                  <Link
                    to={"href" in item ? item.href : item.path}
                    className={navLinkClass}
                  >
                    {"label" in item ? item.label : item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center space-x-4 text-white">
          <Link to={dashboardLink} className="flex items-center space-x-2">
            <UserIcon className="w-5 h-5" />
            <span className="text-sm font-medium">{username}</span>
          </Link>
          <button onClick={handleLogout}>
            <LogOut className="h-5 w-5 cursor-pointer" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavbarDashboard;

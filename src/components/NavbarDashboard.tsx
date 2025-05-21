import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { securedApi } from "@/lib/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/constants";
import { LogOut, UserIcon } from "lucide-react";

const NavbarDashboard = () => {
  const [username, setUsername] = useState("");
  const [isCompanyAdmin, setIsCompanyAdmin] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const dashboardLink = isCompanyAdmin ? "/app/c/dashboard" : "/app/u/dashboard";
  const navLinkClass = "font-normal text-white text-base px-2 py-1 hover:opacity-80";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await securedApi.get("/api/v1/me/");
        setUsername(res.data.username);
        setIsCompanyAdmin(res.data.is_company_admin);
      } catch {
        setIsCompanyAdmin(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    navigate("/login");
  };

  if (isCompanyAdmin === null) return null;

  type NavItem =
  | { label: string; href: string }  // untuk company admin
  | { name: string; path: string };  // untuk user biasa

  const navItems: NavItem[] = isCompanyAdmin
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

  return (
    <header className="sticky top-0 z-50 w-full h-[65px] bg-indigo-500 border-b border-indigo-200">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <div className="flex gap-8 items-center">
          <Link to="/app/u/dashboard" className="flex items-center">
            <img className="h-8" alt="Logo" src="/src/assets/fwok2.svg" />
          </Link>

          <nav className="ml-8">
            <ul className="flex space-x-6">
              {navItems.map((item: NavItem) => (
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
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavbarDashboard;

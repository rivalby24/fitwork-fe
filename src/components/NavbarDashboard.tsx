import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, UserIcon, Loader2 } from "lucide-react"; // Tambahkan Loader2 atau ikon loader lain
import { useUserStore } from "@/stores/useUserStore";
import { useAuthStore } from "@/stores/useAuthStore"; // Impor useAuthStore untuk logout

const NavbarDashboard = () => {
  const {
    username,
    isCompanyAdmin,
    fetchStatus,
    fetchUser,
    clearUser, 
  } = useUserStore();

  const { logout: authLogout } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (fetchStatus === 'idle' || fetchStatus === 'error') {
      console.log('NavbarDashboard: Attempting to fetch user data, status:', fetchStatus);
      fetchUser();
    }
  }, [fetchStatus, fetchUser]); // fetchStatus sebagai dependensi utama

  // Menampilkan loader jika sedang fetching, atau null/pesan jika error/idle dan belum ada data
  if (fetchStatus === 'pending') {
    return (
      <header className="sticky top-0 z-50 w-full h-[65px] bg-indigo-500 border-b border-indigo-200">
        <div className="container mx-auto h-full px-4 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </div>
      </header>
    );
  }

  if (fetchStatus !== 'success') {
     return null; // Atau tampilkan UI minimal/pesan error jika fetchStatus === 'error'
  }

  const dashboardLink = isCompanyAdmin ? "/app/c/dashboard" : "/app/u/dashboard";
  const navLinkClass = "font-normal text-white text-base px-2 py-1 hover:opacity-80";

  const navItems = isCompanyAdmin
    ? [
        { label: "Home", href: "/app/c/dashboard" },
        { label: "Assessment", href: "/app/c/assessment" }, // Perbaiki jika perlu
        { label: "EVP", href: "/app/c/evp" }, // Perbaiki jika perlu
      ]
    : [
        { name: "Home", path: "/app/u/dashboard" },
        { name: "Assessment", path: "/app/u/assessment" },
        { name: "AI Chat", path: "/app/u/ai-chat" },
        { name: "Compare", path: "/app/u/compare" },
      ];

  const handleLogout = () => {
    authLogout(); 
    clearUser(); 
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full h-[65px] bg-indigo-500 border-b border-indigo-200">
      {/* ... sisa JSX Anda ... */}
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
          <button onClick={handleLogout} aria-label="Logout">
            <LogOut className="h-5 w-5 cursor-pointer" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavbarDashboard;
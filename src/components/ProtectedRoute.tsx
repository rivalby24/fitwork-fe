import React, { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { Loader } from "lucide-react";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: ReactNode;
  requireCompanyAdmin?: boolean;
  requireCandidate?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireCompanyAdmin = false,
  requireCandidate = false,
}) => {
  const { isAuthorized, userRole, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="h-6 w-6 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-700">Memeriksa akses...</span>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 🔁 Kembalikan user ke dashboard sesuai perannya
  const getDashboardPath = () => {
    if (userRole === "candidate") return "/app/u/dashboard";
    if (userRole === "company_admin") return "/app/c/dashboard";
    return "/";
  };

  if (requireCandidate && userRole !== "candidate") {
    toast.error("Akses ditolak: Halaman ini hanya untuk kandidat.");
    return <Navigate to={getDashboardPath()} replace />;
  }

  if (requireCompanyAdmin && userRole !== "company_admin") {
    toast.error("Akses ditolak: Halaman ini hanya untuk admin perusahaan.");
    return <Navigate to={getDashboardPath()} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

// src/components/ProtectedRoute.tsx
import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom"; // useOutletContext jika perlu
import { useAuthStore } from "../stores/useAuthStore"; // Masih butuh userRole
import { toast } from "sonner";
import { getDashboardPath } from "@/lib/utils";

interface ProtectedRouteProps {
  children: ReactNode;
  requireCompanyAdmin?: boolean;
  requireCandidate?: boolean;
  requireFitworkAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireCompanyAdmin = false,
  requireCandidate = false,
  requireFitworkAdmin = false
}) => {
  const { userRole, isAuthorized } = useAuthStore();
  const location = useLocation();

  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requireCandidate && userRole !== "candidate") {
    toast.error("Akses ditolak: Halaman ini hanya untuk kandidat.");
    return <Navigate to={getDashboardPath(userRole)} replace />;
  }

  if (requireCompanyAdmin && userRole !== "company_admin") {
    toast.error("Akses ditolak: Halaman ini hanya untuk admin perusahaan.");
    return <Navigate to={getDashboardPath(userRole)} replace />;
  }

  if (requireFitworkAdmin && userRole !== "fitwork_admin") {
    toast.error("Akses ditolak: Halaman ini hanya untuk admin.");
    return <Navigate to={getDashboardPath(userRole)} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
import React, { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { securedApi } from "../api"; // pastikan path benar
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

interface ProtectedRouteProps {
  children: ReactNode;
  requireCompanyAdmin?: boolean;
  requireCandidate?: boolean;
}

interface CustomJwtPayload {
  exp: number;
  is_company_admin?: boolean;
  is_candidate?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireCompanyAdmin = false,
  requireCandidate = false,
}) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) {
          setIsAuthorized(false);
          return;
        }

        try {
          const res = await securedApi.post("/api/v1/refresh/", {
            refresh: refreshToken,
          });

          if (res.status === 200) {
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } catch {
          setIsAuthorized(false);
        }
      } else {
        // Cegah kandidat akses dashboard admin
        if (requireCompanyAdmin && !decoded.is_company_admin) {
          setRedirectPath("/u/dashboard");
          setIsAuthorized(false);
          return;
        }

        // Cegah admin akses dashboard kandidat
        if (requireCandidate && !decoded.is_candidate) {
          setRedirectPath("/c/dashboard");
          setIsAuthorized(false);
          return;
        }

        setIsAuthorized(true);
      }
    } catch (e) {
      console.error("Failed to decode token", e);
      setIsAuthorized(false);
    }
  };

  auth();
}, [requireCompanyAdmin, requireCandidate]);


  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return isAuthorized ? <>{children}</> : <Navigate to="/login" replace />;

};

export default ProtectedRoute;

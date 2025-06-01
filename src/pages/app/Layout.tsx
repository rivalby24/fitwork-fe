import FooterDashboard from "@/components/FooterDashboard";
import Loading from "@/components/Loading";
import NavbarDashboard from "@/components/NavbarDashboard";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const MIN_LOADER_MS = 4000;

function Layout() {
  const { isAuthorized, userRole, checkAuth, authStatus } = useAuthStore();
  const { fetchUser, fetchStatus: userFetchStatus } = useUserStore();

  const location = useLocation();
  const [forceShowLoaderUntil, setForceShowLoaderUntil] = useState<number>(0);
  const [isActualLoading, setIsActualLoading] = useState<boolean | null>(true);

  // Logging status saat ini untuk debugging
  useEffect(() => {
    console.log(
      "AuthStatus:",
      authStatus,
      " | Authorized:",
      isAuthorized,
      " | UserFetch:",
      userFetchStatus
    );
  }, [authStatus, isAuthorized, userFetchStatus]);

  // Inisialisasi Auth
  useEffect(() => {
    if (authStatus === "idle" || authStatus === "error") {
      checkAuth();
    }
  }, [checkAuth, authStatus]);

  // Fetch user setelah auth sukses
  useEffect(() => {
    if (authStatus === "success" && isAuthorized) {
      if (userFetchStatus === "idle" || userFetchStatus === "error") {
        fetchUser();
      }
    }
  }, [authStatus, isAuthorized, fetchUser, userFetchStatus]);

  // Update status loading
  useEffect(() => {
    const currentlyLoadingAuth =
      authStatus === "pending" || isAuthorized === null;
    const currentlyLoadingUser =
      authStatus === "success" && isAuthorized && userFetchStatus === "pending";

    const loadingNow = currentlyLoadingAuth || currentlyLoadingUser;

    if (loadingNow) {
      const minEndTime = Date.now() + MIN_LOADER_MS;
      setForceShowLoaderUntil((prev) => Math.max(prev, minEndTime));
    }

    setIsActualLoading(loadingNow);
  }, [authStatus, isAuthorized, userFetchStatus]);

  // Timer agar loader tidak muncul < 2 detik
  useEffect(() => {
    if (!isActualLoading && Date.now() > forceShowLoaderUntil) return;

    const timeout = setTimeout(() => {
      setForceShowLoaderUntil(0);
    }, forceShowLoaderUntil - Date.now());

    return () => clearTimeout(timeout);
  }, [isActualLoading, forceShowLoaderUntil]);

  const showGlobalLoader = isActualLoading || Date.now() < forceShowLoaderUntil;

  if (showGlobalLoader) {
    let loaderMessage = "Memverifikasi sesi Anda...";
    if (
      authStatus === "success" &&
      isAuthorized &&
      userFetchStatus === "pending"
    ) {
      loaderMessage = "...";
    }
    return <Loading logoSize="w-72 h-72" logoSrc="/src/assets/Loading.gif" message={loaderMessage} />;
  }

  if (authStatus !== "pending" && !isAuthorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAuthorized) {
    return (
      <div className="w-full bg-neutral-50 min-h-screen flex flex-col">
        <NavbarDashboard />
        <Outlet context={{ userRole }} />
        <FooterDashboard />
      </div>
    );
  }

  return null;
}

export default Layout;

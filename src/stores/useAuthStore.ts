// stores/useAuthStore.ts
import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { securedApi } from "../lib/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../lib/constants";

interface CustomJwtPayload {
  exp: number;
  is_company_admin?: boolean;
  is_candidate?: boolean;
}

interface AuthState {
  isAuthorized: boolean | null;
  userRole: "candidate" | "company_admin" | null;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthorized: null,
  userRole: null,

  checkAuth: async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      set({ isAuthorized: false, userRole: null });
      return;
    }

    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) {
          set({ isAuthorized: false, userRole: null });
          return;
        }

        try {
          const res = await securedApi.post("/api/v1/refresh/", {
            refresh: refreshToken,
          });

          if (res.status === 200) {
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            const newDecoded = jwtDecode<CustomJwtPayload>(res.data.access);
            set({
              isAuthorized: true,
              userRole: getRole(newDecoded),
            });
          } else {
            set({ isAuthorized: false, userRole: null });
          }
        } catch {
          set({ isAuthorized: false, userRole: null });
        }
      } else {
        set({ isAuthorized: true, userRole: getRole(decoded) });
      }
    } catch {
      set({ isAuthorized: false, userRole: null });
    }
  },
}));

const getRole = (decoded: CustomJwtPayload): AuthState["userRole"] => {
  if (decoded.is_company_admin) return "company_admin";
  if (decoded.is_candidate) return "candidate";
  return null;
};

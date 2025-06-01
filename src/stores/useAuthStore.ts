// stores/useAuthStore.ts
import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { securedApi } from "../lib/api"; // Pastikan ini adalah instance Axios Anda yang terkonfigurasi
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../lib/constants";

interface CustomJwtPayload {
  exp: number;
  is_company_admin?: boolean;
  is_candidate?: boolean;
}

interface AuthState {
  isAuthorized: boolean | null;
  userRole: "candidate" | "company_admin" | null;
  authStatus: 'idle' | 'pending' | 'success' | 'error'; // Status untuk melacak proses checkAuth
  checkAuth: () => Promise<void>;
  logout: () => void; // Fungsi logout untuk membersihkan state
}

const getRole = (decoded: CustomJwtPayload | null): AuthState["userRole"] => {
  if (!decoded) return null;
  if (decoded.is_company_admin) return "company_admin";
  if (decoded.is_candidate) return "candidate";
  return null;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthorized: null,
  userRole: null,
  authStatus: 'idle', // Status awal

  checkAuth: async () => {
    if (get().authStatus === 'pending') {
      console.log('Auth check already in progress.');
      return;
    }

    set({ authStatus: 'pending', isAuthorized: null }); // Mulai pengecekan, reset isAuthorized agar loader muncul

    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      set({ isAuthorized: false, userRole: null, authStatus: 'error' });
      return;
    }

    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) { // Token kedaluwarsa
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) {
          set({ isAuthorized: false, userRole: null, authStatus: 'error' });
          localStorage.removeItem(ACCESS_TOKEN); // Bersihkan token yang kedaluwarsa
          return;
        }

        try {
          const res = await securedApi.post("/api/v1/refresh/", {
            refresh: refreshToken,
          });

          if (res.status === 200 && res.data.access) {
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            const newDecoded = jwtDecode<CustomJwtPayload>(res.data.access);
            set({
              isAuthorized: true,
              userRole: getRole(newDecoded),
              authStatus: 'success',
            });
          } else {
            set({ isAuthorized: false, userRole: null, authStatus: 'error' });
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN); // Refresh token mungkin tidak valid
          }
        } catch (refreshError) {
          set({ isAuthorized: false, userRole: null, authStatus: 'error' });
          localStorage.removeItem(ACCESS_TOKEN);
          localStorage.removeItem(REFRESH_TOKEN);
          console.error('Token refresh caught an error:', refreshError);
        }
      } else { // Token masih valid
        set({
          isAuthorized: true,
          userRole: getRole(decoded),
          authStatus: 'success',
        });
      }
    } catch (decodeError) { // Error saat decode token (misalnya token tidak valid)
      set({ isAuthorized: false, userRole: null, authStatus: 'error' });
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      console.error('Error decoding token:', decodeError);
    }
  },

  logout: () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    // Reset state ke kondisi awal atau status logged-out
    set({ isAuthorized: false, userRole: null, authStatus: 'idle' });
  },
}));
import { create } from "zustand";
import { securedApi } from "@/lib/api";

type UserState = {
  username: string;
  isCompanyAdmin: boolean | null;
  isFetched: boolean;
  loading: boolean;
  error: boolean;
  fetchUser: () => Promise<void>;
  logout: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  username: "",
  isCompanyAdmin: null,
  isFetched: false,
  loading: true,
  error: true,
  fetchUser: async () => {
    const token = localStorage.getItem("access");
    if (!token) return;

    try {
      const res = await securedApi.get("/api/v1/me/");
      set({
        username: res.data.username,
        isCompanyAdmin: res.data.is_company_admin,
        isFetched: true,
        loading: false,
        error: false
      });
    } catch {
      set({ isCompanyAdmin: false, isFetched: true, loading: false, error: false });
    }
  },

  logout: () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    set({ username: "", isCompanyAdmin: null, isFetched: false });
  },
}));

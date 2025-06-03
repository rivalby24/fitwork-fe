import { create } from "zustand";
import { securedApi } from "@/lib/api";

type UserState = {
  username: string;
  isCompanyAdmin: boolean | null;
  companyId: string | null;
  fetchStatus: 'idle' | 'pending' | 'success' | 'error'; 
  error: string | null; 
  fetchUser: () => Promise<void>;
  clearUser: () => void; 
};

export const useUserStore = create<UserState>((set, get) => ({
  username: "",
  companyId: null,
  isCompanyAdmin: null,
  fetchStatus: 'idle', // Status awal: belum ada aksi
  error: null, // Error awal null

  fetchUser: async () => {
    // 1. Cegah eksekusi ganda jika sedang loading atau sudah sukses
    const currentStatus = get().fetchStatus;
    if (currentStatus === 'pending' || currentStatus === 'success') {
      console.log(`User fetch skipped, status is: ${currentStatus}`);
      return;
    }

    // Cek token. Sebaiknya gunakan konstanta dari file constants.ts Anda
    const token = localStorage.getItem("access"); 
    if (!token) {
      set({
        fetchStatus: 'error', // Atau 'idle', tergantung bagaimana Anda ingin menanganinya
        error: 'No access token found. Cannot fetch user.',
      });
      console.log('No token in useUserStore, cannot fetch user.');
      return;
    }

    set({ fetchStatus: 'pending', error: null }); // Mulai proses fetching

    try {
      const res = await securedApi.get("/api/v1/me/");
      set({
        username: res.data.username,
        companyId: res.data.company_id,
        isCompanyAdmin: res.data.is_company_admin,
        fetchStatus: 'success',
        error: null,
      });
    } catch (err) { // Tangkap error spesifik jika perlu (mis. AxiosError)
      console.error('Error fetching user data:', err);
      set({
        fetchStatus: 'error',
        error: 'Failed to fetch user data.',
      });
    }
  },

  clearUser: () => {
    set({
      username: "",
      isCompanyAdmin: null,
      companyId: null,
      fetchStatus: 'idle',
      error: null,
    });
    console.log('User store has been cleared.');
  },
}));
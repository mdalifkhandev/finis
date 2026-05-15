import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthSession, AuthUser } from "@/types/api/auth";

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  isHydrated: boolean;
  setSession: (session: AuthSession) => void;
  setUser: (user: AuthUser | null) => void;
  clearSession: () => void;
  setHydrated: (hydrated: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isHydrated: false,
      setSession: ({ accessToken, user }) => set({ accessToken, user }),
      setUser: (user) => set({ user }),
      clearSession: () => set({ accessToken: null, user: null }),
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: "finis-auth",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

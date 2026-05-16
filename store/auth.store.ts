import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthSession, User } from "@/types/auth.types";

const TOKEN_KEY = "token";

type AuthState = {
  user: User | null;
  token: string | null;
  accessToken: string | null;
  isHydrated: boolean;
  setAuth: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  setSession: (session: AuthSession) => void;
  setUser: (user: User | null) => void;
  clearSession: () => void;
  setHydrated: (hydrated: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      accessToken: null,
      isHydrated: false,
      setAuth: async (user, token) => {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        set({ user, token, accessToken: token });
      },
      logout: async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        set({ user: null, token: null, accessToken: null });
      },
      setSession: ({ accessToken, user }) => {
        void SecureStore.setItemAsync(TOKEN_KEY, accessToken);
        set({ user, token: accessToken, accessToken });
      },
      setUser: (user) => set({ user }),
      clearSession: () => {
        void SecureStore.deleteItemAsync(TOKEN_KEY);
        set({ user: null, token: null, accessToken: null });
      },
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: "finis-auth",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

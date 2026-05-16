import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
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
  initializeAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
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
  initializeAuth: async () => {
    const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);

    if (!storedToken) {
      set({ user: null, token: null, accessToken: null, isHydrated: true });
      return;
    }

    const current = get();

    set({
      token: storedToken,
      accessToken: storedToken,
      user: current.user,
      isHydrated: true,
    });
  },
}));

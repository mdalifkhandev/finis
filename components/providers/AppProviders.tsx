import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";
import { useAuthMeQuery } from "@/hooks/auth/useAuthMeQuery";
import { queryClient } from "@/lib/query-client";
import { useAuthStore } from "@/store/auth.store";

type AppProvidersProps = {
  children: ReactNode;
};

function AuthBootstrap() {
  useAuthMeQuery();

  return null;
}

export default function AppProviders({ children }: AppProvidersProps) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    void initializeAuth();
  }, [initializeAuth]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap />
        {children}
        <Toaster />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

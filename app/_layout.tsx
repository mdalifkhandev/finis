import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import messaging from "@react-native-firebase/messaging";
import AppProviders from "@/components/providers/AppProviders";
import RoleTabBar from "@/components/navigation/RoleTabBar";
import { useAuthStore } from "@/store/auth.store";
import "@/lib/worker-location-task";
import "../global.css";



export default function RootLayout() {
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore(
    (state) => state.user?.role as "admin" | "manager" | "worker" | null | undefined,
  );
  const showRoleTabBar =
    !!token &&
    pathname.startsWith("/screens/") &&
    !pathname.startsWith("/screens/auth");

  return (
    <AppProviders>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
      {showRoleTabBar ? <RoleTabBar role={role} /> : null}
    </AppProviders>
  );
}

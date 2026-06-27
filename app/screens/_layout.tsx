import React from "react";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useAuthStore } from "@/store/auth.store";
import RoleTabBar from "@/components/navigation/RoleTabBar";

export default function ScreensLayout() {
  const role = useAuthStore(
    (state) => state.user?.role as "admin" | "manager" | "worker" | null | undefined,
  );
  const token = useAuthStore((state) => state.token);

  return (
    <View className="flex-1 ">
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>

      {token ? <RoleTabBar role={role} /> : null}
    </View>
  );
}

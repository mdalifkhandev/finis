import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type RoleOption = {
  id: "admin" | "worker" | "manager";
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

const roles: RoleOption[] = [
  {
    id: "admin",
    title: "Admin",
    subtitle:
      "Full company access, payroll, company, inventory and project controls.",
    icon: "shield-checkmark-outline",
    route: "/(tab)/home",
  },
  {
    id: "worker",
    title: "Worker",
    subtitle:
      "Task-focused workflow with worker profile, chat and assigned task views.",
    icon: "construct-outline",
    route: "/worker/home",
  },
  {
    id: "manager",
    title: "Manager",
    subtitle:
      "Project, task, inventory, chat and quotes workflow for field management.",
    icon: "briefcase-outline",
    route: "/manager/home",
  },
];

export default function RoleSelectScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <View className="flex-1 px-5 pt-12">
        <Text className="text-[34px] font-semibold text-[#1F2328]">
          Select Role
        </Text>

        <View className="mt-5 rounded-[18px] border border-[#D9C58B] bg-[#FFF9E8] p-4">
          <Text className="text-[13px] font-semibold uppercase tracking-[0.8px] text-[#8A6A16]">
            Important Notice
          </Text>
          <Text className="mt-2 text-[14px] leading-6 text-[#5F4B12]">
            This role selection screen is for development only. Once development
            is complete and the backend role flow is connected, the app will
            automatically open the correct role-based screen.
          </Text>
        </View>

        <View className="mt-8 gap-4">
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              activeOpacity={0.88}
              onPress={() => router.replace(role.route as never)}
              className="rounded-[18px] border border-[#D6DCE3] bg-white p-4"
            >
              <View className="flex-row items-center">
                <View className="h-14 w-14 items-center justify-center rounded-[16px] bg-[#E3EDF6]">
                  <Ionicons name={role.icon} size={26} color="#1F5577" />
                </View>

                <View className="ml-4 flex-1 pr-3">
                  <Text className="text-[18px] font-semibold text-[#1F2328]">
                    {role.title}
                  </Text>
                  <Text className="mt-1 text-[14px] leading-6 text-[#66707B]">
                    {role.subtitle}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={22} color="#7C8594" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

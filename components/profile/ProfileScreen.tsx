import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileAvatar from "./ProfileAvatar";
import ProfileHeaderBar from "./ProfileHeaderBar";

const avatarUrl =
  "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=200&auto=format&fit=crop";

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ProfileHeaderBar title="" onBack={() => router.back()} />

      <View className="mt-1 items-center px-4">
        <ProfileAvatar uri={avatarUrl} size={76} />
        <Text className="mt-2 text-[16px] font-medium text-[#2B2B2B]">Rokey Mahmud</Text>
        <Text className="mt-0.5 text-[13px] text-[#49505A]">Admin</Text>
      </View>

      <View className="mt-4 px-4">
        <View className="rounded-[10px] border border-[#E0E4E9] bg-white px-3 py-3">
          <Text className="mb-2 text-[12px] text-[#2B2B2B]">Account Information</Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push("/screens/profile/personalinfo")}
            className="flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <Ionicons name="person-outline" size={14} color="#2B2B2B" />
              <Text className="ml-2 text-[12px] text-[#2B2B2B]">Personal info</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#2B2B2B" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          className="mt-2 flex-row items-center justify-between rounded-[10px] border border-[#E0E4E9] bg-white px-3 py-3"
        >
          <Text className="text-[12px] text-[#2B2B2B]">Log Out</Text>
          <Ionicons name="log-out-outline" size={14} color="#2B2B2B" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

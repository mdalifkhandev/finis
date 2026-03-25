import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileAvatar from "./ProfileAvatar";
import ProfileHeaderBar from "./ProfileHeaderBar";
import { useProfileAvatar } from "./profileStore";

export default function ProfileScreen() {
  const avatarUri = useProfileAvatar();

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ProfileHeaderBar title="" onBack={() => router.back()} />

      <View className="mt-2 items-center px-4">
        <View className="w-full rounded-[12px] border border-[#E0E4E9] bg-white px-4 pb-5 pt-3">
          <View className="items-center">
            <ProfileAvatar uri={avatarUri} size={76} />
            <Text className="mt-3 text-[16px] font-medium text-[#2B2B2B]">
              Rokey Mahmud
            </Text>
            <Text className="mt-1 text-[14px] text-[#49505A]">Admin</Text>
          </View>

          <View className="mt-5">
            <Text className="mb-2.5 text-[14px] text-[#2B2B2B]">
              Account Information
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/screens/profile/personalinfo")}
              className="flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <Ionicons name="person-outline" size={14} color="#2B2B2B" />
                <Text className="ml-2 text-[14px] text-[#2B2B2B]">
                  Personal info
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color="#2B2B2B" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          className="mt-2 w-full flex-row items-center justify-between rounded-[10px] border border-[#E0E4E9] bg-white px-3 py-3"
        >
          <Text className="text-[14px] text-[#2B2B2B]">Log Out</Text>
          <Ionicons name="log-out-outline" size={14} color="#2B2B2B" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

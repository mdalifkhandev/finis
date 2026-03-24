import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileAvatar from "./ProfileAvatar";
import ProfileHeaderBar from "./ProfileHeaderBar";

const avatarUrl =
  "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=200&auto=format&fit=crop";

export default function PersonalInfoScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ProfileHeaderBar
        title="Personal info"
        onBack={() => router.back()}
        rightIconName="create-outline"
        onPressRight={() => router.push("/screens/profile/edit")}
      />

      <View className="mt-3 items-center">
        <ProfileAvatar uri={avatarUrl} size={74} showCamera />
        <Text className="mt-2 text-[16px] font-medium text-[#2B2B2B]">
          Rokey
        </Text>
      </View>

      <View className="mt-3 px-4">
        <View className="rounded-[10px] border border-[#E0E4E9] bg-white px-3 py-3">
          <Text className="text-[14px] font-semibold text-[#2B2B2B]">
            Personal Information
          </Text>

          <View className="mt-2">
            <Text className="text-[10px] text-[#98A2B3]">Full Name</Text>
            <Text className="text-[13px] text-[#2B2B2B]">Rokey Mahmud</Text>
          </View>

          <Text className="mt-3 text-[14px] font-semibold text-[#2B2B2B]">
            Contact Information
          </Text>

          <View className="mt-2 flex-row">
            <Ionicons name="mail-outline" size={14} color="#98A2B3" />
            <View className="ml-2">
              <Text className="text-[10px] text-[#98A2B3]">Email</Text>
              <Text className="text-[13px] text-[#2B2B2B]">
                alice@example.com
              </Text>
            </View>
          </View>

          <View className="mt-2 flex-row">
            <Ionicons name="call-outline" size={14} color="#98A2B3" />
            <View className="ml-2">
              <Text className="text-[10px] text-[#98A2B3]">Phone</Text>
              <Text className="text-[13px] text-[#2B2B2B]">
                +1 (555) 123-4567
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/screens/profile/changepassword")}
          className="mt-2 flex-row items-center justify-between rounded-[10px] border border-[#E0E4E9] bg-white px-3 py-3"
        >
          <Text className="text-[12px] text-[#2B2B2B]">Change Password</Text>
          <Ionicons name="chevron-forward" size={14} color="#2B2B2B" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

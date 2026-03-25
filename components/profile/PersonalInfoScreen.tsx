import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileAvatar from "./ProfileAvatar";
import ProfileHeaderBar from "./ProfileHeaderBar";
import { pickProfileAvatar, useProfileAvatar } from "./profileStore";

export default function PersonalInfoScreen() {
  const avatarUri = useProfileAvatar();

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ProfileHeaderBar
        title="Personal info"
        onBack={() => router.back()}
        rightIconName="create-outline"
        onPressRight={() => router.push("/screens/profile/edit")}
      />

      <View className="mt-5 items-center px-4">
        <ProfileAvatar
          uri={avatarUri}
          size={74}
          showCamera
          onPressCamera={pickProfileAvatar}
        />
        <Text className="mt-2 text-[16px] font-medium text-[#2B2B2B]">
          Rokey
        </Text>
      </View>

      <View className="mt-4 px-4">
        <View className="rounded-[10px] border border-[#E0E4E9] bg-white px-3 py-3">
          <Text className="text-[14px] font-semibold text-[#2B2B2B]">
            Personal Information
          </Text>

          <View className="mt-2.5">
            <Text className="text-[12px] text-[#98A2B3]">Full Name</Text>
            <Text className="mt-0.5 text-[14px] text-[#2B2B2B]">Rokey Mahmud</Text>
          </View>

          <Text className="mt-4 text-[14px] font-semibold text-[#2B2B2B]">
            Contact Information
          </Text>

          <View className="mt-2.5 flex-row">
            <Ionicons name="mail-outline" size={14} color="#98A2B3" />
            <View className="ml-2">
              <Text className="text-[12px] text-[#98A2B3]">Email</Text>
              <Text className="mt-0.5 text-[14px] text-[#2B2B2B]">
                alice@example.com
              </Text>
            </View>
          </View>

          <View className="mt-3 flex-row">
            <Ionicons name="call-outline" size={14} color="#98A2B3" />
            <View className="ml-2">
              <Text className="text-[12px] text-[#98A2B3]">Phone</Text>
              <Text className="mt-0.5 text-[14px] text-[#2B2B2B]">
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
          <Text className="text-[14px] text-[#2B2B2B]">Change Password</Text>
          <Ionicons name="chevron-forward" size={14} color="#2B2B2B" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

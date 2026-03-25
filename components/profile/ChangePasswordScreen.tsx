import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileField from "./ProfileField";
import ProfileHeaderBar from "./ProfileHeaderBar";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ProfileHeaderBar
          title="Change Password"
          onBack={() => router.back()}
        />

        <View className="flex-1 px-4 pt-4">
          <ProfileField
            label="Current Password"
            placeholder="Enter old password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />

          <ProfileField
            label="New Password"
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />

          <ProfileField
            label="Confirm Password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <View className="flex-1" />

          <TouchableOpacity
            activeOpacity={0.88}
            className="mb-4 h-[42px] items-center justify-center rounded-[10px] bg-[#1F5577]"
          >
            <Text className="text-[14px] font-semibold text-white">
              Update password
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

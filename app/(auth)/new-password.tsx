import { Ionicons } from "@expo/vector-icons";
import { isAxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { useResetPassword } from "@/hooks/auth/auth";

export default function NewPasswordRoute() {
  const router = useRouter();
  const { resetToken } = useLocalSearchParams<{ resetToken?: string }>();
  const { resetPassword, isPending } = useResetPassword();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = async () => {
    if (!resetToken || typeof resetToken !== "string") {
      toast.error("Reset token missing. Please try again.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error("Enter and confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({
        resetToken,
        newPassword,
      });

      toast.success("Password updated");
      router.replace("/(auth)/login");
    } catch (error) {
      const message = isAxiosError(error)
        ? (error.response?.data?.message as string | undefined)
        : undefined;

      toast.error(
        message ||
          (error instanceof Error ? error.message : "Password reset failed"),
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <View className="h-16 flex-row items-center border-b border-[#DBE0E5] px-5">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#1E2329" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="mr-6 text-[18px] font-semibold text-[#1F2328]">
            Back to Login
          </Text>
        </View>
      </View>

      <View className="px-5 pt-28">
        <Text className="text-[42px] font-semibold text-[#1F2328]">
          Set a new password
        </Text>
        <Text className="mt-2 text-[16px] leading-6 text-[#545A61]">
          Please set a new password for your account to continue
        </Text>

        <View className="mt-8 h-14 flex-row items-center rounded-xl border border-[#B8BEC5] bg-[#F2F3F5] px-3">
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder="New Password"
            placeholderTextColor="#A0A6AE"
            className="flex-1 text-[16px] text-[#1F2328]"
          />
          <Ionicons name="eye-off-outline" size={20} color="#B7BDC4" />
        </View>

        <View className="mt-3 h-14 flex-row items-center rounded-xl border border-[#B8BEC5] bg-[#F2F3F5] px-3">
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Confirm Password"
            placeholderTextColor="#A0A6AE"
            className="flex-1 text-[16px] text-[#1F2328]"
          />
          <Ionicons name="eye-off-outline" size={20} color="#B7BDC4" />
        </View>

        <TouchableOpacity
          className="mt-6 h-12 items-center justify-center rounded-xl bg-[#1F5577]"
          onPress={handleUpdatePassword}
          disabled={isPending}
        >
          <Text className="text-[18px] font-semibold text-white">
            {isPending ? "Updating..." : "Update Password"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

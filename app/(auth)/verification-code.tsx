import { Ionicons } from "@expo/vector-icons";
import { isAxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { useVerifyOtp, useForgotPassword } from "@/hooks/auth/auth";

export default function VerificationCodeRoute() {
  const router = useRouter();
  const { email, forgotToken: initialForgotToken } = useLocalSearchParams<{
    email?: string;
    forgotToken?: string;
  }>();
  const [forgotToken, setForgotToken] = useState<string | undefined>(initialForgotToken);
  const { verifyOtp, isPending } = useVerifyOtp();
  const { sendCode, isPending: isResending } = useForgotPassword();
  const [otp, setOtp] = useState("");
  const maskedEmail =
    typeof email === "string" && email.includes("@")
      ? `${email.slice(0, 1)}***@${email.split("@")[1]}`
      : "your email";

  const handleResend = async () => {
    if (!email || typeof email !== "string") {
      toast.error("Email is missing.");
      return;
    }

    try {
      const response = await sendCode({ email });
      if (response && response.forgotToken) {
        setForgotToken(response.forgotToken);
      }
      toast.success("Verification code resent successfully.");
    } catch (error) {
      const message = isAxiosError(error)
        ? (error.response?.data?.message as string | undefined)
        : undefined;

      toast.error(
        message ||
          (error instanceof Error ? error.message : "Failed to resend code"),
      );
    }
  };

  const handleVerify = async () => {
    if (!forgotToken || typeof forgotToken !== "string") {
      toast.error("Reset token missing. Please try again.");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Enter 6 digit OTP.");
      return;
    }

    try {
      const result = await verifyOtp({
        forgotToken,
        otp,
      });

      toast.success("OTP verified");
      router.push({
        pathname: "/(auth)/new-password",
        params: { resetToken: result.resetToken },
      });
    } catch (error) {
      const message = isAxiosError(error)
        ? (error.response?.data?.message as string | undefined)
        : undefined;

      toast.error(
        message ||
          (error instanceof Error ? error.message : "OTP verification failed"),
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

      <View className="px-5 pt-14">
        <View className="mx-auto h-16 w-16 items-center justify-center rounded-full bg-[#1F5577]">
          <Ionicons name="shield-checkmark-outline" size={30} color="white" />
        </View>

        <Text className="mt-6 text-center text-[38px] font-semibold text-[#1F2328]">
          Enter Verification Code
        </Text>
        <Text className="mt-2 text-center text-[16px] text-[#535960]">
          We’ve sent a 6-digit code to {maskedEmail}
        </Text>

        <View className="mt-8 flex-row items-center justify-between">
          {[...Array(6)].map((_, index) => (
            <View
              key={`code-${index}`}
              className="h-11 w-11 items-center justify-center rounded-xl border border-[#8F969E] bg-transparent"
            >
              <Text className="text-[18px] text-[#1F2328]">
                {otp[index] ?? ""}
              </Text>
            </View>
          ))}
        </View>

        <TextInput
          value={otp}
          onChangeText={(value) => setOtp(value.replace(/\D/g, "").slice(0, 6))}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
          className="absolute h-0 w-0 opacity-0"
        />

        <Text className="mt-5 text-center text-[16px] font-semibold text-[#42484F]">
          Paste Code
        </Text>

        <TouchableOpacity
          className="mt-6 h-12 items-center justify-center rounded-xl bg-[#1F5577]"
          onPress={handleVerify}
          activeOpacity={0.86}
          disabled={isPending}
        >
          <Text className="text-[18px] font-semibold text-white">
            {isPending ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>

        <View className="mt-8 flex-row items-center justify-center">
          <Text className="text-[16px] text-[#8A9097]">
            Didn&apos;t receive the code?{" "}
          </Text>
          <TouchableOpacity onPress={handleResend} disabled={isResending}>
            <Text className={`text-[16px] font-medium ${isResending ? "text-[#8A9097]" : "text-[#3B4046]"}`}>
              {isResending ? "Resending..." : "Resend"}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text className="mt-3 text-center text-[17px] font-semibold text-[#3B4046]">
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

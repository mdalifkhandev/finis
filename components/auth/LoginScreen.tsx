import { Ionicons } from "@expo/vector-icons";
import { isAxiosError } from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { getRoleHomeRoute } from "@/features/auth/auth.routes";
import { useLoginMutation } from "@/features/auth/useLoginMutation";

export default function LoginScreen() {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier || !password) {
      toast.error("Enter your email or phone and password.");
      return;
    }

    loginMutation.mutate(
      { identifier: trimmedIdentifier, password },
      {
        onSuccess: (session) => {
          toast.success("Login successful");
          router.replace(getRoleHomeRoute(session.user.role));
        },
        onError: (error) => {
          const message = isAxiosError(error)
            ? (error.response?.data?.message as string | undefined)
            : undefined;
          toast.error(
            message ||
              (error instanceof Error ? error.message : "Unable to sign in."),
          );
        },
      },
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <View className="h-16 flex-row items-center border-b border-[#DBE0E5] px-5">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#1E2329" />
        </TouchableOpacity>
      </View>

      <View className="px-5 pt-16">
        <Text className="text-[38px] font-semibold text-[#1F2328]">
          Welcome Back
        </Text>
        <Text className="mt-1 text-[22px] text-[#4E545B]">
          Login to your account
        </Text>

        <Text className="mt-12 text-[16px] text-[#34393F]">
          Enter Your E-mail Or Number
        </Text>
        <TextInput
          value={identifier}
          onChangeText={setIdentifier}
          placeholder="E-mail address or number"
          placeholderTextColor="#90979F"
          autoCapitalize="none"
          keyboardType="email-address"
          className="mt-3 h-14 rounded-xl border border-[#C8CED5] bg-[#F3F4F6] px-4 text-[16px] text-[#1E2328]"
        />

        <Text className="mt-5 text-[16px] text-[#34393F]">Password</Text>
        <View className="mt-3 h-14 flex-row items-center rounded-xl border border-[#C8CED5] bg-[#F3F4F6] px-3">
          <Ionicons name="lock-closed-outline" size={18} color="#9BA2AA" />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="********"
            placeholderTextColor="#90979F"
            secureTextEntry
            className="ml-2 flex-1 text-[16px] text-[#1E2328]"
          />
        </View>

        <TouchableOpacity
          className="mt-6 h-12 items-center justify-center rounded-xl bg-[#1F5577]"
          onPress={handleLogin}
          activeOpacity={0.86}
          disabled={loginMutation.isPending}
        >
          <Text className="text-[18px] font-semibold text-white">
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

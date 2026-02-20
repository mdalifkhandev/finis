import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginRoute() {
  const router = useRouter();
  const [remember, setRemember] = useState(false);

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
          placeholder="E-mail address or number"
          placeholderTextColor="#90979F"
          className="mt-3 h-14 rounded-xl border border-[#C8CED5] bg-[#F3F4F6] px-4 text-[16px] text-[#1E2328]"
        />

        <Text className="mt-5 text-[16px] text-[#34393F]">Password</Text>
        <View className="mt-3 h-14 flex-row items-center rounded-xl border border-[#C8CED5] bg-[#F3F4F6] px-3">
          <Ionicons name="lock-closed-outline" size={18} color="#9BA2AA" />
          <TextInput
            placeholder="********"
            placeholderTextColor="#90979F"
            secureTextEntry
            className="ml-2 flex-1 text-[16px] text-[#1E2328]"
          />
          <Ionicons name="eye-off-outline" size={20} color="#B5BBC1" />
        </View>

        <View className="mt-3 flex-row items-center justify-between">
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => setRemember((value) => !value)}
          >
            <View className="h-4 w-4 items-center justify-center rounded-full border border-[#A8AEB5]">
              {remember ? (
                <View className="h-2 w-2 rounded-full bg-[#1F5577]" />
              ) : null}
            </View>
            <Text className="ml-2 text-[16px] text-[#6B7076]">Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            <Text className="text-[16px] text-[#FF5C5C]">Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="mt-6 h-12 items-center justify-center rounded-xl bg-[#1F5577]"
          onPress={() => router.push("/(auth)/signup")}
          activeOpacity={0.86}
        >
          <Text className="text-[18px] font-semibold text-white">Login</Text>
        </TouchableOpacity>

        <View className="mt-8 flex-row items-center">
          <View className="h-px flex-1 bg-[#BDC3CA]" />
          <Text className="mx-3 text-[15px] text-[#4E545B]">
            Or Continue With
          </Text>
          <View className="h-px flex-1 bg-[#BDC3CA]" />
        </View>

        <View className="mt-5 flex-row items-center justify-center gap-6">
          <View className="h-11 w-11 items-center justify-center rounded-full border border-[#D3D8DE] bg-white">
            <Ionicons name="logo-google" size={22} color="#1F2328" />
          </View>
          <View className="h-11 w-11 items-center justify-center rounded-full border border-[#D3D8DE] bg-white">
            <Ionicons name="logo-apple" size={22} color="#1F2328" />
          </View>
          <View className="h-11 w-11 items-center justify-center rounded-full border border-[#D3D8DE] bg-white">
            <Ionicons name="logo-facebook" size={22} color="#1877F2" />
          </View>
        </View>

        <View className="mt-6 flex-row items-center justify-center">
          <Text className="text-[17px] text-[#34393F]">
            Don’t have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
            <Text className="text-[17px] font-semibold text-[#1F2328]">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

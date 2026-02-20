import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyRoute() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#A8A8A8]">
      <View className="flex-1 justify-center px-5">
        <View className="rounded-3xl bg-[#F5F5F5] p-4">
          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-[32px] font-semibold text-[#262626]">
              Privacy & Policy
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={24} color="#141414" />
            </TouchableOpacity>
          </View>

          <Text className="text-[18px] font-medium text-[#303030]">
            Last updated on 23 August 2025
          </Text>

          <Text className="mt-4 text-[14px] leading-6 text-[#4A4A4A]">
            We collect personal information that you voluntarily provide to us
            when you register on the [app/service], express an interest in
            obtaining information about us or our products and services,
          </Text>

          <Text className="mt-4 text-[14px] leading-6 text-[#4A4A4A]">
            The personal information that we collect depends on the context of
            your interactions with us and the [app/service], the choices you
            make, and the products and features you use.
          </Text>

          <Text className="mt-5 text-[16px] font-medium text-[#1C1C1C]">
            1.Information we collect
          </Text>
          <Text className="mt-2 text-[14px] leading-6 text-[#4A4A4A]">
            The personal information that we collect depends on the context of
            your interactions with us and the [app/service], the choices you
            make, and the products and features you use.
          </Text>

          <Text className="mt-5 text-[16px] font-medium text-[#1C1C1C]">
            2.Information use collect
          </Text>
          <Text className="mt-2 text-[14px] leading-6 text-[#4A4A4A]">
            We process your personal information for these purposes in reliance
            on our legitimate business interests, in order to enter into or
            perform a contract with you,
          </Text>

          <Pressable
            className="mt-5 flex-row items-center"
            onPress={() => setAccepted((value) => !value)}
          >
            <View className="h-5 w-5 items-center justify-center rounded border border-[#19557A]">
              {accepted ? (
                <Ionicons name="checkmark" size={14} color="#19557A" />
              ) : null}
            </View>
            <Text className="ml-2 text-[14px] text-[#2C2C2C]">
              Accept{" "}
              <Text className="text-[#19557A] underline">
                terms & conditions
              </Text>
            </Text>
          </Pressable>

          <TouchableOpacity
            className={`mt-6 h-14 items-center justify-center rounded-xl border ${
              accepted
                ? "border-[#19557A] bg-white"
                : "border-[#A8B0B8] bg-[#E7EAED]"
            }`}
            onPress={() => accepted && router.push("/screens/auth/faq")}
            activeOpacity={0.85}
            disabled={!accepted}
          >
            <Text
              className={`text-[18px] font-semibold ${
                accepted ? "text-[#19557A]" : "text-[#8C96A0]"
              }`}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

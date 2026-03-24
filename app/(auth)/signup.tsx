import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupRoute() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <View className="h-16 flex-row items-center border-b border-[#DBE0E5] px-5">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#1E2329" />
        </TouchableOpacity>
      </View>

      <View className="px-5 pt-16">
        <Text className="text-[38px] font-semibold text-[#1F2328]">
          Sign Up
        </Text>
        <Text className="mt-1 text-[22px] text-[#656B72]">
          It only takes a minute to create your account
        </Text>

        <TextInput
          placeholder="E-mail address or phone number"
          placeholderTextColor="#90979F"
          className="mt-12 h-14 rounded-xl border border-[#C8CED5] bg-[#F3F4F6] px-4 text-[16px] text-[#1E2328]"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#90979F"
          secureTextEntry
          className="mt-4 h-14 rounded-xl border border-[#C8CED5] bg-[#F3F4F6] px-4 text-[16px] text-[#1E2328]"
        />

        <TextInput
          placeholder="Conform Password"
          placeholderTextColor="#90979F"
          secureTextEntry
          className="mt-4 h-14 rounded-xl border border-[#C8CED5] bg-[#F3F4F6] px-4 text-[16px] text-[#1E2328]"
        />

        <TouchableOpacity
          className="mt-4 flex-row items-center"
          onPress={() => setAccepted((value) => !value)}
        >
          <View className="h-4 w-4 items-center justify-center rounded border border-[#7C838A]">
            {accepted ? (
              <Ionicons name="checkmark" size={12} color="#1F5577" />
            ) : null}
          </View>
          <Text className="ml-2 text-[16px] text-[#4A4F56]">
            Accept terms & conditions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-6 h-12 items-center justify-center rounded-xl bg-[#1F5577]"
          activeOpacity={0.85}
          onPress={() => router.push("/screens/auth/roleselect")}
        >
          <Text className="text-[18px] font-semibold text-white">Sign Up</Text>
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
      </View>
    </SafeAreaView>
  );
}

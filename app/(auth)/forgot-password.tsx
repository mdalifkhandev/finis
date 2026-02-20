import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordRoute() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <View className="h-16 flex-row items-center border-b border-[#DBE0E5] px-5">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#1E2329" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="mr-6 text-[18px] font-semibold text-[#1F2328]">
            Forgot Password
          </Text>
        </View>
      </View>

      <View className="px-5 pt-14">
        <Text className="text-[40px] font-semibold text-[#1F2328]">
          Forgot Password?
        </Text>
        <Text className="mt-2 text-[16px] leading-7 text-[#6A6F76]">
          Don’t worry! Enter your registered email or phone number.
        </Text>

        <Text className="mt-10 text-[16px] font-semibold text-[#454A50]">
          Enter your email or phone number
        </Text>

        <View className="mt-2 h-12 flex-row items-center rounded-xl border border-[#CCD2D8] bg-[#F4F5F6] px-3">
          <Ionicons name="mail-outline" size={18} color="#7F868D" />
          <TextInput
            placeholder="Enter your email or phone"
            placeholderTextColor="#9FA5AC"
            className="ml-3 flex-1 text-[16px] text-[#1F2328]"
          />
        </View>

        <TouchableOpacity
          className="mt-6 h-12 items-center justify-center rounded-xl bg-[#1F5577]"
          onPress={() => router.push("/(auth)/verification-code")}
          activeOpacity={0.86}
        >
          <Text className="text-[18px] font-semibold text-white">
            Send Reset Code
          </Text>
        </TouchableOpacity>

        <View className="mt-10 items-center">
          <Text className="text-[16px] text-[#5E646B]">
            Remembered your password?{" "}
            <Text className="font-semibold text-[#24292F]">Login</Text>
          </Text>
          <Text className="mt-3 text-[16px] text-[#4B5158]">Need Help?</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

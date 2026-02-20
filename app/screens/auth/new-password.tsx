import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewPasswordRoute() {
  const router = useRouter();

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
        <Text className="text-[46px] font-semibold text-[#1F2328]">
          Set a new password
        </Text>
        <Text className="mt-2 text-[33px] leading-10 text-[#545A61]">
          Please set a new password for your account to continue
        </Text>

        <View className="mt-8 h-14 flex-row items-center rounded-xl border border-[#B8BEC5] bg-[#F2F3F5] px-3">
          <TextInput
            secureTextEntry
            placeholder="New Password"
            placeholderTextColor="#A0A6AE"
            className="flex-1 text-[25px] text-[#1F2328]"
          />
          <Ionicons name="eye-off-outline" size={20} color="#B7BDC4" />
        </View>

        <View className="mt-3 h-14 flex-row items-center rounded-xl border border-[#B8BEC5] bg-[#F2F3F5] px-3">
          <TextInput
            secureTextEntry
            placeholder="Confirm Password"
            placeholderTextColor="#A0A6AE"
            className="flex-1 text-[25px] text-[#1F2328]"
          />
          <Ionicons name="eye-off-outline" size={20} color="#B7BDC4" />
        </View>

        <TouchableOpacity
          className="mt-6 h-12 items-center justify-center rounded-xl bg-[#1F5577]"
          onPress={() => router.replace("/screens/auth/login")}
        >
          <Text className="text-[18px] font-semibold text-white">
            Update Password
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerificationCodeRoute() {
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

      <View className="px-5 pt-14">
        <View className="mx-auto h-16 w-16 items-center justify-center rounded-full bg-[#1F5577]">
          <Ionicons name="shield-checkmark-outline" size={30} color="white" />
        </View>

        <Text className="mt-6 text-center text-[38px] font-semibold text-[#1F2328]">
          Enter Verification Code
        </Text>
        <Text className="mt-2 text-center text-[18px] text-[#535960]">
          We’ve sent a 6-digit code to j***@gmail.com
        </Text>

        <View className="mt-8 flex-row items-center justify-between">
          {[...Array(6)].map((_, index) => (
            <TextInput
              key={`code-${index}`}
              maxLength={1}
              keyboardType="number-pad"
              className="h-11 w-11 rounded-xl border border-[#8F969E] bg-transparent text-center text-[20px] text-[#1F2328]"
            />
          ))}
        </View>

        <Text className="mt-5 text-center text-[16px] font-semibold text-[#42484F]">
          Paste Code
        </Text>

        <TouchableOpacity
          className="mt-6 h-12 items-center justify-center rounded-xl bg-[#1F5577]"
          onPress={() => router.push("/screens/auth/new-password")}
          activeOpacity={0.86}
        >
          <Text className="text-[18px] font-semibold text-white">Verify</Text>
        </TouchableOpacity>

        <Text className="mt-8 text-center text-[16px] text-[#8A9097]">
          Didn&apos;t receive the code?{" "}
          <Text className="font-medium text-[#3B4046]">Resend</Text>
        </Text>
        <TouchableOpacity onPress={() => router.replace("/screens/auth/login")}>
          <Text className="mt-3 text-center text-[17px] font-semibold text-[#3B4046]">
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

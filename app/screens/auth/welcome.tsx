import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeRoute() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <View className="h-[62%] overflow-hidden rounded-b-[120px] bg-[#1E628E]">
        <View className="absolute -left-16 top-64 h-[360px] w-[520px] rounded-full bg-[#1A5379]" />
        <View className="absolute -left-24 top-[310px] h-[420px] w-[620px] rounded-full border-[42px] border-[#E9EDF1]" />

        <Image
          source={require("../../../assets/images/react-logo.png")}
          resizeMode="contain"
          className="mx-auto mt-20 h-72 w-80"
        />
      </View>

      <View className="px-5 pt-10">
        <Text className="text-center text-[24px] font-bold text-[#2A2A2A]">
          Welcome to Finis
        </Text>
        <Text className="mt-3 text-center text-[16px] leading-6 text-[#666A70]">
          Connecting you with the best services, anytime, anywhere. Experience
          seamless support tailored just for you.
        </Text>

        <TouchableOpacity
          className="mt-8 h-14 items-center justify-center rounded-xl bg-[#1F5577]"
          activeOpacity={0.86}
          onPress={() => router.push("/screens/auth/location")}
        >
          <Text className="text-[18px] font-semibold text-white">
            Get Stated
          </Text>
        </TouchableOpacity>

        <View className="mt-5 flex-row items-center justify-center">
          <Text className="text-[16px] text-[#31353A]">
            Already haven account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text className="text-[16px] font-semibold text-[#2A2A2A]">
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeRoute() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <View>
        <View />

        <Image
          source={require("../../../assets/images/welcome.svg")}
          contentFit="contain"
          style={{ height: 532, width: 375 }}
        />
      </View>

      <View className="px-5">
        <Text className="text-center text-[24px] font-bold text-[#2A2A2A]">
          Welcome to Finis
        </Text>
        <Text className="mt-2 text-center text-[13px] text-[#666A70]">
          Connecting you with the best services, anytime, anywhere. Experience
          seamless support tailored just for you.
        </Text>

        <TouchableOpacity
          className="mt-6 h-14 items-center justify-center rounded-xl bg-[#1F5577]"
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

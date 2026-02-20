import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LocationRoute() {
  const router = useRouter();

  const handleAllowLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      router.replace("/(auth)/login");
      return;
    }

    Alert.alert("Permission Needed", "Please allow location permission.");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <View className="flex-1 items-center justify-center px-5">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-[#1F5577]">
          <Ionicons name="location-outline" size={30} color="white" />
        </View>

        <Text className="mt-6 text-[24px] font-semibold text-[#292929]">
          Allow Location Access
        </Text>
        <Text className="mt-3 text-center text-[17px] leading-6 text-[#6A6D72]">
          To help you find the best service providers near you, please share
          your location.
        </Text>

        <TouchableOpacity
          className="mt-10 h-12 w-full items-center justify-center rounded-xl bg-[#1F5577]"
          activeOpacity={0.85}
          onPress={handleAllowLocation}
        >
          <Text className="text-[16px] font-semibold text-white">
            Allow location access
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

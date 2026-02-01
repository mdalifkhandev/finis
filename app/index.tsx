import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="bg-red-500">
        Edit app/index.tsx to edit this screen.
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/(tab)/home")}
        className="mt-6 rounded-full bg-black px-6 py-3 shadow-lg"
        activeOpacity={0.85}
      >
        <Text className="text-base font-semibold text-white">Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

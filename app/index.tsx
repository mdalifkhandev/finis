import { getRoleHomeRoute } from "@/api/auth/auth.routes";
import { useAuthStore } from "@/store/auth.store";
import { Redirect } from "expo-router";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const token = useAuthStore((state) => state.token);
  const userRole = useAuthStore((state) => state.user?.role);

  if (isHydrated && token && userRole) {
    return <Redirect href={getRoleHomeRoute(userRole) as never} />;
  }

  if (isHydrated && !token) {
    return <Redirect href={"/screens/auth/spalsh-screen" as never} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-8">
        <Image
          source={require("../assets/images/splash-icon.png")}
          resizeMode="contain"
          className="h-72 w-72"
        />
      </View>
    </SafeAreaView>
  );
}

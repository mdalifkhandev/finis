import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplashScreenRoute() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/screens/auth/privacy");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView edges={['top','left',"right"]} className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-8">
        <Image
          source={require("../../../assets/images/splash-icon.png")}
          resizeMode="contain"
          className="h-72 w-72"
        />
      </View>
    </SafeAreaView>
  );
}

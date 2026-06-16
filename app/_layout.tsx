import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import messaging from "@react-native-firebase/messaging";
import AppProviders from "@/components/providers/AppProviders";
import "../global.css";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("[FCM] background message:", {
    title: remoteMessage.notification?.title,
    body: remoteMessage.notification?.body,
    data: remoteMessage.data,
  });
  console.log("[FCM] background handler triggered");
});

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </AppProviders>
  );
}

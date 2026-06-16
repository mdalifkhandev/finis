import { Platform } from "react-native";
import { useEffect, useRef } from "react";
import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { saveDeviceToken } from "@/api/notifications/notifications.api";
import { useAuthStore } from "@/store/auth.store";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useFcmTokenTest() {
  const authToken = useAuthStore((state) => state.token);
  const pendingTokenRef = useRef<string | null>(null);

  useEffect(() => {
    console.log("[FCM] hook mounted", {
      hasAuthToken: !!authToken,
      platform: Platform.OS,
    });
    let unsubscribeTokenRefresh: undefined | (() => void);
    let unsubscribeMessage: undefined | (() => void);

    if (Platform.OS === "android") {
      void Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#0F62FE",
      });
    }

    async function persistToken(token: string) {
      console.log("[FCM] persist token start", {
        hasAuthToken: !!authToken,
        platform: "android",
        tokenPreview: token.slice(0, 10),
      });
      if (!authToken) {
        pendingTokenRef.current = token;
        console.log("[FCM] auth not ready yet, token pending save");
        return;
      }

      await saveDeviceToken({
        token,
        platform: "android",
      });
      console.log("[FCM] token saved to backend");
    }

    async function initFCM() {
      try {
        console.log("[FCM] init start");
        const expoPermission = await Notifications.requestPermissionsAsync();
        console.log("[FCM] expo permission:", expoPermission.status);

        const authorizationStatus = await messaging().requestPermission();
        console.log("[FCM] permission status:", authorizationStatus);

        const token = await messaging().getToken();
        console.log("[FCM] token:", token);
        await persistToken(token);

        unsubscribeTokenRefresh = messaging().onTokenRefresh((nextToken) => {
          console.log("[FCM] token refreshed:", nextToken);
          void persistToken(nextToken).then(() => {
            if (authToken) {
              console.log("[FCM] refreshed token saved to backend");
            }
          });
        });

        unsubscribeMessage = messaging().onMessage(async (remoteMessage) => {
          const title = remoteMessage.notification?.title ?? "Notification";
          const body = remoteMessage.notification?.body ?? "";
          console.log("[FCM] foreground message:", { title, body, data: remoteMessage.data });

          await Notifications.scheduleNotificationAsync({
            content: {
              title,
              body,
              data: remoteMessage.data,
              sound: "default",
              ...(Platform.OS === "android" ? { channelId: "default" } : {}),
            },
            trigger: null,
          });
          console.log("[FCM] local notification scheduled", {
            title,
            body,
            data: remoteMessage.data,
          });
        });
      } catch (error) {
        console.log("[FCM] init error:", error);
      }
    }

    void initFCM();

    if (authToken && pendingTokenRef.current) {
      console.log("[FCM] flushing pending token to backend");
      void persistToken(pendingTokenRef.current);
      pendingTokenRef.current = null;
    }

    return () => {
      if (unsubscribeTokenRefresh) {
        unsubscribeTokenRefresh();
      }
      if (unsubscribeMessage) {
        unsubscribeMessage();
      }
    };
  }, [authToken]);
}

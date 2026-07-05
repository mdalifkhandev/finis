import { Feather, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const THEME = {
  colors: {
    background: "#FFFFFF",
    textMain: "#1A1C1E",
    textSecondary: "#475569",
    border: "#F1F5F9",
    activeToggle: "#1D4F6D",
  },
};

type PermissionKey = "location" | "notifications" | "camera";
type PermissionStatusMap = Record<PermissionKey, boolean>;

function PermissionItem({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: (val: boolean) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {label.includes("Location") ? (
          <Ionicons name="location-outline" size={24} color="#475569" />
        ) : null}
        {label.includes("Notifications") ? (
          <Ionicons name="notifications-outline" size={24} color="#475569" />
        ) : null}
        {label.includes("Camera") ? (
          <Ionicons name="camera-outline" size={24} color="#475569" />
        ) : null}
      </View>

      <Text
        style={{
          flex: 1,
          marginLeft: 16,
          fontSize: 16,
          color: "#475569",
          fontWeight: "500",
        }}
      >
        {label}
      </Text>

      <Switch
        trackColor={{ false: "#CBD5E1", true: THEME.colors.activeToggle }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#CBD5E1"
        onValueChange={onToggle}
        value={value}
      />
    </View>
  );
}

function isGranted(status?: string) {
  return status === "granted";
}

export default function PermissionsScreen() {
  const [permissions, setPermissions] = useState<PermissionStatusMap>({
    location: false,
    notifications: false,
    camera: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeKey, setActiveKey] = useState<PermissionKey | null>(null);

  const loadPermissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const [locationPermission, notificationPermission, cameraPermission] =
        await Promise.all([
          Location.getForegroundPermissionsAsync(),
          Notifications.getPermissionsAsync(),
          ImagePicker.getCameraPermissionsAsync(),
        ]);

      setPermissions({
        location: isGranted(locationPermission.status),
        notifications: isGranted(notificationPermission.status),
        camera: isGranted(cameraPermission.status),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadPermissions();
    }, [loadPermissions]),
  );

  const openDeviceSettings = () => {
    Alert.alert(
      "Open Settings",
      "To turn off a permission, please change it from your device settings.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open Settings",
          onPress: () => {
            void Linking.openSettings();
          },
        },
      ],
    );
  };

  const handleToggle = async (key: PermissionKey, nextValue: boolean) => {
    if (!nextValue) {
      openDeviceSettings();
      return;
    }

    setActiveKey(key);
    try {
      if (key === "location") {
        const permission = await Location.requestForegroundPermissionsAsync();
        setPermissions((prev) => ({
          ...prev,
          location: isGranted(permission.status),
        }));
      }

      if (key === "notifications") {
        const permission = await Notifications.requestPermissionsAsync();
        setPermissions((prev) => ({
          ...prev,
          notifications: isGranted(permission.status),
        }));
      }

      if (key === "camera") {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        setPermissions((prev) => ({
          ...prev,
          camera: isGranted(permission.status),
        }));
      }
    } finally {
      setActiveKey(null);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: THEME.colors.background }}
      edges={["top", "left", "right"]}
    >
      <StatusBar barStyle="dark-content" />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: 64,
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", left: 20 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather
            name="chevron-left"
            size={32}
            color={THEME.colors.textMain}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: THEME.colors.textMain,
          }}
        >
          Permissions
        </Text>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="small" color={THEME.colors.activeToggle} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16 }}
        >
          <PermissionItem
            label="Location Access"
            value={permissions.location}
            onToggle={(value) => {
              void handleToggle("location", value);
            }}
          />
          <PermissionItem
            label="Allow Notifications"
            value={permissions.notifications}
            onToggle={(value) => {
              void handleToggle("notifications", value);
            }}
          />
          <PermissionItem
            label="Camera Access"
            value={permissions.camera}
            onToggle={(value) => {
              void handleToggle("camera", value);
            }}
          />

          {activeKey ? (
            <View style={{ marginTop: 8, flexDirection: "row", alignItems: "center" }}>
              <ActivityIndicator size="small" color={THEME.colors.activeToggle} />
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 14,
                  color: THEME.colors.textSecondary,
                }}
              >
                Updating {activeKey} permission...
              </Text>
            </View>
          ) : null}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

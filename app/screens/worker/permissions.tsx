import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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
    white: "#FFFFFF",
    textMain: "#1A1C1E",
    textSecondary: "#475569",
    border: "#F1F5F9",
    activeToggle: "#1D4F6D", // Dark blue from design
  },
};

const PermissionItem = ({
  icon,
  label,
  value,
  onToggle,
}: {
  icon?: any;
  label: string;
  value: boolean;
  onToggle: (val: boolean) => void;
}) => (
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
      {label.includes("Location") && (
        <Ionicons name="location-outline" size={24} color="#475569" />
      )}
      {label.includes("Notifications") && (
        <Ionicons name="notifications-outline" size={24} color="#475569" />
      )}
      {label.includes("Camera") && (
        <Ionicons name="camera-outline" size={24} color="#475569" />
      )}
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
      trackColor={{ false: "#767577", true: THEME.colors.activeToggle }}
      thumbColor={value ? "#FFFFFF" : "#f4f3f4"}
      ios_backgroundColor="#3e3e3e"
      onValueChange={onToggle}
      value={value}
    />
  </View>
);

const PermissionsScreen = () => {
  const [locationAccess, setLocationAccess] = useState(true);
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [cameraAccess, setCameraAccess] = useState(true);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: THEME.colors.background }}
      edges={['top','left',"right"]}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
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
          Permission
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16 }}
      >
        <PermissionItem
          label="Location Access"
          value={locationAccess}
          onToggle={setLocationAccess}
        />
        <PermissionItem
          label="Allow Notifications"
          value={allowNotifications}
          onToggle={setAllowNotifications}
        />
        <PermissionItem
          label="Camera Access"
          value={cameraAccess}
          onToggle={setCameraAccess}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PermissionsScreen;

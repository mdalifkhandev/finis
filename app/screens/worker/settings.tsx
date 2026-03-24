import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StatusBar,
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
    red: "#FF4D4D",
  },
};

const SettingItem = ({
  label,
  onPress,
  isLogout = false,
}: {
  label: string;
  onPress?: () => void;
  isLogout?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: THEME.colors.border,
    }}
  >
    <Text
      style={{
        fontSize: 16,
        color: isLogout ? THEME.colors.red : "#475569",
        fontWeight: "500",
      }}
    >
      {label}
    </Text>
    <Feather
      name="chevron-right"
      size={20}
      color={isLogout ? "#FFCCCC" : "#94A3B8"}
    />
  </TouchableOpacity>
);

const SettingsScreen = () => {
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalVisible(false);
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: THEME.colors.background }}
      edges={["top"]}
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
          Settings
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
      >
        <SettingItem
          label="About Us"
          onPress={() => router.push("/screens/worker/about_us")}
        />
        <SettingItem
          label="FAQ"
          onPress={() => router.push("/screens/worker/faq")}
        />
        <SettingItem
          label="Support Requests"
          onPress={() => router.push("/screens/worker/support_requests")}
        />
        <SettingItem
          label="Privacy Policy"
          onPress={() => router.push("/screens/worker/privacy_policy")}
        />
        <SettingItem
          label="Terms of service"
          onPress={() => router.push("/screens/worker/terms_of_service")}
        />
        <SettingItem
          label="Logout"
          isLogout
          onPress={() => setIsLogoutModalVisible(true)}
        />
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={isLogoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLogoutModalVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
          onPress={() => setIsLogoutModalVisible(false)}
        >
          <Pressable
            style={{
              backgroundColor: "white",
              width: "100%",
              borderRadius: 24,
              padding: 24,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: "#FFEEEE",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Ionicons name="log-out" size={32} color={THEME.colors.red} />
            </View>

            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: THEME.colors.textMain,
                marginBottom: 12,
              }}
            >
              Logout Confirmation
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: THEME.colors.textSecondary,
                textAlign: "center",
                lineHeight: 20,
                marginBottom: 24,
              }}
            >
              Are you sure you want to logout? You will need to login again to
              access your account.
            </Text>

            <View style={{ flexDirection: "row", width: "100%" }}>
              <TouchableOpacity
                onPress={() => setIsLogoutModalVisible(false)}
                style={{
                  flex: 1,
                  height: 56,
                  borderRadius: 14,
                  backgroundColor: "#F1F5F9",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: THEME.colors.textSecondary,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogout}
                style={{
                  flex: 1,
                  height: 56,
                  borderRadius: 14,
                  backgroundColor: THEME.colors.red,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "600", color: "white" }}
                >
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingsScreen;

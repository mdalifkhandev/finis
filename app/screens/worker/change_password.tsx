import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
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
    textLabel: "#1A1C1E",
    inputBg: "#F8FAFC",
    inputBorder: "#F1F5F9",
    bluePrimary: "#1D4F6D", // Dark blue for the update button
  },
};

const PasswordInput = ({
  label,
  placeholder,
  value,
  onChangeText,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}) => (
  <View style={{ marginBottom: 24 }}>
    <Text
      style={{
        fontSize: 14,
        fontWeight: "600",
        color: THEME.colors.textLabel,
        marginBottom: 8,
      }}
    >
      {label}
    </Text>
    <View
      style={{
        height: 56,
        backgroundColor: THEME.colors.inputBg,
        borderRadius: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: THEME.colors.inputBorder,
        justifyContent: "center",
      }}
    >
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry
        style={{
          fontSize: 16,
          color: THEME.colors.textMain,
          fontWeight: "500",
        }}
      />
    </View>
  </View>
);

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: THEME.colors.white }}
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
          Change Password
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 40,
          }}
        >
          <PasswordInput
            label="Current Password"
            placeholder="Enter old password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />

          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <PasswordInput
            label="Conform Password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </ScrollView>

        {/* Fixed bottom button container */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          <TouchableOpacity
            style={{
              height: 56,
              backgroundColor: THEME.colors.bluePrimary,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => router.back()}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
              Update password
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

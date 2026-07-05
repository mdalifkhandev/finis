import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { toast } from "sonner-native";
import {
  ActivityIndicator,
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
import { useWorkerSupportRequestMutation } from "@/hooks/public-content/public-content";

const THEME = {
  colors: {
    background: "#FFFFFF",
    white: "#FFFFFF",
    textMain: "#1A1C1E",
    textSecondary: "#475569",
    inputBg: "#F8FAFC",
    inputBorder: "#F1F5F9",
    bluePrimary: "#1D4F6D",
  },
};

export default function SupportRequestsScreen() {
  const [complain, setComplain] = useState("");
  const [recipient, setRecipient] = useState<"admin" | "manager">("admin");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const supportMutation = useWorkerSupportRequestMutation();

  const recipientOptions = [
    { label: "Send to admin", value: "admin" as const },
    { label: "Send to manager", value: "manager" as const },
  ];

  const handleSubmit = async () => {
    if (!complain.trim()) {
      toast.error("Please write your support request");
      return;
    }

    try {
      await supportMutation.mutateAsync({
        sendTo: recipient,
        message: complain.trim(),
      });
      router.back();
    } catch {
      // handled in mutation
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
          <Feather name="chevron-left" size={32} color={THEME.colors.textMain} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: THEME.colors.textMain,
          }}
        >
          Support Requests
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
            paddingTop: 32,
            paddingBottom: 40,
          }}
        >
          <View style={{ marginBottom: 16, zIndex: 10 }}>
            <TouchableOpacity
              onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                height: 64,
                backgroundColor: "#F3F9FB",
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                borderWidth: 1,
                borderColor: "#E2E8F0",
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: "#1A1C1E",
                  fontWeight: "500",
                }}
              >
                {recipientOptions.find((opt) => opt.value === recipient)?.label}
              </Text>
              <Feather
                name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                size={24}
                color="#1A1C1E"
              />
            </TouchableOpacity>

            {isDropdownOpen ? (
              <View
                style={{
                  position: "absolute",
                  top: 68,
                  left: 0,
                  right: 0,
                  backgroundColor: "white",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 5,
                  overflow: "hidden",
                }}
              >
                {recipientOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => {
                      setRecipient(option.value);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      paddingVertical: 16,
                      paddingHorizontal: 16,
                      backgroundColor:
                        recipient === option.value ? "#F3F9FB" : "white",
                      borderBottomWidth: option.value === "manager" ? 0 : 1,
                      borderBottomColor: "#F1F5F9",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color:
                          recipient === option.value ? "#1D4F6D" : "#475569",
                        fontWeight: recipient === option.value ? "700" : "500",
                      }}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>

          <View
            style={{
              height: 200,
              backgroundColor: "#F3F9FB",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              marginBottom: 24,
            }}
          >
            <TextInput
              placeholder="Write your complain here"
              placeholderTextColor="#CBD5E1"
              multiline
              textAlignVertical="top"
              value={complain}
              onChangeText={setComplain}
              style={{
                flex: 1,
                fontSize: 16,
                color: THEME.colors.textMain,
                fontWeight: "500",
              }}
            />
          </View>

          <TouchableOpacity
            style={{
              height: 56,
              backgroundColor: THEME.colors.bluePrimary,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              opacity: supportMutation.isPending ? 0.7 : 1,
            }}
            disabled={supportMutation.isPending}
            onPress={handleSubmit}
          >
            {supportMutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
                Send
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

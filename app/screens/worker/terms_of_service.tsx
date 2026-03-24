import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
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
  },
};

const Section = ({ title, content }: { title: string; content: string }) => (
  <View style={{ marginBottom: 24 }}>
    <Text
      style={{
        fontSize: 18,
        fontWeight: "700",
        color: THEME.colors.textMain,
        marginBottom: 12,
      }}
    >
      {title}
    </Text>
    <Text
      style={{
        fontSize: 14,
        lineHeight: 22,
        color: THEME.colors.textSecondary,
        textAlign: "justify",
      }}
    >
      {content}
    </Text>
  </View>
);

const TermsOfServiceScreen = () => {
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
          Terms & Condition
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 40,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: THEME.colors.textMain,
            marginBottom: 16,
          }}
        >
          Privacy & Policy
        </Text>

        <Text
          style={{
            fontSize: 14,
            lineHeight: 22,
            color: THEME.colors.textSecondary,
            marginBottom: 24,
            textAlign: "justify",
          }}
        >
          By accessing or using this application or service, you agree to be
          bound by these Terms and Conditions. If you do not agree with any part
          of these terms, you must not use the application or service.
        </Text>

        <Section
          title="1. Use of the Service"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        />

        <Section
          title="2. User Responsibilities"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta."
        />

        <Section
          title="3. Account & Access"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis."
        />

        <Section
          title="4. Limitation of Liability"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. Integer euismod lacus luctus magna. Quisque"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsOfServiceScreen;

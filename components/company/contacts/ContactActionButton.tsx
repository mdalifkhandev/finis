import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

type ContactActionButtonProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  variant?: "default" | "primary";
  onPress?: () => void;
};

const variantStyles = {
  default: {
    container: "border border-[#D8DEE6] bg-white",
    icon: "#1F2937",
    text: "text-[#1F2937]",
  },
  primary: {
    container: "bg-[#B7D9ED]",
    icon: "#1F2937",
    text: "text-[#1F2937]",
  },
} as const;

export default function ContactActionButton({
  label,
  icon,
  variant = "default",
  onPress,
}: ContactActionButtonProps) {
  const styles = variantStyles[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className={`h-10 flex-1 flex-row items-center justify-center gap-2 rounded-[10px] ${styles.container}`}
    >
      <Ionicons name={icon} size={17} color={styles.icon} />
      <Text className={`text-[16px] font-medium leading-6 ${styles.text}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

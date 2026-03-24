import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type QuoteSectionCardProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
};

export default function QuoteSectionCard({
  title,
  icon,
  children,
}: QuoteSectionCardProps) {
  return (
    <View className="mt-5 rounded-[20px] border border-[#D7E0E8] bg-white px-5 py-5 shadow-sm">
      <View className="mb-5 flex-row items-center">
        <Ionicons name={icon} size={24} color="#255779" />
        <Text className="ml-3 text-[16px] font-semibold text-[#1F2937]">
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

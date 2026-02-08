import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type BackTitleHeaderProps = {
  title: string;
  onBack?: () => void;
};

export default function BackTitleHeader({ title, onBack }: BackTitleHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5 pt-2">
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.8}
        className="h-6 w-6 items-center justify-center"
      >
        <Ionicons name="chevron-back" size={24} color="#2B2B2B" />
      </TouchableOpacity>
      <Text className="text-[18px] font-semibold text-[#2B2B2B]">{title}</Text>
      <View className="h-6 w-6" />
    </View>
  );
}

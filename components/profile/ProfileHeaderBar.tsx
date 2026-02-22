import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type ProfileHeaderBarProps = {
  title: string;
  onBack?: () => void;
  rightIconName?: keyof typeof Ionicons.glyphMap;
  onPressRight?: () => void;
};

export default function ProfileHeaderBar({
  title,
  onBack,
  rightIconName,
  onPressRight,
}: ProfileHeaderBarProps) {
  return (
    <View className="flex-row items-center justify-between px-4 pt-2">
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.8}
        className="h-8 w-8 items-center justify-center"
      >
        <Ionicons name="chevron-back" size={20} color="#2B2B2B" />
      </TouchableOpacity>

      <Text className="text-[16px] font-medium text-[#2B2B2B]">{title}</Text>

      {rightIconName ? (
        <TouchableOpacity
          onPress={onPressRight}
          activeOpacity={0.85}
          className="h-8 w-8 items-center justify-center rounded-full bg-[#1F5577]"
        >
          <Ionicons name={rightIconName} size={16} color="#FFFFFF" />
        </TouchableOpacity>
      ) : (
        <View className="h-8 w-8" />
      )}
    </View>
  );
}

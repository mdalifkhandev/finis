import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ProfileHeaderProps = {
  title: string;
  onBack?: () => void;
};

export default function ProfileHeader({ title, onBack }: ProfileHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5 pt-2">
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.8}
        className="h-10 w-10 items-start justify-center"
      >
        <Ionicons name="chevron-back" size={34} color="#22252b" />
      </TouchableOpacity>
      <Text className="text-[22px] font-semibold text-[#262a31]">{title}</Text>
      <View className="h-10 w-10" />
    </View>
  );
}

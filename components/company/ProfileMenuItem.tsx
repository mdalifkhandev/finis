import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

type ProfileMenuItemProps = {
  label: string;
  onPress?: () => void;
};

export default function ProfileMenuItem({
  label,
  onPress,
}: ProfileMenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-row items-center justify-between px-6 py-6"
    >
      <Text className="text-base text-[#13151a]">{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#101217" />
    </TouchableOpacity>
  );
}

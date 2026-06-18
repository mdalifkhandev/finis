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
      className="flex-row items-center justify-between rounded-[14px] border border-[#EDF1F5] bg-[#F8FAFC] px-4 py-4"
    >
      <Text className="text-[16px] font-medium text-[#334155]">{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </TouchableOpacity>
  );
}

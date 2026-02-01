import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type InviteButtonProps = {
  onPress?: () => void;
};

export default function InviteButton({ onPress }: InviteButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mr-5 mt-4 flex-row items-center self-end rounded-full bg-slate-800 px-4 py-2"
      activeOpacity={0.85}
    >
      <Ionicons name="add" size={16} color="#ffffff" />
      <Text className="ml-2 text-xs font-semibold text-white">Invite</Text>
    </TouchableOpacity>
  );
}

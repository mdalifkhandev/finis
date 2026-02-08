import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type TeamMemberCardProps = {
  avatarUrl: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  onDelete?: () => void;
};

export default function TeamMemberCard({
  avatarUrl,
  name,
  role,
  email,
  phone,
  onDelete,
}: TeamMemberCardProps) {
  return (
    <View className="mt-2.5 rounded-xl border border-[#D6DBE2] bg-[#F7F9FB] px-3 py-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 flex-row">
          <Image source={{ uri: avatarUrl }} className="h-11 w-11 rounded-full" />
          <View className="ml-2.5 flex-1 pr-2">
            <Text className="text-[16px] font-medium text-[#1B2028]">{name}</Text>
            <Text className="text-[14px] text-[#687385]">{role}</Text>
            <Text className="mt-0.5 text-[13px] text-[#687385]">{email}</Text>
            <Text className="text-[13px] text-[#687385]">{phone}</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onDelete}
          className="h-7 w-7 items-center justify-center"
        >
          <Ionicons name="trash-outline" size={16} color="#FF4B4B" />
        </TouchableOpacity>
      </View>
    </View>
  );
}


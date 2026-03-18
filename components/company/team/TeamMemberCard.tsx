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
  onPress?: () => void;
  hideDelete?: boolean;
};

export default function TeamMemberCard({
  avatarUrl,
  name,
  role,
  email,
  phone,
  onDelete,
  onPress,
  hideDelete = false,
}: TeamMemberCardProps) {
  return (
    <View className="mt-2.5 rounded-[10px] border border-[#E0E4E9] bg-[#FFFFFF] px-3 py-3">
      <View className="flex-row items-start justify-between">
        <TouchableOpacity
          activeOpacity={onPress ? 0.85 : 1}
          onPress={onPress}
          className="flex-1 flex-row"
          disabled={!onPress}
        >
          <Image source={{ uri: avatarUrl }} className="h-10 w-10 rounded-full" />
          <View className="ml-2.5 flex-1 pr-2">
            <Text className="text-[16px] font-medium text-[#1B2028]">{name}</Text>
            <Text className="mt-0.5 text-[14px] text-[#687385]">{role}</Text>
            <Text className="mt-1 text-[12px] text-[#687385]">{email}</Text>
            <Text className="text-[12px] text-[#687385]">{phone}</Text>
          </View>
        </TouchableOpacity>

        {!hideDelete ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onDelete}
            className="h-6 w-6 items-center justify-center"
          >
            <Ionicons name="trash-outline" size={14} color="#FF4B4B" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type ConversationHeaderProps = {
  name: string;
  avatarUrl: string;
  idText?: string;
  onBack: () => void;
};

export default function ConversationHeader({
  name,
  avatarUrl,
  idText,
  onBack,
}: ConversationHeaderProps) {
  return (
    <View className="mt-2 flex-row items-center px-5">
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onBack}
        className="mr-3 h-10 w-8 justify-center"
      >
        <Ionicons name="chevron-back" size={28} color="#2B2B2B" />
      </TouchableOpacity>

      <Image source={{ uri: avatarUrl }} className="h-10 w-10 rounded-full" />

      <View className="ml-3">
        <View className="flex-row items-center">
          <Text className="text-[17px] font-medium text-[#2B2B2B]">{name}</Text>
          <View className="ml-2 h-2.5 w-2.5 rounded-full bg-[#0FB866]" />
        </View>
        <Text className="text-[14px] text-[#6B7280]">
          {idText || "ID: #225432"}
        </Text>
      </View>
    </View>
  );
}

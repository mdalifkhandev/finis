import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type TeamWorkerCardProps = {
  avatarUrl: string | null;
  name: string;
  role: string;
  onDelete?: () => void;
};

export default function TeamWorkerCard({
  avatarUrl,
  name,
  role,
  onDelete,
}: TeamWorkerCardProps) {
  return (
    <View className="mt-2.5 rounded-[10px] border border-[#E0E4E9] bg-[#FFFFFF] px-3 py-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} className="h-10 w-10 rounded-full" />
          ) : (
            <View className="h-10 w-10 rounded-full bg-[#E9EDF1] items-center justify-center">
              <Ionicons name="person" size={18} color="#9CA3AF" />
            </View>
          )}
          <View className="ml-2.5 flex-1 pr-2">
            <Text className="text-[16px] font-medium text-[#1B2028]">
              {name}
            </Text>
            <Text className="mt-0.5 text-[14px] text-[#687385]">{role}</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onDelete}
          className="h-6 w-6 items-center justify-center"
        >
          <Ionicons name="trash-outline" size={14} color="#FF4B4B" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

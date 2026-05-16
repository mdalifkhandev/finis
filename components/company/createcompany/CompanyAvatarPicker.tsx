import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type CompanyAvatarPickerProps = {
  avatarUrl?: string | null;
  onPress?: () => void;
};

export default function CompanyAvatarPicker({
  avatarUrl,
  onPress,
}: CompanyAvatarPickerProps) {
  return (
    <View className="items-center">
      <View className="relative h-[120px] w-[120px]">
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            className="h-full w-full rounded-full"
          />
        ) : (
          <View className="h-full w-full items-center justify-center rounded-full bg-[#F3F4F6]">
            <Ionicons name="business-outline" size={42} color="#6B7280" />
            <Text className="mt-1 text-[10px] text-[#6B7280]">Company Logo</Text>
          </View>
        )}
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.85}
          className="absolute bottom-1 right-1 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#9CA3AF]"
        >
          <Ionicons name="camera-outline" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

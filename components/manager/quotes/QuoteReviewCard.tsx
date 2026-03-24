import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type QuoteReviewCardProps = {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
};

export default function QuoteReviewCard({
  title,
  onEdit,
  children,
}: QuoteReviewCardProps) {
  return (
    <View className="mt-5 rounded-[20px] border border-[#D7E0E8] bg-white px-5 py-5 shadow-sm">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-[16px] font-semibold text-[#1F2937]">
          {title}
        </Text>
        {onEdit ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onEdit}
            className="flex-row items-center"
          >
            <Ionicons name="pencil-outline" size={18} color="#1F5577" />
            <Text className="ml-1 text-[14px] font-medium text-[#1F5577]">
              Edit
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {children}
    </View>
  );
}

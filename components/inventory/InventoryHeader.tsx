import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type InventoryHeaderProps = {
  title: string;
  onBack: () => void;
  onPressAdd?: () => void;
  showAddButton?: boolean;
};

export default function InventoryHeader({
  title,
  onBack,
  onPressAdd,
  showAddButton = false,
}: InventoryHeaderProps) {
  return (
    <View className="mt-2 flex-row items-center justify-between px-5">
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onBack}
        className="h-10 w-10 items-start justify-center"
      >
        <Ionicons name="chevron-back" size={30} color="#2B2B2B" />
      </TouchableOpacity>

      <Text className="text-[18px] font-semibold text-[#2B2B2B]">{title}</Text>

      {showAddButton ? (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPressAdd}
          className="h-16 w-16 items-center justify-center rounded-full bg-[#1D5478]"
        >
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      ) : (
        <View className="h-16 w-16" />
      )}
    </View>
  );
}

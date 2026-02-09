import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type ProjectCheckboxOptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export default function ProjectCheckboxOption({
  label,
  selected,
  onPress,
}: ProjectCheckboxOptionProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="mr-5 flex-row items-center py-1"
    >
      <View
        className={`h-6 w-6 items-center justify-center rounded-md border ${
          selected
            ? "border-[#1D4F6D] bg-[#1D4F6D]"
            : "border-[#101010] bg-transparent"
        }`}
      >
        {selected ? <Ionicons name="checkmark" size={15} color="#FFFFFF" /> : null}
      </View>
      <Text className="ml-2 text-[16px] text-[#334155]">{label}</Text>
    </TouchableOpacity>
  );
}

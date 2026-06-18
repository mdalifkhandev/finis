import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const defaultItems = [
  "Project details",
  "Project Analysis",
  "Team",
  "Task",
  "Document",
];

type ProjectDetailsMenuProps = {
  onPressItem?: (item: string) => void;
  items?: string[];
};

export default function ProjectDetailsMenu({
  onPressItem,
  items = defaultItems,
}: ProjectDetailsMenuProps) {
  return (
    <View className="mx-5 mt-3.5 rounded-3xl border border-[#D7DDE4] bg-[#F8FAFC] py-1.5">
      {items.map((item) => (
        <TouchableOpacity
          key={item}
          activeOpacity={0.85}
          onPress={() => onPressItem?.(item)}
          className="flex-row items-center justify-between px-5 py-5"
        >
          <Text className="text-[16px] text-[#111827]">{item}</Text>
          <Ionicons name="chevron-forward" size={28} color="#111827" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, View } from "react-native";

type ChatSearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export default function ChatSearchBar({
  value,
  onChangeText,
}: ChatSearchBarProps) {
  return (
    <View className="mt-6 h-[40px] flex-row items-center rounded-[10px] border border-[#D4DAE3] bg-[#F8FAFC] px-4">
      <Ionicons name="search-outline" size={20} color="#111418" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search by name"
        placeholderTextColor="#9399A2"
        className="ml-3 flex-1 text-[14px] text-[#1F2937]"
      />
    </View>
  );
}

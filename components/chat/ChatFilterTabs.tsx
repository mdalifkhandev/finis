import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ChatFilter } from "./chatData";

type ChatFilterTabsProps = {
  value: ChatFilter;
  onChange: (next: ChatFilter) => void;
};

export default function ChatFilterTabs({
  value,
  onChange,
}: ChatFilterTabsProps) {
  const tabClass = (tab: ChatFilter) =>
    tab === value
      ? "bg-[#1D5478] border-[#1D5478]"
      : "bg-[#EAF2F1] border-[#C6DCDB]";

  const textClass = (tab: ChatFilter) =>
    tab === value ? "text-white" : "text-[#374151]";

  return (
    <View className="mt-5 flex-row justify-between">
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onChange("chat")}
        className={`h-[40px] w-[48%] justify-center rounded-[12px] border px-4 ${tabClass("chat")}`}
      >
        <Text className={`text-[14px] font-medium ${textClass("chat")}`}>
          Chat
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onChange("support")}
        className={`h-[40px] w-[48%] justify-center rounded-[12px] border px-4 ${tabClass("support")}`}
      >
        <Text className={`text-[14px] font-medium ${textClass("support")}`}>
          Support
        </Text>
      </TouchableOpacity>
    </View>
  );
}

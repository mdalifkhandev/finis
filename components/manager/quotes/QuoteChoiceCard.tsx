import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type QuoteChoiceCardProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export default function QuoteChoiceCard({ label, selected, onPress }: QuoteChoiceCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className={`h-[72px] flex-1 flex-row items-center justify-center rounded-[14px] border ${selected ? "border-[#D4DCE5] bg-white" : "border-[#DDE4EC] bg-white"}`}
    >
      <View className={`mr-3 h-[18px] w-[18px] rounded-full border ${selected ? "border-[#1F5577]" : "border-[#7A9AB4]"} items-center justify-center`}>
        {selected ? <View className="h-[10px] w-[10px] rounded-full bg-[#1F5577]" /> : null}
      </View>
      <Text className="text-[13px] font-medium text-[#25313F]">{label}</Text>
    </TouchableOpacity>
  );
}

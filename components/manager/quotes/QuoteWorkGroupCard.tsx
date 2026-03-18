import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import QuoteWorkItemCard, { type QuoteSelectedWorkItem } from "./QuoteWorkItemCard";

export type QuoteSelectedWorkGroup = {
  id: string;
  title: string;
  expanded: boolean;
  items: QuoteSelectedWorkItem[];
};

type QuoteWorkGroupCardProps = {
  group: QuoteSelectedWorkGroup;
  onToggleGroup: () => void;
  onToggleItem: (itemId: string) => void;
  onChangeItemQuantity: (itemId: string, value: string) => void;
  onSelectItemUnit: (itemId: string, unit: string) => void;
};

export default function QuoteWorkGroupCard({ group, onToggleGroup, onToggleItem, onChangeItemQuantity, onSelectItemUnit }: QuoteWorkGroupCardProps) {
  return (
    <View className="mb-4 rounded-[14px] border border-[#E3E8EE] bg-white p-3">
      <TouchableOpacity activeOpacity={0.85} onPress={onToggleGroup} className="flex-row items-center justify-between">
        <View>
          <Text className="text-[15px] font-medium text-[#1F2937]">{group.title}</Text>
          <Text className="mt-1 text-[12px] text-[#7B8794]">{group.items.length} items</Text>
        </View>
        <Ionicons name={group.expanded ? "chevron-up" : "chevron-down"} size={18} color="#7B8794" />
      </TouchableOpacity>

      {group.expanded ? (
        <View className="mt-3">
          {group.items.map((item) => (
            <QuoteWorkItemCard
              key={item.id}
              item={item}
              onToggle={() => onToggleItem(item.id)}
              onChangeQuantity={(value) => onChangeItemQuantity(item.id, value)}
              onSelectUnit={(unit) => onSelectItemUnit(item.id, unit)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

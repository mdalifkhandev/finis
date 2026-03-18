import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { formatCurrency, type QuoteUnitOption } from "./quoteMockData";

export type QuoteSelectedWorkItem = {
  id: string;
  title: string;
  quantity: string;
  unitOptions: QuoteUnitOption[];
  selectedUnit: string;
  selectedUnitPrice: number;
  selected: boolean;
};

type QuoteWorkItemCardProps = {
  item: QuoteSelectedWorkItem;
  onToggle: () => void;
  onChangeQuantity: (value: string) => void;
  onSelectUnit: (unit: string) => void;
};

export default function QuoteWorkItemCard({ item, onToggle, onChangeQuantity, onSelectUnit }: QuoteWorkItemCardProps) {
  const quantity = Number(item.quantity) || 0;
  const subtotal = item.selected ? quantity * item.selectedUnitPrice : 0;

  return (
    <View className="mb-3 rounded-[12px] border border-[#E6EBF1] bg-white p-3">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="flex-1 pr-3 text-[14px] font-medium text-[#1F2937]">{item.title}</Text>
        <TouchableOpacity activeOpacity={0.85} onPress={onToggle} className="h-5 w-5 items-center justify-center rounded-[4px] border border-[#C7D1DB] bg-white">
          {item.selected ? <Ionicons name="checkmark" size={14} color="#1F5577" /> : null}
        </TouchableOpacity>
      </View>

      <Text className="mb-1 text-[11px] text-[#66707B]">Quantity</Text>
      <TextInput value={item.quantity} onChangeText={onChangeQuantity} keyboardType="numeric" className="mb-3 h-[42px] rounded-[10px] border border-[#D9E1E8] bg-[#F7F9FB] px-3 text-[13px] text-[#1F2937]" />

      <Text className="mb-2 text-[11px] text-[#66707B]">Unit</Text>
      <View className="mb-3 flex-row flex-wrap gap-2">
        {item.unitOptions.map((option) => {
          const active = option.unit === item.selectedUnit;
          return (
            <TouchableOpacity
              key={`${item.id}-${option.unit}`}
              activeOpacity={0.85}
              onPress={() => onSelectUnit(option.unit)}
              className={`rounded-full border px-3 py-2 ${active ? "border-[#1F5577] bg-[#EAF3F8]" : "border-[#D9E1E8] bg-white"}`}
            >
              <Text className={`text-[12px] font-medium ${active ? "text-[#1F5577]" : "text-[#475569]"}`}>{option.unit}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text className="mb-1 text-[11px] text-[#66707B]">Unit Price</Text>
      <View className="mb-3 h-[42px] justify-center rounded-[10px] border border-[#D9E1E8] bg-[#F7F9FB] px-3">
        <Text className="text-[13px] text-[#1F2937]">{formatCurrency(item.selectedUnitPrice)} / {item.selectedUnit}</Text>
      </View>

      <Text className="mb-1 text-[11px] text-[#66707B]">Subtotal</Text>
      <View className="h-[42px] justify-center rounded-[10px] border border-[#D9E1E8] bg-[#F7F9FB] px-3">
        <Text className="text-[13px] font-medium text-[#1F2937]">{formatCurrency(subtotal)}</Text>
      </View>
    </View>
  );
}

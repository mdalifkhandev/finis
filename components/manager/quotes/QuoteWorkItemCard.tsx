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
  isCustom?: boolean;
};

type QuoteWorkItemCardProps = {
  item: QuoteSelectedWorkItem;
  onToggle: () => void;
  onChangeQuantity: (value: string) => void;
  onSelectUnit: (unit: string) => void;
};

function formatUnitPrice(value: number) {
  const formatted = Number.isInteger(value)
    ? String(value)
    : String(value.toFixed(2));
  return formatted.replace(/\.00$/, "").replace(/(\.\d*[1-9])0$/, "$1");
}

export default function QuoteWorkItemCard({
  item,
  onToggle,
  onChangeQuantity,
  onSelectUnit,
}: QuoteWorkItemCardProps) {
  const quantity = Number(item.quantity) || 0;
  const subtotal = quantity * item.selectedUnitPrice;
  const currentUnitIndex = item.unitOptions.findIndex(
    (option) => option.unit === item.selectedUnit,
  );

  const handleUnitPress = () => {
    if (!item.unitOptions.length) return;
    const nextIndex =
      currentUnitIndex >= 0
        ? (currentUnitIndex + 1) % item.unitOptions.length
        : 0;
    onSelectUnit(item.unitOptions[nextIndex].unit);
  };

  return (
    <View className="mb-3 rounded-[12px] border border-[#E6EBF1] bg-white p-3">
      <View className="mb-4 flex-row items-start justify-between">
        <Text className="flex-1 pr-3 text-[16px] font-medium text-[#1F2937]">
          {item.title}
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onToggle}
          className="h-5 w-5 items-center justify-center rounded-[4px] border border-[#C7D1DB] bg-white"
        >
          {item.selected ? (
            <Ionicons name="checkmark" size={14} color="#98A2B3" />
          ) : null}
        </TouchableOpacity>
      </View>

      <Text className="mb-2 text-[12px] font-medium text-[#344054]">
        Quantity
      </Text>
      <TextInput
        value={item.quantity}
        onChangeText={onChangeQuantity}
        keyboardType="decimal-pad"
        className="mb-4 h-[58px] rounded-[16px] border border-[#D5DEE8] bg-[#F6F8FB] px-4 text-[18px] text-[#667085]"
      />

      <Text className="mb-2 text-[12px] font-medium text-[#344054]">Unit</Text>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleUnitPress}
        className="mb-4 h-[58px] flex-row items-center justify-between rounded-[16px] border border-[#D5DEE8] bg-[#F6F8FB] px-4"
      >
        <Text className="text-[18px] text-[#667085]">{item.selectedUnit}</Text>
        {item.unitOptions.length > 1 ? (
          <Ionicons name="chevron-down" size={18} color="#98A2B3" />
        ) : null}
      </TouchableOpacity>

      <Text className="mb-2 text-[12px] font-medium text-[#344054]">
        Unit Price
      </Text>
      <View className="mb-4 h-[58px] justify-center rounded-[16px] border border-[#D5DEE8] bg-[#F6F8FB] px-4">
        <Text className="text-[18px] text-[#667085]">
          {formatUnitPrice(item.selectedUnitPrice)}
        </Text>
      </View>

      <Text className="mb-2 text-[12px] font-medium text-[#344054]">
        Subtotal
      </Text>
      <View className="h-[58px] justify-center rounded-[16px] border border-[#D5DEE8] bg-[#F6F8FB] px-4">
        <Text className="text-[18px] font-medium text-[#101828]">
          {formatCurrency(subtotal)}
        </Text>
      </View>
    </View>
  );
}

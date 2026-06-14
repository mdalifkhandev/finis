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

type BackendQuoteItem = {
  id: string;
  title: string;
  projectType: string;
  propertyType: string;
  unitType: string;
  quantity: number;
  unit: string | null;
  unitPrice: number;
  subtotal: number;
  notes: string | null;
  isCustom: boolean;
  unitOptions?: QuoteUnitOption[];
  selectedUnit?: string;
  selectedUnitPrice?: number;
  selected?: boolean;
};

type QuoteWorkItemCardProps = {
  item: QuoteSelectedWorkItem | BackendQuoteItem;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
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
  onEdit,
  onDelete,
  onChangeQuantity,
  onSelectUnit,
}: QuoteWorkItemCardProps) {
  const unitOptions = "unitOptions" in item ? item.unitOptions ?? [] : [];
  const selectedUnit =
    "selectedUnit" in item ? item.selectedUnit ?? "" : item.unit ?? "";
  const selectedUnitPrice =
    "selectedUnitPrice" in item
      ? item.selectedUnitPrice ?? 0
      : item.unitPrice ?? 0;
  const quantityValue =
    "quantity" in item ? String(item.quantity ?? 0) : "0";
  const selected = "selected" in item ? item.selected ?? false : true;

  const quantity = Number(quantityValue) || 0;
  const subtotal = quantity * selectedUnitPrice;
  const currentUnitIndex = unitOptions.findIndex(
    (option) => option.unit === selectedUnit,
  );


  const handleUnitPress = () => {
    if (!unitOptions.length) return;
    const nextIndex =
      currentUnitIndex >= 0
        ? (currentUnitIndex + 1) % unitOptions.length
        : 0;
    onSelectUnit(unitOptions[nextIndex].unit);
  };

  return (
    <View className="mb-3 rounded-[12px] border border-[#E6EBF1] bg-white p-3">
      <View className="mb-4 flex-row items-center justify-between">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onEdit}
          className="flex-1 rounded-[10px] bg-[#F3F7FA] px-3 py-2"
        >
          <Text className="text-[14px] font-medium text-[#1F2937]">
            Edit Item
          </Text>
        </TouchableOpacity>

        <View className="ml-2 flex-row items-center gap-2">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onDelete}
            className="h-9 w-9 items-center justify-center rounded-[10px] bg-[#FEE2E2]"
          >
            <Ionicons name="trash-outline" size={16} color="#B42318" />
          </TouchableOpacity>

          <TouchableOpacity
          activeOpacity={0.85}
          onPress={onToggle}
            className="h-9 w-9 items-center justify-center rounded-[10px] border border-[#C7D1DB] bg-white"
          >
            {selected ? (
              <Ionicons name="checkmark" size={16} color="#1F5577" />
            ) : (
              <Ionicons name="add" size={16} color="#98A2B3" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Text className="mb-2 text-[12px] font-medium text-[#344054]">
        Quantity
      </Text>
      <TextInput
        value={quantityValue}
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
        <Text className="text-[18px] text-[#667085]">{selectedUnit}</Text>
        {unitOptions.length > 1 ? (
          <Ionicons name="chevron-down" size={18} color="#98A2B3" />
        ) : null}
      </TouchableOpacity>

      <Text className="mb-2 text-[12px] font-medium text-[#344054]">
        Unit Price
      </Text>
      <View className="mb-4 h-[58px] justify-center rounded-[16px] border border-[#D5DEE8] bg-[#F6F8FB] px-4">
        <Text className="text-[18px] text-[#667085]">
          {formatUnitPrice(selectedUnitPrice)}
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

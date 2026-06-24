import React from "react";
import { Text, View } from "react-native";
import { formatCurrency } from "./quoteTypes";

type QuoteWorkTotalsBarProps = {
  itemsSelected: number;
  estimatedTotal: number;
  subtotal: number;
};

export default function QuoteWorkTotalsBar({
  itemsSelected,
  estimatedTotal,
  subtotal,
}: QuoteWorkTotalsBarProps) {
  return (
    <View className="mt-4 rounded-[14px] border border-[#D9E1E8] bg-white px-3 py-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 items-center">
          <Text className="text-[11px] text-[#66707B]">Items Selected</Text>
          <Text className="mt-2 text-[18px] font-semibold text-[#1F5577]">
            {itemsSelected}
          </Text>
        </View>
        <View className="h-10 w-px bg-[#E5EAF0]" />
        <View className="flex-1 items-center">
          <Text className="text-[11px] text-[#66707B]">Estimated Total</Text>
          <Text className="mt-2 text-[18px] font-semibold text-[#1F5577]">
            {formatCurrency(estimatedTotal)}
          </Text>
        </View>
        <View className="h-10 w-px bg-[#E5EAF0]" />
        <View className="flex-1 items-center">
          <Text className="text-[11px] text-[#66707B]">Subtotal</Text>
          <Text className="mt-2 text-[18px] font-semibold text-[#1F5577]">
            {formatCurrency(subtotal)}
          </Text>
        </View>
      </View>
    </View>
  );
}

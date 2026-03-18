import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import QuoteSectionCard from "./QuoteSectionCard";
import { formatCurrency, type QuoteEstimate, type QuoteProjectType, type QuotePropertyType, type QuoteUnitType } from "./quoteMockData";

type QuotePricingSummaryProps = {
  clientName: string;
  projectAddress: string;
  projectType: QuoteProjectType;
  propertyType: QuotePropertyType;
  unitType: QuoteUnitType;
  estimate: QuoteEstimate;
  subtotal: number;
  itemsSelected: number;
  onBack: () => void;
};

export default function QuotePricingSummary({
  clientName,
  projectAddress,
  projectType,
  propertyType,
  unitType,
  estimate,
  subtotal,
  itemsSelected,
  onBack,
}: QuotePricingSummaryProps) {
  const contingency = subtotal * 0.08;
  const estimatedTotal = subtotal + contingency;

  return (
    <>
      <QuoteSectionCard title="Quote Summary" icon="document-text-outline">
        <Text className="text-[16px] font-semibold text-[#1F2328]">{estimate.title}</Text>
        <Text className="mt-1 text-[13px] leading-5 text-[#66707B]">{estimate.subtitle}</Text>

        <View className="mt-4 rounded-[12px] bg-[#F6F9FB] p-3">
          <Text className="text-[12px] text-[#66707B]">Client</Text>
          <Text className="mt-1 text-[14px] font-medium text-[#1F2328]">{clientName || "Walk-in Client"}</Text>
          <Text className="mt-3 text-[12px] text-[#66707B]">Project Address</Text>
          <Text className="mt-1 text-[14px] font-medium text-[#1F2328]">{projectAddress || "Address pending"}</Text>
          <Text className="mt-3 text-[12px] text-[#66707B]">Configuration</Text>
          <Text className="mt-1 text-[14px] font-medium text-[#1F2328]">{projectType} • {propertyType} • {unitType}</Text>
          <Text className="mt-3 text-[12px] text-[#66707B]">Estimated Timeline</Text>
          <Text className="mt-1 text-[14px] font-medium text-[#1F2328]">{estimate.timeline}</Text>
        </View>
      </QuoteSectionCard>

      <QuoteSectionCard title="Selected Work Totals" icon="cash-outline">
        <View className="mb-3 flex-row items-center justify-between rounded-[10px] bg-[#F9FBFC] px-3 py-3">
          <Text className="text-[13px] font-medium text-[#334155]">Items Selected</Text>
          <Text className="text-[13px] font-semibold text-[#1F5577]">{itemsSelected}</Text>
        </View>
        <View className="mb-3 flex-row items-center justify-between rounded-[10px] bg-[#F9FBFC] px-3 py-3">
          <Text className="text-[13px] font-medium text-[#334155]">Subtotal</Text>
          <Text className="text-[13px] font-semibold text-[#1F5577]">{formatCurrency(subtotal)}</Text>
        </View>
        <View className="mb-3 flex-row items-center justify-between rounded-[10px] bg-[#F9FBFC] px-3 py-3">
          <Text className="text-[13px] font-medium text-[#334155]">Estimated All</Text>
          <Text className="text-[13px] font-semibold text-[#1F5577]">{formatCurrency(estimatedTotal)}</Text>
        </View>
        <View className="rounded-[12px] bg-[#1F5577] px-4 py-4">
          <Text className="text-[12px] uppercase tracking-[0.8px] text-[#C8DCE9]">Estimated Total</Text>
          <Text className="mt-1 text-[24px] font-semibold text-white">{formatCurrency(estimatedTotal)}</Text>
        </View>
      </QuoteSectionCard>

      <View className="mt-4 flex-row gap-3">
        <TouchableOpacity activeOpacity={0.88} onPress={onBack} className="h-[52px] flex-1 items-center justify-center rounded-[12px] border border-[#D6DCE3] bg-white">
          <Text className="text-[15px] font-medium text-[#2B2B2B]">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.88} className="h-[52px] flex-1 items-center justify-center rounded-[12px] bg-[#1F5577]">
          <Text className="text-[15px] font-medium text-white">Generate Quote</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

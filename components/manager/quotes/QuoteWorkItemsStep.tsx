import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import QuoteSectionCard from "./QuoteSectionCard";
import QuoteWorkGroupCard, {
  type QuoteSelectedWorkGroup,
} from "./QuoteWorkGroupCard";
import QuoteWorkTotalsBar from "./QuoteWorkTotalsBar";

type QuoteWorkItemsStepProps = {
  catalogLabel: string;
  groups: QuoteSelectedWorkGroup[];
  subtotal: number;
  itemsSelected: number;
  estimatedTotal: number;
  onToggleGroup: (groupId: string) => void;
  onToggleItem: (groupId: string, itemId: string) => void;
  onChangeItemQuantity: (
    groupId: string,
    itemId: string,
    value: string,
  ) => void;
  onSelectItemUnit: (groupId: string, itemId: string, unit: string) => void;
  onAddCustomItem: () => void;
  onNext: () => void;
  onBack: () => void;
};

export default function QuoteWorkItemsStep({
  catalogLabel,
  groups,
  subtotal,
  itemsSelected,
  estimatedTotal,
  onToggleGroup,
  onToggleItem,
  onChangeItemQuantity,
  onSelectItemUnit,
  onAddCustomItem,
  onNext,
  onBack,
}: QuoteWorkItemsStepProps) {
  return (
    <>
      <QuoteSectionCard title="Select Services" icon="construct-outline">
        <Text className="text-[13px] leading-5 text-[#66707B]">
          Catalog loaded from the selected configuration database:{" "}
          {catalogLabel}
        </Text>
        <Text className="mt-2 text-[13px] leading-5 text-[#66707B]">
          Select the services you need. Quantity and unit of measurement stay
          separate.
        </Text>

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={onAddCustomItem}
          className="mt-4 h-[46px] flex-row items-center justify-center rounded-[12px] border border-[#1F5577] bg-white"
        >
          <Ionicons name="add" size={18} color="#1F5577" />
          <Text className="ml-2 text-[14px] font-medium text-[#1F5577]">
            Add Custom Item
          </Text>
        </TouchableOpacity>
      </QuoteSectionCard>

      {groups.map((group) => (
        <QuoteWorkGroupCard
          key={group.id}
          group={group}
          onToggleGroup={() => onToggleGroup(group.id)}
          onToggleItem={(itemId) => onToggleItem(group.id, itemId)}
          onChangeItemQuantity={(itemId, value) =>
            onChangeItemQuantity(group.id, itemId, value)
          }
          onSelectItemUnit={(itemId, unit) =>
            onSelectItemUnit(group.id, itemId, unit)
          }
        />
      ))}

      <QuoteWorkTotalsBar
        itemsSelected={itemsSelected}
        estimatedTotal={estimatedTotal}
        subtotal={subtotal}
      />

      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onBack}
        className="mt-4 h-[52px] items-center justify-center rounded-[12px] border border-[#D6DCE3] bg-white"
      >
        <Text className="text-[15px] font-medium text-[#2B2B2B]">Back</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onNext}
        className="mt-3 h-[56px] items-center justify-center rounded-[14px] bg-[#1F5577]"
      >
        <Text className="text-[16px] font-medium text-white">Next</Text>
      </TouchableOpacity>
    </>
  );
}

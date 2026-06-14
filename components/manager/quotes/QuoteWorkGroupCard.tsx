import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import QuoteWorkItemCard, {
  type QuoteSelectedWorkItem,
} from "./QuoteWorkItemCard";

export type QuoteSelectedWorkGroup = {
  id: string;
  title: string;
  expanded: boolean;
  items: QuoteSelectedWorkItem[];
};

export type BackendQuote = {
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
};

type QuoteWorkGroupCardProps = {
  group: BackendQuote;
  onToggleGroup: () => void;
  onToggleItem: (itemId: string) => void;
  onChangeItemQuantity: (itemId: string, value: string) => void;
  onSelectItemUnit: (itemId: string, unit: string) => void;
};

export default function QuoteWorkGroupCard({
group,
  onToggleItem,
  onChangeItemQuantity,
  onSelectItemUnit,
}: QuoteWorkGroupCardProps) {
  console.log(JSON.stringify(group, null, 2));
  const [expanded, setExpanded] = React.useState(false);
  const onToggleGroup=()=>{
setExpanded((prev) => !prev);
  }
  return (
    <View className="mb-4 rounded-[14px] border border-[#E3E8EE] bg-white p-3">
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onToggleGroup}
        className="flex-row items-center justify-between"
      >
        <View>
          <Text className="text-[15px] font-medium text-[#1F2937]">
            {group.title}
          </Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color="#7B8794"
        />
      </TouchableOpacity>

      {expanded ? (
        <View className="mt-3">
            <QuoteWorkItemCard
              key={group.id}
              item={group}
              onToggle={() => onToggleItem(group.id)}
              onChangeQuantity={(value) => onChangeItemQuantity(group.id, value)}
              onSelectUnit={(unit) => onSelectItemUnit(group.id, unit)}
            />
        
        </View>
      ) : null}
    </View>
  );
}

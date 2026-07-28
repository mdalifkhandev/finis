import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export type UnitDigitsValue = "3" | "4";

type UnitDigitsDropdownProps = {
  value: UnitDigitsValue;
  onChange: (next: UnitDigitsValue) => void;
};

const OPTIONS: { label: string; value: UnitDigitsValue }[] = [
  { label: "3 Digits", value: "3" },
  { label: "4 Digits", value: "4" },
];

export default function UnitDigitsDropdown({
  value,
  onChange,
}: UnitDigitsDropdownProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = OPTIONS.find((o) => o.value === value)?.label ?? "3 Digits";

  return (
    <View>
      <Text className="mb-2 text-[15px] font-medium text-[#1F2937]">
        Unit Number Format
      </Text>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setOpen((prev) => !prev)}
        className="h-[46px] flex-row items-center rounded-xl border border-[#C9D1D9] bg-[#F3F5F7] px-3"
      >
        <Text className="flex-1 text-[15px] text-[#374151]">{selectedLabel}</Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color="#6B7280"
        />
      </TouchableOpacity>

      {open ? (
        <View className="mt-2 overflow-hidden rounded-xl border border-[#D5DBE2] bg-[#F8FAFC]">
          {OPTIONS.map((option) => {
            const selected = option.value === value;

            return (
               <TouchableOpacity
                key={option.value}
                activeOpacity={0.85}
                onPress={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`h-[42px] flex-row items-center px-3 ${
                  selected ? "bg-[#E9F2F8]" : "bg-[#F8FAFC]"
                }`}
              >
                <Text
                  className={`text-[15px] ${
                    selected ? "font-medium text-[#1D4F6D]" : "text-[#374151]"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

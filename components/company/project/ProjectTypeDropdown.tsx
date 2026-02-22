import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ProjectTypeValue } from "./projectStore";

export type { ProjectTypeValue } from "./projectStore";

type ProjectTypeDropdownProps = {
  value: ProjectTypeValue;
  onChange: (next: ProjectTypeValue) => void;
};

const PROJECT_TYPE_OPTIONS: ProjectTypeValue[] = [
  "Apartment Building",
  "House",
];

export default function ProjectTypeDropdown({
  value,
  onChange,
}: ProjectTypeDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <Text className="mb-2 text-[16px] font-medium text-[#1F2937]">
        Project Type
      </Text>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setOpen((prev) => !prev)}
        className="h-12 flex-row items-center rounded-xl border border-[#C9D1D9] bg-[#F3F5F7] px-3"
      >
        <Text className="flex-1 text-[16px] text-[#374151]">{value}</Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color="#6B7280"
        />
      </TouchableOpacity>

      {open ? (
        <View className="mt-2 overflow-hidden rounded-xl border border-[#D5DBE2] bg-[#F8FAFC]">
          {PROJECT_TYPE_OPTIONS.map((option) => {
            const selected = option === value;

            return (
              <TouchableOpacity
                key={option}
                activeOpacity={0.85}
                onPress={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`h-11 flex-row items-center px-3 ${
                  selected ? "bg-[#E9F2F8]" : "bg-[#F8FAFC]"
                }`}
              >
                <Text
                  className={`text-[15px] ${
                    selected ? "font-medium text-[#1D4F6D]" : "text-[#374151]"
                  }`}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

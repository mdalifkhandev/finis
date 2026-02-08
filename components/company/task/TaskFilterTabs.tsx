import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export type TaskFilter = "All" | "Progress" | "Pending" | "Completed";

type TaskFilterTabsProps = {
  value: TaskFilter;
  onChange: (value: TaskFilter) => void;
};

const filters: TaskFilter[] = ["All", "Progress", "Pending", "Completed"];

export default function TaskFilterTabs({ value, onChange }: TaskFilterTabsProps) {
  return (
    <View className="mt-3 flex-row items-center">
      {filters.map((filter, index) => {
        const isActive = value === filter;

        return (
          <TouchableOpacity
            key={filter}
            activeOpacity={0.85}
            onPress={() => onChange(filter)}
            className={`h-10 min-w-[66px] items-center justify-center rounded-[9px] border px-3 ${
              isActive
                ? "border-[#1F5777] bg-[#1F5777]"
                : "border-[#D2DAE1] bg-[#DFE6EA]"
            } ${index > 0 ? "ml-2" : ""}`}
          >
            <Text
              className={`text-[16px] ${isActive ? "text-white" : "text-[#3E4B59]"}`}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


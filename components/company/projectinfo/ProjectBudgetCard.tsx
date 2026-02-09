import React from "react";
import { Text, View } from "react-native";

type ProjectBudgetCardProps = {
  title: string;
  amount: string;
  amountColor: string;
  usagePercent?: number;
  usageLabel?: string;
};

export default function ProjectBudgetCard({
  title,
  amount,
  amountColor,
  usagePercent,
  usageLabel,
}: ProjectBudgetCardProps) {
  const hasUsage = typeof usagePercent === "number";

  return (
    <View
      className={`mt-3.5 rounded-xl border border-[#D8DEE5] bg-[#F7F9FB] px-4 py-4 ${
        hasUsage ? "min-h-[148px]" : "min-h-[126px]"
      }`}
    >
      <Text className="text-[14px] text-[#596579]">{title}</Text>
      <Text
        className="mt-1.5 text-[38px] font-bold leading-[46px]"
        style={{ color: amountColor }}
      >
        {amount}
      </Text>

      {hasUsage ? (
        <>
          <View className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#D7DCE3]">
            <View
              className="h-full rounded-full bg-[#F24800]"
              style={{ width: `${usagePercent}%` }}
            />
          </View>
          {usageLabel ? (
            <Text className="mt-2 text-[15px] text-[#596579]">{usageLabel}</Text>
          ) : null}
        </>
      ) : null}
    </View>
  );
}

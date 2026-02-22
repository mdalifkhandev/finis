import React from "react";
import { Text, View } from "react-native";

type PayrollStatCardProps = {
  value: string;
  label: string;
};

export default function PayrollStatCard({ value, label }: PayrollStatCardProps) {
  return (
    <View
      className="w-[48.5%] rounded-[14px] bg-white px-4 py-3"
      style={{
        minHeight: 82,
        shadowColor: "#101828",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <Text className="text-[32px] font-semibold text-[#1F5577]" style={{ fontSize: 32 / 2 }}>
        {value}
      </Text>
      <Text className="mt-0.5 text-[14px] text-[#666A70]">{label}</Text>
    </View>
  );
}

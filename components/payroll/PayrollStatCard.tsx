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
        shadowOpacity: 0.04,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
      }}
    >
      <Text className="text-[32px] font-semibold text-[#1F5577]" style={{ fontSize: 32 / 2 }}>
        {value}
      </Text>
      <Text className="mt-0.5 text-[14px] text-[#666A70]">{label}</Text>
    </View>
  );
}

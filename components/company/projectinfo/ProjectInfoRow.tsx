import React from "react";
import { Text, View } from "react-native";

type ProjectInfoRowProps = {
  label: string;
  value: React.ReactNode;
};

export default function ProjectInfoRow({ label, value }: ProjectInfoRowProps) {
  return (
    <View className="mt-2.5 flex-row items-center justify-between">
      <Text className="text-[15px] text-[#6B7687]">{label}</Text>
      <View>
        {typeof value === "string" ? (
          <Text className="text-[15px] text-[#111827]">{value}</Text>
        ) : (
          value
        )}
      </View>
    </View>
  );
}

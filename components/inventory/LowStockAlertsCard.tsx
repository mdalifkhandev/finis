import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { LowStockAlert } from "./types";

type LowStockAlertsCardProps = {
  alerts: LowStockAlert[];
};

export default function LowStockAlertsCard({ alerts }: LowStockAlertsCardProps) {
  return (
    <View className="mt-3 overflow-hidden rounded-2xl border border-[#DEE4EA] bg-[#F7F9FB]">
      {alerts.map((alert, index) => {
        const isCritical = alert.status === "Critical";

        return (
          <View
            key={alert.id}
            className={`flex-row items-center px-4 py-4 ${
              index !== alerts.length - 1 ? "border-b border-[#DEE4EA]" : ""
            }`}
          >
            <Ionicons
              name="warning-outline"
              size={27}
              color={isCritical ? "#FF2E3A" : "#E7A900"}
            />

            <View className="ml-4">
              <Text className="text-[17px] font-medium text-[#111827]">{alert.title}</Text>
              <Text className="mt-0.5 text-[15px] text-[#667085]">{alert.message}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

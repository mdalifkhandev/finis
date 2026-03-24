import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InventoryHeader from "./InventoryHeader";
import InventoryItemCard from "./InventoryItemCard";
import InventoryStatCard from "./InventoryStatCard";
import LowStockAlertsCard from "./LowStockAlertsCard";
import {
  useInventoryItems,
  useInventorySummary,
  useLowStockAlerts,
} from "./inventoryStore";

export default function InventoryScreen() {
  const summary = useInventorySummary();
  const alerts = useLowStockAlerts();
  const items = useInventoryItems();

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <InventoryHeader
          title="Inventory"
          onBack={() => router.back()}
          showAddButton
          onPressAdd={() => router.push("/screens/inventory/add")}
        />

        <View className="mt-5 flex-row justify-between px-5">
          <InventoryStatCard
            value={String(summary.totalItems)}
            label="Total Items"
          />
          <InventoryStatCard
            value={String(summary.lowStock)}
            label="Low Stock"
          />
        </View>

        <View className="mt-5 px-5">
          <Text className="text-[18px] font-medium text-[#111827]">
            Low Stock Alerts
          </Text>
          <LowStockAlertsCard alerts={alerts} />

          <TouchableOpacity
            activeOpacity={0.85}
            className="mt-4 h-11 self-start rounded-full bg-[#1D5478] px-6"
          >
            <Text className="pt-2.5 text-[16px] font-medium text-white">
              All Items
            </Text>
          </TouchableOpacity>

          <View className="mt-2">
            {items.map((item) => (
              <InventoryItemCard key={item.id} item={item} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

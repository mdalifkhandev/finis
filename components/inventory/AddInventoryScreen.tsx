import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InventoryFormField from "./InventoryFormField";
import InventoryHeader from "./InventoryHeader";
import { addInventoryItem } from "./inventoryStore";

export default function AddInventoryScreen() {
  const [name, setName] = useState("Cement");
  const [location, setLocation] = useState("Warehouse A");
  const [quantity, setQuantity] = useState("123");

  const handleSave = () => {
    addInventoryItem({
      name: name.trim() || "Unnamed Item",
      location: location.trim() || "Warehouse",
      quantity: Number(quantity) || 0,
    });

    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
        >
          <InventoryHeader title="Add Inventory" onBack={() => router.back()} />

          <View className="mt-6 flex-1 px-5">
            <View className="rounded-[24px] border border-[#DEE4EA] bg-[#F7F9FB] p-4">
              <Text className="text-[17px] font-semibold text-[#2B2B2B]">Product details</Text>

              <InventoryFormField
                label="Product Name"
                value={name}
                onChangeText={setName}
                placeholder="Cement"
              />

              <InventoryFormField
                label="Location"
                value={location}
                onChangeText={setLocation}
                placeholder="Warehouse A"
              />

              <InventoryFormField
                label="Quantity"
                value={quantity}
                onChangeText={setQuantity}
                placeholder="123"
                keyboardType="number-pad"
              />
            </View>

            <View className="mt-8 flex-row items-center justify-between">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.back()}
                className="h-[56px] w-[48%] items-center justify-center rounded-[14px] border border-[#D3D9E2] bg-[#F7F9FB]"
              >
                <Text className="text-[16px] font-medium text-[#1F2937]">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSave}
                className="h-[56px] w-[48%] items-center justify-center rounded-[14px] bg-[#B9DBEE]"
              >
                <Text className="text-[16px] font-medium text-[#1F2937]">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

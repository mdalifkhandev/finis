import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import InventoryFormField from "./InventoryFormField";
import InventoryHeader from "./InventoryHeader";
import { useCreateInventoryMutation, useInventoryProjectsQuery } from "@/hooks/inventory/inventory";
import { toast } from "sonner-native";

export default function AddInventoryScreen() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isProjectModalVisible, setProjectModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minStockQty, setMinStockQty] = useState("");

  const { data: projects = [], isLoading: isLoadingProjects } = useInventoryProjectsQuery();
  const { mutate: createItem, isPending } = useCreateInventoryMutation();

  const selectedProject = projects.find((p) => p.id === projectId);

  const handleSave = () => {
    if (!projectId) {
      toast.error("Please select a project first");
      return;
    }

    createItem(
      {
        projectId,
        name: name.trim() || "Unnamed Item",
        category: category.trim() || "General",
        unit: unit.trim() || "pcs",
        currentQty: Number(quantity) || 0,
        minStockQty: Number(minStockQty) || 0,
        location: location.trim() || "Warehouse",
      },
      {
        onSuccess: () => {
          router.back();
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1] " edges={['top','left',"right"]}>
      <KeyboardAvoidingView
        className="flex-1"
       
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 120, flexGrow: 1 }}
        >
          <InventoryHeader title="Add Inventory " onBack={() => router.back()} />

          <View className="mt-6 flex-1 px-5">
            <View className="rounded-[24px] border border-[#DEE4EA] bg-[#F7F9FB] p-4">
              <Text className="text-[17px] font-semibold text-[#2B2B2B]">
                Product details
              </Text>

              <View className="mt-4">
                <Text className="text-[14px] font-medium text-[#4D596A]">Project</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setProjectModalVisible(true)}
                  className="mt-2 flex-row items-center justify-between rounded-[12px] border border-[#D8DEE5] bg-white px-4 py-3.5"
                >
                  <Text className={`text-[16px] ${selectedProject ? "text-[#141A22]" : "text-[#A0AEC0]"}`}>
                    {selectedProject ? selectedProject.name : "Select a project"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#A0AEC0" />
                </TouchableOpacity>
              </View>

              <InventoryFormField
                label="Product Name"
                value={name}
                onChangeText={setName}
                placeholder="e.g. Electrical Wire"
              />

              <InventoryFormField
                label="Category"
                value={category}
                onChangeText={setCategory}
                placeholder="e.g. Electrical"
              />

              <InventoryFormField
                label="Unit"
                value={unit}
                onChangeText={setUnit}
                placeholder="e.g. meter"
              />

              <InventoryFormField
                label="Location"
                value={location}
                onChangeText={setLocation}
                placeholder="e.g. house"
              />

              <InventoryFormField
                label="Current Quantity"
                value={quantity}
                onChangeText={setQuantity}
                placeholder="e.g. 500"
                keyboardType="number-pad"
              />

              <InventoryFormField
                label="Minimum Stock Quantity"
                value={minStockQty}
                onChangeText={setMinStockQty}
                placeholder="e.g. 50"
                keyboardType="number-pad"
              />
            </View>

            <View className="mt-8 flex-row items-center justify-between">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.back()}
                className="h-[56px] w-[48%] items-center justify-center rounded-[14px] border border-[#D3D9E2] bg-[#F7F9FB]"
                disabled={isPending}
              >
                <Text className="text-[16px] font-medium text-[#1F2937]">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSave}
                disabled={isPending}
                className="h-[56px] w-[48%] flex-row items-center justify-center rounded-[14px] bg-[#B9DBEE]"
              >
                {isPending ? (
                  <ActivityIndicator color="#1F2937" style={{ marginRight: 8 }} />
                ) : null}
                <Text className="text-[16px] font-medium text-[#1F2937]">
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={isProjectModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setProjectModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-end bg-black/40"
          activeOpacity={1}
          onPress={() => setProjectModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            className="h-[60%] rounded-t-[24px] bg-white p-5"
          >
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-[18px] font-bold text-[#141A22]">Select Project</Text>
              <TouchableOpacity onPress={() => setProjectModalVisible(false)}>
                <Ionicons name="close" size={24} color="#697487" />
              </TouchableOpacity>
            </View>

            {isLoadingProjects ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#1F506D" />
              </View>
            ) : (
              <FlatList
                data={projects}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setProjectId(item.id);
                      setProjectModalVisible(false);
                    }}
                    className={`mb-3 flex-row items-center justify-between rounded-[12px] border p-4 ${
                      projectId === item.id
                        ? "border-[#2662F4] bg-[#F0F4FF]"
                        : "border-[#D8DEE5] bg-[#F7F9FB]"
                    }`}
                  >
                    <Text
                      className={`text-[16px] ${
                        projectId === item.id ? "font-semibold text-[#2662F4]" : "text-[#141A22]"
                      }`}
                    >
                      {item.name}
                    </Text>
                    {projectId === item.id && (
                      <Ionicons name="checkmark-circle" size={20} color="#2662F4" />
                    )}
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View className="mt-10 items-center">
                    <Text className="text-[#697487]">No projects found</Text>
                  </View>
                }
              />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}


import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import QuoteChoiceCard from "./QuoteChoiceCard";
import QuoteField from "./QuoteField";
import QuoteSectionCard from "./QuoteSectionCard";
import type {
  QuoteProjectType,
  QuotePropertyType,
  QuoteUnitType,
} from "./quoteTypes";

type QuoteBuilderFormProps = {
  clientName: string;
  setClientName: (value: string) => void;
  defaultClientName: string;
  projectAddress: string;
  setProjectAddress: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  defaultPhone: string;
  email: string;
  setEmail: (value: string) => void;
  defaultEmail: string;
  estimatedTime: string;
  setEstimatedTime: (value: string) => void;
  selectedAdmin: string;
  setSelectedAdmin: (value: string) => void;
  projectType: QuoteProjectType;
  setProjectType: (value: QuoteProjectType) => void;
  propertyType: QuotePropertyType;
  setPropertyType: (value: QuotePropertyType) => void;
  unitType: QuoteUnitType;
  setUnitType: (value: QuoteUnitType) => void;
  onNext: () => void;
};

export default function QuoteBuilderForm({
  clientName,
  setClientName,
  defaultClientName,
  projectAddress,
  setProjectAddress,
  phoneNumber,
  setPhoneNumber,
  defaultPhone,
  email,
  setEmail,
  defaultEmail,
  estimatedTime,
  setEstimatedTime,
  selectedAdmin,
  setSelectedAdmin,
  projectType,
  setProjectType,
  propertyType,
  setPropertyType,
  unitType,
  setUnitType,
  onNext,
}: QuoteBuilderFormProps) {
  const [adminSheetVisible, setAdminSheetVisible] = useState(false);
  const adminOptions = ["Admin 1", "Admin 2", "Admin 3"];

  return (
    <>
      <QuoteSectionCard title="Client Information" icon="business-outline">
        <QuoteField
          label="Client Name *"
          placeholder="Roky Islam"
          value={clientName || defaultClientName}
          onChangeText={setClientName}
        />
        <QuoteField
          label="Project Address *"
          placeholder="Enter full project address"
          value={projectAddress}
          onChangeText={setProjectAddress}
          leftIcon="location-outline"
        />
        <QuoteField
          label="Phone Number"
          placeholder="+880123456789"
          value={phoneNumber || defaultPhone}
          onChangeText={setPhoneNumber}
        />
        <QuoteField
          label="Email"
          placeholder="Enter your mail"
          value={email || defaultEmail}
          onChangeText={setEmail}
        />
        <QuoteField
          label="Time Hours"
          placeholder="Enter hours"
          value={estimatedTime}
          onChangeText={setEstimatedTime}
          keyboardType="number-pad"
        />
        <View className="mb-5">
          <Text className="mb-2 text-[14px] font-medium text-[#2B2B2B]">
            Select Admin
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setAdminSheetVisible(true)}
            className="h-[56px] flex-row items-center rounded-[16px] border border-[#D4DCE5] bg-white px-4"
          >
            <Text className={`flex-1 text-[14px] ${selectedAdmin ? "text-[#1F2937]" : "text-[#A0A8B5]"}`}>
              {selectedAdmin || "Select admin"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#A0A8B5" />
          </TouchableOpacity>
        </View>

      </QuoteSectionCard>

      <QuoteSectionCard title="Project Details" icon="home-outline">
        <Text className="mb-3 text-[14px] font-medium text-[#2B2B2B]">
          Project Type *
        </Text>
        <View className="mb-5 flex-row gap-3">
          <QuoteChoiceCard
            label="New Build"
            selected={projectType === "New Build"}
            onPress={() => setProjectType("New Build")}
          />
          <QuoteChoiceCard
            label="Renovations"
            selected={projectType === "Renovations"}
            onPress={() => setProjectType("Renovations")}
          />
        </View>

        <Text className="mb-3 text-[14px] font-medium text-[#2B2B2B]">
          Property Type *
        </Text>
        <View className="mb-5 flex-row gap-3">
          <QuoteChoiceCard
            label="Residential"
            selected={propertyType === "Residential"}
            onPress={() => setPropertyType("Residential")}
          />
          <QuoteChoiceCard
            label="Commercial"
            selected={propertyType === "Commercial"}
            onPress={() => setPropertyType("Commercial")}
          />
        </View>

        <Text className="mb-3 text-[14px] font-medium text-[#2B2B2B]">
          Unit Type *
        </Text>
        <View className="flex-row gap-3">
          <View className="w-[48%]">
            <QuoteChoiceCard
              label="House"
              selected={unitType === "House"}
              onPress={() => setUnitType("House")}
            />
          </View>
          <View className="w-[48%]">
            <QuoteChoiceCard
              label="Apartment"
              selected={unitType === "Apartment"}
              onPress={() => setUnitType("Apartment")}
            />
          </View>
        </View>
      </QuoteSectionCard>

      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onNext}
        className="mt-5 h-[56px] items-center justify-center rounded-[14px] bg-[#1F5577]"
      >
        <Text className="text-[16px] font-medium text-white">Next</Text>
      </TouchableOpacity>

      <Modal
        visible={adminSheetVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setAdminSheetVisible(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/35"
          onPress={() => setAdminSheetVisible(false)}
        >
          <Pressable
            className="max-h-[70%] rounded-t-[24px] bg-white px-5 pb-6 pt-4"
            onPress={() => {}}
          >
            <View className="items-center">
              <View className="h-1.5 w-16 rounded-full bg-[#D7DEE7]" />
            </View>

            <Text className="mt-5 text-[18px] font-semibold text-[#1F2937]">
              Select Admin
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 16, paddingBottom: 8 }}
            >
              {adminOptions.map((admin) => {
                const isSelected = selectedAdmin === admin;
                return (
                  <TouchableOpacity
                    key={admin}
                    activeOpacity={0.85}
                    onPress={() => {
                      setSelectedAdmin(admin);
                      setAdminSheetVisible(false);
                    }}
                    className={`mb-3 flex-row items-center justify-between rounded-[14px] border px-4 py-4 ${
                      isSelected ? "border-[#1F5577] bg-[#EEF6FA]" : "border-[#D7DEE7] bg-white"
                    }`}
                  >
                    <Text className={`text-[15px] font-medium ${isSelected ? "text-[#1F5577]" : "text-[#1F2937]"}`}>
                      {admin}
                    </Text>
                    {isSelected ? (
                      <Ionicons name="checkmark-circle" size={20} color="#1F5577" />
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

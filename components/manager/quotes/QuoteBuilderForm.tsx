import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
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
  projectType,
  setProjectType,
  propertyType,
  setPropertyType,
  unitType,
  setUnitType,
  onNext,
}: QuoteBuilderFormProps) {
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
   
        />
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
    </>
  );
}

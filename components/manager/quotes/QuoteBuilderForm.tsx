import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import QuoteChoiceCard from "./QuoteChoiceCard";
import QuoteField from "./QuoteField";
import QuoteSectionCard from "./QuoteSectionCard";
import type {
  QuoteProjectType,
  QuotePropertyType,
  QuoteUnitType,
} from "./quoteMockData";

export type QuoteProjectDetailSelection = QuoteProjectType | QuotePropertyType;

type QuoteBuilderFormProps = {
  clientName: string;
  setClientName: (value: string) => void;
  projectAddress: string;
  setProjectAddress: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  projectDetailSelection: QuoteProjectDetailSelection;
  onSelectProjectDetail: (value: QuoteProjectDetailSelection) => void;
  unitType: QuoteUnitType;
  setUnitType: (value: QuoteUnitType) => void;
  onNext: () => void;
};

export default function QuoteBuilderForm({
  clientName,
  setClientName,
  projectAddress,
  setProjectAddress,
  phoneNumber,
  setPhoneNumber,
  email,
  setEmail,
  projectDetailSelection,
  onSelectProjectDetail,
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
          value={clientName}
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
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <QuoteField
          label="Email"
          placeholder="Enter your mail"
          value={email}
          onChangeText={setEmail}
        />
      </QuoteSectionCard>

      <QuoteSectionCard title="Project Details" icon="home-outline">
        <Text className="mb-3 text-[14px] font-medium text-[#2B2B2B]">
          Project Type *
        </Text>
        <View className="mb-3 flex-row gap-3">
          <QuoteChoiceCard
            label="New Build"
            selected={projectDetailSelection === "New Build"}
            onPress={() => onSelectProjectDetail("New Build")}
          />
          <QuoteChoiceCard
            label="Renovation"
            selected={projectDetailSelection === "Renovation"}
            onPress={() => onSelectProjectDetail("Renovation")}
          />
        </View>

        <View className="mb-5 flex-row gap-3">
          <QuoteChoiceCard
            label="Residential"
            selected={projectDetailSelection === "Residential"}
            onPress={() => onSelectProjectDetail("Residential")}
          />
          <QuoteChoiceCard
            label="Commercial"
            selected={projectDetailSelection === "Commercial"}
            onPress={() => onSelectProjectDetail("Commercial")}
          />
        </View>

        <Text className="mb-3 text-[14px] font-medium text-[#2B2B2B]">
          Unit Type *
        </Text>
        <View className="flex-row flex-wrap gap-3">
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
          <View className="w-[48%]">
            <QuoteChoiceCard
              label="Office"
              selected={unitType === "Office"}
              onPress={() => setUnitType("Office")}
            />
          </View>
          <View className="w-[48%]">
            <QuoteChoiceCard
              label="Hotel"
              selected={unitType === "Hotel"}
              onPress={() => setUnitType("Hotel")}
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

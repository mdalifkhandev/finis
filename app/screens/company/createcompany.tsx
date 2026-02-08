import BackTitleHeader from "@/components/common/BackTitleHeader";
import CompanyAvatarPicker from "@/components/company/createcompany/CompanyAvatarPicker";
import CompanyFormField from "@/components/company/createcompany/CompanyFormField";
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

const avatarUrl =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop";

export default function CreateCompanyRoute() {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const industries = [
    "Construction",
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={16}
      >
        <BackTitleHeader title="Create Company" onBack={() => router.back()} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 28 }}
        >
          <View className="mt-2">
            <CompanyAvatarPicker avatarUrl={avatarUrl} />
          </View>

          <View className="mt-4">
            <CompanyFormField
              placeholder="Company name"
              value={companyName}
              onChangeText={setCompanyName}
            />
          </View>

          <View className="mt-3">
            <CompanyFormField
              placeholder="Select industry"
              value={industry}
              rightIconName="chevron-down"
              onPress={() => setIsIndustryOpen((prev) => !prev)}
            />
            {isIndustryOpen ? (
              <View className="mt-2 rounded-xl border border-[#D1D5DB] bg-white py-1">
                {industries.map((item) => (
                  <TouchableOpacity
                    key={item}
                    activeOpacity={0.85}
                    className="px-4 py-3"
                    onPress={() => {
                      setIndustry(item);
                      setIsIndustryOpen(false);
                    }}
                  >
                    <Text className="text-[15px] text-[#374151]">{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>

          <View className="mt-3">
            <CompanyFormField
              placeholder="Brief description of the company..."
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          <View className="mt-3">
            <CompanyFormField
              placeholder="+1 (555)000-00000"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View className="mt-3">
            <CompanyFormField
              placeholder="abc@company.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View className="mt-3">
            <CompanyFormField
              placeholder="Website link"
              value={website}
              onChangeText={setWebsite}
            />
          </View>

          <View className="mt-3">
            <CompanyFormField
              placeholder="Business address"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.86}
            className="mt-5 h-[52px] items-center justify-center rounded-[14px] bg-[#1D5677]"
          >
            <Text className="text-[16px] font-medium text-[#EAF0F4]">
              Create Company
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

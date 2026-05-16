import BackTitleHeader from "@/components/common/BackTitleHeader";
import CompanyAvatarPicker from "@/components/company/createcompany/CompanyAvatarPicker";
import CompanyFormField from "@/components/company/createcompany/CompanyFormField";
import { useCreateCompanyMutation } from "@/hooks/company/company";
import type { CompanyLogoFile } from "@/types/company.types";
import * as ImagePicker from "expo-image-picker";
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
import { toast } from "sonner-native";

export default function CreateCompanyRoute() {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [revenue, setRevenue] = useState("");
  const [projectLevel, setProjectLevel] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<CompanyLogoFile | null>(null);
  const { createCompany, isPending } = useCreateCompanyMutation();
  const industries = [
    "Construction",
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
  ];

  const handlePickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    const mimeType = asset.mimeType || "image/jpeg";
    const extension = mimeType.split("/")[1] || "jpg";

    setLogoPreview(asset.uri);
    setLogoFile({
      uri: asset.uri,
      name: asset.fileName || `company-logo.${extension}`,
      type: mimeType,
    });
  };

  const handleCreateCompany = async () => {
    const trimmedName = companyName.trim();

    if (
      !trimmedName ||
      !industry ||
      !description.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !website.trim() ||
      !address.trim() ||
      !revenue.trim() ||
      !projectLevel.trim()
    ) {
      toast.error("Please fill in all company details.");
      return;
    }

    if (!logoFile) {
      toast.error("Please select a company logo.");
      return;
    }

    try {
      await createCompany({
        name: trimmedName,
        industry,
        description: description.trim(),
        phone: phone.trim(),
        email: email.trim(),
        website: website.trim(),
        address: address.trim(),
        revenue: revenue.trim(),
        projectLevel: projectLevel.trim(),
        logo: logoFile,
      });

      toast.success("Company created");
      router.back();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create company",
      );
    }
  };

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
            <CompanyAvatarPicker
              avatarUrl={logoPreview}
              onPress={handlePickLogo}
            />
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

          <View className="mt-3">
            <CompanyFormField
              placeholder="Revenue"
              value={revenue}
              onChangeText={setRevenue}
              keyboardType="numeric"
            />
          </View>

          <View className="mt-3">
            <CompanyFormField
              placeholder="Project level"
              value={projectLevel}
              onChangeText={setProjectLevel}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.86}
            onPress={handleCreateCompany}
            disabled={isPending}
            className="mt-5 h-[52px] items-center justify-center rounded-[14px] bg-[#1D5677]"
          >
            <Text className="text-[16px] font-medium text-[#EAF0F4]">
              {isPending ? "Creating..." : "Create Company"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

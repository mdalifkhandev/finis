import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CompanyCard from "@/components/company/CompanyCard";
import { cardShadow } from "@/components/home/styles";

const companies = [
  {
    name: "Summit Construction Ltd.",
    type: "Construction",
    revenue: "$12121212",
    projects: "Intermediate",
    address: "8502 Preston Rd, Inglewood",
    website: "www.Good Boy.com",
  },
  {
    name: "Summit Construction Ltd.",
    type: "Construction",
    revenue: "$12121212",
    projects: "Intermediate",
    address: "8502 Preston Rd, Inglewood",
    website: "www.Good Boy.com",
  },
  {
    name: "Summit Construction Ltd.",
    type: "Construction",
    revenue: "$12121212",
    projects: "Intermediate",
    address: "8502 Preston Rd, Inglewood",
    website: "www.Good Boy.com",
  },
];

export default function Company() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="flex-row items-center justify-between px-5 pt-4">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            className="h-9 w-9 items-center justify-center rounded-full bg-white"
            style={cardShadow}
          >
            <Ionicons name="chevron-back" size={18} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-base font-semibold text-slate-900">Company</Text>
          <View className="h-9 w-9" />
        </View>

        <View className="mt-5 px-5">
          <View className="flex-row items-center rounded-xl border border-slate-200 bg-white px-3 py-2">
            <Ionicons name="search" size={16} color="#94a3b8" />
            <TextInput
              placeholder="Search....."
              placeholderTextColor="#94a3b8"
              className="ml-2 flex-1 text-sm text-slate-700"
            />
          </View>
        </View>

        <View className="mt-2 px-5">
          {companies.map((company, index) => (
            <CompanyCard key={`${company.name}-${index}`} {...company} />
          ))}
        </View>

        <View className="mt-6 px-5">
          <TouchableOpacity
            activeOpacity={0.85}
            className="items-center justify-center rounded-xl bg-[#1f3d5c] py-3"
          >
            <Text className="text-sm font-semibold text-white">
              Create New Company
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

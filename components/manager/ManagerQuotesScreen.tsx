import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const quotes = [
  { company: "BuildCore Supplies", project: "Riverside Tower", amount: "$12,400", status: "Pending Review" },
  { company: "Prime Electrical", project: "Lakeside Plaza", amount: "$8,950", status: "Approved" },
  { company: "Metro Concrete", project: "North Point", amount: "$15,200", status: "Pending Review" },
];

export default function ManagerQuotesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-5 pt-8">
          <Text className="text-[28px] font-semibold text-[#1F2328]">Quotes</Text>
          <Text className="mt-1 text-[15px] text-[#66707B]">Review vendor quotes and pricing approvals.</Text>
        </View>

        <View className="mt-5 px-5 gap-3">
          {quotes.map((quote, index) => (
            <View key={`${quote.company}-${index}`} className="rounded-[16px] border border-[#D6DCE3] bg-white p-4">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-[17px] font-semibold text-[#1F2328]">{quote.company}</Text>
                  <Text className="mt-1 text-[14px] text-[#66707B]">{quote.project}</Text>
                </View>
                <View className="rounded-[10px] bg-[#E8F0F8] px-3 py-2">
                  <Text className="text-[13px] font-medium text-[#1F5577]">{quote.status}</Text>
                </View>
              </View>

              <Text className="mt-4 text-[24px] font-semibold text-[#1F5577]">{quote.amount}</Text>

              <View className="mt-4 flex-row gap-3">
                <TouchableOpacity className="h-[46px] flex-1 items-center justify-center rounded-[12px] border border-[#D6DCE3] bg-white" activeOpacity={0.85}>
                  <Text className="text-[15px] font-medium text-[#1F2328]">Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity className="h-[46px] flex-1 items-center justify-center rounded-[12px] bg-[#1E5371]" activeOpacity={0.85}>
                  <Text className="text-[15px] font-medium text-white">Approve</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View className="mt-6 px-5">
          <TouchableOpacity className="h-[52px] flex-row items-center justify-center rounded-[12px] bg-[#1E5371]" activeOpacity={0.85}>
            <Ionicons name="add" size={20} color="#F4F8FA" />
            <Text className="ml-2 text-[16px] font-medium text-[#F4F8FA]">Create Quote Request</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

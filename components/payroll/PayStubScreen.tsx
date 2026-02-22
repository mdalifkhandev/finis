import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackTitleHeader from "../common/BackTitleHeader";
import { PAY_PERIOD_LABEL, getPayStubData, payrollWorkerMocks } from "./payrollData";
import { formatCurrency } from "./utils";

export default function PayStubScreen() {
  const { workerId } = useLocalSearchParams<{ workerId?: string }>();

  const worker = useMemo(
    () => payrollWorkerMocks.find((item) => item.id === workerId) || payrollWorkerMocks[0],
    [workerId]
  );

  const stub = useMemo(() => getPayStubData(), []);

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <BackTitleHeader title="Pay Stub" onBack={() => router.back()} />

        <View className="mt-4 px-4">
          <View className="rounded-[12px] border border-[#E3E6EA] bg-white p-4">
            <Text className="text-center text-[40px] font-medium text-[#101828]" style={{ fontSize: 40 / 2 }}>
              {worker.name}
            </Text>
            <Text className="mt-1 text-center text-[16px] text-[#475467]">{worker.role}</Text>
            <Text className="mt-1 text-center text-[12px] text-[#667085]">Pay Period: {PAY_PERIOD_LABEL}</Text>

            <View className="my-3 h-px bg-[#E6E8EB]" />

            <View className="gap-y-2.5">
              <View className="flex-row items-center justify-between">
                <Text className="text-[15px] text-[#475467]">Regular Hours ({stub.regularHours})</Text>
                <Text className="text-[15px] font-medium text-[#101828]">{formatCurrency(worker.total)}</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-[15px] text-[#475467]">Overtime Hours ({stub.overtimeHours})</Text>
                <Text className="text-[15px] font-medium text-[#101828]">{formatCurrency(540)}</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-[15px] text-[#475467]">Site Allowance</Text>
                <Text className="text-[15px] font-medium text-[#101828]">{formatCurrency(stub.siteAllowance)}</Text>
              </View>
            </View>

            <View className="my-3 h-px bg-[#E6E8EB]" />

            <View className="flex-row items-center justify-between">
              <Text className="text-[16px] font-medium text-[#101828]">Gross Pay</Text>
              <Text className="text-[16px] font-medium text-[#101828]">{formatCurrency(stub.grossPay)}</Text>
            </View>

            <View className="mt-3 rounded-[10px] bg-[#F7F8FA] px-3 py-3">
              <Text className="text-[16px] font-medium text-[#101828]">Deductions</Text>

              {stub.deductions.map((item) => (
                <View key={item.label} className="mt-2 flex-row items-center justify-between">
                  <Text className="text-[15px] text-[#475467]">{item.label}</Text>
                  <Text className="text-[15px] font-medium text-[#101828]">{formatCurrency(item.amount)}</Text>
                </View>
              ))}

              <View className="my-2.5 h-px bg-[#E6E8EB]" />

              <View className="flex-row items-center justify-between">
                <Text className="text-[16px] font-medium text-[#101828]">Total Deductions</Text>
                <Text className="text-[16px] font-medium text-[#101828]">{formatCurrency(stub.totalDeductions)}</Text>
              </View>
            </View>

            <View className="mt-4 rounded-[10px] bg-[#1F5577] px-4 py-4">
              <Text className="text-center text-[16px] text-[#EAF1F5]">Net Pay</Text>
              <Text className="mt-1 text-center text-[56px] font-medium text-[#EAF1F5]" style={{ fontSize: 56 / 2 }}>
                {formatCurrency(stub.netPay)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.86}
            className="mt-4 h-12 flex-row items-center justify-center rounded-[10px] bg-[#1F5577]"
          >
            <Ionicons name="download-outline" size={20} color="#FFFFFF" />
            <Text className="ml-2 text-[16px] font-medium text-white">Download Pay Stub</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

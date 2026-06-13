import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAdminPayStubQuery } from "@/hooks/admin/payroll";
import BackTitleHeader from "../common/BackTitleHeader";
import { formatCurrency } from "./utils";

export default function PayStubScreen() {
  const { payrollId } = useLocalSearchParams<{ payrollId?: string }>();
  const { data: stub } = useAdminPayStubQuery(payrollId);

  const hourlyRate = Number(stub?.worker.hourlyRate ?? 0);
  const regularHours = stub?.earnings.regularHours ?? 0;
  const overtimeHours = stub?.earnings.overtimeHours ?? 0;
  const regularPay = stub?.earnings.regularPay ?? 0;
  const overtimePay = stub?.earnings.overtimePay ?? 0;
  const grossPay = stub?.earnings.grossPay ?? 0;
  const deductions = stub?.deductions.totalDeductions ?? 0;
  const netPay = useMemo(
    () => Math.max(0, Math.round((grossPay - deductions) * 100) / 100),
    [grossPay, deductions],
  );
  const payPeriodLabel = stub?.payPeriod.start
    ? new Date(stub.payPeriod.start).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "This week";

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <BackTitleHeader title="Pay Stub" onBack={() => router.back()} />

        <View className="mt-4 px-4">
          <View className="rounded-[12px] border border-[#E3E6EA] bg-white p-4">
            <View className="items-center">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-[#1F5577]">
                <Text className="text-[24px] font-semibold text-white">
                  {stub?.worker.fullName?.charAt(0)?.toUpperCase() || "W"}
                </Text>
              </View>
              <Text className="mt-3 text-center text-[20px] font-semibold text-[#101828]">
                {stub?.worker.fullName || "Worker"}
              </Text>
              <Text className="mt-1 text-center text-[14px] text-[#475467]">
                {stub?.worker.department || "Worker"}
              </Text>
              <Text className="mt-1 text-center text-[12px] text-[#667085]">
                Pay Period: {payPeriodLabel}
              </Text>
            </View>

            <View className="my-3 h-px bg-[#E6E8EB]" />

            <View className="gap-y-2.5">
              <View className="flex-row items-center justify-between">
                <Text className="text-[15px] text-[#475467]">
                  Regular Hours ({regularHours.toFixed(2)})
                </Text>
                <Text className="text-[15px] font-medium text-[#101828]">
                  {formatCurrency(regularPay)}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-[15px] text-[#475467]">
                  Overtime Hours ({overtimeHours.toFixed(2)})
                </Text>
                <Text className="text-[15px] font-medium text-[#101828]">
                  {formatCurrency(overtimePay)}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-[15px] text-[#475467]">
                  Hourly Rate
                </Text>
                <Text className="text-[15px] font-medium text-[#101828]">
                  {formatCurrency(hourlyRate)}
                </Text>
              </View>
            </View>

            <View className="my-3 h-px bg-[#E6E8EB]" />

            <View className="flex-row items-center justify-between">
              <Text className="text-[16px] font-medium text-[#101828]">
                Gross Pay
              </Text>
              <Text className="text-[16px] font-medium text-[#101828]">
                {formatCurrency(grossPay)}
              </Text>
            </View>

            <View className="mt-3 rounded-[10px] bg-[#F7F8FA] px-3 py-3">
              <Text className="text-[16px] font-medium text-[#101828]">
                Deductions
              </Text>

              <View className="mt-2 flex-row items-center justify-between">
                <Text className="text-[15px] text-[#475467]">Estimated Tax</Text>
                <Text className="text-[15px] font-medium text-[#101828]">
                  {formatCurrency(deductions)}
                </Text>
              </View>

              <View className="my-2.5 h-px bg-[#E6E8EB]" />

              <View className="flex-row items-center justify-between">
                <Text className="text-[16px] font-medium text-[#101828]">
                  Total Deductions
                </Text>
                <Text className="text-[16px] font-medium text-[#101828]">
                  {formatCurrency(deductions)}
                </Text>
              </View>
            </View>

            <View className="mt-4 rounded-[10px] bg-[#1F5577] px-4 py-4">
              <Text className="text-center text-[16px] text-[#EAF1F5]">
                Net Pay
              </Text>
              <Text
                className="mt-1 text-center text-[56px] font-medium text-[#EAF1F5]"
                style={{ fontSize: 56 / 2 }}
              >
                {formatCurrency(netPay)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.86}
            className="mt-4 h-12 flex-row items-center justify-center rounded-[10px] bg-[#1F5577]"
          >
            <Ionicons name="download-outline" size={20} color="#FFFFFF" />
            <Text className="ml-2 text-[16px] font-medium text-white">
              Download Pay Stub
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

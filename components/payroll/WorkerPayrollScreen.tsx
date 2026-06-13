import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackTitleHeader from "../common/BackTitleHeader";
import PayrollCalendarCard from "./PayrollCalendarCard";
import { useWorkerProfileQuery } from "@/hooks/profile/profile";
import { useTodayAttendanceQuery } from "@/hooks/worker/attendance";
import { formatCurrency } from "./utils";

function parseHourlyRate(value: string | null | undefined) {
  const numericRate = Number(value);
  return Number.isFinite(numericRate) ? numericRate : 0;
}

export default function WorkerPayrollScreen() {
  const [monthDate, setMonthDate] = useState(new Date(2024, 8, 1));
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 8, 27));
  const { data: profile } = useWorkerProfileQuery();
  const { data: attendance } = useTodayAttendanceQuery();

  const hourlyRate = useMemo(() => parseHourlyRate(profile?.hourlyRate), [profile?.hourlyRate]);
  const totalHours = attendance?.totalHours ?? 0;
  const estimatedGrossPay = useMemo(() => Math.round(totalHours * hourlyRate * 100) / 100, [hourlyRate, totalHours]);
  const estimatedDeductions = useMemo(() => Math.round(estimatedGrossPay * 0.18 * 100) / 100, [estimatedGrossPay]);
  const estimatedNetPay = useMemo(
    () => Math.max(0, Math.round((estimatedGrossPay - estimatedDeductions) * 100) / 100),
    [estimatedGrossPay, estimatedDeductions],
  );
  const currentSessions = attendance?.sessions?.slice(0, 2) ?? [];

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
        <BackTitleHeader title="Payroll" onBack={() => router.back()} />

        <View className="mt-4 px-4">
          <View className="rounded-[24px] border border-[#1F5577] bg-[#C9E7FB] px-4 py-4">
            <Text className="text-[16px] font-semibold text-[#101828]">
              This week’s savings
            </Text>
            <View className="mt-4 rounded-[20px] bg-white px-4 py-5">
              <Text className="text-center text-[32px] font-semibold text-[#101828]">
                {formatCurrency(estimatedNetPay)}
              </Text>
              <TouchableOpacity activeOpacity={0.8} onPress={() => router.push("/screens/payroll/paystub")} className="mt-4">
                <Text className="text-center text-[16px] font-medium text-[#1F5577]">
                  See Transactions
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-4 overflow-hidden rounded-[20px] border border-[#E1E5EA] bg-white px-3 py-3">
            <PayrollCalendarCard
              monthDate={monthDate}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onMonthDateChange={setMonthDate}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => router.push("/screens/payroll/paystub")}
            className="mt-3 h-[56px] items-center justify-center rounded-[14px] bg-[#1F5577]"
          >
            <Text className="text-[16px] font-medium text-white">View Payroll Summary</Text>
          </TouchableOpacity>

          <View className="mt-4">
            <Text className="text-[18px] font-medium text-[#101828]">
              Scheduled Activities
            </Text>

            <View className="mt-3 rounded-[14px] border border-[#E9EDF1] bg-white px-4 py-4">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <View className="flex-row items-center self-start rounded-[6px] bg-[#EAF7EF] px-3 py-1">
                    <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
                    <Text className="ml-2 text-[12px] font-medium text-[#14803C]">
                      Work Approve
                    </Text>
                  </View>
                  <Text className="mt-4 text-[20px] font-medium text-[#101828]">
                    {profile?.fullName || "Worker"}
                  </Text>
                  <Text className="mt-2 text-[14px] text-[#98A2B3]">
                    Redesign existing website
                  </Text>

                  <View className="mt-4 flex-row items-center justify-between">
                    <Text className="text-[14px] text-[#667085]">
                      {currentSessions.length > 0 ? `${currentSessions.length}/3` : "3/3"}
                    </Text>
                    <Text className="text-[14px] text-[#667085]">
                      {Math.round(((attendance?.totalHours ?? 0) / 8) * 100) || 100}%
                    </Text>
                  </View>

                  <View className="mt-2 h-1.5 rounded-full bg-[#EAF6EE]">
                    <View
                      className="h-1.5 rounded-full bg-[#4ADE80]"
                      style={{
                        width: `${Math.min(100, Math.round(((attendance?.totalHours ?? 0) / 8) * 100))}%`,
                      }}
                    />
                  </View>

                  <View className="mt-4 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="flex-row">
                        <View className="-mr-2 h-8 w-8 rounded-full bg-[#D9E6F8]" />
                        <View className="-mr-2 h-8 w-8 rounded-full bg-[#AFC4E8]" />
                        <View className="-mr-2 h-8 w-8 rounded-full bg-[#6EA8FE]" />
                      </View>
                      <View className="ml-1 rounded-full bg-[#EAF2FF] px-3 py-2">
                        <Text className="text-[13px] font-medium text-[#1F3D5C]">
                          10+ Assign
                        </Text>
                      </View>
                    </View>

                    <Text className="text-[13px] text-[#667085]">
                      {formatCurrency(estimatedNetPay)}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity activeOpacity={0.8} className="pt-1">
                  <Ionicons name="ellipsis-horizontal" size={18} color="#98A2B3" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="mt-3 rounded-[14px] border border-[#E9EDF1] bg-white px-4 py-4">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <View className="flex-row items-center self-start rounded-[6px] bg-[#EAF7EF] px-3 py-1">
                    <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
                    <Text className="ml-2 text-[12px] font-medium text-[#14803C]">
                      Work Approve
                    </Text>
                  </View>
                  <Text className="mt-4 text-[20px] font-medium text-[#101828]">
                    {profile?.department || "Worker"}
                  </Text>
                  <Text className="mt-2 text-[14px] text-[#98A2B3]">
                    Attendance tracked this week
                  </Text>

                  <View className="mt-4 flex-row items-center justify-between">
                    <Text className="text-[14px] text-[#667085]">
                      {currentSessions.length > 0 ? `${currentSessions.length}/3` : "3/3"}
                    </Text>
                    <Text className="text-[14px] text-[#667085]">
                      {Math.round(((attendance?.totalHours ?? 0) / 8) * 100) || 100}%
                    </Text>
                  </View>

                  <View className="mt-2 h-1.5 rounded-full bg-[#EAF6EE]">
                    <View
                      className="h-1.5 rounded-full bg-[#4ADE80]"
                      style={{
                        width: `${Math.min(100, Math.round(((attendance?.totalHours ?? 0) / 8) * 100))}%`,
                      }}
                    />
                  </View>

                  <View className="mt-4 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="flex-row">
                        <View className="-mr-2 h-8 w-8 rounded-full bg-[#D9E6F8]" />
                        <View className="-mr-2 h-8 w-8 rounded-full bg-[#AFC4E8]" />
                        <View className="-mr-2 h-8 w-8 rounded-full bg-[#6EA8FE]" />
                      </View>
                      <View className="ml-1 rounded-full bg-[#EAF2FF] px-3 py-2">
                        <Text className="text-[13px] font-medium text-[#1F3D5C]">
                          10+ Assign
                        </Text>
                      </View>
                    </View>

                    <Text className="text-[13px] text-[#667085]">
                      {formatCurrency(estimatedGrossPay)}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity activeOpacity={0.8} className="pt-1">
                  <Ionicons name="ellipsis-horizontal" size={18} color="#98A2B3" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

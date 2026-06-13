import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackTitleHeader from "../common/BackTitleHeader";
import PayrollCalendarCard from "./PayrollCalendarCard";
import ScheduledActivityCard from "./ScheduledActivityCard";
import { useWorkerProfileQuery } from "@/hooks/profile/profile";
import { useTodayAttendanceQuery } from "@/hooks/worker/attendance";
import { formatCurrency } from "./utils";

function parseHourlyRate(value: string | null | undefined) {
  const numericRate = Number(value);
  return Number.isFinite(numericRate) ? numericRate : 0;
}

export default function SchedulingPayrollScreen() {
  const [monthDate, setMonthDate] = useState(new Date(2024, 8, 1));
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 8, 27));
  const { data: profile } = useWorkerProfileQuery();
  const { data: attendance } = useTodayAttendanceQuery();

  const hourlyRate = useMemo(
    () => parseHourlyRate(profile?.hourlyRate),
    [profile?.hourlyRate],
  );
  const totalHours = attendance?.totalHours ?? 0;
  const estimatedGrossPay = useMemo(
    () => Math.round(totalHours * hourlyRate * 100) / 100,
    [hourlyRate, totalHours],
  );
  const estimatedDeductions = useMemo(
    () => Math.round(estimatedGrossPay * 0.18 * 100) / 100,
    [estimatedGrossPay],
  );
  const estimatedNetPay = useMemo(
    () => Math.max(0, Math.round((estimatedGrossPay - estimatedDeductions) * 100) / 100),
    [estimatedGrossPay, estimatedDeductions],
  );
  const attendanceLabel =
    attendance?.status === "clocked_in"
      ? "Clocked in today"
      : attendance?.status === "clocked_out"
        ? "Clocked out today"
        : "No attendance record today";

  const activities = useMemo(() => {
    const sessions = attendance?.sessions ?? [];

    if (sessions.length === 0) {
      return [
        {
          id: "payroll-empty",
          title: "No recent attendance",
          dateLabel: "Today",
          workersLabel: "Attendance will appear here",
        },
      ];
    }

    return sessions.map((session, index) => ({
      id: session.id,
      title: index === 0 ? "Current pay session" : "Completed pay session",
      dateLabel: new Date(session.checkInTime).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      workersLabel: `${session.hoursWorked ?? 0} hrs logged`,
    }));
  }, [attendance?.sessions]);

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 96 }}
      >
        <BackTitleHeader
          title="Scheduling & Payroll"
          onBack={() => router.back()}
        />

        <View className="mt-4 px-4">
          <View className="rounded-[18px] border border-[#1F5577] bg-[#B9DCF3] px-4 py-4 mb-3">
            <Text className="text-[15px] font-semibold text-[#101828]">
              This month’s savings
            </Text>
            <View className="mt-3 rounded-[16px] bg-white px-4 py-5">
              <Text className="text-center text-[30px] font-semibold text-[#101828]">
                {formatCurrency(estimatedNetPay)}
              </Text>
              <Text className="mt-2 text-center text-[15px] text-[#1F5577]">
                Estimated worker payout
              </Text>
            </View>
          </View>

          <PayrollCalendarCard
            monthDate={monthDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onMonthDateChange={setMonthDate}
          />

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => router.push("/screens/payroll/paystub")}
            className="mt-3 h-[56px] items-center justify-center rounded-[12px] bg-[#1F5577]"
          >
            <Text className="text-[16px] font-medium text-white">
              View Payroll Summary
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-3 px-4">
          <View className="mb-2 rounded-[14px] bg-white px-4 py-3">
            <Text className="text-[14px] text-[#667085]">Worker</Text>
            <Text className="mt-1 text-[18px] font-semibold text-[#101828]">
              {profile?.fullName || "Worker"}
            </Text>
            <Text className="mt-1 text-[13px] text-[#667085]">
              {attendanceLabel}
            </Text>
          </View>

          <Text className="text-[32px] font-medium text-[#101828]" style={{ fontSize: 32 / 2 }}>
            Scheduled Activities
          </Text>

          {activities.map((item) => (
            <ScheduledActivityCard key={item.id} activity={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

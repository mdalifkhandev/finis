import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackTitleHeader from "../common/BackTitleHeader";
import PayrollCalendarCard from "./PayrollCalendarCard";
import ScheduledActivityCard from "./ScheduledActivityCard";
import { useAdminWorkerSummaryQuery } from "@/hooks/admin/payroll";
import type { ActivityItem } from "./types";

export default function SchedulingPayrollScreen() {
  const [monthDate, setMonthDate] = useState(new Date(2024, 8, 1));
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 8, 27));
  const { data } = useAdminWorkerSummaryQuery();

  const activities = useMemo<ActivityItem[]>(() => {
    return (
      data?.projects?.map((project) => ({
        id: project.projectId,
        title: project.projectName,
        dateLabel: new Date(project.endDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        workersLabel: `${project.workerCount} workers • ${project.teamMemberCount} team members`,
      })) ?? []
    );
  }, [data?.projects]);

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 96 }}
      >
        <BackTitleHeader
          title="Scheduling & Payroll"
          onBack={() => router.back()}
        />

        <View className="mt-4 px-4">
          <PayrollCalendarCard
            monthDate={monthDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onMonthDateChange={setMonthDate}
          />

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => router.push("/screens/payroll/summary")}
            className="mt-3 h-[56px] items-center justify-center rounded-[12px] bg-[#1F5577]"
          >
            <Text className="text-[16px] font-medium text-white">
              View Payroll Summary
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-3 px-4">
          <Text
            className="text-[32px] font-medium text-[#101828]"
            style={{ fontSize: 32 / 2 }}
          >
            Scheduled Activities
          </Text>

          {activities.length > 0 ? (
            activities.map((item) => (
              <ScheduledActivityCard key={item.id} activity={item} />
            ))
          ) : (
            <View className="mt-3 rounded-[12px] border border-[#E3E6EA] bg-white px-4 py-4">
              <Text className="text-[14px] text-[#667085]">
                No scheduled activities found.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

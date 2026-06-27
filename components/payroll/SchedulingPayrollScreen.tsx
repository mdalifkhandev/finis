import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackTitleHeader from "../common/BackTitleHeader";
import PayrollCalendarCard, { type PayrollCalendarMode } from "./PayrollCalendarCard";
import ScheduledActivityCard from "./ScheduledActivityCard";
import { useAdminWorkerSummaryQuery } from "@/hooks/admin/payroll";
import type { ActivityItem } from "./types";

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function mapPeriodModeToBackendRange(mode: PayrollCalendarMode) {
  if (mode === "weekly") return "weekly";
  if (mode === "biweekly") return "bi-weekly";
  if (mode === "monthly") return "monthly";
  if (mode === "bimonthly") return "bi-monthly";
  return "custom";
}

export default function SchedulingPayrollScreen() {
  const [monthDate, setMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRangeEnd, setSelectedRangeEnd] = useState<Date | null>(null);
  const [periodMode, setPeriodMode] = useState<PayrollCalendarMode>("custom");
  const { data, refetch } = useAdminWorkerSummaryQuery();
  const [refreshing, setRefreshing] = useState(false);
  const summaryAnchorDate = selectedDate ?? new Date();
  const summaryStartDate = selectedDate ?? summaryAnchorDate;
  const summaryEndDate = selectedRangeEnd ?? summaryStartDate;
  const backendRange = mapPeriodModeToBackendRange(periodMode);

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

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return (
    <SafeAreaView edges={['top','left',"right"]} className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 96 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <BackTitleHeader
          title="Scheduling & Payroll"
          onBack={() => router.back()}
        />

        <View className="mt-4 px-4">
          <PayrollCalendarCard
            monthDate={monthDate}
            selectedDate={selectedDate}
            periodMode={periodMode}
            selectedRangeEnd={selectedRangeEnd}
            onSelectDate={(date) => setSelectedDate(date)}
            onSelectRangeEnd={setSelectedRangeEnd}
            onMonthDateChange={setMonthDate}
            onPeriodModeChange={(mode) => {
              setPeriodMode(mode);
              setSelectedDate(null);
              setSelectedRangeEnd(null);
            }}
          />

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() =>
              router.push({
                pathname: "/screens/payroll/summary",
                params: {
                  date: formatLocalDate(summaryAnchorDate),
                  range: backendRange,
                  startDate: formatLocalDate(summaryStartDate),
                  endDate: formatLocalDate(summaryEndDate),
                },
              })
            }
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

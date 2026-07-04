import { useAuthStore } from "@/store/auth.store";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ReportType = {
  key: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const REPORT_TYPES: ReportType[] = [
  {
    key: "payroll",
    title: "Payroll Reports",
    subtitle: "Worker payslips and tax deductions",
    icon: "cash-outline",
  },
  {
    key: "invoices",
    title: "Project Invoices",
    subtitle: "Client billing and project budgets",
    icon: "receipt-outline",
  },
  {
    key: "performance",
    title: "Worker Performance",
    subtitle: "Attendance scores and task completion",
    icon: "trending-up-outline",
  },
  {
    key: "expense",
    title: "Expense Reports",
    subtitle: "Reimbursements and tool costs",
    icon: "wallet-outline",
  },
];

const FREQUENCY_OPTIONS = [
  "Daily Summary",
  "Weekly Summary",
  "Monthly Summary",
  "Quarterly Summary",
  "Yearly Summary",
];

function formatDate(date: Date) {
  return date
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}

export default function ReportScreen() {
  const role = useAuthStore((state) => state.user?.role);
  const isAdmin = role === "admin";

  const [selectedType, setSelectedType] = useState<string>("payroll");
  const [frequency, setFrequency] = useState<string>("Daily Summary");
  const [frequencyOpen, setFrequencyOpen] = useState(false);

  const now = new Date();
  const [startDate, setStartDate] = useState<Date>(now);
  const [endDate, setEndDate] = useState<Date>(
    new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
  );
  const [pickerTarget, setPickerTarget] = useState<"start" | "end" | null>(null);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (event.type === "dismissed" || !selectedDate || !pickerTarget) {
      setPickerTarget(null);
      return;
    }
    if (pickerTarget === "start") {
      setStartDate(selectedDate);
    } else {
      setEndDate(selectedDate);
    }
    setPickerTarget(null);
  };

  if (!isAdmin) {
    return (
      <SafeAreaView
        edges={["top", "left", "right"]}
        className="flex-1 bg-[#E9EDF1]"
      >
        <View className="flex-row items-center px-5 pt-2">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.8}
            className="h-6 w-6 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color="#2B2B2B" />
          </TouchableOpacity>
        </View>
        <View className="mt-16 items-center px-8">
          <Ionicons name="lock-closed-outline" size={28} color="#94A3B8" />
          <Text className="mt-3 text-center text-[14px] text-[#64748B]">
            Reports are only available to admins.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-2">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.8}
          className="h-6 w-6 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="#2B2B2B" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[18px] font-semibold text-[#111827]">
          Reports &amp; Analytics
        </Text>
        <View className="h-6 w-6" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 36 }}
      >
        <Text className="text-[14px] leading-5 text-[#6B7280]">
          Generate comprehensive insights for your organization.
        </Text>

        {/* Action buttons */}
        <View className="mt-4 flex-row gap-3">
          <TouchableOpacity
            activeOpacity={0.85}
            className="h-[46px] flex-1 flex-row items-center justify-center rounded-[12px] border border-[#1D5478] bg-white"
          >
            <Ionicons name="calendar-outline" size={16} color="#1D5478" />
            <Text className="ml-2 text-[14px] font-semibold text-[#1D5478]">
              Schedule
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            className="h-[46px] flex-1 flex-row items-center justify-center rounded-[12px] bg-[#1D5478]"
          >
            <Ionicons name="download-outline" size={16} color="#FFFFFF" />
            <Text className="ml-2 text-[14px] font-semibold text-white">
              Export All
            </Text>
          </TouchableOpacity>
        </View>

        {/* Report Type */}
        <Text className="mb-3 mt-6 text-[16px] font-semibold text-[#111827]">
          Report Type
        </Text>

        <View className="gap-3">
          {REPORT_TYPES.map((type) => {
            const active = selectedType === type.key;
            return (
              <TouchableOpacity
                key={type.key}
                activeOpacity={0.85}
                onPress={() => setSelectedType(type.key)}
                className={`flex-row items-center rounded-[14px] border px-4 py-4 ${
                  active
                    ? "border-l-4 border-[#1D5478] bg-[#EAF3FA]"
                    : "border-[#EDF1F5] bg-white"
                }`}
                style={
                  active
                    ? undefined
                    : {
                        shadowColor: "#0F172A",
                        shadowOpacity: 0.05,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 3 },
                        elevation: 2,
                      }
                }
              >
                <View
                  className="h-10 w-10 items-center justify-center rounded-[12px]"
                  style={{ backgroundColor: active ? "#D8E7F3" : "#F1F5F9" }}
                >
                  <Ionicons
                    name={type.icon}
                    size={20}
                    color={active ? "#1D5478" : "#64748B"}
                  />
                </View>
                <View className="ml-3 flex-1">
                  <Text
                    className={`text-[15px] font-semibold ${
                      active ? "text-[#1D5478]" : "text-[#111827]"
                    }`}
                  >
                    {type.title}
                  </Text>
                  <Text className="mt-0.5 text-[13px] leading-4 text-[#6B7280]">
                    {type.subtitle}
                  </Text>
                </View>
                {active ? (
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={22}
                    color="#1D5478"
                  />
                ) : (
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Report Parameters */}
        <View className="mt-6 rounded-[16px] border-l-4 border-[#1D5478] bg-white px-4 py-4">
          <Text className="text-[16px] font-semibold text-[#111827]">
            Report Parameters
          </Text>

          {/* Period Frequency */}
          <Text className="mb-2 mt-4 text-[12px] font-semibold tracking-[1px] text-[#6B7280]">
            PERIOD FREQUENCY
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setFrequencyOpen(true)}
            className="h-[48px] flex-row items-center justify-between rounded-[12px] border border-[#E5EAF0] bg-[#F8FAFC] px-4"
          >
            <Text className="text-[15px] text-[#334155]">{frequency}</Text>
            <Ionicons name="chevron-down" size={18} color="#64748B" />
          </TouchableOpacity>

          {/* Dates */}
          <View className="mt-4 flex-row gap-3">
            <View className="flex-1">
              <Text className="mb-2 text-[12px] font-semibold tracking-[1px] text-[#6B7280]">
                START DATE
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setPickerTarget("start")}
                className="h-[48px] flex-row items-center justify-between rounded-[12px] border border-[#E5EAF0] bg-[#F8FAFC] px-3"
              >
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={16} color="#1D5478" />
                  <Text className="ml-2 text-[13px] text-[#334155]">
                    {formatDate(startDate)}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View className="flex-1">
              <Text className="mb-2 text-[12px] font-semibold tracking-[1px] text-[#6B7280]">
                END DATE
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setPickerTarget("end")}
                className="h-[48px] flex-row items-center justify-between rounded-[12px] border border-[#E5EAF0] bg-[#F8FAFC] px-3"
              >
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={16} color="#1D5478" />
                  <Text className="ml-2 text-[13px] text-[#334155]">
                    {formatDate(endDate)}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={16} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Generate */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/screens/profile/reportresult",
                params: {
                  type: selectedType,
                  frequency,
                  startDate: startDate.toISOString(),
                  endDate: endDate.toISOString(),
                },
              })
            }
            className="mt-4 h-[48px] flex-row items-center justify-center rounded-[12px] bg-[#1D5478]"
          >
            <Ionicons name="bar-chart-outline" size={18} color="#FFFFFF" />
            <Text className="ml-2 text-[15px] font-semibold text-white">
              Generate Report
            </Text>
          </TouchableOpacity>
        </View>

        {/* Empty state */}
        <View
          className="mt-5 items-center rounded-[16px] border border-dashed border-[#CBD5E1] px-6 py-10"
          style={{ backgroundColor: "#FCFDFE" }}
        >
          <View className="h-14 w-14 items-center justify-center rounded-full bg-[#F1F5F9]">
            <Ionicons name="document-outline" size={26} color="#94A3B8" />
          </View>
          <Text className="mt-4 text-[15px] font-semibold text-[#334155]">
            No Report Generated
          </Text>
          <Text className="mt-1 text-center text-[13px] leading-5 text-[#6B7280]">
            Select your report parameters above and click &apos;Generate
            Report&apos; to view analytics.
          </Text>
        </View>
      </ScrollView>

      {/* Frequency dropdown modal */}
      <Modal
        visible={frequencyOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setFrequencyOpen(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/30"
          onPress={() => setFrequencyOpen(false)}
        >
          <Pressable
            className="rounded-t-[24px] bg-white px-5 pb-8 pt-4"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="mb-2 items-center">
              <View className="h-1 w-10 rounded-full bg-[#E2E8F0]" />
            </View>
            <Text className="mb-2 text-[16px] font-semibold text-[#111827]">
              Period Frequency
            </Text>
            {FREQUENCY_OPTIONS.map((option) => {
              const active = option === frequency;
              return (
                <TouchableOpacity
                  key={option}
                  activeOpacity={0.85}
                  onPress={() => {
                    setFrequency(option);
                    setFrequencyOpen(false);
                  }}
                  className="flex-row items-center justify-between border-b border-[#F1F5F9] py-4"
                >
                  <Text
                    className={`text-[15px] ${
                      active
                        ? "font-semibold text-[#1D5478]"
                        : "text-[#334155]"
                    }`}
                  >
                    {option}
                  </Text>
                  {active ? (
                    <Ionicons name="checkmark" size={18} color="#1D5478" />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Date picker */}
      {pickerTarget ? (
        <DateTimePicker
          value={pickerTarget === "start" ? startDate : endDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      ) : null}
    </SafeAreaView>
  );
}

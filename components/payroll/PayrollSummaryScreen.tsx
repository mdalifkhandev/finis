import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackTitleHeader from "../common/BackTitleHeader";
import PayrollStatCard from "./PayrollStatCard";
import WorkerPayrollCard from "./WorkerPayrollCard";
import { payrollWorkerMocks } from "./payrollData";

export default function PayrollSummaryScreen() {
  const [workers, setWorkers] = useState(payrollWorkerMocks);

  const pendingCount = useMemo(
    () => workers.filter((item) => item.status === "Pending").length,
    [workers]
  );

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <BackTitleHeader title="Payroll Summary" onBack={() => router.back()} />

        <View className="mt-4 px-4">
          <View className="flex-row justify-between">
            <PayrollStatCard value="56" label="Total Hours" />
            <PayrollStatCard value="$29.3K" label="Total Pay" />
          </View>

          <View className="mt-3 flex-row justify-between">
            <PayrollStatCard value={String(pendingCount)} label="Pending" />
            <PayrollStatCard value="85" label="Inventory Alerts" />
          </View>
        </View>

        <View className="mt-4 flex-row items-center justify-between px-4">
          <Text className="text-[16px] font-medium text-[#101828]">Workers ({workers.length})</Text>
          <TouchableOpacity activeOpacity={0.8}>
            <Text className="text-[13px] text-[#1F5577]">Export</Text>
          </TouchableOpacity>
        </View>

        <View className="px-4">
          {workers.map((worker) => (
            <WorkerPayrollCard
              key={worker.id}
              worker={worker}
              onViewStub={() =>
                router.push({
                  pathname: "/screens/payroll/paystub",
                  params: { workerId: worker.id },
                })
              }
              onApprove={() => {
                setWorkers((prev) =>
                  prev.map((item) =>
                    item.id === worker.id ? { ...item, status: "Approved" } : item
                  )
                );
              }}
            />
          ))}

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => {
              setWorkers((prev) =>
                prev.map((item) => ({
                  ...item,
                  status: "Approved",
                }))
              );
            }}
            className="mb-8 mt-3 h-12 items-center justify-center rounded-[10px] bg-[#1F5577]"
          >
            <Text className="text-[16px] font-medium text-white">Process payroll</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

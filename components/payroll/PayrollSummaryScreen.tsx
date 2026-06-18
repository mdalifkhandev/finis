import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import {
  useUpdateAdminPayrollMutation,
  useAdminPayrollSummaryQuery,
  useAdminPayrollOverviewQuery,
  useApproveAdminPayrollMutation,
} from "@/hooks/admin/payroll";
import BackTitleHeader from "../common/BackTitleHeader";
import EditPayrollRateSheet from "./EditPayrollRateSheet";
import PayrollStatCard from "./PayrollStatCard";
import WorkerPayrollCard from "./WorkerPayrollCard";
import { formatCurrency } from "./utils";
import type { WorkerPayroll } from "./types";
import type { AdminPayrollSummaryWorker } from "@/api/admin/payroll.api";

export default function PayrollSummaryScreen() {
  const { date } = useLocalSearchParams<{ date?: string | string[] }>();
  const selectedDate = Array.isArray(date) ? date[0] : date;
  const { data } = useAdminPayrollSummaryQuery({ date: selectedDate });
  const { data: overview } = useAdminPayrollOverviewQuery();
  const approvePayroll = useApproveAdminPayrollMutation();
  const updatePayroll = useUpdateAdminPayrollMutation();
  const [editSheetVisible, setEditSheetVisible] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<AdminPayrollSummaryWorker | null>(null);
  const [rateInput, setRateInput] = useState("0");
  const workers = useMemo<WorkerPayroll[]>(
    () =>
      data?.workers?.map((item) => ({
        id: item.payrollId,
        payrollId: item.payrollId,
        name: item.worker.fullName,
        role: item.worker.department || "Worker",
        hours: item.hours,
        hoursDisplay: item.hoursDisplay,
        rate: Number(item.rate ?? item.worker.hourlyRate ?? 0),
        total: item.netPay,
        status:
          item.status === "draft"
            ? "Pending"
            : item.status === "paid"
              ? "Paid"
              : "Approved",
        showApproveButton: item.status === "draft",
      })) ?? [],
    [data?.workers],
  );

  const openEditSheet = (worker: AdminPayrollSummaryWorker) => {
    setSelectedWorker(worker);
    setRateInput(String(Number(worker.rate ?? worker.worker.hourlyRate ?? 0)));
    setEditSheetVisible(true);
  };

  const handleUpdatePayroll = () => {
    if (!selectedWorker) return;

    const nextRate = Number(rateInput);
    updatePayroll.mutate(
      {
        payrollId: selectedWorker.payrollId,
        payload: {
          workerId: selectedWorker.worker.id,
          projectId: selectedWorker.project?.id,
          payPeriodStart: selectedWorker.payPeriodStart?.split("T")[0],
          payPeriodEnd: selectedWorker.payPeriodEnd?.split("T")[0],
          regularHours: selectedWorker.hours,
          overtimeHours: selectedWorker.overtimeHours,
          ratePerHour: nextRate,
          grossPay: selectedWorker.grossPay,
          deductions: selectedWorker.deductions,
          netPay: selectedWorker.netPay,
        },
      },
      {
        onSuccess: () => {
          setEditSheetVisible(false);
          setSelectedWorker(null);
        },
      },
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <BackTitleHeader title="Payroll Summary" onBack={() => router.back()} />

        <View className="mt-4 px-4">
          <View className="flex-row justify-between">
            <PayrollStatCard
              value={overview?.totalHoursDisplay ?? String(Math.round(overview?.totalHours ?? 0))}
              label="Total Hours"
            />
            <PayrollStatCard
              value={formatCurrency(overview?.totalPay ?? 0)}
              label="Total Pay"
            />
          </View>

          <View className="mt-3 flex-row justify-between">
            <PayrollStatCard value={String(overview?.pending ?? 0)} label="Pending" />
            <PayrollStatCard value={String(overview?.inventoryAlerts ?? 0)} label="Inventory Alerts" />
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
              key={worker.payrollId || worker.id}
              worker={worker}
              onViewStub={() =>
                router.push({
                  pathname: "/screens/payroll/paystub",
                  params: { payrollId: worker.payrollId || worker.id },
                })
              }
              onEdit={() => {
                const sourceWorker = data?.workers?.find(
                  (item) => item.payrollId === worker.payrollId,
                );
                if (sourceWorker) {
                  openEditSheet(sourceWorker);
                }
              }}
              onApprove={() => {
                approvePayroll.mutate({ payrollId: worker.payrollId || worker.id });
              }}
            />
          ))}

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() =>
              router.push({
                pathname: "/screens/payroll/paystub",
                params: { mode: "approved" },
              })
            }
            className="mb-8 mt-3 h-12 items-center justify-center rounded-[10px] bg-[#1F5577]"
          >
            <Text className="text-[16px] font-medium text-white">
              Process payroll
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <EditPayrollRateSheet
        visible={editSheetVisible}
        value={rateInput}
        onChangeValue={setRateInput}
        onClose={() => {
          setEditSheetVisible(false);
          setSelectedWorker(null);
        }}
        onUpdate={handleUpdatePayroll}
        isUpdating={updatePayroll.isPending}
      />
    </SafeAreaView>
  );
}

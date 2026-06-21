import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useAdminApprovedPayrollQuery,
  useAdminPayStubQuery,
  useBulkPaidAdminPayrollMutation,
} from "@/hooks/admin/payroll";
import { useWorkerPayrollQuery } from "@/hooks/worker/payroll";
import BackTitleHeader from "../common/BackTitleHeader";
import { downloadPayStubPdf } from "./payStubPdf";
import { formatCurrency } from "./utils";
import { toast } from "sonner-native";

function formatMaybeMoney(value?: number | null, fallback = "—") {
  return typeof value === "number" ? formatCurrency(value) : fallback;
}

function formatMaybeNumber(value?: number | null, digits = 2, fallback = "—") {
  return typeof value === "number" ? value.toFixed(digits) : fallback;
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function PayStubScreen() {
  const { payrollId, mode, date } = useLocalSearchParams<{
    payrollId?: string;
    mode?: string;
    date?: string;
  }>();

  const resolvedPayrollId = Array.isArray(payrollId) ? payrollId[0] : payrollId;
  const resolvedMode = Array.isArray(mode) ? mode[0] : mode;
  const selectedDate = Array.isArray(date) ? date[0] : date;
  const resolvedDate = selectedDate ?? formatLocalDate(new Date());

  if (resolvedMode === "worker") {
    return <WorkerModePayStubContent date={resolvedDate} />;
  }

  if (resolvedMode === "approved") {
    return <ApprovedModePayStubContent date={resolvedDate} payrollId={resolvedPayrollId} />;
  }

  return <DefaultModePayStubContent payrollId={resolvedPayrollId} />;
}

function WorkerModePayStubContent({ date }: { date: string }) {
  const { data: workerPayroll, isLoading } = useWorkerPayrollQuery(date);
  const workerSummary = workerPayroll?.lifetimeSummary;
  const workerProjects = workerPayroll?.projects ?? [];

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <BackTitleHeader title="Pay Stub" onBack={() => router.back()} />

        <View className="mt-4 px-4">
          <View className="rounded-[12px] border border-[#E3E6EA] bg-white p-4 mt-4">
            <Text className="text-center text-[12px] text-[#667085] mt-2">
              Pay Period: {date}
            </Text>

            <View className="my-3 h-px bg-[#E6E8EB] mt-2" />

            <View className="gap-y-2.5">
              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-[15px] text-[#475467]">Total Hours</Text>
                <Text className="text-[15px] font-medium text-[#101828]">
                  {workerSummary?.totalHoursDisplay ?? "0h 0m"}
                </Text>
              </View>

              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-[15px] text-[#475467]">Gross Pay</Text>
                <Text className="text-[15px] font-medium text-[#101828]">
                  {formatMaybeMoney(workerSummary?.grossPay)}
                </Text>
              </View>

              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-[15px] text-[#475467]">Total Deductions</Text>
                <Text className="text-[15px] font-medium text-[#101828]">
                  {formatMaybeMoney(workerSummary?.totalDeductions)}
                </Text>
              </View>

              <View className="flex-row items-center justify-between mt-2">
                <Text className="text-[15px] text-[#475467]">Average Hourly Rate</Text>
                <Text className="text-[15px] font-medium text-[#101828]">
                  {formatMaybeMoney(workerSummary?.averageHourlyRate)}
                </Text>
              </View>
            </View>

            <View className="my-3 h-px bg-[#E6E8EB] mt-2" />

            <TouchableOpacity
              activeOpacity={0.88}
              disabled
              className="rounded-[10px] bg-[#1F5577] px-4 py-4 opacity-100 mt-2"
            >
              <Text className="text-center text-[16px] text-[#EAF1F5]">
                Total Paid
              </Text>
              <Text
                className="mt-1 text-center text-[56px] font-medium text-[#EAF1F5]"
                style={{ fontSize: 56 / 2 }}
              >
                {formatMaybeMoney(workerSummary?.totalPay)}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-[18px] font-medium text-[#101828]">
                Project List
              </Text>
              <Text className="text-[12px] text-[#667085]">{date}</Text>
            </View>

            {isLoading ? (
              <View className="min-h-[120px] items-center justify-center rounded-[14px] border border-[#E9EDF1] bg-white">
                <ActivityIndicator size="small" color="#1F5577" />
              </View>
            ) : workerProjects.length > 0 ? (
              workerProjects.map((project) => (
                <View
                  key={project.projectId}
                  className="mb-3 rounded-[16px] border border-[#E9EDF1] bg-white px-4 py-4"
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 pr-3">
                      <Text className="text-[18px] font-semibold text-[#101828]">
                        {project.projectName}
                      </Text>
                      <Text className="mt-1 text-[13px] text-[#667085]">
                        {project.companyName}
                      </Text>
                      <Text className="mt-1 text-[12px] text-[#98A2B3]">
                        {project.totalHoursDisplay} worked
                      </Text>
                    </View>
                    <View className="rounded-full bg-[#EAF7EF] px-3 py-1">
                      <Text className="text-[12px] font-medium text-[#14803C]">
                        {project.totalPay > 0 ? "Paid" : "Pending"}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-4 flex-row justify-between">
                    <View>
                      <Text className="text-[12px] text-[#667085]">Gross Pay</Text>
                      <Text className="mt-1 text-[15px] font-semibold text-[#101828]">
                        {formatMaybeMoney(project.grossPay)}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-[12px] text-[#667085]">Deductions</Text>
                      <Text className="mt-1 text-[15px] font-semibold text-[#101828]">
                        {formatMaybeMoney(project.totalDeductions)}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-[12px] text-[#667085]">Total Pay</Text>
                      <Text className="mt-1 text-[15px] font-semibold text-[#1F5577]">
                        {formatMaybeMoney(project.totalPay)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View className="rounded-[14px] border border-[#E9EDF1] bg-white px-4 py-5">
                <Text className="text-center text-[14px] text-[#667085]">
                  No payroll data found for this date.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ApprovedModePayStubContent({
  date,
  payrollId,
}: {
  date: string;
  payrollId?: string;
}) {
  const { data: approved } = useAdminApprovedPayrollQuery({ date }, true);
  const bulkPaidMutation = useBulkPaidAdminPayrollMutation();

  const approvedSummary = approved?.summary;
  const approvedRecords = approved?.records ?? [];
  const approvedPayrollIds = useMemo(
    () => approvedRecords.map((item) => item.payrollId).filter(Boolean),
    [approvedRecords],
  );
  const record = useMemo(() => {
    if (!approvedRecords.length) return null;
    if (payrollId) {
      return approvedRecords.find((item) => item.payrollId === payrollId) ?? approvedRecords[0];
    }
    return approvedRecords[0];
  }, [approvedRecords, payrollId]);

  const handleBulkPaid = async () => {
    if (!approvedPayrollIds.length) {
      toast.error("No approved payroll found to mark as paid");
      return;
    }

    await bulkPaidMutation.mutateAsync({ payrollIds: approvedPayrollIds });
  };

  const handleDownload = async () => {
    if (!record) return;

    await downloadPayStubPdf({
      workerName: record.worker.fullName || "Worker",
      workerRole: record.displayRole || record.worker.department || "Worker",
      payPeriodLabel: record.payPeriodStart
        ? new Date(record.payPeriodStart).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "This week",
      regularHours: record.hours ?? 0,
      overtimeHours: record.overtimeHours ?? 0,
      hourlyRate: Number(record.rate ?? record.worker.hourlyRate ?? 0),
      grossPay: record.grossPay ?? 0,
      deductions: record.deductions ?? 0,
      netPay: Math.max(0, (record.grossPay ?? 0) - (record.deductions ?? 0)),
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <BackTitleHeader title="Pay Stub" onBack={() => router.back()} />

        <View className="mt-4 px-4">
          <View className="rounded-[12px] border border-[#E3E6EA] bg-white p-4">
            <Text className="text-center text-[12px] text-[#667085]">
              Pay Period: {date}
            </Text>

            <View className="my-3 h-px bg-[#E6E8EB]" />

            <View className="gap-y-2.5">
              <View className="flex-row items-center justify-between">
                <Text className="text-[15px] text-[#475467]">Total Workers</Text>
                <Text className="text-[15px] font-medium text-[#101828]">
                  {approvedSummary?.totalWorkers ?? 0}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-[15px] text-[#475467]">Total Hours</Text>
                <Text className="text-[15px] font-medium text-[#101828]">
                  {approvedSummary?.totalHoursDisplay ?? formatMaybeNumber(approvedSummary?.totalHours ?? 0)}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-[15px] text-[#475467]">Average Hourly Rate</Text>
                <Text className="text-[15px] font-medium text-[#101828]">
                  {formatMaybeMoney(approvedSummary?.averageHourlyRate)}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-[15px] text-[#475467]">Gross Pay</Text>
                <Text className="text-[15px] font-medium text-[#101828]">
                  {formatMaybeMoney(approvedSummary?.grossPay)}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-[15px] text-[#475467]">Total Deductions</Text>
                <Text className="text-[15px] font-medium text-[#101828]">
                  {formatMaybeMoney(approvedSummary?.totalDeductions)}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-[15px] text-[#475467]">Total Pay</Text>
                <Text className="text-[15px] font-medium text-[#101828]">
                  {formatMaybeMoney(approvedSummary?.totalPay)}
                </Text>
              </View>
            </View>

            <View className="my-3 h-px bg-[#E6E8EB]" />

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleBulkPaid}
              disabled={bulkPaidMutation.isPending || (approvedSummary?.totalWorkers ?? 0) === 0}
              className="mt-4 rounded-[10px] bg-[#1F5577] px-4 py-4"
            >
              <Text className="text-center text-[16px] text-[#EAF1F5]">
                Net Pay
              </Text>
              <Text
                className="mt-1 text-center text-[56px] font-medium text-[#EAF1F5]"
                style={{ fontSize: 56 / 2 }}
              >
                {formatMaybeMoney(approvedSummary?.totalPay)}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.86}
            onPress={handleDownload}
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

function DefaultModePayStubContent({ payrollId }: { payrollId?: string }) {
  const { data: stub } = useAdminPayStubQuery(payrollId);
  const bulkPaidMutation = useBulkPaidAdminPayrollMutation();
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
  const displayName = stub?.worker.fullName || "Worker";
  const displayRole = stub?.worker.department || "Worker";
  const avatarText = displayName?.charAt(0)?.toUpperCase() || "W";

  const handleDownload = async () => {
    await downloadPayStubPdf({
      workerName: displayName,
      workerRole: displayRole,
      payPeriodLabel,
      regularHours,
      overtimeHours,
      hourlyRate,
      grossPay,
      deductions,
      netPay,
    });
  };

  const handleSinglePay = async () => {
    if (!payrollId) {
      toast.error("No payroll found to mark as paid");
      return;
    }

    await bulkPaidMutation.mutateAsync({ payrollIds: [payrollId] });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E9EDF1]">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <BackTitleHeader title="Pay Stub" onBack={() => router.back()} />

        <View className="mt-4 px-4">
          <View className="rounded-[12px] border border-[#E3E6EA] bg-white p-4">
            <View className="items-center">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-[#1F5577]">
                <Text className="text-[24px] font-semibold text-white">
                  {avatarText}
                </Text>
              </View>
              <Text className="mt-3 text-center text-[20px] font-semibold text-[#101828]">
                {displayName}
              </Text>
              <Text className="mt-1 text-center text-[14px] text-[#475467]">
                {displayRole}
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
                <Text className="text-[15px] text-[#475467]">Hourly Rate</Text>
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

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleSinglePay}
              disabled={stub?.status === "paid"}
              className="mt-4 rounded-[10px] bg-[#1F5577] px-4 py-4"
            >
              <Text className="text-center text-[16px] text-[#EAF1F5]">
                Pay
              </Text>
              <Text
                className="mt-1 text-center text-[56px] font-medium text-[#EAF1F5]"
                style={{ fontSize: 56 / 2 }}
              >
                {formatCurrency(netPay)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

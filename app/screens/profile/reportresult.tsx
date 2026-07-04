import BackTitleHeader from "@/components/common/BackTitleHeader";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TYPE_TITLES: Record<string, string> = {
  payroll: "Payroll Report",
  invoices: "Project Invoices",
  performance: "Worker Performance",
  expense: "Expense Reports",
};

type Invoice = {
  id: string;
  name: string;
  company: string;
  status: string;
  progress: number;
  billed: string;
  remaining: string;
};

const INVOICES: Invoice[] = [
  {
    id: "1",
    name: "Lakeside Towers",
    company: "Summit Construction Ltd.",
    status: "PAID",
    progress: 45,
    billed: "$6,750,000",
    remaining: "$8,250,000",
  },
  {
    id: "2",
    name: "Maple Grove Homes",
    company: "Horizon Builders Inc.",
    status: "PAID",
    progress: 30,
    billed: "$2,550,000",
    remaining: "$5,950,000",
  },
  {
    id: "3",
    name: "Oakwood Residences",
    company: "Summit Construction Ltd.",
    status: "PAID",
    progress: 60,
    billed: "$7,200,000",
    remaining: "$4,800,000",
  },
  {
    id: "4",
    name: "Westside Community Center",
    company: "Horizon Builders Inc.",
    status: "PAID",
    progress: 100,
    billed: "$5,500,000",
    remaining: "$0",
  },
  {
    id: "5",
    name: "Harborfront Condos",
    company: "Summit Construction Ltd.",
    status: "PAID",
    progress: 25,
    billed: "$6,250,000",
    remaining: "$18,750,000",
  },
];

type Worker = {
  id: string;
  name: string;
  role: string;
  attendance: number;
  tasksDone: number;
  rating: number;
  accent: string;
};

const WORKERS: Worker[] = [
  {
    id: "1",
    name: "Carlos Martinez",
    role: "Electrician",
    attendance: 100,
    tasksDone: 0,
    rating: 4.0,
    accent: "#1D5478",
  },
  {
    id: "2",
    name: "David Chen",
    role: "Plumber",
    attendance: 0,
    tasksDone: 0,
    rating: 2.5,
    accent: "#E11D48",
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    role: "Carpenter",
    attendance: 100,
    tasksDone: 0,
    rating: 4.0,
    accent: "#1D5478",
  },
];

type Expense = {
  id: string;
  name: string;
  date: string;
  category: string;
  amount: string;
  status: "PENDING" | "APPROVED";
};

const EXPENSES: Expense[] = [
  {
    id: "1",
    name: "Carlos Martinez",
    date: "July 12, 2026",
    category: "Travel",
    amount: "$45.00",
    status: "PENDING",
  },
  {
    id: "2",
    name: "David Chen",
    date: "July 10, 2026",
    category: "Equipment",
    amount: "$125.50",
    status: "PENDING",
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    date: "July 08, 2026",
    category: "Meals",
    amount: "$25.00",
    status: "APPROVED",
  },
  {
    id: "4",
    name: "Carlos Martinez",
    date: "July 05, 2026",
    category: "Tools",
    amount: "$53.25",
    status: "APPROVED",
  },
];

const TOTAL_EXPENSES = "$248.75";
const PENDING_APPROVAL = "$125.50";

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View className="flex-1 rounded-[14px] border border-[#EDF1F5] bg-white px-4 py-4">
      <Text className="text-[18px] font-bold text-[#111827]">{value}</Text>
      <Text className="mt-1 text-[11px] font-semibold tracking-[0.5px] text-[#94A3B8]">
        {label}
      </Text>
    </View>
  );
}

function ExpenseStatCard({
  label,
  value,
  valueColor = "#111827",
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View
      className="flex-1 rounded-[16px] border border-[#E9EDF3] bg-white px-4 py-4"
      style={{
        shadowColor: "#0F172A",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <Text className="text-[11px] font-bold uppercase leading-4 tracking-[0.8px] text-[#6B7280]">
        {label}
      </Text>
      <Text className="mt-3 text-[22px] font-bold" style={{ color: valueColor }}>
        {value}
      </Text>
    </View>
  );
}

function InvoiceCard({ invoice }: { invoice: Invoice }) {
  return (
    <View
      className="mt-4 rounded-[18px] bg-white px-4 py-4"
      style={{
        shadowColor: "#0F172A",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      {/* Title + status */}
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-[18px] font-bold text-[#111827]">
            {invoice.name}
          </Text>
          <Text className="mt-0.5 text-[13px] text-[#6B7280]">
            {invoice.company}
          </Text>
        </View>
        <View className="rounded-full bg-[#E7F6EE] px-3 py-1">
          <Text className="text-[11px] font-bold tracking-[0.5px] text-[#15925B]">
            {invoice.status}
          </Text>
        </View>
      </View>

      {/* Progress */}
      <View className="mt-4 flex-row items-center justify-between">
        <Text className="text-[12px] font-bold tracking-[0.5px] text-[#94A3B8]">
          PROGRESS
        </Text>
        <Text className="text-[14px] font-bold text-[#1D5478]">
          {invoice.progress}%
        </Text>
      </View>
      <View className="mt-2 h-[6px] w-full overflow-hidden rounded-full bg-[#E5EAF0]">
        <View
          className="h-full rounded-full bg-[#1D5478]"
          style={{ width: `${invoice.progress}%` }}
        />
      </View>

      {/* Billed / Remaining + download */}
      <View className="mt-4 flex-row items-end justify-between">
        <View>
          <Text className="text-[11px] font-bold tracking-[0.5px] text-[#94A3B8]">
            BILLED TO DATE
          </Text>
          <Text className="mt-1 text-[17px] font-bold text-[#111827]">
            {invoice.billed}
          </Text>
        </View>
        <View>
          <Text className="text-[11px] font-bold tracking-[0.5px] text-[#94A3B8]">
            REMAINING
          </Text>
          <Text className="mt-1 text-[15px] text-[#6B7280]">
            {invoice.remaining}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          className="h-10 w-10 items-center justify-center rounded-full bg-[#F1F5F9]"
        >
          <Ionicons name="download-outline" size={18} color="#64748B" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function WorkerCard({ worker }: { worker: Worker }) {
  const attendanceLow = worker.attendance === 0;
  return (
    <View
      className="mt-4 flex-row overflow-hidden rounded-[18px] bg-white"
      style={{
        shadowColor: "#0F172A",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      {/* Accent bar */}
      <View style={{ width: 5, backgroundColor: worker.accent }} />

      <View className="flex-1 px-4 py-4">
        {/* Name + View Profile */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-[18px] font-bold text-[#111827]">
              {worker.name}
            </Text>
            <Text className="mt-0.5 text-[13px] text-[#6B7280]">
              {worker.role}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            className="rounded-[10px] border border-[#CBD5E1] px-3 py-2"
          >
            <Text className="text-[12px] font-semibold text-[#1D5478]">
              View Profile
            </Text>
          </TouchableOpacity>
        </View>

        <View className="my-4 h-[1px] bg-[#EDF1F5]" />

        {/* Metrics */}
        <View className="flex-row">
          <View className="flex-1">
            <Text className="text-[11px] font-bold tracking-[0.5px] text-[#94A3B8]">
              ATTENDANCE
            </Text>
            <View className="mt-1 flex-row items-center">
              <Text
                className="text-[16px] font-bold"
                style={{ color: attendanceLow ? "#E11D48" : "#15925B" }}
              >
                {worker.attendance}%
              </Text>
              {attendanceLow ? (
                <Ionicons
                  name="warning-outline"
                  size={14}
                  color="#E11D48"
                  style={{ marginLeft: 4 }}
                />
              ) : null}
            </View>
          </View>

          <View className="flex-1">
            <Text className="text-[11px] font-bold tracking-[0.5px] text-[#94A3B8]">
              TASKS DONE
            </Text>
            <Text className="mt-1 text-[16px] font-bold text-[#111827]">
              {worker.tasksDone}
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-[11px] font-bold tracking-[0.5px] text-[#94A3B8]">
              RATING
            </Text>
            <View className="mt-1 flex-row items-center">
              <Ionicons name="star" size={14} color="#F5B301" />
              <Text className="ml-1 text-[16px] font-bold text-[#111827]">
                {worker.rating.toFixed(1)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function ExpenseCard({ expense }: { expense: Expense }) {
  const pending = expense.status === "PENDING";
  const accent = pending ? "#D4DAE5" : "#C7F4E6";
  const badgeBg = pending ? "#E9EEFF" : "#DDFBF0";
  const badgeText = pending ? "#8B5E3C" : "#2E8B57";
  return (
    <View
      className="mt-5 flex-row overflow-hidden rounded-[20px] bg-white"
      style={{
        shadowColor: "#0F172A",
        shadowOpacity: 0.04,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
      }}
    >
      <View style={{ width: 4, backgroundColor: accent }} />

      <View className="flex-1 px-4 py-5">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-[17px] font-bold text-[#1F2937]">
              {expense.name}
            </Text>
            <Text className="mt-1 text-[13px] text-[#7C8594]">
              {expense.date}
            </Text>
          </View>
          <View
            className="rounded-full px-4 py-1.5"
            style={{ backgroundColor: badgeBg }}
          >
            <Text
              className="text-[11px] font-semibold tracking-[1.2px]"
              style={{ color: badgeText }}
            >
              {expense.status}
            </Text>
          </View>
        </View>

        <View className="mt-4 flex-row items-end justify-between">
          <Text className="text-[14px] text-[#6B7280]">
            {expense.category}
          </Text>
          <Text className="text-[18px] font-bold text-[#111827]">
            {expense.amount}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function ReportResultScreen() {
  const { type } = useLocalSearchParams<{
    type?: string;
    frequency?: string;
    startDate?: string;
    endDate?: string;
  }>();

  const reportType = typeof type === "string" ? type : "payroll";
  const title = TYPE_TITLES[reportType] ?? "Report";

  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-[#E9EDF1]">
      <BackTitleHeader title={title} onBack={() => router.back()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 36 }}
      >
        {reportType === "invoices" ? (
          <View>
            {/* Heading */}
            <Text className="text-[26px] font-extrabold text-[#1D5478]">
              Project Invoicing
            </Text>
            <Text className="mt-1 text-[14px] text-[#6B7280]">
              Billing status based on project progress
            </Text>

            {/* Total billed volume */}
            <View className="mt-5 rounded-[18px] border-l-4 border-[#1D5478] bg-white px-4 py-6">
              <Text className="text-center text-[34px] font-extrabold text-[#1D5478]">
                $28,250,000
              </Text>
              <Text className="mt-1 text-center text-[12px] font-bold tracking-[1px] text-[#94A3B8]">
                TOTAL BILLED VOLUME
              </Text>
            </View>

            {/* Invoice cards */}
            {INVOICES.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </View>
        ) : reportType === "performance" ? (
          <View>
            {/* Heading */}
            <Text className="text-[26px] font-extrabold text-[#111827]">
              Worker Performance
            </Text>
            <Text className="mt-1 text-[14px] text-[#6B7280]">
              Efficiency and reliability metrics
            </Text>

            {/* Worker cards */}
            {WORKERS.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}

            {/* Weekly summary */}
            <View className="mt-5 flex-row items-center justify-between rounded-[18px] bg-[#1D5478] px-5 py-5">
              <View>
                <Text className="text-[18px] font-bold text-white">
                  Weekly Summary
                </Text>
                <Text className="mt-1 text-[13px] text-[#C7D8E6]">
                  92% Average Efficiency
                </Text>
              </View>
              <Ionicons name="stats-chart" size={26} color="#FFFFFF" />
            </View>
          </View>
        ) : reportType === "expense" ? (
          <View>
            <View className="flex-row gap-4">
              <ExpenseStatCard
                label="TOTAL EXPENSES (ALL TIME)"
                value={TOTAL_EXPENSES}
              />
              <ExpenseStatCard
                label="PENDING APPROVAL"
                value={PENDING_APPROVAL}
                valueColor="#F59E0B"
              />
            </View>

            <Text className="mt-8 text-[18px] font-bold text-[#111827]">
              Expense Breakdown
            </Text>
            <Text className="mt-1 text-[14px] text-[#6B7280]">
              Track project and worker expenditures
            </Text>

            {EXPENSES.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
          </View>
        ) : (
          <View>
            {/* Stat cards */}
            <View className="flex-row gap-3">
              <StatCard value="0h 0m" label="TOTAL HOURS" />
              <StatCard value="$0" label="GROSS PAY" />
            </View>

            <View className="mt-3 flex-row gap-3">
              <StatCard value="$0" label="DEDUCTIONS" />
              <StatCard value="$0.00" label="AVG HOURLY RATE" />
            </View>

            {/* Workers */}
            <Text className="mb-1 mt-6 text-[16px] font-semibold text-[#111827]">
              Workers
            </Text>
            <Text className="text-[13px] text-[#6B7280]">0 payroll rows</Text>

            <TouchableOpacity
              activeOpacity={0.85}
              className="mt-4 h-[52px] flex-row items-center justify-between rounded-[12px] border border-[#1D5478] bg-white px-4"
            >
              <Text className="text-[15px] font-semibold text-[#1D5478]">
                Process payroll
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#1D5478" />
            </TouchableOpacity>

            <View className="mt-4 items-center rounded-[14px] bg-[#F1F5F9] px-6 py-10">
              <Ionicons name="search-outline" size={26} color="#94A3B8" />
              <Text className="mt-3 text-[14px] text-[#64748B]">
                No results found.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

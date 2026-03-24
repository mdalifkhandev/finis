import { ActivityItem, PayStubData, WorkerPayroll } from "./types";

export const schedulingActivities: ActivityItem[] = [
  {
    id: "a-1",
    title: "Multiple Projects",
    dateLabel: "Jan 13, 2025",
    workersLabel: "15 workers scheduled",
  },
  {
    id: "a-2",
    title: "Multiple Projects",
    dateLabel: "Jan 13, 2025",
    workersLabel: "15 workers scheduled",
  },
  {
    id: "a-3",
    title: "Multiple Projects",
    dateLabel: "Jan 13, 2025",
    workersLabel: "15 workers scheduled",
  },
];

export const payrollWorkerMocks: WorkerPayroll[] = [
  {
    id: "w-1",
    name: "John Smith",
    role: "Site Supervisor",
    hours: 160,
    rate: 45,
    total: 7200,
    status: "Approved",
  },
  {
    id: "w-2",
    name: "John Smith",
    role: "Site Supervisor",
    hours: 160,
    rate: 45,
    total: 7200,
    status: "Pending",
  },
  {
    id: "w-3",
    name: "John Smith",
    role: "Site Supervisor",
    hours: 160,
    rate: 45,
    total: 7200,
    status: "Approved",
    showApproveButton: true,
  },
  {
    id: "w-4",
    name: "John Smith",
    role: "Site Supervisor",
    hours: 160,
    rate: 45,
    total: 7200,
    status: "Approved",
    showApproveButton: true,
  },
  {
    id: "w-5",
    name: "John Smith",
    role: "Site Supervisor",
    hours: 160,
    rate: 45,
    total: 7200,
    status: "Approved",
  },
];

export const PAY_PERIOD_LABEL = "Jan 1 - Jan 15, 2025";

export function getPayStubData(): PayStubData {
  const deductions = [
    { label: "Federal Tax", amount: 1198.5 },
    { label: "State Tax", amount: 399.5 },
    { label: "Social Security", amount: 495.38 },
    { label: "Medicare", amount: 115.86 },
  ];

  const totalDeductions = deductions.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  return {
    regularHours: 160,
    overtimeHours: 8,
    siteAllowance: 250,
    grossPay: 7990,
    deductions,
    totalDeductions,
    netPay: 7990 - totalDeductions,
  };
}

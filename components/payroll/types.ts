export type ActivityItem = {
  id: string;
  title: string;
  dateLabel: string;
  workersLabel: string;
};

export type PayrollStatus = "Approved" | "Pending" | "Paid";

export type WorkerPayroll = {
  id: string;
  payrollId?: string;
  name: string;
  role: string;
  avatarUrl?: string | null;
  hours: number;
  hoursDisplay?: string;
  rate: number;
  total: number;
  totalDisplay?: string;
  status: PayrollStatus;
  showApproveButton?: boolean;
};

export type PayStubItem = {
  label: string;
  amount: number;
};

export type PayStubData = {
  regularHours: number;
  overtimeHours: number;
  siteAllowance: number;
  grossPay: number;
  deductions: PayStubItem[];
  totalDeductions: number;
  netPay: number;
};

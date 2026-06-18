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
  hours: number;
  rate: number;
  total: number;
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

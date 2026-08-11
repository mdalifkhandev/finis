import { api } from "@/lib/api/client";
import type { ApiResponse } from "@/types/auth.types";

export type WorkerPayrollProjectSummary = {
  projectId: string;
  projectName: string;
  companyId: string;
  companyName: string;
  totalHours: number;
  totalHoursDisplay: string;
  grossPay: number;
  totalDeductions: number;
  totalPay: number;
  averageHourlyRate: number;
};

export type WorkerPayrollLifetimeSummary = {
  totalHours: number;
  totalHoursDisplay: string;
  totalPay: number;
  totalDeductions: number;
  grossPay: number;
  averageHourlyRate: number;
};

export type WorkerPayrollWorker = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  employeeId: string | null;
  department: string | null;
  role: string;
  status: string;
};

export type WorkerPayrollResponse = {
  date: string;
  worker: WorkerPayrollWorker;
  projects: WorkerPayrollProjectSummary[];
  periodSummary: WorkerPayrollLifetimeSummary;
  lifetimeSummary: WorkerPayrollLifetimeSummary;
};

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function getWorkerPayroll(params?: {
  date?: string;
  startDate?: string;
  endDate?: string;
}) {
  const query = new URLSearchParams();
  if (params?.date) query.append("date", params.date);
  if (params?.startDate) query.append("startDate", params.startDate);
  if (params?.endDate) query.append("endDate", params.endDate);

  const { data } = await api.get<ApiResponse<WorkerPayrollResponse>>("/worker/payroll", {
    params: Object.fromEntries(query.entries()),
  });

  if (!data.success) {
    throw new Error(data.message || "Failed to load worker payroll");
  }

  return data.data;
}

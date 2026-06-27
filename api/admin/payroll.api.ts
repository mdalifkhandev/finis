import { api } from "@/lib/api/client";

export type AdminPayrollSummaryWorker = {
  payrollId: string;
  project: { id: string; name: string } | null;
  worker: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    department: string | null;
    hourlyRate?: number | null;
  };
  hours: number;
  hoursDisplay?: string;
  overtimeHours: number;
  rate: number;
  grossPay: number;
  grossPayDisplay?: string;
  deductions: number;
  netPay: number;
  status: "draft" | "approved" | "paid" | string;
  payPeriodStart?: string;
  payPeriodEnd?: string;
  processedAt?: string | null;
};

export type AdminPayrollSummaryResponse = {
  subscription?: unknown;
  summary: {
    totalHours: number;
    totalHoursDisplay?: string;
    totalPay: number;
    pending: number;
    processing: number;
    paid: number;
    inventoryAlerts: number;
  };
  workers: AdminPayrollSummaryWorker[];
};

export type AdminPayrollOverviewResponse = {
  subscription?: unknown;
  summary: {
    totalHours: number;
    totalHoursDisplay?: string;
    totalPay: number;
    pending: number;
    inventoryAlerts: number;
    activeWorkers: number;
  };
};

export type AdminPayrollQueryParams = {
  date?: string;
  month?: string;
  year?: string;
  range?: "custom" | "weekly" | "bi-weekly" | "monthly" | "bi-monthly" | "yearly";
  startDate?: string;
  endDate?: string;
  projectId?: string;
};

type AdminPayrollOverviewApiResponse = {
  success: boolean;
  message: string;
  subscription?: unknown;
  summary: AdminPayrollOverviewResponse["summary"];
};

type AdminPayrollSummaryApiResponse = {
  success: boolean;
  message: string;
  subscription?: unknown;
  summary: AdminPayrollSummaryResponse["summary"];
  workers: AdminPayrollSummaryWorker[];
};

export type AdminPayrollUsersResponse = {
  date: string;
  subscription?: unknown;
  totalUsers?: number;
  users: Array<{
    user: {
      id: string;
      fullName: string;
      email: string;
      phone: string | null;
      avatarUrl: string | null;
      role: string;
      status: string;
      department: string | null;
      employeeId: string | null;
      hourlyRate: number | string | null;
      joinDate: string | null;
    };
    projects: Array<{ id: string; name: string; companyId: string }>;
    attendance: {
      date: string;
      status: string;
      sessions: Array<{
        checkInTime: string;
        checkOutTime: string | null;
        duration: string;
      }>;
      totalWorked: {
        hours: number;
        minutes: number;
        display: string;
      };
    };
    payrollPreview: {
      regularHours: number;
      displayHours: string;
      overtimeHours: number;
      ratePerHour: number;
      grossPay: number;
      deductions: number;
      netPay: number;
      employerCost: number;
    };
    latestPayroll: {
      id: string;
      regularHours: number;
      overtimeHours: number;
      ratePerHour: number;
      grossPay: number;
      deductions: number;
      netPay: number;
      status: string;
      payPeriodStart: string;
      payPeriodEnd: string;
      processedAt: string | null;
    } | null;
  }>;
};

export type AdminPayStubResponse = {
  payrollId: string;
  worker: {
    id: string;
    fullName: string;
    department: string | null;
    hourlyRate: number | string | null;
  };
  project: { id: string; name: string } | null;
  payPeriod: {
    start: string;
    end: string;
  };
  earnings: {
    regularHours: number;
    regularHoursDisplay?: string;
    regularPay: number;
    overtimeHours: number;
    overtimeHoursDisplay?: string;
    overtimePay: number;
    grossPay: number;
  };
  deductions: {
    totalDeductions: number;
  };
  netPay: number;
  employerCost?: number;
  status: string;
  processedAt?: string | null;
};

export type AdminApprovedPayrollRecord = {
  payrollId: string;
  worker: {
    id: string;
    fullName?: string;
    avatarUrl?: string | null;
    department?: string | null;
    hourlyRate?: number | string | null;
  };
  project?: { id: string; name: string } | null;
  displayRole?: string;
  hours?: number;
  overtimeHours?: number;
  rate?: number;
  grossPay?: number;
  grossPayDisplay?: string;
  deductions?: number;
  netPay?: number;
  status?: string;
  statusLabel?: string;
  payPeriodStart?: string;
  payPeriodEnd?: string;
  processedAt?: string | null;
  canApprove?: boolean;
};

export type AdminApprovedPayrollResponse = {
  summary: {
    totalWorkers: number;
    totalHours: number;
    totalHoursDisplay?: string;
    averageHourlyRate: number;
    grossPay: number;
    totalDeductions: number;
    totalPay: number;
  };
  records: AdminApprovedPayrollRecord[];
};

export type AdminBulkPaidPayrollPayload = {
  payrollIds: string[];
};

export type AdminUpdatePayrollPayload = {
  workerId?: string;
  projectId?: string;
  companyId?: string;
  payPeriodStart?: string;
  payPeriodEnd?: string;
  regularHours?: number;
  overtimeHours?: number;
  ratePerHour?: number;
  grossPay?: number;
  deductions?: number;
  netPay?: number;
  note?: string;
};

export async function approveAdminPayroll(payrollId: string, payload?: { note?: string }) {
  const { data } = await api.patch<{ success: boolean; message: string; data: unknown }>(
    `/admin/payroll/${payrollId}/approve`,
    payload ?? {},
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to approve payroll");
  }

  return data.data;
}

export async function processAdminPayroll(params?: {
  month?: string;
  year?: string;
  projectId?: string;
}) {
  const { data } = await api.post<{ success: boolean; message: string; data: unknown }>(
    "/admin/payroll/process",
    null,
    { params },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to process payroll");
  }

  return data;
}

export async function updateAdminPayroll(
  payrollId: string,
  payload: AdminUpdatePayrollPayload,
) {
  const { data } = await api.patch<{ success: boolean; message: string; data: unknown }>(
    `/admin/payroll/${payrollId}`,
    payload,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to update payroll");
  }

  return data.data;
}

export async function getAdminApprovedPayroll(params?: {
  date?: string;
  month?: string;
  year?: string;
  range?: AdminPayrollQueryParams["range"];
  startDate?: string;
  endDate?: string;
  projectId?: string;
}) {
  console.log("[AdminApprovedPayrollAPI] request", {
    input: params,
  });

  const { data } = await api.get<{ success: boolean; message: string; summary: AdminApprovedPayrollResponse["summary"]; records: AdminApprovedPayrollRecord[] }>(
    "/admin/payroll/approved",
    { params },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load approved payroll records");
  }

  return {
    summary: data.summary,
    records: data.records ?? [],
  };
}

export async function bulkPaidAdminPayroll(payload: AdminBulkPaidPayrollPayload) {
  const results = await Promise.all(
    payload.payrollIds.map(async (payrollId) => {
      const { data } = await api.patch<{ success: boolean; message: string; data?: unknown }>(
        `/admin/payroll/${payrollId}/paid`,
        {},
      );

      if (!data.success) {
        throw new Error(data.message || `Failed to mark payroll ${payrollId} as paid`);
      }

      return data.data ?? null;
    }),
  );

  return results;
}

export async function getAdminPayrollOverview(params?: {
  date?: string;
  month?: string;
  year?: string;
  range?: AdminPayrollQueryParams["range"];
  startDate?: string;
  endDate?: string;
}) {
  const currentDate = params?.date ? new Date(params.date) : new Date();
  const resolvedParams = {
    date: params?.date,
    month: params?.month ?? String(currentDate.getMonth() + 1),
    year: params?.year ?? String(currentDate.getFullYear()),
    range: params?.range,
    startDate: params?.startDate,
    endDate: params?.endDate,
  };

  console.log("[AdminPayrollOverviewAPI] request", {
    input: params,
    resolvedParams,
  });

  const { data } = await api.get<AdminPayrollOverviewApiResponse>("/admin/payroll/overview", {
    params: resolvedParams,
  });
  if (!data.success) {
    throw new Error(data.message || "Failed to load payroll overview");
  }
  return data.summary;
}

export async function getAdminPayrollSummary(params?: {
  date?: string;
  month?: string;
  year?: string;
  projectId?: string;
  range?: AdminPayrollQueryParams["range"];
  startDate?: string;
  endDate?: string;
}) {
  const { data } = await api.get<AdminPayrollSummaryApiResponse>(
    "/admin/payroll/summary",
    { params },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load payroll summary");
  }

  return {
    subscription: data.subscription ?? null,
    summary: data.summary ?? {
      totalHours: 0,
      totalHoursDisplay: "0h 0m",
      totalPay: 0,
      pending: 0,
      processing: 0,
      paid: 0,
      inventoryAlerts: 0,
    },
    workers: data.workers ?? [],
  };
}

export async function getAdminPayrollUsers(params?: { date?: string }) {
  const { data } = await api.get<{ success: boolean; message: string; data: AdminPayrollUsersResponse }>(
    "/admin/payroll/users",
    { params },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load payroll users");
  }

  return data.data ?? {
    date: params?.date ?? new Date().toISOString(),
    subscription: null,
    totalUsers: 0,
    users: [],
  };
}

export async function getAdminPayStub(payrollId: string) {
  const { data } = await api.get<{ success: boolean; message: string; data: AdminPayStubResponse }>(
    `/admin/payroll/${payrollId}/stub`,
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load pay stub");
  }

  return data.data ?? {
    payrollId,
    worker: {
      id: "",
      fullName: "Worker",
      department: null,
      hourlyRate: 0,
    },
    project: null,
    payPeriod: {
      start: new Date().toISOString(),
      end: new Date().toISOString(),
    },
    earnings: {
      regularHours: 0,
      regularHoursDisplay: "0h 0m",
      regularPay: 0,
      overtimeHours: 0,
      overtimeHoursDisplay: "0h 0m",
      overtimePay: 0,
      grossPay: 0,
    },
    deductions: {
      totalDeductions: 0,
    },
    netPay: 0,
    employerCost: 0,
    status: "draft",
    processedAt: null,
  };
}

import { api } from "@/lib/api/client";

export type AdminPayrollSummaryWorker = {
  payrollId: string;
  project: { id: string; name: string } | null;
  worker: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    department: string | null;
  };
  hours: number;
  overtimeHours: number;
  rate: number;
  total: number;
  status: "draft" | "approved" | "paid" | string;
};

export type AdminPayrollSummaryResponse = {
  summary: {
    totalHours: number;
    totalPay: number;
    pending: number;
    processing: number;
    paid: number;
    inventoryAlerts: number;
  };
  workers: AdminPayrollSummaryWorker[];
};

export type AdminPayrollUsersResponse = {
  date: string;
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
    regularPay: number;
    overtimeHours: number;
    overtimePay: number;
    grossPay: number;
  };
  deductions: {
    totalDeductions: number;
  };
  netPay: number;
  status: string;
};

export async function getAdminPayrollSummary(params?: {
  month?: string;
  year?: string;
  projectId?: string;
}) {
  console.log(params);
  
  const { data } = await api.get<{ success: boolean; message: string; data: AdminPayrollSummaryResponse }>(
    "/admin/payroll/summary",
    { params },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load payroll summary");
  }

  return data.data ?? {
    summary: {
      totalHours: 0,
      totalPay: 0,
      pending: 0,
      processing: 0,
      paid: 0,
      inventoryAlerts: 0,
    },
    workers: [],
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
      regularPay: 0,
      overtimeHours: 0,
      overtimePay: 0,
      grossPay: 0,
    },
    deductions: {
      totalDeductions: 0,
    },
    netPay: 0,
    status: "draft",
  };
}

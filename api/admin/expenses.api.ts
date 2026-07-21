import { api } from "@/lib/api/client";

export type ReimbursementExpenseStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "PAID";
export type ReimbursementExpense = {
  id: string; title: string; expenseDate: string; amount: number; currency: string; category: string;
  vendor?: string | null; paymentMethod?: string | null; projectId?: string | null; notes?: string | null; receiptUrl?: string | null;
  status: ReimbursementExpenseStatus; submittedAt?: string | null; approvedAt?: string | null; rejectedAt?: string | null; paidAt?: string | null; rejectionNote?: string | null;
  createdAt: string; updatedAt: string; project?: { id: string; name: string } | null;
};
export type ExpensePayload = { title: string; expenseDate: string; amount: number; currency?: string; category: string; vendor?: string; paymentMethod?: string; projectId?: string; notes?: string; receiptUrl?: string; action?: "DRAFT" | "SUBMITTED" };
export type ExpenseFilters = { page?: number; limit?: number; search?: string; status?: string; category?: string; currency?: string; projectId?: string; sortBy?: "createdAt" | "expenseDate" | "amount"; sortOrder?: "asc" | "desc" };
export type ExpenseSummary = { totalExpenses: number; draft: number; submitted: number; approved: number; rejected: number; paid: number; totalAmountThisMonth: number };

type ListResponse = { success: boolean; message: string; data: ReimbursementExpense[]; meta: { page: number; limit: number; total: number; totalPages: number } };
type DataResponse<T> = { success: boolean; message: string; data: T };
type SummaryResponse = { success: boolean; message: string; summary: ExpenseSummary };

export async function getAdminExpenses(params?: ExpenseFilters) { const { data } = await api.get<ListResponse>("/admin/reimbursement-expenses", { params }); if (!data.success) throw new Error(data.message); return { data: data.data ?? [], meta: data.meta }; }
export async function getAdminExpenseSummary() { const { data } = await api.get<SummaryResponse>("/admin/reimbursement-expenses/summary"); if (!data.success) throw new Error(data.message); return data.summary; }
export async function getAdminExpense(id: string) { const { data } = await api.get<DataResponse<ReimbursementExpense>>(`/admin/reimbursement-expenses/${id}`); if (!data.success) throw new Error(data.message); return data.data; }
export async function createAdminExpense(payload: ExpensePayload) { const { data } = await api.post<DataResponse<ReimbursementExpense>>("/admin/reimbursement-expenses", payload); if (!data.success) throw new Error(data.message); return data.data; }
export async function updateAdminExpense(id: string, payload: Partial<ExpensePayload>) { const { data } = await api.patch<DataResponse<ReimbursementExpense>>(`/admin/reimbursement-expenses/${id}`, payload); if (!data.success) throw new Error(data.message); return data.data; }
export async function deleteAdminExpense(id: string) { const { data } = await api.delete<DataResponse<{ id: string }>>(`/admin/reimbursement-expenses/${id}`); if (!data.success) throw new Error(data.message); return data.data; }
export async function submitAdminExpense(id: string) { const { data } = await api.post<DataResponse<ReimbursementExpense>>(`/admin/reimbursement-expenses/${id}/submit`); if (!data.success) throw new Error(data.message); return data.data; }
export async function approveAdminExpense(id: string) { const { data } = await api.post<DataResponse<ReimbursementExpense>>(`/admin/reimbursement-expenses/${id}/approve`); if (!data.success) throw new Error(data.message); return data.data; }
export async function rejectAdminExpense(id: string, comment?: string) { const { data } = await api.post<DataResponse<ReimbursementExpense>>(`/admin/reimbursement-expenses/${id}/reject`, { comment }); if (!data.success) throw new Error(data.message); return data.data; }
export async function markAdminExpensePaid(id: string) { const { data } = await api.post<DataResponse<ReimbursementExpense>>(`/admin/reimbursement-expenses/${id}/mark-paid`); if (!data.success) throw new Error(data.message); return data.data; }

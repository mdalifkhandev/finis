import { api } from "@/lib/api/client";

export type ManagerQuote = {
  id: string;
  createdById: string;
  projectType: string;
  propertyType: string;
  unitType: string;
  title: string;
  quantity: number;
  unit: string | null;
  unitPrice: number;
  subtotal: number;
  notes: string | null;
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    role: string;
  };
};

export type ManagerQuotesResponse = {
  total: number;
  quotes: ManagerQuote[];
  requestedBy: string;
};

export async function getManagerQuotes(params?: {
  projectType?: string;
  propertyType?: string;
  unitType?: string;
}) {
  const normalizedParams = {
    projectType: params?.projectType?.toLowerCase(),
    propertyType: params?.propertyType?.toLowerCase(),
    unitType: params?.unitType?.toLowerCase(),
  };


  const { data } = await api.get<{ success: boolean; message: string; data: ManagerQuotesResponse }>(
    "/manager/quotes",
    { params: normalizedParams },
  );

  if (!data.success) {
    throw new Error(data.message || "Failed to load quotes");
  }

  return data.data;
}

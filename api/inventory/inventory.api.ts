import { api } from "@/lib/api/client";
import { ApiResponse } from "@/types/auth.types";

export type InventoryApiResponseItem = {
  id: string;
  name: string;
  category: string;
  currentQty: number;
  unit: string;
  minStockQty: number;
  stockStatus: string;
  location: string | null;
  unresolvedDamages: number;
  project: {
    id: string;
    name: string;
  } | null;
  updatedAt: string;
};

type GetAllInventoryResponse = ApiResponse<InventoryApiResponseItem[]> & {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export async function getAllInventoryItems() {
  const { data } = await api.get<GetAllInventoryResponse>("/inventory/all");
  
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch inventory items");
  }
  
  return data;
}



export type InventorySummaryData = {
  totalProducts: number;
  lowStockAlerts: number;
  unresolvedDamages: number;
};

type GetInventorySummaryResponse = ApiResponse<InventorySummaryData>;

export async function getInventorySummary() {
  const { data } = await api.get<GetInventorySummaryResponse>("/inventory/summary");
  
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch inventory summary");
  }
  
  return data.data;
}


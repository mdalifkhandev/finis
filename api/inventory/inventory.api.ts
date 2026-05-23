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


export type CreateInventoryPayload = {
  projectId: string;
  name: string;
  category: string;
  unit: string;
  currentQty: number;
  minStockQty: number;
  location: string;
};

export async function createInventoryItem(payload: CreateInventoryPayload) {
  const { data } = await api.post<ApiResponse<any>>("/inventory", payload);
  
  if (!data.success) {
    throw new Error(data.message || "Failed to create inventory item");
  }
  
  return data.data;
}


export type InventoryProject = {
  id: string;
  name: string;
};

type GetInventoryProjectsResponse = ApiResponse<InventoryProject[]>;

export async function getInventoryProjects() {
  const { data } = await api.get<GetInventoryProjectsResponse>("/inventory/projects");
  
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch inventory projects");
  }
  
  return data.data;
}


export type LowStockItemResponse = {
  id: string;
  name: string;
  category: string;
  unit: string;
  location: string | null;
  currentQty: number;
  minStockQty: number;
  shortage: number;
  stockStatus: string;
  project: {
    id: string;
    name: string;
  } | null;
  updatedAt: string;
};

type GetLowStockAlertsResponse = ApiResponse<LowStockItemResponse[]>;

export async function getLowStockAlerts() {
  const { data } = await api.get<GetLowStockAlertsResponse>("/inventory/low-stock");
  
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch low stock alerts");
  }
  
  return data.data;
}


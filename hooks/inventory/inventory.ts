import { useQuery } from "@tanstack/react-query";
import { getAllInventoryItems } from "@/api/inventory/inventory.api";
import { InventoryItem } from "@/components/inventory/types";

export function useAllInventoryItemsQuery() {
  return useQuery({
    queryKey: ["inventory", "all"],
    queryFn: async () => {
      const response = await getAllInventoryItems();
      const mappedItems: InventoryItem[] = response.data.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        currentQty: item.currentQty,
        minStock: item.minStockQty,
        unit: item.unit,
        location: item.location || "Unknown",
        updatedAt: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
      }));
      return mappedItems;
    },
  });
}


export function useInventorySummaryQuery() {
  return useQuery({
    queryKey: ["inventory", "summary"],
    queryFn: () => import("@/api/inventory/inventory.api").then(m => m.getInventorySummary()),
  });
}


import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInventoryItem, CreateInventoryPayload } from "@/api/inventory/inventory.api";
import { toast } from "sonner-native";

export function useCreateInventoryMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreateInventoryPayload) => createInventoryItem(payload),
    onSuccess: () => {
      toast.success("Inventory item added successfully");
      queryClient.invalidateQueries({ queryKey: ["inventory", "all"] });
      queryClient.invalidateQueries({ queryKey: ["inventory", "summary"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add inventory item");
    },
  });
}


export function useInventoryProjectsQuery() {
  return useQuery({
    queryKey: ["inventory", "projects"],
    queryFn: () => import("@/api/inventory/inventory.api").then(m => m.getInventoryProjects()),
  });
}


import { LowStockAlert, InventoryStatus } from "@/components/inventory/types";

export function useLowStockAlertsQuery() {
  return useQuery({
    queryKey: ["inventory", "low-stock"],
    queryFn: async () => {
      const response = await import("@/api/inventory/inventory.api").then(m => m.getLowStockAlerts());
      const mappedAlerts: LowStockAlert[] = response.map(item => ({
        id: item.id,
        title: item.name,
        message: `Only ${item.currentQty} ${item.unit} remaining (Shortage: ${item.shortage})`,
        status: item.stockStatus === "CRITICAL" ? "Critical" : "Low Stock",
      }));
      return mappedAlerts;
    },
  });
}


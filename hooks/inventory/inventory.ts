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


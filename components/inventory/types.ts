export type InventoryStatus = "Critical" | "Low Stock" | "In Stock";

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  currentQty: number;
  minStock: number;
  unit: string;
  location: string;
  updatedAt: string;
};

export type LowStockAlert = {
  id: string;
  title: string;
  message: string;
  status: Extract<InventoryStatus, "Critical" | "Low Stock">;
};

import { useSyncExternalStore } from "react";
import { InventoryItem, InventoryStatus, LowStockAlert } from "./types";

const initialInventoryItems: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Cement",
    category: "Materials",
    currentQty: 15,
    minStock: 50,
    unit: "bags",
    location: "Warehouse A",
    updatedAt: "Jan 12",
  },
  {
    id: "inv-2",
    name: "Steel Rods",
    category: "Materials",
    currentQty: 8,
    minStock: 30,
    unit: "units",
    location: "Warehouse A",
    updatedAt: "Jan 12",
  },
  {
    id: "inv-3",
    name: "Safety Helmets",
    category: "Safety",
    currentQty: 25,
    minStock: 30,
    unit: "pcs",
    location: "Safety Storage",
    updatedAt: "Jan 10",
  },
  {
    id: "inv-4",
    name: "Paint (White)",
    category: "Materials",
    currentQty: 45,
    minStock: 20,
    unit: "gallons",
    location: "Warehouse A",
    updatedAt: "Jan 13",
  },
];

let inventoryItems = initialInventoryItems;
let totalItemsCount = 56;
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => inventoryItems;

export function getInventoryStatus(item: InventoryItem): InventoryStatus {
  if (item.currentQty <= item.minStock * 0.4) {
    return "Critical";
  }

  if (item.currentQty < item.minStock) {
    return "Low Stock";
  }

  return "In Stock";
}

export function useInventoryItems() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function useInventorySummary() {
  const items = useInventoryItems();
  const lowStockCount = items.filter((item) => getInventoryStatus(item) !== "In Stock").length;

  return {
    totalItems: totalItemsCount,
    lowStock: lowStockCount,
  };
}

export function useLowStockAlerts() {
  const items = useInventoryItems();

  return items
    .filter((item) => getInventoryStatus(item) !== "In Stock")
    .slice(0, 3)
    .map((item) => {
      const status = getInventoryStatus(item) as Extract<InventoryStatus, "Critical" | "Low Stock">;

      const alert: LowStockAlert = {
        id: item.id,
        title: item.name,
        message: `Only ${item.currentQty} ${item.unit} remaining`,
        status,
      };

      return alert;
    });
}

export function addInventoryItem(input: {
  name: string;
  location: string;
  quantity: number;
}) {
  const quantity = Number.isFinite(input.quantity) ? Math.max(0, input.quantity) : 0;

  const newItem: InventoryItem = {
    id: `inv-${Date.now()}`,
    name: input.name,
    category: "Materials",
    currentQty: quantity,
    minStock: Math.max(10, Math.round(quantity * 0.6) || 10),
    unit: "pcs",
    location: input.location,
    updatedAt: "Today",
  };

  inventoryItems = [newItem, ...inventoryItems];
  totalItemsCount += 1;
  notify();
}

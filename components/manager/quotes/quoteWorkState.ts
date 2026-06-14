import type { QuoteSelectedWorkGroup } from "./QuoteWorkGroupCard";
import type { QuoteSelectedWorkItem } from "./QuoteWorkItemCard";
import type {
  QuoteCatalog,
  QuoteWorkGroup,
  QuoteWorkItemTemplate,
} from "./quoteMockData";

function mapItem(item: QuoteWorkItemTemplate): QuoteSelectedWorkItem {
  return {
    id: item.id,
    title: item.title,
    quantity: String(item.defaultQuantity),
    unitOptions: item.unitOptions,
    selectedUnit: item.unitOptions[0].unit,
    selectedUnitPrice: item.unitOptions[0].price,
    selected: false,
  };
}

function mapGroup(group: QuoteWorkGroup, index: number): QuoteSelectedWorkGroup {
  return {
    id: group.id,
    title: group.title,
    expanded: index === 0,
    items: group.items.map(mapItem),
  };
}

export function buildQuoteSelectedWorkGroups(
  catalog: QuoteCatalog,
): QuoteSelectedWorkGroup[] {
  return catalog.groups.map(mapGroup);
}

export function toggleQuoteWorkGroup(
  groups: QuoteSelectedWorkGroup[],
  groupId: string,
): QuoteSelectedWorkGroup[] {
  return groups.map((group) =>
    group.id === groupId ? { ...group, expanded: !group.expanded } : group,
  );
}

export function toggleQuoteWorkItem(
  groups: QuoteSelectedWorkGroup[],
  groupId: string,
  itemId: string,
): QuoteSelectedWorkGroup[] {
  return groups.map((group) =>
    group.id === groupId
      ? {
          ...group,
          items: group.items.map((item) =>
            item.id === itemId ? { ...item, selected: !item.selected } : item,
          ),
        }
      : group,
  );
}

export function updateQuoteWorkItemQuantity(
  groups: QuoteSelectedWorkGroup[],
  groupId: string,
  itemId: string,
  value: string,
): QuoteSelectedWorkGroup[] {
  return groups.map((group) =>
    group.id === groupId
      ? {
          ...group,
          items: group.items.map((item) =>
            item.id === itemId ? { ...item, quantity: value } : item,
          ),
        }
      : group,
  );
}

export function updateQuoteWorkItemUnit(
  groups: QuoteSelectedWorkGroup[],
  groupId: string,
  itemId: string,
  unit: string,
): QuoteSelectedWorkGroup[] {
  return groups.map((group) =>
    group.id === groupId
      ? {
          ...group,
          items: group.items.map((item) => {
            if (item.id !== itemId) return item;
            const option = item.unitOptions.find(
              (unitOption) => unitOption.unit === unit,
            );
            return option
              ? {
                  ...item,
                  selectedUnit: option.unit,
                  selectedUnitPrice: option.price,
                }
              : item;
          }),
        }
      : group,
  );
}

export function updateQuoteWorkItemDetails(
  groups: QuoteSelectedWorkGroup[],
  groupId: string,
  itemId: string,
  updates: {
    title: string;
    quantity: string;
    unit: string;
    unitPrice: string;
  },
): QuoteSelectedWorkGroup[] {
  const quantityValue = Number(updates.quantity) || 0;
  const unitPriceValue = Number(updates.unitPrice) || 0;
  const nextTitle = updates.title.trim() || "";
  const nextUnit = updates.unit.trim() || "pcs";

  return groups.map((group) =>
    group.id === groupId
      ? {
          ...group,
          title: nextTitle || group.title,
          items: group.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  title: nextTitle || item.title,
                  quantity: String(quantityValue),
                  unitOptions: [{ unit: nextUnit, price: unitPriceValue }],
                  selectedUnit: nextUnit,
                  selectedUnitPrice: unitPriceValue,
                }
              : item,
          ),
        }
      : group,
  );
}

export function addCustomQuoteWorkItem(
  groups: QuoteSelectedWorkGroup[],
  customTitle: string,
  customQuantity: string,
  customUnit: string,
  customUnitPrice: string,
): QuoteSelectedWorkGroup[] {
  const quantityValue = Number(customQuantity) || 1;
  const unitPriceValue = Number(customUnitPrice) || 0;
  const unitLabel = customUnit.trim() || "pcs";
  const customItem: QuoteSelectedWorkItem = {
    id: `custom-${Date.now()}`,
    title: customTitle.trim(),
    quantity: String(quantityValue),
    unitOptions: [{ unit: unitLabel, price: unitPriceValue }],
    selectedUnit: unitLabel,
    selectedUnitPrice: unitPriceValue,
    selected: true,
    isCustom: true,
  };
  const customGroup = groups.find((group) => group.id === "custom-items");

  if (customGroup) {
    return groups.map((group) =>
      group.id === "custom-items"
        ? { ...group, expanded: true, items: [...group.items, customItem] }
        : group,
    );
  }

  return [
    ...groups,
    {
      id: "custom-items",
      title: "Custom Items",
      expanded: true,
      items: [customItem],
    },
  ];
}

export function calculateQuoteWorkTotals(groups: QuoteSelectedWorkGroup[]) {
  const subtotal = groups.reduce(
    (groupTotal, group) =>
      groupTotal +
      group.items.reduce((itemTotal, item) => {
        if (!item.selected) return itemTotal;
        return itemTotal + (Number(item.quantity) || 0) * item.selectedUnitPrice;
      }, 0),
    0,
  );

  const itemsSelected = groups.reduce(
    (total, group) => total + group.items.filter((item) => item.selected).length,
    0,
  );

  return {
    subtotal,
    itemsSelected,
  };
}

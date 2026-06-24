export type QuoteProjectType = "New Build" | "Renovations";
export type QuotePropertyType = "Residential" | "Commercial";
export type QuoteUnitType = "House" | "Apartment";

export type QuoteLineItem = {
  label: string;
  amount: number;
};

export type QuoteEstimate = {
  title: string;
  subtitle: string;
  timeline?: string;
  lineItems: QuoteLineItem[];
};

export type QuoteUnitOption = {
  unit: string;
  price: number;
};

export type QuoteWorkItemTemplate = {
  id: string;
  title: string;
  defaultQuantity: number;
  unitOptions: QuoteUnitOption[];
};

export type QuoteWorkGroup = {
  id: string;
  title: string;
  items: QuoteWorkItemTemplate[];
};

export type QuoteCatalog = {
  key: string;
  title: string;
  description: string;
  groups: QuoteWorkGroup[];
};

export function formatCurrency(amount: number) {
  return `$${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

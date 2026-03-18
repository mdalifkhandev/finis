export type QuoteProjectType = "New Build" | "Renovation";
export type QuotePropertyType = "Residential" | "Commercial";
export type QuoteUnitType = "House" | "Apartment" | "Office" | "Hotel";

export type QuoteLineItem = {
  label: string;
  amount: number;
};

export type QuoteEstimate = {
  title: string;
  subtitle: string;
  timeline: string;
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

type QuotePricingMap = Record<QuoteProjectType, Record<QuotePropertyType, Record<QuoteUnitType, QuoteEstimate>>>;
type QuoteWorkGroupMap = Record<QuoteProjectType, Record<QuotePropertyType, Record<QuoteUnitType, QuoteWorkGroup[]>>>;

const unit = (name: string, price: number): QuoteUnitOption => ({ unit: name, price });
const item = (id: string, title: string, defaultQuantity: number, unitOptions: QuoteUnitOption[]): QuoteWorkItemTemplate => ({ id, title, defaultQuantity, unitOptions });

export const quotePricingMap: QuotePricingMap = {
  "New Build": {
    Residential: {
      House: {
        title: "New House Build Estimate",
        subtitle: "Pricing based on residential house construction.",
        timeline: "14 - 18 weeks",
        lineItems: [
          { label: "Structural work", amount: 18500 },
          { label: "Electrical installation", amount: 6200 },
          { label: "Finishing materials", amount: 5400 },
        ],
      },
      Apartment: {
        title: "New Apartment Build Estimate",
        subtitle: "Pricing based on apartment unit construction.",
        timeline: "10 - 14 weeks",
        lineItems: [
          { label: "Core construction", amount: 15600 },
          { label: "Electrical and HVAC", amount: 7100 },
          { label: "Interior finishing", amount: 4800 },
        ],
      },
      Office: {
        title: "New Residential Office Estimate",
        subtitle: "Pricing based on office-style residential conversion.",
        timeline: "12 - 15 weeks",
        lineItems: [
          { label: "Framing and layout", amount: 14900 },
          { label: "Utility setup", amount: 6900 },
          { label: "Fit-out package", amount: 5300 },
        ],
      },
      Hotel: {
        title: "New Residential Hotel Estimate",
        subtitle: "Pricing based on hospitality unit construction.",
        timeline: "16 - 20 weeks",
        lineItems: [
          { label: "Structural package", amount: 21400 },
          { label: "MEP installation", amount: 8600 },
          { label: "Guest finish package", amount: 7900 },
        ],
      },
    },
    Commercial: {
      House: {
        title: "Commercial House Estimate",
        subtitle: "Pricing based on mixed-use house development.",
        timeline: "15 - 19 weeks",
        lineItems: [
          { label: "Shell construction", amount: 19800 },
          { label: "Systems integration", amount: 7700 },
          { label: "Facade and interiors", amount: 6200 },
        ],
      },
      Apartment: {
        title: "Commercial Apartment Estimate",
        subtitle: "Pricing based on commercial apartment development.",
        timeline: "13 - 17 weeks",
        lineItems: [
          { label: "Concrete and framing", amount: 22100 },
          { label: "Vertical systems", amount: 9800 },
          { label: "Interior delivery", amount: 7100 },
        ],
      },
      Office: {
        title: "Commercial Office Estimate",
        subtitle: "Pricing based on office building delivery.",
        timeline: "12 - 16 weeks",
        lineItems: [
          { label: "Structure and partitions", amount: 24300 },
          { label: "Electrical and network", amount: 11400 },
          { label: "Ceiling and flooring", amount: 8300 },
        ],
      },
      Hotel: {
        title: "Commercial Hotel Estimate",
        subtitle: "Pricing based on hotel-grade commercial delivery.",
        timeline: "18 - 24 weeks",
        lineItems: [
          { label: "Primary structure", amount: 28600 },
          { label: "Hospitality systems", amount: 13100 },
          { label: "Rooms and lobby finish", amount: 12600 },
        ],
      },
    },
  },
  Renovation: {
    Residential: {
      House: {
        title: "House Renovation Estimate",
        subtitle: "Pricing based on residential house renovation.",
        timeline: "5 - 8 weeks",
        lineItems: [
          { label: "Demolition and prep", amount: 4200 },
          { label: "Electrical rework", amount: 3600 },
          { label: "Finishing package", amount: 3100 },
        ],
      },
      Apartment: {
        title: "Apartment Renovation Estimate",
        subtitle: "Pricing based on apartment renovation.",
        timeline: "4 - 7 weeks",
        lineItems: [
          { label: "Interior strip-out", amount: 3500 },
          { label: "MEP upgrades", amount: 3900 },
          { label: "Paint and finish", amount: 2700 },
        ],
      },
      Office: {
        title: "Office Renovation Estimate",
        subtitle: "Pricing based on office-fit renovation.",
        timeline: "6 - 9 weeks",
        lineItems: [
          { label: "Layout adjustment", amount: 5100 },
          { label: "Systems refresh", amount: 4700 },
          { label: "Finish replacement", amount: 3500 },
        ],
      },
      Hotel: {
        title: "Hotel Renovation Estimate",
        subtitle: "Pricing based on hospitality renovation.",
        timeline: "8 - 12 weeks",
        lineItems: [
          { label: "Guest room refresh", amount: 9200 },
          { label: "Service upgrades", amount: 6800 },
          { label: "Decor package", amount: 5400 },
        ],
      },
    },
    Commercial: {
      House: {
        title: "Mixed-use Renovation Estimate",
        subtitle: "Pricing based on mixed-use property renovation.",
        timeline: "7 - 10 weeks",
        lineItems: [
          { label: "Reinforcement works", amount: 6400 },
          { label: "Power and lighting", amount: 5200 },
          { label: "Final finishes", amount: 3800 },
        ],
      },
      Apartment: {
        title: "Commercial Apartment Renovation Estimate",
        subtitle: "Pricing based on commercial apartment upgrade.",
        timeline: "6 - 9 weeks",
        lineItems: [
          { label: "Structure refresh", amount: 7100 },
          { label: "MEP modernization", amount: 6400 },
          { label: "Interior improvement", amount: 4500 },
        ],
      },
      Office: {
        title: "Commercial Office Renovation Estimate",
        subtitle: "Pricing based on office modernization work.",
        timeline: "7 - 11 weeks",
        lineItems: [
          { label: "Demolition and rebuild", amount: 8600 },
          { label: "Technology and power", amount: 7900 },
          { label: "Premium finish pack", amount: 6100 },
        ],
      },
      Hotel: {
        title: "Commercial Hotel Renovation Estimate",
        subtitle: "Pricing based on hotel renovation scope.",
        timeline: "10 - 14 weeks",
        lineItems: [
          { label: "Room overhaul", amount: 12200 },
          { label: "Service upgrades", amount: 9500 },
          { label: "Lobby and finish works", amount: 7300 },
        ],
      },
    },
  },
};

const apartmentWorkGroups: QuoteWorkGroup[] = [
  {
    id: "final-cleaning",
    title: "Final Cleaning",
    items: [
      item("interior-deep-clean", "Interior Deep Clean", 1, [unit("service", 50)]),
      item("window-cleaning", "Window Cleaning", 4, [unit("panel", 12.5), unit("sqm", 10)]),
      item("debris-removal", "Debris Removal", 1, [unit("load", 350), unit("bag", 18)]),
      item("floor-polishing", "Floor Polishing", 1, [unit("room", 75), unit("sqm", 4.5)]),
    ],
  },
  {
    id: "caulking",
    title: "Caulking",
    items: [
      item("bathroom-caulking", "Bathroom Caulking", 1, [unit("bathroom", 120)]),
      item("kitchen-caulking", "Kitchen Caulking", 1, [unit("kitchen", 150)]),
      item("window-sealing", "Window Sealing", 8, [unit("ft", 3), unit("meter", 9.84)]),
      item("exterior-caulking", "Exterior Caulking", 6, [unit("meter", 4.5), unit("ft", 1.37)]),
    ],
  },
  {
    id: "fixture-installation",
    title: "Fixture Installation",
    items: [
      item("light-fixture-installation", "Light Fixture Installation", 3, [unit("pcs", 125), unit("set", 340)]),
      item("ceiling-fan-installation", "Ceiling Fan Installation", 1, [unit("pcs", 200)]),
      item("bathroom-fixture-installation", "Bathroom Fixture Installation", 1, [unit("set", 175), unit("pcs", 58)]),
      item("cabinet-hardware-installation", "Cabinet Hardware Installation", 10, [unit("pcs", 5), unit("set", 42)]),
    ],
  },
];

const houseWorkGroups: QuoteWorkGroup[] = [
  {
    id: "materials",
    title: "Materials",
    items: [
      item("steel-rod", "Steel Rod", 1, [unit("kg", 2.8), unit("bundle", 85)]),
      item("cement-bag", "Cement Bag", 12, [unit("pcs", 8.5)]),
      item("electric-cable", "Electric Cable", 25, [unit("meter", 1.9), unit("ft", 0.58)]),
    ],
  },
  {
    id: "fixtures",
    title: "Fixtures",
    items: [
      item("led-light", "LED Light", 3, [unit("pcs", 18), unit("box", 96)]),
      item("door-lock", "Door Lock", 4, [unit("pcs", 22)]),
      item("wall-switch", "Wall Switch", 8, [unit("pcs", 6), unit("set", 28)]),
    ],
  },
  {
    id: "finishes",
    title: "Finishes",
    items: [
      item("paint-finish", "Paint Finish", 40, [unit("sqm", 2.4), unit("ft", 0.23)]),
      item("baseboard-installation", "Baseboard Installation", 25, [unit("meter", 3.2), unit("ft", 0.98)]),
      item("floor-tile", "Floor Tile", 18, [unit("sqm", 14), unit("box", 32)]),
    ],
  },
];

const officeWorkGroups: QuoteWorkGroup[] = [
  {
    id: "workspace-setup",
    title: "Workspace Setup",
    items: [
      item("partition-install", "Partition Installation", 12, [unit("meter", 42), unit("ft", 12.8)]),
      item("floor-boxes", "Floor Box Installation", 6, [unit("pcs", 140)]),
      item("meeting-room-fitout", "Meeting Room Fit-out", 1, [unit("room", 980)]),
    ],
  },
  {
    id: "network-electrical",
    title: "Network & Electrical",
    items: [
      item("data-cabling", "Data Cabling", 60, [unit("meter", 6), unit("ft", 1.83)]),
      item("lighting-grid", "Lighting Grid", 14, [unit("pcs", 55), unit("set", 780)]),
      item("access-control", "Access Control Setup", 2, [unit("door", 450)]),
    ],
  },
];

const hotelWorkGroups: QuoteWorkGroup[] = [
  {
    id: "guest-rooms",
    title: "Guest Rooms",
    items: [
      item("room-fixtures", "Room Fixture Installation", 8, [unit("room", 680)]),
      item("bath-fitout", "Bath Fit-out", 8, [unit("room", 740)]),
      item("finish-touchups", "Finish Touch-ups", 20, [unit("sqm", 5.5), unit("ft", 0.52)]),
    ],
  },
  {
    id: "public-areas",
    title: "Public Areas",
    items: [
      item("lobby-lighting", "Lobby Lighting", 12, [unit("pcs", 105), unit("set", 1250)]),
      item("corridor-finishes", "Corridor Finishes", 30, [unit("meter", 18), unit("ft", 5.49)]),
      item("signage-install", "Signage Installation", 4, [unit("set", 420)]),
    ],
  },
];

const quoteWorkGroupMap: QuoteWorkGroupMap = {
  "New Build": {
    Residential: {
      House: houseWorkGroups,
      Apartment: apartmentWorkGroups,
      Office: officeWorkGroups,
      Hotel: hotelWorkGroups,
    },
    Commercial: {
      House: houseWorkGroups,
      Apartment: apartmentWorkGroups,
      Office: officeWorkGroups,
      Hotel: hotelWorkGroups,
    },
  },
  Renovation: {
    Residential: {
      House: houseWorkGroups,
      Apartment: apartmentWorkGroups,
      Office: officeWorkGroups,
      Hotel: hotelWorkGroups,
    },
    Commercial: {
      House: houseWorkGroups,
      Apartment: apartmentWorkGroups,
      Office: officeWorkGroups,
      Hotel: hotelWorkGroups,
    },
  },
};

export function getQuoteEstimate(projectType: QuoteProjectType, propertyType: QuotePropertyType, unitType: QuoteUnitType) {
  return quotePricingMap[projectType][propertyType][unitType];
}

export function getQuoteWorkGroups(projectType: QuoteProjectType, propertyType: QuotePropertyType, unitType: QuoteUnitType) {
  return quoteWorkGroupMap[projectType][propertyType][unitType];
}

export function getQuoteTotal(lineItems: QuoteLineItem[]) {
  return lineItems.reduce((total, item) => total + item.amount, 0);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

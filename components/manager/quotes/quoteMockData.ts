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

export type QuoteCatalog = {
  key: string;
  title: string;
  description: string;
  groups: QuoteWorkGroup[];
};

type QuotePricingMap = Record<
  QuoteProjectType,
  Record<QuotePropertyType, Record<QuoteUnitType, QuoteEstimate>>
>;
type QuoteCatalogMap = Record<
  QuoteProjectType,
  Record<QuotePropertyType, Record<QuoteUnitType, QuoteCatalog>>
>;

const unit = (name: string, price: number): QuoteUnitOption => ({ unit: name, price });
const item = (
  id: string,
  title: string,
  defaultQuantity: number,
  unitOptions: QuoteUnitOption[],
): QuoteWorkItemTemplate => ({ id, title, defaultQuantity, unitOptions });

const residentialHouseWorkGroups: QuoteWorkGroup[] = [
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

const commercialHouseWorkGroups: QuoteWorkGroup[] = [
  {
    id: "shell-works",
    title: "Shell Works",
    items: [
      item("structural-frame", "Structural Frame", 18, [unit("meter", 32), unit("ft", 9.75)]),
      item("exterior-cladding", "Exterior Cladding", 60, [unit("sqm", 19), unit("ft", 1.76)]),
      item("roof-package", "Roof Package", 1, [unit("set", 1800)]),
    ],
  },
  {
    id: "systems-fitout",
    title: "Systems & Fit-out",
    items: [
      item("distribution-board", "Distribution Board", 2, [unit("pcs", 220)]),
      item("commercial-lighting", "Commercial Lighting", 16, [unit("pcs", 48), unit("set", 720)]),
      item("fire-safety-kit", "Fire Safety Kit", 4, [unit("set", 265)]),
    ],
  },
  {
    id: "delivery-package",
    title: "Delivery Package",
    items: [
      item("signage-install", "Signage Installation", 3, [unit("pcs", 140), unit("set", 360)]),
      item("parking-marking", "Parking Marking", 85, [unit("ft", 2.4), unit("meter", 7.87)]),
      item("shopfront-glass", "Shopfront Glass", 22, [unit("sqm", 28)]),
    ],
  },
];

const residentialApartmentWorkGroups: QuoteWorkGroup[] = [
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

const commercialApartmentWorkGroups: QuoteWorkGroup[] = [
  {
    id: "core-buildout",
    title: "Core Build-out",
    items: [
      item("concrete-partition", "Concrete Partition", 28, [unit("sqm", 21), unit("ft", 1.95)]),
      item("metal-framing", "Metal Framing", 35, [unit("meter", 14), unit("ft", 4.27)]),
      item("service-shaft", "Service Shaft Package", 1, [unit("set", 1350)]),
    ],
  },
  {
    id: "mep-package",
    title: "MEP Package",
    items: [
      item("sprinkler-head", "Sprinkler Head", 12, [unit("pcs", 52)]),
      item("hvac-diffuser", "HVAC Diffuser", 6, [unit("pcs", 88)]),
      item("cable-tray", "Cable Tray", 30, [unit("meter", 18), unit("ft", 5.49)]),
    ],
  },
  {
    id: "handover-finish",
    title: "Handover Finish",
    items: [
      item("lobby-flooring", "Lobby Flooring", 40, [unit("sqm", 16), unit("ft", 1.49)]),
      item("unit-door-package", "Unit Door Package", 8, [unit("pcs", 260)]),
      item("wayfinding-signage", "Wayfinding Signage", 6, [unit("pcs", 95), unit("set", 470)]),
    ],
  },
];

function makeCatalog(
  projectType: QuoteProjectType,
  propertyType: QuotePropertyType,
  unitType: QuoteUnitType,
  groups: QuoteWorkGroup[],
): QuoteCatalog {
  return {
    key: `${projectType}-${propertyType}-${unitType}`,
    title: `${projectType} - ${propertyType} - ${unitType}`,
    description:
      `Services loaded from the ${projectType} / ${propertyType} / ${unitType} pricing catalog. ` +
      "Select items, enter quantity, and pick the correct unit of measurement.",
    groups,
  };
}

export const quotePricingMap: QuotePricingMap = {
  "New Build": {
    Residential: {
      House: {
        title: "New Build Residential House Estimate",
        subtitle: "Pricing based on new residential house construction.",
        timeline: "14 - 18 weeks",
        lineItems: [
          { label: "Structural work", amount: 18500 },
          { label: "Electrical installation", amount: 6200 },
          { label: "Finishing materials", amount: 5400 },
        ],
      },
      Apartment: {
        title: "New Build Residential Apartment Estimate",
        subtitle: "Pricing based on new residential apartment work.",
        timeline: "10 - 14 weeks",
        lineItems: [
          { label: "Core construction", amount: 15600 },
          { label: "Electrical and HVAC", amount: 7100 },
          { label: "Interior finishing", amount: 4800 },
        ],
      },
    },
    Commercial: {
      House: {
        title: "New Build Commercial House Estimate",
        subtitle: "Pricing based on new commercial house development.",
        timeline: "15 - 19 weeks",
        lineItems: [
          { label: "Shell construction", amount: 19800 },
          { label: "Systems integration", amount: 7700 },
          { label: "Facade and interiors", amount: 6200 },
        ],
      },
      Apartment: {
        title: "New Build Commercial Apartment Estimate",
        subtitle: "Pricing based on new commercial apartment development.",
        timeline: "13 - 17 weeks",
        lineItems: [
          { label: "Concrete and framing", amount: 22100 },
          { label: "Vertical systems", amount: 9800 },
          { label: "Interior delivery", amount: 7100 },
        ],
      },
    },
  },
  Renovations: {
    Residential: {
      House: {
        title: "Renovations Residential House Estimate",
        subtitle: "Pricing based on residential house renovation.",
        timeline: "5 - 8 weeks",
        lineItems: [
          { label: "Demolition and prep", amount: 4200 },
          { label: "Electrical rework", amount: 3600 },
          { label: "Finishing package", amount: 3100 },
        ],
      },
      Apartment: {
        title: "Renovations Residential Apartment Estimate",
        subtitle: "Pricing based on apartment renovation.",
        timeline: "4 - 7 weeks",
        lineItems: [
          { label: "Interior strip-out", amount: 3500 },
          { label: "MEP upgrades", amount: 3900 },
          { label: "Paint and finish", amount: 2700 },
        ],
      },
    },
    Commercial: {
      House: {
        title: "Renovations Commercial House Estimate",
        subtitle: "Pricing based on commercial house renovation.",
        timeline: "7 - 10 weeks",
        lineItems: [
          { label: "Reinforcement works", amount: 6400 },
          { label: "Power and lighting", amount: 5200 },
          { label: "Final finishes", amount: 3800 },
        ],
      },
      Apartment: {
        title: "Renovations Commercial Apartment Estimate",
        subtitle: "Pricing based on commercial apartment upgrade.",
        timeline: "6 - 9 weeks",
        lineItems: [
          { label: "Structure refresh", amount: 7100 },
          { label: "MEP modernization", amount: 6400 },
          { label: "Interior improvement", amount: 4500 },
        ],
      },
    },
  },
};

const quoteCatalogMap: QuoteCatalogMap = {
  "New Build": {
    Residential: {
      House: makeCatalog("New Build", "Residential", "House", residentialHouseWorkGroups),
      Apartment: makeCatalog("New Build", "Residential", "Apartment", residentialApartmentWorkGroups),
    },
    Commercial: {
      House: makeCatalog("New Build", "Commercial", "House", commercialHouseWorkGroups),
      Apartment: makeCatalog("New Build", "Commercial", "Apartment", commercialApartmentWorkGroups),
    },
  },
  Renovations: {
    Residential: {
      House: makeCatalog("Renovations", "Residential", "House", residentialHouseWorkGroups),
      Apartment: makeCatalog("Renovations", "Residential", "Apartment", residentialApartmentWorkGroups),
    },
    Commercial: {
      House: makeCatalog("Renovations", "Commercial", "House", commercialHouseWorkGroups),
      Apartment: makeCatalog("Renovations", "Commercial", "Apartment", commercialApartmentWorkGroups),
    },
  },
};

export function getQuoteEstimate(
  projectType: QuoteProjectType,
  propertyType: QuotePropertyType,
  unitType: QuoteUnitType,
) {
  return quotePricingMap[projectType][propertyType][unitType];
}

export function getQuoteCatalog(
  projectType: QuoteProjectType,
  propertyType: QuotePropertyType,
  unitType: QuoteUnitType,
) {
  return quoteCatalogMap[projectType][propertyType][unitType];
}

export function getQuoteWorkGroups(
  projectType: QuoteProjectType,
  propertyType: QuotePropertyType,
  unitType: QuoteUnitType,
) {
  return getQuoteCatalog(projectType, propertyType, unitType).groups;
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

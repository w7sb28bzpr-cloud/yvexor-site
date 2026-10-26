import type { BusinessToolCategoryId } from "./content-types";

export const businessToolCategories: { id: BusinessToolCategoryId; label: string }[] = [
  { id: "sell", label: "Vendre & encaisser" },
  { id: "customers", label: "Clients & équipe" },
  { id: "operations", label: "Stock & logistique" },
  { id: "finance", label: "Gestion & finances" },
  { id: "digital", label: "En ligne" },
  { id: "automate", label: "Automatiser & IA" },
  { id: "business", label: "Packs métier" },
];

export const businessToolCategoryById = Object.fromEntries(
  businessToolCategories.map((category) => [category.id, category]),
) as Record<BusinessToolCategoryId, (typeof businessToolCategories)[number]>;

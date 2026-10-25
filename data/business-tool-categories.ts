import type { BusinessToolCategoryId } from "./content-types";

export const businessToolCategories: { id: BusinessToolCategoryId; label: string }[] = [
  { id: "manage", label: "Gérer" },
  { id: "sell", label: "Vendre" },
  { id: "business", label: "Mon activité" },
  { id: "digital", label: "Digital" },
  { id: "automate", label: "Automatiser & piloter" },
];

export const businessToolCategoryById = Object.fromEntries(
  businessToolCategories.map((category) => [category.id, category]),
) as Record<BusinessToolCategoryId, (typeof businessToolCategories)[number]>;

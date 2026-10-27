import type { BusinessToolCategoryId, ToolIconId } from "./content-types";

export type BusinessToolCategory = {
  id: BusinessToolCategoryId;
  label: string;
  /** Page under /applications/; must never match a tool slug. */
  slug: string;
  description: string;
  icon: ToolIconId;
};

export const businessToolCategories: BusinessToolCategory[] = [
  { id: "sell", label: "Vendre & encaisser", slug: "vendre-encaisser", description: "Encaisser, faire vos devis et vos factures.", icon: "cash-register" },
  { id: "customers", label: "Clients & équipe", slug: "clients-equipe", description: "Suivre vos clients et organiser votre équipe.", icon: "users" },
  { id: "operations", label: "Stock & logistique", slug: "stock-logistique", description: "Gérer vos produits, vos achats et vos livraisons.", icon: "boxes" },
  { id: "finance", label: "Gestion & finances", slug: "gestion-finances", description: "Suivre vos chiffres et votre comptabilité.", icon: "chart" },
  { id: "digital", label: "En ligne", slug: "en-ligne", description: "Être visible et vendre sur internet.", icon: "globe" },
  { id: "automate", label: "Automatiser & IA", slug: "automatiser-ia", description: "Gagner du temps avec l’automatisation et l’IA.", icon: "sparkles" },
  { id: "business", label: "Packs métier", slug: "packs-metier", description: "Tout pour votre métier, déjà relié.", icon: "restaurant" },
];

/** The full library, with filters, lives at the end of the path. */
export const allApplicationsSlug = "toutes";

export const businessToolCategoryById = Object.fromEntries(
  businessToolCategories.map((category) => [category.id, category]),
) as Record<BusinessToolCategoryId, BusinessToolCategory>;

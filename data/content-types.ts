/** Shared editorial shape used by existing SEO pages and the content graph. */
export type EditorialSection = {
  title: string;
  text: string;
  items?: string[];
};

export type EditorialPage = {
  title: string;
  metaTitle?: string;
  description: string;
  intro: string;
  sections: EditorialSection[];
  faq?: EditorialSection[];
  cta?: string;
};

export type SolutionClusterId =
  | "logiciel-ia"
  | "commerce-paiement"
  | "connecte-terrain"
  | "digital-infrastructure";

export type SolutionEntryPoint = "custom-build";

export type BusinessToolKind = "application" | "business-suite" | "capability";
export type BusinessToolCategoryId = "manage" | "sell" | "business" | "digital" | "automate";
export type BusinessToolCatalogSurfaceId = "legacy-solutions" | "applications";
export type ToolIconId =
  | "cash-register" | "globe" | "workflow" | "users" | "calendar" | "clipboard"
  | "wrench" | "life-buoy" | "receipt" | "calculator" | "boxes" | "truck"
  | "repeat" | "restaurant" | "trophy" | "shopping-cart" | "sparkles" | "chart";
export type IndustryVisualId = "restaurant" | "hotel" | "garage" | "generic";

/** A client-facing application entry backed by one or more YVEXOR capabilities. */
export type BusinessTool = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  kind: BusinessToolKind;
  categoryId: BusinessToolCategoryId;
  icon: ToolIconId;
  solutionIds: string[];
  /** Public catalog locations. Empty means this entry is internal only. */
  catalogSurfaces: BusinessToolCatalogSurfaceId[];
  /** Composed applications reference their component tools without copying their content. */
  includesBusinessToolIds?: string[];
  audience: string[];
  capabilities: string[];
  connections: string[];
  evolution: string;
  /** Shared by multiple tools when they are later built on the same platform. Internal only. */
  implementationPlatformId?: string;
  /** Existing canonical destination only; tools do not create duplicate SEO pages. */
  canonicalPath: string;
  availabilityStatus: "draft" | "available";
};

/** Explicit public projection; internal implementation metadata never reaches client views. */
export type PublicBusinessTool = Pick<BusinessTool,
  | "id"
  | "slug"
  | "name"
  | "shortDescription"
  | "kind"
  | "categoryId"
  | "icon"
  | "solutionIds"
  | "catalogSurfaces"
  | "includesBusinessToolIds"
  | "audience"
  | "capabilities"
  | "connections"
  | "evolution"
  | "canonicalPath"
  | "availabilityStatus"
>;

export type PricingOffer =
  | { kind: "subscription"; monthlyFrom?: number; monthlyFixed?: number }
  | { kind: "oneTime"; amountFrom?: number; quoteRequired?: boolean }
  | { kind: "quote" };

export type Pricing = {
  offers: PricingOffer[];
  label?: string;
  hardwareSeparate?: boolean;
  setupSeparate?: boolean;
  recurringServicesNote?: string;
  /** False marks an internal hypothesis; it must not be rendered as a public price. */
  validated: boolean;
};

export type Solution = {
  id: string;
  slug: string;
  /** Public URL that owns this solution; existing editorial pages stay canonical owners. */
  canonicalPath: string;
  cluster: SolutionClusterId;
  /** Navigation metadata for the custom-build doorway; clusters remain browse-only groupings. */
  entryPoints?: SolutionEntryPoint[];
  eyebrow: string;
  primaryAction: { label: string; href: string };
  industryIds: string[];
  projectIds: string[];
  page: EditorialPage;
  pricing: Pricing;
  /** Reserved for future transversal capabilities; no assistant workflow is enabled yet. */
  capabilities?: {
    assistantManaged?: boolean;
    openSourceComponents?: boolean;
  };
};

export type Industry = {
  id: string;
  slug: string;
  name: string;
  canonicalPath: string;
  solutionIds: string[];
  /** Explicit links to public application tools; tool content remains in BusinessTool. */
  businessToolIds: string[];
  /** Short presentation copy for the industry portal and reconstructed canonical page. */
  cardDescription: string;
  heroPromise: string;
  visualId: IndustryVisualId;
  projectIds: string[];
  page: EditorialPage;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  need: string;
  /** Optional factual context that can be shared with the approved case study. */
  context?: string;
  intervention: string;
  outcome: string;
  solutionIds: string[];
  industryIds: string[];
  media: { src: string; alt: string; publicationApproved: boolean; decorative?: boolean }[];
  publicationStatus: "draft" | "approved";
};

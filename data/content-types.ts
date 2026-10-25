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

export type ToolCategoryId = "commerce" | "digital" | "gestion";
export type ToolIconId = "cash-register" | "globe" | "workflow";

/** A client-facing application entry backed by one or more YVEXOR capabilities. */
export type BusinessTool = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  category: ToolCategoryId;
  icon: ToolIconId;
  solutionIds: string[];
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

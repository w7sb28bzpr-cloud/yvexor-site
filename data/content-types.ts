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
  intervention: string;
  outcome: string;
  solutionIds: string[];
  industryIds: string[];
  media: { src: string; alt: string }[];
  publicationStatus: "draft" | "approved";
};

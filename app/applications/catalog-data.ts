import { seoPages } from "../../data/seo-pages";
import { getApplicationCatalogTools } from "../../lib/content";

const featuredIds = [
  "cash-register", "business-management-app", "business-website", "crm",
  "invoicing", "planning",
];

/** Shared by the hub and the category pages so every list keeps the same order. */
export function getApplicationsCatalog() {
  const source = getApplicationCatalogTools();
  const featuredRank = new Map(featuredIds.map((id, index) => [id, index]));
  const tools = source.filter((tool) => tool.kind !== "business-suite").sort((a, b) =>
    (featuredRank.get(a.id) ?? featuredIds.length) - (featuredRank.get(b.id) ?? featuredIds.length));
  const packs = source.filter((tool) => tool.kind === "business-suite");
  const knownPagePaths = new Set(seoPages.map((page) => `/${page.slug}/`));
  const existingCanonicalPaths = source.filter((tool) => knownPagePaths.has(tool.canonicalPath)).map((tool) => tool.canonicalPath);
  return { source, tools, packs, existingCanonicalPaths };
}

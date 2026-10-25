import type { BusinessTool, BusinessToolCatalogSurfaceId, Industry, Pricing, Project, PublicBusinessTool } from "../data/content-types";
import { industries, industryById } from "../data/industries";
import { projects } from "../data/projects";
import { seoPages } from "../data/seo-pages";
import { solutions, solutionById } from "../data/solutions";
import { businessTools } from "../data/business-tools";
import { businessToolCategories } from "../data/business-tool-categories";

export { industries, industryById };

export type PublishablePricing = Pricing & { validated: true };
export type PublicSolution = Omit<(typeof solutions)[number], "pricing"> & { pricing: PublishablePricing | null };

/** Public UI must obtain pricing through this gate, never render raw hypothesis data. */
export function getPublishablePricing(pricing: Pricing): PublishablePricing | null {
  return pricing.validated ? { ...pricing, validated: true } : null;
}

/** Only approved real projects enter public views or static route lists. */
export function filterPublishedProjects(source: readonly Project[]): Project[] {
  return source
    .filter((project) => project.publicationStatus === "approved")
    .map((project) => ({
      ...project,
      media: project.media.filter((media) => media.publicationApproved),
    }));
}

export function getPublishedProjects(source: readonly Project[] = projects): Project[] {
  return filterPublishedProjects(source);
}

export function getPublicProjectBySlug(slug: string, source: readonly Project[] = projects): Project | undefined {
  return getPublishedProjects(source).find((project) => project.slug === slug);
}

export function getGeneratedProjectPages(source: readonly Project[] = projects): { slug: string }[] {
  return getPublishedProjects(source).map(({ slug }) => ({ slug }));
}

export function getProjectSitemapPaths(source: readonly Project[] = projects): string[] {
  const pages = getGeneratedProjectPages(source);
  // Detail routes are deferred until there is an approved project to build and verify.
  return pages.length ? ["/projets/"] : [];
}

/** Public pages receive pricing only through the validation gate. */
export function getPublicSolutions(): PublicSolution[] {
  return solutions.map((solution) => ({
    ...solution,
    pricing: getPublishablePricing(solution.pricing),
  }));
}

/** Public tools are explicitly available and assigned to the requested catalog surface. */
export function getPublicTools(source: readonly BusinessTool[] = businessTools, surface: BusinessToolCatalogSurfaceId = "legacy-solutions"): PublicBusinessTool[] {
  return source.filter((tool) => tool.availabilityStatus === "available" && tool.catalogSurfaces.includes(surface)).map((tool) => ({
    id: tool.id,
    slug: tool.slug,
    name: tool.name,
    shortDescription: tool.shortDescription,
    kind: tool.kind,
    categoryId: tool.categoryId,
    icon: tool.icon,
    solutionIds: tool.solutionIds,
    catalogSurfaces: tool.catalogSurfaces,
    includesBusinessToolIds: tool.includesBusinessToolIds,
    audience: tool.audience,
    capabilities: tool.capabilities,
    connections: tool.connections,
    evolution: tool.evolution,
    canonicalPath: tool.canonicalPath,
    availabilityStatus: tool.availabilityStatus,
  }));
}

/** Prepared application catalog data; no public route is created by this selector. */
export function getApplicationCatalogTools(source: readonly BusinessTool[] = businessTools): PublicBusinessTool[] {
  return getPublicTools(source, "applications");
}

/** Industry tool relationships are explicit and preserve the order chosen in data. */
export function getPublicToolsForIndustry(industry: Industry, source: readonly BusinessTool[] = businessTools): PublicBusinessTool[] {
  const publicById = new Map(getApplicationCatalogTools(source).map((tool) => [tool.id, tool]));
  return industry.businessToolIds.map((id) => publicById.get(id)).filter((tool): tool is PublicBusinessTool => Boolean(tool));
}

/** The bespoke doorway uses explicit data metadata; clusters remain navigation groupings. */
export function getCustomBuildSolutions(): PublicSolution[] {
  return getPublicSolutions().filter((solution) => solution.entryPoints?.includes("custom-build"));
}

export function getPublicSolutionById(id: string): PublicSolution | undefined {
  const solution = solutionById[id];
  return solution ? { ...solution, pricing: getPublishablePricing(solution.pricing) } : undefined;
}

export function getPublicSolutionBySlug(slug: string): PublicSolution | undefined {
  const solution = solutions.find((item) => item.slug === slug);
  return solution ? { ...solution, pricing: getPublishablePricing(solution.pricing) } : undefined;
}

/** Only solutions whose own canonical URL is in the new namespace get generated detail pages. */
export function getGeneratedSolutionPages(): { slug: string }[] {
  return solutions
    .filter((solution) => solution.canonicalPath === `/solutions/${solution.slug}/`)
    .map(({ slug }) => ({ slug }));
}

/** Only industries that own a URL in the new namespace get a generated detail page. */
export function getGeneratedIndustryPages(source: readonly Industry[] = industries): { slug: string }[] {
  return source
    .filter((industry) => industry.canonicalPath === `/metiers/${industry.slug}/`)
    .map(({ slug }) => ({ slug }));
}

export function validateContentGraph(source: {
  solutions?: typeof solutions;
  industries?: readonly Industry[];
  projects?: readonly Project[];
  tools?: readonly BusinessTool[];
} = {}): string[] {
  const checkedSolutions = source.solutions ?? solutions;
  const checkedIndustries = source.industries ?? industries;
  const checkedProjects = source.projects ?? projects;
  const checkedTools = source.tools ?? businessTools;
  const checkedSolutionById = Object.fromEntries(checkedSolutions.map((item) => [item.id, item]));
  const checkedIndustryById = Object.fromEntries(checkedIndustries.map((item) => [item.id, item]));
  const errors: string[] = [];
  const checkUnique = (label: string, values: readonly { id: string; slug: string }[]) => {
    const ids = new Set<string>();
    const slugs = new Set<string>();
    for (const value of values) {
      if (ids.has(value.id)) errors.push(`Duplicate ${label} id: ${value.id}`);
      if (slugs.has(value.slug)) errors.push(`Duplicate ${label} slug: ${value.slug}`);
      ids.add(value.id);
      slugs.add(value.slug);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug)) errors.push(`Invalid ${label} slug: ${value.slug}`);
    }
  };

  checkUnique("solution", checkedSolutions);
  checkUnique("industry", checkedIndustries);
  checkUnique("project", checkedProjects);
  checkUnique("tool", checkedTools);

  const clusters = new Set(["logiciel-ia", "commerce-paiement", "connecte-terrain", "digital-infrastructure"]);
  const toolKinds = new Set(["application", "business-suite", "capability"]);
  const toolCategoryIds = new Set(businessToolCategories.map(({ id }) => id));
  const toolCatalogSurfaces = new Set(["legacy-solutions", "applications"]);
  const legacyPagePaths = new Set(seoPages.map((page) => `/${page.slug}/`));
  const knownSolutionDestinations = new Set([...legacyPagePaths, "/boutique/"]);
  const solutionPaths = new Set<string>();
  const industryPaths = new Set<string>();
  const toolPaths = new Set<string>();
  for (const solution of checkedSolutions) {
    if (!clusters.has(solution.cluster)) errors.push(`Unknown cluster on solution ${solution.id}: ${solution.cluster}`);
    if (!solution.canonicalPath.startsWith("/") || !solution.canonicalPath.endsWith("/")) {
      errors.push(`Solution ${solution.id} canonicalPath must be a local absolute path ending with /`);
    }
    const generatedPath = `/solutions/${solution.slug}/`;
    if (solution.canonicalPath !== generatedPath && !knownSolutionDestinations.has(solution.canonicalPath)) {
      errors.push(`Solution ${solution.id} canonicalPath must be its generated page or an existing solution destination`);
    }
    if (solutionPaths.has(solution.canonicalPath)) errors.push(`Duplicate solution canonicalPath: ${solution.canonicalPath}`);
    solutionPaths.add(solution.canonicalPath);
    const canonicalSlug = solution.canonicalPath.replace(/^\//, "").replace(/\/$/, "");
    const canonicalPage = seoPages.find((page) => page.slug === canonicalSlug);
    if (canonicalPage && (solution.page.title !== canonicalPage.title || solution.page.description !== canonicalPage.description)) {
      errors.push(`Solution ${solution.id} content must reuse its canonical SEO page at ${solution.canonicalPath}`);
    }
    if (!solution.primaryAction.label.trim() || !solution.primaryAction.href.startsWith("/") || !solution.primaryAction.href.endsWith("/")) {
      errors.push(`Solution ${solution.id} primaryAction must have a label and local path`);
    }
    for (const field of ["industryIds", "projectIds"] as const) {
      if (new Set(solution[field]).size !== solution[field].length) errors.push(`Duplicate ${field} on solution ${solution.id}`);
    }
    for (const industryId of solution.industryIds) {
      const industry = checkedIndustryById[industryId];
      if (!industry) errors.push(`Unknown industry ${industryId} on solution ${solution.id}`);
      else if (!industry.solutionIds.includes(solution.id)) errors.push(`Missing reciprocal solution ${solution.id} on industry ${industryId}`);
    }
    for (const projectId of solution.projectIds) {
      const project = checkedProjects.find((item) => item.id === projectId);
      if (!project) errors.push(`Unknown project ${projectId} on solution ${solution.id}`);
      else if (!project.solutionIds.includes(solution.id)) errors.push(`Missing reciprocal solution ${solution.id} on project ${projectId}`);
    }
    if (solution.pricing.offers.length === 0) errors.push(`Solution ${solution.id} must define at least one pricing offer`);
    for (const offer of solution.pricing.offers) {
      const amounts = offer.kind === "subscription"
        ? [offer.monthlyFrom, offer.monthlyFixed]
        : offer.kind === "oneTime" ? [offer.amountFrom] : [];
      if (amounts.some((amount) => amount !== undefined && (!Number.isFinite(amount) || amount < 0))) {
        errors.push(`Invalid amount on ${offer.kind} offer for solution ${solution.id}`);
      }
      if (offer.kind === "subscription" && offer.monthlyFrom === undefined && offer.monthlyFixed === undefined) {
        errors.push(`Subscription offer needs a monthly amount for solution ${solution.id}`);
      }
      if (offer.kind === "oneTime" && offer.amountFrom === undefined && offer.quoteRequired !== true) {
        errors.push(`One-time offer needs an amount or quoteRequired for solution ${solution.id}`);
      }
    }
  }

  for (const industry of checkedIndustries) {
    for (const field of ["solutionIds", "businessToolIds", "projectIds"] as const) {
      if (new Set(industry[field]).size !== industry[field].length) errors.push(`Duplicate ${field} on industry ${industry.id}`);
    }
    if (!industry.canonicalPath.startsWith("/") || !industry.canonicalPath.endsWith("/")) {
      errors.push(`Industry ${industry.id} canonicalPath must be a local absolute path ending with /`);
    }
    if (!legacyPagePaths.has(industry.canonicalPath) && industry.canonicalPath !== `/metiers/${industry.slug}/`) {
      errors.push(`Industry ${industry.id} canonicalPath must point to its legacy page or /metiers/${industry.slug}/`);
    }
    const industryCanonicalSlug = industry.canonicalPath.replace(/^\//, "").replace(/\/$/, "");
    const industryCanonicalPage = seoPages.find((page) => page.slug === industryCanonicalSlug);
    if (industryCanonicalPage && (industry.page.title !== industryCanonicalPage.title || industry.page.description !== industryCanonicalPage.description)) {
      errors.push(`Industry ${industry.id} content must reuse its canonical SEO page at ${industry.canonicalPath}`);
    }
    if (industryPaths.has(industry.canonicalPath)) errors.push(`Duplicate industry canonicalPath: ${industry.canonicalPath}`);
    industryPaths.add(industry.canonicalPath);
    for (const solutionId of industry.solutionIds) {
      const solution = checkedSolutionById[solutionId];
      if (!solution) errors.push(`Unknown solution ${solutionId} on industry ${industry.id}`);
      else if (!solution.industryIds.includes(industry.id)) errors.push(`Missing reciprocal industry ${industry.id} on solution ${solutionId}`);
    }
    for (const projectId of industry.projectIds) {
      const project = checkedProjects.find((item) => item.id === projectId);
      if (!project) errors.push(`Unknown project ${projectId} on industry ${industry.id}`);
      else if (!project.industryIds.includes(industry.id)) errors.push(`Missing reciprocal industry ${industry.id} on project ${projectId}`);
    }
    for (const toolId of industry.businessToolIds) {
      const tool = checkedTools.find((item) => item.id === toolId);
      if (!tool) errors.push(`Unknown tool ${toolId} on industry ${industry.id}`);
      else if (tool.availabilityStatus !== "available") errors.push(`Industry ${industry.id} cannot link to unpublished tool ${toolId}`);
    }
  }

  for (const project of checkedProjects) {
    for (const field of ["solutionIds", "industryIds"] as const) {
      if (new Set(project[field]).size !== project[field].length) errors.push(`Duplicate ${field} on project ${project.id}`);
    }
    for (const solutionId of project.solutionIds) {
      const solution = checkedSolutionById[solutionId];
      if (!solution) errors.push(`Unknown solution ${solutionId} on project ${project.id}`);
      else if (!solution.projectIds.includes(project.id)) errors.push(`Missing reciprocal project ${project.id} on solution ${solutionId}`);
    }
    for (const industryId of project.industryIds) {
      const industry = checkedIndustryById[industryId];
      if (!industry) errors.push(`Unknown industry ${industryId} on project ${project.id}`);
      else if (!industry.projectIds.includes(project.id)) errors.push(`Missing reciprocal project ${project.id} on industry ${industryId}`);
    }
    if (project.publicationStatus === "approved" && (!project.solutionIds.length || !project.industryIds.length)) {
      errors.push(`Approved project ${project.id} must link to at least one solution and industry`);
    }
  }

  for (const tool of checkedTools) {
    if (!tool.canonicalPath.startsWith("/") || !tool.canonicalPath.endsWith("/")) {
      errors.push(`Tool ${tool.id} canonicalPath must be a local absolute path ending with /`);
    }
    if (tool.availabilityStatus !== "available" && tool.availabilityStatus !== "draft") {
      errors.push(`Invalid availabilityStatus on tool ${tool.id}`);
    }
    if (!toolKinds.has(tool.kind)) errors.push(`Invalid kind on tool ${tool.id}: ${tool.kind}`);
    if (!toolCategoryIds.has(tool.categoryId)) errors.push(`Invalid categoryId on tool ${tool.id}: ${tool.categoryId}`);
    if (new Set(tool.catalogSurfaces).size !== tool.catalogSurfaces.length) errors.push(`Duplicate catalogSurfaces on tool ${tool.id}`);
    for (const surface of tool.catalogSurfaces) {
      if (!toolCatalogSurfaces.has(surface)) errors.push(`Invalid catalog surface ${surface} on tool ${tool.id}`);
    }
    if (toolPaths.has(tool.canonicalPath)) errors.push(`Duplicate tool canonicalPath: ${tool.canonicalPath}`);
    toolPaths.add(tool.canonicalPath);
    if (new Set(tool.solutionIds).size !== tool.solutionIds.length) errors.push(`Duplicate solutionIds on tool ${tool.id}`);
    if (tool.availabilityStatus === "available" && tool.solutionIds.length === 0) {
      errors.push(`Available tool ${tool.id} must link to at least one solution`);
    }
    const relatedSolutions = tool.solutionIds.map((id) => checkedSolutionById[id]).filter(Boolean);
    for (const solutionId of tool.solutionIds) {
      if (!checkedSolutionById[solutionId]) errors.push(`Unknown solution ${solutionId} on tool ${tool.id}`);
    }
    const ownsFutureApplicationPath = tool.canonicalPath === `/applications/${tool.slug}/`;
    const ownsIndustryPath = tool.kind === "business-suite" && checkedIndustries.some((industry) =>
      industry.slug === tool.slug && industry.canonicalPath === tool.canonicalPath);
    if (!ownsFutureApplicationPath && !ownsIndustryPath && !relatedSolutions.some((solution) => solution.canonicalPath === tool.canonicalPath)) {
      errors.push(`Tool ${tool.id} must use a linked Solution canonicalPath, its matching Industry canonicalPath, or /applications/${tool.slug}/`);
    }
    const includedIds = tool.includesBusinessToolIds ?? [];
    if (tool.kind === "business-suite" && includedIds.length === 0) errors.push(`Business suite ${tool.id} must include at least one tool`);
    if (tool.kind !== "business-suite" && includedIds.length > 0) errors.push(`Only business suites may include tools: ${tool.id}`);
    if (new Set(includedIds).size !== includedIds.length) errors.push(`Duplicate includesBusinessToolIds on tool ${tool.id}`);
    for (const includedId of includedIds) {
      if (includedId === tool.id) errors.push(`Tool ${tool.id} cannot include itself`);
      const includedTool = checkedTools.find((candidate) => candidate.id === includedId);
      if (!includedTool) errors.push(`Unknown included tool ${includedId} on tool ${tool.id}`);
      else if (includedTool.availabilityStatus !== "available") errors.push(`Business suite ${tool.id} cannot include unpublished tool ${includedId}`);
    }
    for (const field of ["audience", "capabilities", "connections"] as const) {
      if (new Set(tool[field]).size !== tool[field].length) errors.push(`Duplicate ${field} on tool ${tool.id}`);
    }
  }

  const toolById = new Map(checkedTools.map((tool) => [tool.id, tool]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const checkSuiteCycles = (toolId: string) => {
    if (visiting.has(toolId)) {
      errors.push(`Circular business suite composition involving ${toolId}`);
      return;
    }
    if (visited.has(toolId)) return;
    const tool = toolById.get(toolId);
    if (!tool) return;
    visiting.add(toolId);
    for (const includedId of tool.includesBusinessToolIds ?? []) {
      if (toolById.get(includedId)?.kind === "business-suite") checkSuiteCycles(includedId);
    }
    visiting.delete(toolId);
    visited.add(toolId);
  };
  for (const tool of checkedTools) {
    if (tool.kind === "business-suite") checkSuiteCycles(tool.id);
  }

  return errors;
}

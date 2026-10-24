import type { Pricing, Project } from "../data/content-types";
import { industries, industryById } from "../data/industries";
import { projects } from "../data/projects";
import { seoPages } from "../data/seo-pages";
import { solutions, solutionById } from "../data/solutions";

export { industries, industryById };

export type PublishablePricing = Pricing & { validated: true };
export type PublicSolution = Omit<(typeof solutions)[number], "pricing"> & { pricing: PublishablePricing | null };

/** Public UI must obtain pricing through this gate, never render raw hypothesis data. */
export function getPublishablePricing(pricing: Pricing): PublishablePricing | null {
  return pricing.validated ? { ...pricing, validated: true } : null;
}

/** Only approved real projects enter public views or static route lists. */
export function filterPublishedProjects(source: readonly Project[]): Project[] {
  return source.filter((project) => project.publicationStatus === "approved");
}

export function getPublishedProjects(): Project[] {
  return filterPublishedProjects(projects);
}

/** Public pages receive pricing only through the validation gate. */
export function getPublicSolutions(): PublicSolution[] {
  return solutions.map((solution) => ({
    ...solution,
    pricing: getPublishablePricing(solution.pricing),
  }));
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

export function validateContentGraph(): string[] {
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

  checkUnique("solution", solutions);
  checkUnique("industry", industries);
  checkUnique("project", projects);

  const clusters = new Set(["logiciel-ia", "commerce-paiement", "connecte-terrain", "digital-infrastructure"]);
  const legacyPagePaths = new Set(seoPages.map((page) => `/${page.slug}/`));
  const knownSolutionDestinations = new Set([...legacyPagePaths, "/boutique/"]);
  const solutionPaths = new Set<string>();
  const industryPaths = new Set<string>();
  for (const solution of solutions) {
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
      const industry = industryById[industryId];
      if (!industry) errors.push(`Unknown industry ${industryId} on solution ${solution.id}`);
      else if (!industry.solutionIds.includes(solution.id)) errors.push(`Missing reciprocal solution ${solution.id} on industry ${industryId}`);
    }
    for (const projectId of solution.projectIds) {
      const project = projects.find((item) => item.id === projectId);
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

  for (const industry of industries) {
    for (const field of ["solutionIds", "projectIds"] as const) {
      if (new Set(industry[field]).size !== industry[field].length) errors.push(`Duplicate ${field} on industry ${industry.id}`);
    }
    if (!industry.canonicalPath.startsWith("/") || !industry.canonicalPath.endsWith("/")) {
      errors.push(`Industry ${industry.id} canonicalPath must be a local absolute path ending with /`);
    }
    if (!legacyPagePaths.has(industry.canonicalPath) && industry.canonicalPath !== `/metiers/${industry.slug}/`) {
      errors.push(`Industry ${industry.id} canonicalPath must point to its legacy page or /metiers/${industry.slug}/`);
    }
    if (industryPaths.has(industry.canonicalPath)) errors.push(`Duplicate industry canonicalPath: ${industry.canonicalPath}`);
    industryPaths.add(industry.canonicalPath);
    for (const solutionId of industry.solutionIds) {
      const solution = solutionById[solutionId];
      if (!solution) errors.push(`Unknown solution ${solutionId} on industry ${industry.id}`);
      else if (!solution.industryIds.includes(industry.id)) errors.push(`Missing reciprocal industry ${industry.id} on solution ${solutionId}`);
    }
    for (const projectId of industry.projectIds) {
      const project = projects.find((item) => item.id === projectId);
      if (!project) errors.push(`Unknown project ${projectId} on industry ${industry.id}`);
      else if (!project.industryIds.includes(industry.id)) errors.push(`Missing reciprocal industry ${industry.id} on project ${projectId}`);
    }
  }

  for (const project of projects) {
    for (const field of ["solutionIds", "industryIds"] as const) {
      if (new Set(project[field]).size !== project[field].length) errors.push(`Duplicate ${field} on project ${project.id}`);
    }
    for (const solutionId of project.solutionIds) {
      const solution = solutionById[solutionId];
      if (!solution) errors.push(`Unknown solution ${solutionId} on project ${project.id}`);
      else if (!solution.projectIds.includes(project.id)) errors.push(`Missing reciprocal project ${project.id} on solution ${solutionId}`);
    }
    for (const industryId of project.industryIds) {
      const industry = industryById[industryId];
      if (!industry) errors.push(`Unknown industry ${industryId} on project ${project.id}`);
      else if (!industry.projectIds.includes(project.id)) errors.push(`Missing reciprocal project ${project.id} on industry ${industryId}`);
    }
    if (project.publicationStatus === "approved" && (!project.solutionIds.length || !project.industryIds.length)) {
      errors.push(`Approved project ${project.id} must link to at least one solution and industry`);
    }
  }

  return errors;
}

import type { EditorialPage, Industry } from "./content-types";
import { seoPageBySlug } from "./seo-pages";

function pageFromSeo(slug: string): EditorialPage {
  const page = seoPageBySlug[slug];
  if (!page) throw new Error(`Missing SEO page source for industry: ${slug}`);
  return {
    title: page.title,
    metaTitle: page.metaTitle,
    description: page.description,
    intro: page.intro,
    sections: page.sections,
    faq: page.faq,
    cta: page.cta,
  };
}

export const industries: Industry[] = [
  {
    id: "restaurant",
    slug: "restaurant",
    name: "Restaurant & restauration",
    canonicalPath: "/solutions-restaurants/",
    solutionIds: ["custom-software", "commerce-caisse-ticketing", "management-reservation", "sites-applications", "ai-automation", "equipment-retrofit"],
    projectIds: [],
    page: pageFromSeo("solutions-restaurants"),
  },
  {
    id: "hotel",
    slug: "hotel",
    name: "Hôtel & hôtellerie",
    canonicalPath: "/solutions-hotels/",
    solutionIds: ["custom-software", "ai-automation", "management-reservation", "sites-applications", "connected-systems", "equipment-retrofit"],
    projectIds: [],
    page: pageFromSeo("solutions-hotels"),
  },
  {
    id: "garage",
    slug: "garage",
    name: "Garage automobile",
    canonicalPath: "/logiciel-garage/",
    solutionIds: ["custom-software", "ai-automation", "connected-systems", "equipment-retrofit"],
    projectIds: [],
    page: pageFromSeo("logiciel-garage"),
  },
];

export const industryById = Object.fromEntries(industries.map((industry) => [industry.id, industry]));

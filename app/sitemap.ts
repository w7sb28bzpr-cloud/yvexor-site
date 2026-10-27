import type { MetadataRoute } from "next";
import { seoPages } from "../data/seo-pages";
import { professions } from "../data/caisse-professions";

import { products } from "../lib/boutique";
import { getGeneratedSolutionPages, getProjectSitemapPaths } from "../lib/content";
import { allApplicationsSlug, businessToolCategories } from "../data/business-tool-categories";
import { catalogueOffers } from "../data/catalogue-offers";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://yvexor.com/" },
    { url: "https://yvexor.com/solutions/" },
    { url: "https://yvexor.com/applications/" },
    ...[...businessToolCategories.map(({ slug }) => slug), allApplicationsSlug].map((slug) => ({ url: `https://yvexor.com/applications/${slug}/` })),
    ...getGeneratedSolutionPages().map(({ slug }) => ({ url: `https://yvexor.com/solutions/${slug}/` })),
    ...catalogueOffers.map(({ slug }) => ({ url: `https://yvexor.com/solutions/offres/${slug}/` })),
    { url: "https://yvexor.com/metiers/" },
    ...getProjectSitemapPaths().map((path) => ({ url: `https://yvexor.com${path}` })),
    { url: "https://yvexor.com/a-propos/" },
    { url: "https://yvexor.com/histoire/" },
    { url: "https://yvexor.com/materiel/" },
    { url: "https://yvexor.com/boutique/" },
    ...products.map(p=>({url:`https://yvexor.com/boutique/${p.slug}/`})),
    { url: "https://yvexor.com/caisse/" },
    ...professions.map(p=>({url:`https://yvexor.com/caisse/${p.slug}/`})),
    ...seoPages.map(({ slug }) => ({
      url: `https://yvexor.com/${slug}/`,
    })),
  ];
}

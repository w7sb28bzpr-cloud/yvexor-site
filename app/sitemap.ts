import type { MetadataRoute } from "next";
import { seoPages } from "../data/seo-pages";
import { professions } from "../data/caisse-professions";

import { products } from "../lib/boutique";
import { getGeneratedSolutionPages } from "../lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://yvexor.com/" },
    { url: "https://yvexor.com/solutions/" },
    ...getGeneratedSolutionPages().map(({ slug }) => ({ url: `https://yvexor.com/solutions/${slug}/` })),
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

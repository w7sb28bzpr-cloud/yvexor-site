import type { MetadataRoute } from "next";
import { seoPages } from "../data/seo-pages";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-09");

  return [
    { url: "https://yvexor.com/", lastModified },
    ...seoPages.map(({ slug }) => ({
      url: `https://yvexor.com/${slug}/`,
      lastModified,
    })),
  ];
}

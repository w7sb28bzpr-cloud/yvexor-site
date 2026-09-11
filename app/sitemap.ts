import type { MetadataRoute } from "next";
import { seoPages } from "../data/seo-pages";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://yvexor.com/" },
    { url: "https://yvexor.com/histoire/" },
    ...seoPages.map(({ slug }) => ({
      url: `https://yvexor.com/${slug}/`,
    })),
  ];
}

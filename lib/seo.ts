import type { Metadata } from "next";

export const siteUrl = "https://yvexor.com";
export const homeTitle = "Logiciels sur mesure à Marseille & solutions connectées | YVEXOR";
export const homeDescription = "YVEXOR développe logiciels métier, applications, caisses et automatisations pour les entreprises à Marseille, en PACA et à distance en France.";
export const areas = ["Marseille", "Bouches-du-Rhône", "Provence-Alpes-Côte d’Azur", "France"];

export function pageMetadata(path: string, title: string, description: string, index = true): Metadata {
  const url = siteUrl + path;
  return { title, description, alternates: { canonical: url }, robots: { index, follow: true },
    openGraph: { title, description, url, siteName: "YVEXOR", locale: "fr_FR", type: "website", images: [{ url: `${siteUrl}/yvexor-social-v1.jpg`, width: 1200, height: 630, alt: "YVEXOR — Solutions digitales sur mesure" }] },
    twitter: { card: "summary_large_image", title, description, images: [`${siteUrl}/yvexor-social-v1.jpg`] } };
}

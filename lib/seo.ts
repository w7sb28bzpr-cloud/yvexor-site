import type { Metadata } from "next";



export const siteUrl = "https://yvexor.com";

export const homeTitle = "Solutions technologiques sur mesure pour professionnels | YVEXOR";

export const homeDescription = "Logiciels, applications, IA, automatisation et équipements connectés : YVEXOR construit la solution adaptée à votre activité, à Marseille et à distance.";

export const areas = ["Marseille", "Bouches-du-Rhône", "Provence-Alpes-Côte d’Azur", "France"];



export function pageMetadata(path: string, title: string, description: string, index = true): Metadata {

  const url = siteUrl + path;

  return { title, description, alternates: { canonical: url }, robots: { index, follow: true },

    openGraph: { title, description, url, siteName: "YVEXOR", locale: "fr_FR", type: "website", images: [{ url: `${siteUrl}/yvexor-social-v1.jpg`, width: 1200, height: 630, alt: "YVEXOR — Solutions digitales sur mesure" }] },

    twitter: { card: "summary_large_image", title, description, images: [`${siteUrl}/yvexor-social-v1.jpg`] } };

}

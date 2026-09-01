import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yvexor.com"),
  title: "YVEXOR — Produits digitaux, IA & automatisation",
  description: "YVEXOR transforme les opérations des entreprises en produits digitaux rapides, clairs et rentables.",
  manifest: "/manifest.webmanifest",
  openGraph: { title: "YVEXOR — La tech qui fait avancer", description: "Produits digitaux, IA et automatisation. Tarifs clairs, résultat mesurable.", images: ["/yvexor-social.jpg"] },
  twitter: { card: "summary_large_image", title: "YVEXOR — La tech qui fait avancer", description: "Produits digitaux, IA et automatisation.", images: ["/yvexor-social.jpg"] }
};
export const viewport: Viewport = { themeColor: "#c8ff33", width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body>{children}</body></html>; }

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegister } from "../components/pwa-register";

export const metadata: Metadata = {
  metadataBase: new URL("https://yvexor.com"),
  title: "YVEXOR — Solutions digitales sur mesure",
  description: "YVEXOR transforme les problèmes métier en applications, logiciels, automatisations et systèmes connectés sur mesure.",
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "https://yvexor.com/" },
  icons: { icon: [{ url: "/app-icon-192.png", sizes: "192x192", type: "image/png" }], apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }] },
  openGraph: { title: "YVEXOR — Votre problème métier. Construisons la solution.", description: "Solutions digitales, logiciels métier, IA et systèmes connectés adaptés à votre activité.", url: "https://yvexor.com/", siteName: "YVEXOR", type: "website", images: [{ url: "https://yvexor.com/yvexor-social-v1.jpg", width: 1200, height: 630, alt: "YVEXOR — Votre problème métier. Construisons la solution." }] },
  twitter: { card: "summary_large_image", title: "YVEXOR — Votre problème métier. Construisons la solution.", description: "Solutions digitales, logiciels métier, IA et systèmes connectés adaptés à votre activité.", images: ["https://yvexor.com/yvexor-social-v1.jpg"] }
};
export const viewport: Viewport = { themeColor: "#05070a", width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body><PwaRegister/>{children}</body></html>; }

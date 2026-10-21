import type { Metadata, Viewport } from "next";
import "./globals.css";

import "./bespoke.css";
import "./visual-home.css";

import "./automation.css";
import "./commerce-pricing.css";
import "./detail-pages.css";
import "./audit-refinements.css";
import "./category-journeys.css";

import { PwaRegister } from "../components/pwa-register";
import { OrganizationData } from "../components/structured-data";
import { homeTitle, homeDescription, pageMetadata } from "../lib/seo";
import "./seo-refinements.css";
import "./brand.css";
import "./themes.css";
import "./reading-rhythm.css";
import {themeBootstrap} from "../lib/theme";

export const metadata: Metadata = {
  metadataBase: new URL("https://yvexor.com"),
  title: homeTitle,
  description: homeDescription,
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "https://yvexor.com/" },
  icons: { icon: [{ url: "/app-icon-192.png", sizes: "192x192", type: "image/png" }], apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }] },
  openGraph: pageMetadata("/",homeTitle,homeDescription).openGraph,
  twitter: pageMetadata("/",homeTitle,homeDescription).twitter
};
export const viewport: Viewport = { themeColor: "#05070a", width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeBootstrap}}/></head><body><a className="skip-link" href="#contenu">Aller au contenu</a><OrganizationData/><PwaRegister/>{children}</body></html>; }

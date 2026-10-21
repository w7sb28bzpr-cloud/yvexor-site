import type { Metadata } from "next";
import { SiteHeader } from "../../components/navigation";
import { SiteFooter } from "../../components/site-footer";

export const metadata: Metadata = {
  title: "Projets YVEXOR — À venir",
  description: "Des projets YVEXOR documentés seront présentés ici après validation des informations et des visuels partageables.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://yvexor.com/projets/" },
};

export default function ProjetsPage() {
  return <><SiteHeader /><main id="contenu" className="v2-directory v2-directory--short">
    <div className="v2-directory__intro" data-reveal><p className="v2-directory__eyebrow">Projets</p><h1>Des réalisations concrètes, bientôt ici.</h1><p>Nous publierons des projets réels, avec le besoin de départ, ce qui a été construit et les éléments que nous pouvons partager. Aucun exemple fictif.</p><a className="v2-button" href="/contact/">Tu as quelque chose en tête ?</a></div>
  </main><SiteFooter /></>;
}

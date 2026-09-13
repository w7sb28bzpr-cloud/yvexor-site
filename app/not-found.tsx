import type { Metadata } from "next";
import { SiteHeader, MobileTabBar } from "../components/navigation";
import { SiteFooter } from "../components/site-footer";
export const metadata:Metadata={title:"Page introuvable | YVEXOR",description:"Cette page n’existe pas. Retrouvez les solutions YVEXOR ou contactez-nous pour votre projet.",robots:{index:false,follow:true},alternates:{canonical:null},openGraph:null,twitter:null};
export default function NotFound(){return <><SiteHeader root/><main className="seo-page" id="contenu"><section className="seo-hero"><p className="eyebrow">Erreur 404</p><h1>Cette page est introuvable</h1><p>Le lien a peut-être changé. Retrouvez nos solutions ou contactez YVEXOR pour votre projet.</p><div className="hero-actions"><a className="action-link primary" href="/">Retour à l’accueil</a><a className="action-link" href="/contact/">Contacter YVEXOR</a></div></section></main><SiteFooter/><MobileTabBar root/></>;}

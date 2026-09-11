import { BrandLogo } from "./brand-logo";
import { MobileTabBar, SiteHeader } from "./navigation";
import { SmsLink } from "./sms-link";
import { ActionLink } from "./ui";
import { ExistingSolutionDetail } from "./existing-solution-detail";
import { AutomationShowcase } from "./automation-showcase";
import type { SeoPage as SeoPageData } from "../data/seo-pages";

export function SeoPage({page}:{page:SeoPageData}){
  const automation=page.slug==="automatisation-entreprise";
  return <><SiteHeader root/><main className={`seo-page${automation?" automation-page":""}`} id="contenu">
    <section className="seo-hero" id="accueil"><div className="seo-orbit" aria-hidden="true"/><nav className="seo-breadcrumb" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span>/</span><span>{page.eyebrow}</span></nav><p className="eyebrow">{page.eyebrow}</p><h1>{page.title}</h1><p className="seo-lead">{page.intro}</p><div className="hero-actions"><SmsLink className="action-link primary">Présenter mon projet</SmsLink><SmsLink className="phone">SMS · 07 56 91 30 13</SmsLink></div></section>
    {automation&&<AutomationShowcase/>}
    <section className={`seo-content ${page.kind?`seo-content--${page.kind}`:""}`} id="solutions">{page.sections.map((section,index)=><article className="seo-section" id={automation?`automatisation-${index+1}`:undefined} key={section.title}><span>0{index+1}</span><div><h2>{section.title}</h2><p>{section.text}</p>{section.items&&<ul>{section.items.map(item=><li key={item}>{item}</li>)}</ul>}</div></article>)}</section>
    {automation&&<div className="seo-related"><a href="/#solutions">← Toutes les solutions</a></div>}
    {page.slug==="logiciel-caisse-marseille"&&<ExistingSolutionDetail/>}
    {page.slug==="solutions-restaurants"&&<ExistingSolutionDetail restaurant/>}
    {page.kind==="contact"&&<section className="seo-contact"><p className="eyebrow">Contact professionnel</p><h2>Un échange simple, sans formulaire inutile.</h2><div className="hero-actions"><a className="action-link primary" href="tel:+33756913013">Appeler le 07 56 91 30 13</a><SmsLink className="action-link secondary">Envoyer un SMS</SmsLink></div></section>}
    <aside className="seo-related" id="exemples"><p className="eyebrow">Continuer votre recherche</p><div>{page.related.map(slug=><a href={`/${slug}/`} key={slug}>{slug.replaceAll("-"," ")}<b aria-hidden="true">→</b></a>)}</div></aside>
    <section className="seo-final" id="projet"><BrandLogo compact/><h2>Votre besoin d’abord. La technologie ensuite.</h2><p>Nous cherchons la base, le périmètre et la première étape les plus cohérents.</p><SmsLink className="action-link primary">Parler à YVEXOR</SmsLink></section>
  </main><footer className="footer"><BrandLogo/><p>Solutions digitales, logiciels métier, IA et systèmes connectés.</p><div><a href="/mentions-legales/">Mentions légales</a><a href="/politique-confidentialite/">Confidentialité</a></div><small>© 2026 YVEXOR</small></footer><MobileTabBar root/></>;
}

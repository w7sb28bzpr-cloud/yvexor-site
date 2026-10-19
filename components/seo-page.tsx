import {ProjectContact} from "./project-contact";
import {ProjectMethod} from "./project-method";
import {BudgetSection} from "./budget-section";
import { BrandLogo } from "./brand-logo";
import { MobileTabBar, SiteHeader } from "./navigation";
import { SmsLink } from "./sms-link";


import { AutomationShowcase } from "./automation-showcase";
import { BackLink } from "./back-link";
import { CategoryPrice, WebContent, CommerceBenefits } from "./category-content";
import { offerDestinations } from "../data/public-offer";
import { WebPricing } from "./web-pricing";
import { seoPageBySlug, type SeoPage as SeoPageData } from "../data/seo-pages";
import { PageData } from "./structured-data";
import { SiteFooter } from "./site-footer";

export function SeoPage({page}:{page:SeoPageData}){
  const custom=page.slug==="logiciel-sur-mesure";
  const information=["mentions-legales","politique-confidentialite","faq","contact"].includes(page.slug);
  const web=page.slug==="site-presence-web";
  const hasPrice=!custom&&Object.values(offerDestinations).includes(`/${page.slug}/`);
  const automation=page.slug==="automatisation-entreprise";
  const detail=!page.kind&&!["mentions-legales","politique-confidentialite"].includes(page.slug);
  const artwork=web?"solution-web-v1.webp":page.slug==="domotique-batiments"?"solution-maison-v1.webp":page.slug==="logiciel-caisse-marseille"?"solution-commerce-v1.webp":page.slug==="solutions-restaurants"?"solution-restaurant-v1.webp":page.slug==="solutions-hotels"?"solution-hotel-v1.webp":page.slug.includes("ia")||page.slug.includes("intelligence")?"yvexor-automation-768-v1.webp":"solution-logiciel-v1.webp";
  return <><PageData path={`/${page.slug}/`} title={page.title} description={page.description} service={page.service?page.title:undefined} faq={page.kind==="faq"?page.sections:page.faq}/><SiteHeader root/><main className={`seo-page${automation?" automation-page":""}${detail?" detail-page":""}${information?" info-page":""}`} id="contenu">
    <div className="detail-back-wrap"><BackLink/></div>
    <section className="seo-hero" id="accueil"><nav className="seo-breadcrumb" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span aria-hidden="true">/</span><span aria-current="page">{page.title}</span></nav><p className="eyebrow">{page.eyebrow}</p><h1>{page.title}</h1><p className="seo-lead">{page.intro}</p>{!information&&<div className="hero-actions"><a className="action-link primary" href="/contact/">{page.cta??"Présenter mon projet"}</a><a className="phone" href="/#solutions">Toutes les solutions</a></div>}</section>
    {detail&&<nav className="category-nav" aria-label="Dans cette rubrique"><a href="#solutions">Possibilités</a>{hasPrice&&<a href="#tarifs">Tarifs</a>}<a href="#projet">Mon projet</a></nav>}
    {automation&&<AutomationShowcase/>}
    {web&&<WebPricing/>}
    {hasPrice&&!web&&page.slug!=="logiciel-caisse-marseille"&&<CategoryPrice slug={page.slug}/>}

    {detail&&!automation&&!custom&&<figure className="detail-visual"><img src={`/${artwork}`} alt="" width="960" height={page.slug==="solutions-restaurants"?1440:page.slug==="solutions-hotels"?540:640} loading="lazy" decoding="async"/><figcaption>Visuel d’illustration · Le périmètre livré est défini avec vous.</figcaption></figure>}
    {custom&&<ProjectMethod/>}
    {page.kind==="contact"&&<ProjectContact/>}
    {custom&&<div id="tarifs"><BudgetSection/></div>}
    {web?<WebContent/>:<section className={`seo-content ${page.kind?`seo-content--${page.kind}`:""}`} id="solutions">{page.sections.map((section,index)=><article className="seo-section" id={automation?`automatisation-${index+1}`:undefined} key={section.title}><span>{String(index+1).padStart(2,"0")}</span><div><h2>{section.title}</h2><p>{section.text}</p>{section.items&&(detail?<details className="detail-expand"><summary>Explorer les possibilités</summary><ul>{section.items.map(item=><li key={item}>{item}</li>)}</ul></details>:<ul>{section.items.map(item=><li key={item}>{item}</li>)}</ul>)}</div></article>)}</section>}
    {page.slug==="logiciel-caisse-marseille"&&<CommerceBenefits/>}
    {page.faq?.length&&<section className="seo-faq" id="questions"><h2>Questions sur {page.eyebrow.toLowerCase()}</h2>{page.faq.map(q=><article key={q.title}><h3>{q.title}</h3><p>{q.text}</p></article>)}</section>}
    {automation&&<div className="seo-related"><a href="/#solutions">← Toutes les solutions</a></div>}


    {page.kind==="contact"&&<section className="seo-contact"><p className="eyebrow">Contact professionnel</p><h2>Vous préférez nous parler directement ?</h2><div className="hero-actions"><a className="action-link primary" href="tel:+33756913013">Appeler le 07 56 91 30 13</a><SmsLink className="action-link secondary">Envoyer un SMS</SmsLink></div></section>}
    <aside className="seo-related" id="exemples"><p className="eyebrow">Continuer votre recherche</p><div>{page.related.map(slug=><a href={`/${slug}/`} key={slug}>{seoPageBySlug[slug]?.title??slug.replaceAll("-"," ")}<b aria-hidden="true">→</b></a>)}</div></aside>
    {!information&&<section className="seo-final" id="projet"><BrandLogo compact/><h2>Votre besoin d’abord. La technologie ensuite.</h2><p>Nous cherchons la base, le périmètre et la première étape les plus cohérents.</p><a className="action-link primary" href="/contact/">Préparer mon projet →</a></section>}
  </main><SiteFooter/><MobileTabBar root/></>;
}

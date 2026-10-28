import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "../../../../components/site-footer";
import { SiteHeader } from "../../../../components/navigation";
import { PageData } from "../../../../components/structured-data";
import { catalogueOfferBySlug } from "../../../../data/catalogue-offers";
import { solutionRubricBySlug, solutionRubrics } from "../../../../data/solution-rubrics";
import { tradePageById, tradePages } from "../../../../data/trade-pages";
import { trades } from "../../../../data/trades";
import { pageMetadata } from "../../../../lib/seo";
import { DomainScene } from "../../scenes/domain-scenes";
import { BudgetClosing, HowItWorks, ServiceGrid, SubHero, subpageStyles as sub } from "../../subpage";
import { TradeIcon } from "../../trade-icon";
import offerStyles from "../../offres/offers.module.css";
import styles from "../../solutions.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return tradePages.map(({ id }) => ({ metier: id }));
}

type TradePageProps = { params: Promise<{ metier: string }> };

const metaTitle = (name: string) => `${name} — Solutions YVEXOR`;

export async function generateMetadata({ params }: TradePageProps): Promise<Metadata> {
  const { metier } = await params;
  const page = tradePageById[metier];
  if (!page) notFound();
  return pageMetadata(`/solutions/metiers/${page.id}/`, metaTitle(page.title), page.lead);
}

export default async function TradePage({ params }: TradePageProps) {
  const { metier } = await params;
  const page = tradePageById[metier];
  const trade = trades.find((item) => item.id === metier);
  if (!page || !trade) notFound();
  const path = `/solutions/metiers/${page.id}/`;
  const featured = page.featured ? catalogueOfferBySlug[page.featured.offer] : undefined;

  return <div className={`site-foundation ${styles.shell}`}>
    <PageData path={path} title={metaTitle(page.title)} description={page.lead} service={page.title} />
    <SiteHeader />
    <main id="contenu" className={sub.page}>
      <SubHero
        kicker="Votre métier"
        title={page.title}
        lead={page.lead}
        icon={<span className={`${styles.tile} ${styles.tileSmall}`} data-tone={solutionRubricBySlug[trade.rubric]?.tone}><TradeIcon id={trade.id} /></span>}
        visual={<DomainScene domain={trade.rubric} />}
      >
        <a className={sub.primary} href="/contact/">Parler de mon projet <span aria-hidden="true">→</span></a>
        {featured
          ? <a className={sub.secondary} href="#offre">{`Voir l’offre ${featured.name.toLowerCase()}`}</a>
          : <a className={sub.secondary} href="#services">Ce qu’on fait <span aria-hidden="true">↓</span></a>}
      </SubHero>

      <ServiceGrid id="services" title="Tout ce qu’on peut faire pour vous" services={page.services} />

      <section className={sub.section} aria-labelledby="scope-title">
        <h2 id="scope-title" className={sub.sectionTitle}>{page.scopeTitle}</h2>
        <ul className={offerStyles.tags}>{page.scope.map((item) => <li key={item}>{item}</li>)}</ul>
        <div className={offerStyles.invent}>
          <h3>{page.invent.title}</h3>
          <p>{page.invent.text}</p>
          <a className={offerStyles.secondary} href="/contact/">Parlons de votre idée</a>
        </div>
      </section>

      {featured && <section id="offre" className={sub.section} aria-labelledby="featured-title">
        <h2 id="featured-title" className={sub.sectionTitle}>{page.featured!.title}</h2>
        <p className={sub.sectionLead}>{page.featured!.text}</p>
        <a className={offerStyles.featured} href={`/solutions/offres/${featured.slug}/`}>
          <span className={offerStyles.detailTitle}>{featured.brand}</span>
          <span className={offerStyles.detailText}>{featured.summary}</span>
          <span className={offerStyles.featuredPrice}>Dès {featured.startingPrice} <small>HT / mois pour le club</small></span>
          <span className={offerStyles.featuredCta}>Voir les formules et les prix <span aria-hidden="true">→</span></span>
        </a>
      </section>}

      <HowItWorks />
      <BudgetClosing />

      <nav className={offerStyles.others} aria-labelledby="others-title">
        <h2 id="others-title">Explorer par domaine</h2>
        <ul>{solutionRubrics.map((item) => <li key={item.slug}><a href={`/solutions/domaines/${item.slug}/`}>{item.name}</a></li>)}</ul>
      </nav>
    </main>
    <SiteFooter />
  </div>;
}

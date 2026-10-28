import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "../../../../components/site-footer";
import { SiteHeader } from "../../../../components/navigation";
import { PageData } from "../../../../components/structured-data";
import { catalogueOfferBySlug } from "../../../../data/catalogue-offers";
import { solutionRubricBySlug, solutionRubrics } from "../../../../data/solution-rubrics";
import { tradeHref, tradePageById } from "../../../../data/trade-pages";
import { trades } from "../../../../data/trades";
import { pageMetadata } from "../../../../lib/seo";
import { StepScene } from "../../step-scene";
import { BudgetClosing, HowItWorks, ServiceGrid, SubHero, subpageStyles as sub } from "../../subpage";
import { TechIcon } from "../../tech-icon";
import offerStyles from "../../offres/offers.module.css";
import styles from "../../solutions.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return solutionRubrics.map(({ slug }) => ({ domaine: slug }));
}

type RubricPageProps = { params: Promise<{ domaine: string }> };

const metaTitle = (name: string) => `${name} — Solutions YVEXOR`;

export async function generateMetadata({ params }: RubricPageProps): Promise<Metadata> {
  const { domaine } = await params;
  const rubric = solutionRubricBySlug[domaine];
  if (!rubric) notFound();
  return pageMetadata(`/solutions/domaines/${rubric.slug}/`, metaTitle(rubric.name), rubric.lead);
}

export default async function RubricPage({ params }: RubricPageProps) {
  const { domaine } = await params;
  const rubric = solutionRubricBySlug[domaine];
  if (!rubric) notFound();
  const path = `/solutions/domaines/${rubric.slug}/`;
  const forTrades = trades.filter((trade) => trade.rubric === rubric.slug);
  const offers = (rubric.offers ?? []).map((slug) => catalogueOfferBySlug[slug]).filter(Boolean);
  const others = solutionRubrics.filter((item) => item.slug !== rubric.slug);

  return <div className={`site-foundation ${styles.shell}`}>
    <PageData path={path} title={metaTitle(rubric.name)} description={rubric.lead} service={rubric.name} />
    <SiteHeader />
    <main id="contenu" className={sub.page}>
      <SubHero
        kicker="Nos solutions"
        title={rubric.name}
        lead={rubric.lead}
        icon={<span className={`${styles.tile} ${styles.tileSmall}`} data-tone={rubric.tone}><TechIcon icon={rubric.icon} /></span>}
        visual={<StepScene title={rubric.scene.title} steps={rubric.scene.steps} />}
      >
        <a className={sub.primary} href="/contact/">Parler de mon projet <span aria-hidden="true">→</span></a>
        <a className={sub.secondary} href="#services">Ce qu’on fait <span aria-hidden="true">↓</span></a>
      </SubHero>

      <ServiceGrid id="services" title="Ce qu’on fait pour vous" services={rubric.services} />

      {forTrades.length > 0 && <section className={sub.section} aria-labelledby="trades-title">
        <h2 id="trades-title" className={sub.sectionTitle}>Pour qui&nbsp;?</h2>
        <ul className={`${styles.chips} ${offerStyles.chipsGap}`}>
          {forTrades.map((trade) => <li key={trade.id}><a href={tradePageById[trade.id] || trade.offer ? tradeHref(trade) : "/contact/"}>{trade.name}</a></li>)}
        </ul>
      </section>}

      {offers.length > 0 && <section className={sub.section} aria-labelledby="offers-title">
        <h2 id="offers-title" className={sub.sectionTitle}>Exemples de prix</h2>
        <p className={sub.sectionLead}>Les prix habituels du marché, détaillés par métier. Votre budget reste le point de départ.</p>
        <ul className={`${offerStyles.cards} ${offerStyles.detailCards}`}>
          {offers.map((offer) => <li key={offer.slug}>
            <a className={offerStyles.offerLink} href={`/solutions/offres/${offer.slug}/`}>
              <span className={offerStyles.detailTitle}>{offer.name}</span>
              <span className={offerStyles.detailText}>{offer.summary}</span>
              <span className={offerStyles.cardPrice}>Dès {offer.startingPrice} HT / mois →</span>
            </a>
          </li>)}
        </ul>
      </section>}

      <HowItWorks />
      <BudgetClosing />

      <nav className={offerStyles.others} aria-labelledby="others-title">
        <h2 id="others-title">Les autres domaines</h2>
        <ul>{others.map((item) => <li key={item.slug}><a href={`/solutions/domaines/${item.slug}/`}>{item.name}</a></li>)}</ul>
        {rubric.deeper && <a className={offerStyles.secondary} href={rubric.deeper.href}>{rubric.deeper.label}</a>}
      </nav>
    </main>
    <SiteFooter />
  </div>;
}

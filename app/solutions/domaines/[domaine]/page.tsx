import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "../../../../components/site-footer";
import { SiteHeader } from "../../../../components/navigation";
import { PageData } from "../../../../components/structured-data";
import { catalogueOfferBySlug } from "../../../../data/catalogue-offers";
import { solutionRubricBySlug, solutionRubrics } from "../../../../data/solution-rubrics";
import { trades } from "../../../../data/trades";
import { pageMetadata } from "../../../../lib/seo";
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
    <main id="contenu" className={offerStyles.page}>
      <header className={offerStyles.head}>
        <a className={offerStyles.back} href="/solutions/#rubriques"><span aria-hidden="true">←</span> Nos solutions</a>
        <div className={offerStyles.headIcon}><span className={styles.tile} data-tone={rubric.tone}><TechIcon icon={rubric.icon} /></span></div>
        <h1 className={offerStyles.title}>{rubric.name}</h1>
        <p className={offerStyles.lead}>{rubric.lead}</p>
        <div className={offerStyles.actions}>
          <a className={offerStyles.primary} href="/contact/">Parler de mon projet <span aria-hidden="true">→</span></a>
        </div>
      </header>

      <section className={offerStyles.section} aria-labelledby="services-title">
        <h2 id="services-title" className={offerStyles.sectionTitle}>Ce qu’on fait pour vous</h2>
        <ul className={`${offerStyles.cards} ${offerStyles.detailCards}`}>
          {rubric.services.map((service) => <li key={service.title}>
            <details className={offerStyles.detail}>
              <summary>
                <span className={offerStyles.detailTitle}>{service.title}</span>
                <span className={offerStyles.detailText}>{service.text}</span>
                <span className={offerStyles.detailMore} aria-hidden="true">Lire plus</span>
              </summary>
              <p>{service.more}</p>
            </details>
          </li>)}
        </ul>
        <p className={offerStyles.note}>Votre budget fixe le point de départ : on commence par ce qui vous sert le plus, puis on ajoute le reste quand vous voulez.</p>
      </section>

      {forTrades.length > 0 && <section className={offerStyles.section} aria-labelledby="trades-title">
        <h2 id="trades-title" className={offerStyles.sectionTitle}>Pour qui&nbsp;?</h2>
        <ul className={`${styles.chips} ${offerStyles.chipsGap}`}>
          {forTrades.map((trade) => <li key={trade.id}><a href={trade.offer ? `/solutions/offres/${trade.offer}/` : "/contact/"}>{trade.name}</a></li>)}
        </ul>
      </section>}

      {offers.length > 0 && <section className={offerStyles.section} aria-labelledby="offers-title">
        <h2 id="offers-title" className={offerStyles.sectionTitle}>Exemples de prix</h2>
        <p className={offerStyles.intro}>Les prix habituels du marché, détaillés par métier. Votre budget reste le point de départ.</p>
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

      <nav className={offerStyles.others} aria-labelledby="others-title">
        <h2 id="others-title">Les autres domaines</h2>
        <ul>{others.map((item) => <li key={item.slug}><a href={`/solutions/domaines/${item.slug}/`}>{item.name}</a></li>)}</ul>
        {rubric.deeper && <a className={offerStyles.secondary} href={rubric.deeper.href}>{rubric.deeper.label}</a>}
      </nav>
    </main>
    <SiteFooter />
  </div>;
}

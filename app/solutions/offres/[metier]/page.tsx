import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "../../../../components/site-footer";
import { SiteHeader } from "../../../../components/navigation";
import { PageData } from "../../../../components/structured-data";
import { catalogueOfferBySlug, catalogueOffers, type OfferSection } from "../../../../data/catalogue-offers";
import { pageMetadata } from "../../../../lib/seo";
import styles from "../offers.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return catalogueOffers.map(({ slug }) => ({ metier: slug }));
}

type OfferPageProps = { params: Promise<{ metier: string }> };

const metaTitle = (name: string) => `${name} — Offres et tarifs YVEXOR`;

export async function generateMetadata({ params }: OfferPageProps): Promise<Metadata> {
  const { metier } = await params;
  const offer = catalogueOfferBySlug[metier];
  if (!offer) notFound();
  return pageMetadata(`/solutions/offres/${offer.slug}/`, metaTitle(offer.name), `${offer.brand} : ${offer.summary} Formules dès ${offer.startingPrice} HT par mois, matériel et options.`);
}

function Section({ section }: { section: OfferSection }) {
  return <section id={section.id} className={styles.section} aria-labelledby={`${section.id}-title`}>
    <p className={styles.eyebrow}>{section.eyebrow}</p>
    <h2 id={`${section.id}-title`} className={styles.sectionTitle}>{section.title}</h2>
    {section.intro && <p className={styles.intro}>{section.intro}</p>}

    {section.kind === "plans" && <ul className={styles.plans}>
      {section.plans.map((plan) => <li key={plan.name} className={`${styles.plan} ${plan.badge ? styles.planHighlight : ""}`}>
        {plan.badge && <span className={styles.badge}>{plan.badge}</span>}
        <h3>{plan.name}</h3>
        <p className={styles.price}>{plan.from && <small>Dès </small>}{plan.price} <small>{plan.period}</small></p>
        <p className={styles.planLead}>{plan.lead}</p>
        <ul className={styles.items}>{plan.items.map((item) => <li key={item}>{item}</li>)}</ul>
        {plan.note && <p className={styles.planNote}>{plan.note}</p>}
      </li>)}
    </ul>}

    {section.kind === "table" && <div className={styles.tableWrap} role="region" aria-labelledby={`${section.id}-title`} tabIndex={0}>
      <table className={styles.table}>
        <thead><tr>{section.head.map((cell) => <th key={cell} scope="col">{cell}</th>)}</tr></thead>
        <tbody>{section.rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th key={cell} scope="row">{cell}</th> : <td key={`${row[0]}-${index}`}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>}

    {section.kind === "cards" && <ul className={styles.cards}>
      {section.cards.map((card) => <li key={card.title} className={styles.card}>
        <h3>{card.title}</h3>
        {card.price && <p className={styles.cardPrice}>{card.price}</p>}
        <p>{card.text}</p>
      </li>)}
    </ul>}

    {section.note && <p className={styles.note}>{section.note}</p>}
  </section>;
}

export default async function OfferPage({ params }: OfferPageProps) {
  const { metier } = await params;
  const offer = catalogueOfferBySlug[metier];
  if (!offer) notFound();
  const path = `/solutions/offres/${offer.slug}/`;
  const others = catalogueOffers.filter((item) => item.slug !== offer.slug);

  return <div className="site-foundation">
    <PageData path={path} title={metaTitle(offer.name)} description={offer.summary} service={offer.brand} />
    <SiteHeader />
    <main id="contenu" className={styles.page}>
      <header className={styles.head}>
        <a className={styles.back} href="/solutions/#offres"><span aria-hidden="true">←</span> Nos solutions</a>
        <p className={styles.eyebrow}>{offer.brand} · {offer.eyebrow}</p>
        <h1 className={styles.title}>{offer.title}</h1>
        <p className={styles.lead}>{offer.lead}</p>
        <nav className={styles.jump} aria-label="Dans cette offre">
          {offer.sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.eyebrow.replace(/^[AB] · /, "")}</a>)}
        </nav>
        <div className={styles.actions}>
          <a className={styles.primary} href="/contact/">Demander mon devis <span aria-hidden="true">→</span></a>
          {offer.configure && <a className={styles.secondary} href={offer.configure}>Configurer ma caisse</a>}
        </div>
      </header>

      {offer.sections.map((section) => <Section key={section.id} section={section} />)}

      <section className={styles.conditions} aria-labelledby="conditions-title">
        <h2 id="conditions-title">Bon à savoir</h2>
        <ul>
          <li>Prix hors taxes. Les tarifs sont des repères : on en parle ensemble et on s’adapte à votre activité.</li>
          {offer.conditions.map((condition) => <li key={condition}>{condition}</li>)}
        </ul>
      </section>

      <nav className={styles.others} aria-labelledby="others-title">
        <h2 id="others-title">Les autres métiers</h2>
        <ul>{others.map((item) => <li key={item.slug}><a href={`/solutions/offres/${item.slug}/`}>{item.name}</a></li>)}</ul>
        <a className={styles.secondary} href="/solutions/#sur-mesure">Un projet sur mesure, avec l’IA ? Parlons-en</a>
      </nav>
    </main>
    <SiteFooter />
  </div>;
}

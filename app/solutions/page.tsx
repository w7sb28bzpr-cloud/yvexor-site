import type { Metadata } from "next";
import { PageData } from "../../components/structured-data";
import { catalogueOffers } from "../../data/catalogue-offers";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/navigation";
import { getCustomBuildSolutions, getPublicTools } from "../../lib/content";
import { pageMetadata } from "../../lib/seo";
import { ToolLibrary } from "./tool-library";
import styles from "./solutions.module.css";

const title = "Solutions YVEXOR — Sur mesure & outils pour votre entreprise";
const description = "Un besoin à construire autour ou un outil pour votre entreprise : découvrez les applications YVEXOR et les solutions sur mesure, du logiciel au terrain.";
export const metadata: Metadata = pageMetadata("/solutions/", title, description);

export default function SolutionsPage() {
  const customSolutions = getCustomBuildSolutions();
  const tools = getPublicTools();

  return <div className="site-foundation">
    <PageData path="/solutions/" title={title} description={description} type="CollectionPage" />
    <SiteHeader />
    <main id="contenu" className={styles.page}>
      <div className="site-container">
        <header className={styles.intro}>
          <p className={styles.eyebrow}>Deux façons de commencer</p>
          <h1 className="site-display site-heading-xl">Les solutions YVEXOR s’adaptent à votre besoin.</h1>
          <p className="site-copy">Vous savez ce que vous cherchez ou vous partez d’un problème à résoudre : choisissez votre point de départ.</p>
        </header>

        <section className={styles.offers} id="offres" aria-labelledby="offers-title">
          <h2 id="offers-title" className="site-display">Nos offres par métier</h2>
          <p className={styles.offersLead}>Formules, matériel et options, avec nos tarifs.</p>
          <ul className={styles.offerGrid}>
            {catalogueOffers.map((offer) => <li key={offer.slug}>
              <a className={styles.offerCard} href={`/solutions/offres/${offer.slug}/`}>
                <span className={styles.offerName}>{offer.name}</span>
                <span className={styles.offerSummary}>{offer.summary}</span>
                <span className={styles.offerPrice}>Dès {offer.startingPrice} <small>HT / mois</small></span>
                <span className={styles.offerArrow} aria-hidden="true">→</span>
              </a>
            </li>)}
          </ul>
        </section>

        <div className={styles.doors}>
          <section className={styles.customDoor} id="sur-mesure" aria-labelledby="custom-title">
            <p className={styles.eyebrow}>01 <span>Partir du besoin</span></p>
            <h2 id="custom-title" className="site-display">Construire une solution sur mesure</h2>
            <p className={styles.customMessage}>Vous avez un besoin particulier, une idée ou un équipement à connecter ? Nous construisons la solution autour.</p>
            <ul className={styles.capabilityList} aria-label="Capacités mobilisables selon le projet">
              {customSolutions.map((solution) => <li key={solution.id}>
                {solution.id === "hosting-infrastructure" && <span id="infrastructure" className={styles.anchor} aria-hidden="true" />}
                <a href={solution.canonicalPath}>{solution.eyebrow}<span aria-hidden="true">↗</span></a>
              </li>)}
            </ul>
            <a className={styles.customCta} href="/contact/">Parler de mon besoin <span aria-hidden="true">↗</span></a>
          </section>

          <section className={styles.toolsDoor} id="outils" aria-labelledby="tools-title">
            <p className={styles.eyebrow}>02 <span>Choisir un outil</span></p>
            <h2 id="tools-title" className="site-display">Les outils pour mon entreprise</h2>
            <p className={styles.toolsLead}>Choisissez ce que vous voulez gérer ou améliorer.</p>
            <ToolLibrary tools={tools} />
            <p className={styles.toolsNote}>Besoin d’un outil qui n’est pas encore dans la liste ? <a href="/contact/">Parlons de votre activité.</a></p>
          </section>
        </div>
      </div>
    </main>
    <SiteFooter />
  </div>;
}

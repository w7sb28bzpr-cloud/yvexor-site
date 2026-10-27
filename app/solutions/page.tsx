import type { Metadata } from "next";
import { PageData } from "../../components/structured-data";
import { catalogueOffers } from "../../data/catalogue-offers";
import { trades } from "../../data/trades";
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
          <p className={styles.eyebrow}>Votre accompagnateur web</p>
          <h1 className="site-display site-heading-xl">Votre besoin. Votre budget. On lance ensemble.</h1>
          <p className="site-copy">Chez YVEXOR, on ne vous impose pas une grille de prix. On discute, on définit votre budget avec vous, puis on construit : logiciel, automatisation, IA ou objets connectés. Avec 20 € ou 2 000 € par mois, vous aurez une solution qui vous fait avancer.</p>
          <div className={styles.introActions}>
            <a className={styles.customCta} href="/contact/">Parler de mon projet <span aria-hidden="true">→</span></a>
            <a className={styles.introLink} href="/applications/">Une seule application ? Elle est gratuite <span aria-hidden="true">→</span></a>
          </div>
        </header>

        <ol className={styles.method} aria-label="Comment on travaille">
          <li><span>1</span><strong>On discute</strong>Votre activité, ce qui vous fait perdre du temps, ce que vous voulez changer.</li>
          <li><span>2</span><strong>On définit votre budget</strong>Ensemble, à partir de ce que vous pouvez investir, pas d’une grille.</li>
          <li><span>3</span><strong>On lance et on vous accompagne</strong>Une première version utile, puis on la fait grandir avec vous.</li>
        </ol>

        <section className={styles.trades} id="metiers" aria-labelledby="trades-title">
          <h2 id="trades-title" className="site-display">On touche à tous les métiers.</h2>
          <p className={styles.offersLead}>On répond à n’importe quelle demande, et on connecte même ce qui ne l’est pas encore. Quelques exemples :</p>
          <ul className={styles.tradeGrid}>
            {trades.map((trade) => <li key={trade.id}>
              <details className={styles.trade}>
                <summary>
                  <span className={styles.tradeName}>{trade.name}</span>
                  <span className={styles.tradeShort}>{trade.short}</span>
                  <span className={styles.tradeMore} aria-hidden="true">Lire plus</span>
                </summary>
                <p>{trade.more}</p>
                {trade.offer && <a href={`/solutions/offres/${trade.offer}/`}>Voir un exemple d’offre <span aria-hidden="true">→</span></a>}
              </details>
            </li>)}
            <li className={styles.tradeOther}>
              <p className={styles.tradeName}>Votre métier n’est pas dans la liste&nbsp;?</p>
              <p className={styles.tradeShort}>Aucun problème : dites-nous ce dont vous avez besoin, on trouve la solution.</p>
              <a href="/contact/">Nous écrire <span aria-hidden="true">→</span></a>
            </li>
          </ul>
        </section>

        <section className={styles.offers} id="offres" aria-labelledby="offers-title">
          <h2 id="offers-title" className="site-display">Exemples d’offres par métier</h2>
          <p className={styles.offersLead}>Des repères du marché, pour vous situer. Le vrai point de départ, c’est votre budget.</p>
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

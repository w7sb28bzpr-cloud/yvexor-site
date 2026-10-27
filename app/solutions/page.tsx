import type { Metadata } from "next";
import { PageData } from "../../components/structured-data";
import { catalogueOffers } from "../../data/catalogue-offers";
import { technologies, trades } from "../../data/trades";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/navigation";
import { getCustomBuildSolutions, getPublicTools } from "../../lib/content";
import { pageMetadata } from "../../lib/seo";
import { ConnectedScene } from "./connected-scene";
import { TechIcon } from "./tech-icon";
import { ToolLibrary } from "./tool-library";
import styles from "./solutions.module.css";

const title = "Solutions YVEXOR — Sur mesure & outils pour votre entreprise";
const description = "Un besoin à construire autour ou un outil pour votre entreprise : découvrez les applications YVEXOR et les solutions sur mesure, du logiciel au terrain.";
export const metadata: Metadata = pageMetadata("/solutions/", title, description);

export default function SolutionsPage() {
  const customSolutions = getCustomBuildSolutions();
  const tools = getPublicTools();

  return <div className={`site-foundation ${styles.shell}`}>
    <PageData path="/solutions/" title={title} description={description} type="CollectionPage" />
    <SiteHeader />
    <main id="contenu" className={styles.page}>
      <div className="site-container">
        <div className={styles.hero}>
          <header className={styles.intro}>
            <p className={styles.kicker}>Nos solutions</p>
            <h1 className="site-display site-heading-xl">On construit votre solution, <span>selon votre budget.</span></h1>
            <p className="site-copy">Vous nous expliquez votre besoin et ce que vous voulez y consacrer. On vous propose la solution adaptée (logiciel, automatisation, IA ou équipements connectés), puis on vous accompagne.</p>
            <ul className={styles.promises}>
              <li>Petit budget ou gros projet : il y a toujours une solution.</li>
              <li>Une seule application ? Elle est gratuite.</li>
              <li>On reste à vos côtés après la mise en route.</li>
            </ul>
            <div className={styles.introActions}>
              <a className={styles.customCta} href="/contact/">Parler de mon projet <span aria-hidden="true">→</span></a>
              <a className={styles.introLink} href="/applications/">Voir nos applications <span aria-hidden="true">→</span></a>
            </div>
          </header>
          <ConnectedScene />
        </div>

        <nav className={styles.toc} aria-label="Sur cette page">
          <a href="#comment">Comment ça marche</a>
          <a href="#technologies">Ce qu’on connecte</a>
          <a href="#metiers">Votre métier</a>
          <a href="#offres">Exemples de prix</a>
          <a href="#sur-mesure">Sur mesure</a>
        </nav>

        <section id="comment" className={styles.how} aria-labelledby="how-title">
          <p className={styles.kicker}>Comment ça marche</p>
          <h2 id="how-title" className="site-display">Trois étapes, et c’est parti.</h2>
          <ol className={styles.method}>
            <li><span>1</span><strong>Vous nous parlez de votre besoin</strong>Votre activité, ce qui vous fait perdre du temps, ce que vous voulez changer.</li>
            <li><span>2</span><strong>On fixe le budget ensemble</strong>À partir de ce que vous voulez investir, pas d’une grille imposée.</li>
            <li><span>3</span><strong>On installe et on vous accompagne</strong>Une première version utile, puis on la fait évoluer avec vous.</li>
          </ol>
        </section>

        <section className={styles.trades} id="technologies" aria-labelledby="tech-title">
          <p className={styles.kicker}>Ce qu’on connecte</p>
          <h2 id="tech-title" className="site-display">Tout ce qui est technologique, on le relie.</h2>
          <p className={styles.offersLead}>Même un équipement ancien ou isolé peut rejoindre votre système. Touchez une carte pour en savoir plus.</p>
          <ul className={styles.techGrid}>
            {technologies.map((tech) => <li key={tech.id}>
              <details className={styles.trade}>
                <summary>
                  <span className={styles.techIcon}><TechIcon icon={tech.icon} /></span>
                  <span className={styles.tradeName}>{tech.name}</span>
                  <span className={styles.tradeShort}>{tech.short}</span>
                  <span className={styles.tradeMore} aria-hidden="true">Lire plus</span>
                </summary>
                <p>{tech.more}</p>
              </details>
            </li>)}
          </ul>
        </section>

        <section className={styles.trades} id="metiers" aria-labelledby="trades-title">
          <p className={styles.kicker}>Votre métier</p>
          <h2 id="trades-title" className="site-display">On travaille avec tous les métiers.</h2>
          <p className={styles.offersLead}>Quelle que soit votre demande, on y répond. Trouvez votre activité :</p>
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
          <p className={styles.kicker}>Exemples de prix</p>
          <h2 id="offers-title" className="site-display">Pour vous donner une idée</h2>
          <p className={styles.offersLead}>Ce sont les prix habituels du marché, détaillés par métier. Votre budget reste le point de départ.</p>
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

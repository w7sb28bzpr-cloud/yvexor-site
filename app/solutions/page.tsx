import type { Metadata } from "next";
import { PageData } from "../../components/structured-data";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/navigation";
import { SolutionCard } from "./solution-card";
import { getPublicSolutions } from "../../lib/content";
import { solutionClusters } from "../../data/solution-clusters";
import { pageMetadata } from "../../lib/seo";
import styles from "./solutions.module.css";

const title = "Solutions YVEXOR — Du logiciel au terrain";
const description = "Découvrez les solutions que YVEXOR conçoit, développe, connecte et automatise autour de besoins réels, du logiciel aux équipements physiques.";
export const metadata: Metadata = pageMetadata("/solutions/", title, description);

export default function SolutionsPage() {
  const solutions = getPublicSolutions();

  return <div className="site-foundation">
    <PageData path="/solutions/" title={title} description={description} type="CollectionPage" />
    <SiteHeader />
    <main id="contenu" className={styles.page}>
      <div className="site-container">
        <header className={styles.intro}>
          <p className={styles.eyebrow}>Explorer par solution</p>
          <h1 className="site-display site-heading-xl">Du logiciel au terrain, une solution autour de votre besoin.</h1>
          <p className={`site-copy ${styles.lead}`}>YVEXOR conçoit, développe, connecte et automatise. Un logiciel, un équipement physique ou plusieurs outils peuvent se combiner selon ce que votre activité cherche à faire évoluer.</p>
          <nav className={styles.clusterNav} aria-label="Parcourir les familles de solutions">
            {solutionClusters.map((cluster) => <a className="site-link" key={cluster.id} href={`#${cluster.id}`}>{cluster.label}<span aria-hidden="true"> ↓</span></a>)}
          </nav>
          <p className={styles.navigationNote}>Ces familles sont des repères pour explorer le catalogue. Une solution peut en traverser plusieurs et se combiner avec d’autres.</p>
        </header>

        <div className={styles.clusters}>
          {solutionClusters.map((cluster, index) => {
            const items = solutions.filter((solution) => solution.cluster === cluster.id);
            return <section className={styles.cluster} id={cluster.id} key={cluster.id} aria-labelledby={`${cluster.id}-title`}>
              {cluster.id === "commerce-paiement" && <span id="commerce" className={styles.anchorAlias} aria-hidden="true" />}
              {cluster.id === "digital-infrastructure" && <span id="infrastructure" className={styles.anchorAlias} aria-hidden="true" />}
              <header className={styles.clusterHeading}>
                <p className={styles.eyebrow}>Famille {String(index + 1).padStart(2, "0")}</p>
                <h2 id={`${cluster.id}-title`} className="site-display site-heading-lg">{cluster.label}</h2>
                <p className="site-copy">{cluster.description}</p>
              </header>
              <div className={styles.grid}>
                {items.map((solution) => <SolutionCard key={solution.id} solution={solution} />)}
              </div>
            </section>;
          })}
        </div>

        <aside className={`site-surface site-surface--elevated ${styles.contact}`}>
          <div><p className={styles.eyebrow}>Votre besoin n’entre dans aucune case ?</p><h2 className="site-display">Partons de ce que vous voulez faire.</h2><p className="site-copy">Les solutions peuvent être adaptées ou assemblées au fil du projet. La première étape consiste à comprendre votre besoin.</p></div>
          <a className="site-button" href="/contact/">Étudier mon projet</a>
        </aside>
      </div>
    </main>
    <SiteFooter />
  </div>;
}

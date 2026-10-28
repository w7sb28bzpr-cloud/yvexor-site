import type { Metadata } from "next";
import { PageData } from "../../components/structured-data";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/navigation";
import { solutionRubrics } from "../../data/solution-rubrics";
import { trades } from "../../data/trades";
import { pageMetadata } from "../../lib/seo";
import { ConnectedScene } from "./connected-scene";
import { TechIcon } from "./tech-icon";
import styles from "./solutions.module.css";

const title = "Solutions YVEXOR — Logiciels, IA, objets connectés, sur mesure";
const description = "YVEXOR fait tout : logiciels et applications, IA et automatisation, domotique et objets connectés, accès et parkings, caisses et sites internet. Selon votre budget, pour tous les métiers.";
export const metadata: Metadata = pageMetadata("/solutions/", title, description);

/** Same recipe as /applications/: one animation, one sentence, then doors. Details live in each rubric page. */
export default function SolutionsPage() {
  return <div className={`site-foundation ${styles.shell}`}>
    <PageData path="/solutions/" title={title} description={description} type="CollectionPage" />
    <SiteHeader />
    <main id="contenu" className={styles.page}>
      <div className="site-container">
        <div className={styles.hero}>
          <header className={styles.intro}>
            <h1 className={styles.title}>Nos solutions</h1>
            <p className={styles.lead}><strong>On fait tout</strong> : logiciels, IA, automatisation, objets connectés. Dites-nous ce dont vous avez besoin et votre budget, on s’occupe du reste.</p>
            <div className={styles.introActions}>
              <a className={styles.customCta} href="/contact/">Parler de mon projet <span aria-hidden="true">→</span></a>
              <a className={styles.introLink} href="#rubriques">Choisir un domaine <span aria-hidden="true">↓</span></a>
            </div>
          </header>
          <ConnectedScene />
        </div>

        <section id="rubriques" className={styles.rubrics} aria-labelledby="rubrics-title">
          <h2 id="rubrics-title" className={styles.sectionTitle}>Que voulez-vous faire&nbsp;?</h2>
          <ul className={styles.rubricGrid}>
            {solutionRubrics.map((rubric) => <li key={rubric.slug}>
              <a className={styles.rubric} href={`/solutions/domaines/${rubric.slug}/`}>
                <span className={styles.tile} data-tone={rubric.tone}><TechIcon icon={rubric.icon} /></span>
                <span className={styles.rubricText}>
                  <span className={styles.rubricName}>{rubric.name}</span>
                  <span className={styles.rubricShort}>{rubric.short}</span>
                </span>
                <span className={styles.rubricArrow} aria-hidden="true">→</span>
              </a>
            </li>)}
          </ul>
        </section>

        <section className={styles.tradesRow} aria-labelledby="trades-title">
          <h2 id="trades-title" className={styles.smallTitle}>Votre métier</h2>
          <ul className={styles.chips}>
            {trades.map((trade) => <li key={trade.id}>
              <a href={trade.offer ? `/solutions/offres/${trade.offer}/` : `/solutions/domaines/${trade.rubric}/`}>{trade.name}</a>
            </li>)}
          </ul>
        </section>

        <section className={styles.closing} aria-labelledby="closing-title">
          <h2 id="closing-title" className={styles.sectionTitle}>Votre budget, votre rythme.</h2>
          <p>Petit budget ou gros projet, on trouve la solution et on vous accompagne. Une seule application ? <a href="/applications/">Elle est gratuite</a>.</p>
          <a className={styles.customCta} href="/contact/">Parler de mon projet <span aria-hidden="true">→</span></a>
        </section>
      </div>
    </main>
    <SiteFooter />
  </div>;
}

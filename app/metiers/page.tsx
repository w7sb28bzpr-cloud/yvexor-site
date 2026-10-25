import type { Metadata } from "next";
import { PageData } from "../../components/structured-data";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/navigation";
import { industries } from "../../data/industries";
import { pageMetadata } from "../../lib/seo";
import { IndustryCard } from "./industry-card";
import styles from "./industries.module.css";

const title = "Métiers accompagnés par YVEXOR | Solutions adaptées à votre activité";
const description = "Découvrez comment YVEXOR peut faire évoluer les outils et les équipements de votre activité, du logiciel au terrain.";

export const metadata: Metadata = pageMetadata("/metiers/", title, description);

export default function IndustriesPage() {
  return <div className="site-foundation">
    <PageData path="/metiers/" title={title} description={description} type="CollectionPage" />
    <SiteHeader />
    <main id="contenu" className={styles.page}>
      <div className="site-container">
        <header className={styles.intro}>
          <p className={styles.eyebrow}>Explorer par activité</p>
          <h1 className="site-display site-heading-xl">Quelle est votre activité ?</h1>
          <p className={`site-copy ${styles.lead}`}>YVEXOR adapte logiciels, automatisations et équipements au fonctionnement réel de votre activité.</p>
        </header>

        <section className={styles.catalogue} aria-labelledby="industry-catalogue-title">
          <header className={styles.catalogueHeading}>
            <p className={styles.eyebrow}>Premiers univers déjà structurés</p>
            <h2 id="industry-catalogue-title" className={styles.visuallyHidden}>Activités accompagnées</h2>
          </header>
          <div className={styles.grid}>
            {industries.map((industry) => <IndustryCard industry={industry} key={industry.id} />)}
          </div>
        </section>

        <aside className={`site-surface site-surface--elevated ${styles.contact}`}>
          <div>
            <p className={styles.eyebrow}>Votre activité n’est pas dans la liste ?</p>
            <h2 className="site-display">YVEXOR construit aussi des solutions autour de métiers et de besoins spécifiques.</h2>
          </div>
          <a className="site-button" href="/contact/">Parler de mon activité</a>
        </aside>
      </div>
    </main>
    <SiteFooter />
  </div>;
}

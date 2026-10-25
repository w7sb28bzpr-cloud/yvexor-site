import { SiteHeader } from "../components/navigation";
import { SiteFooter } from "../components/site-footer";
import { PageData } from "../components/structured-data";
import { HomeCodeField } from "../components/home-code-field";
import { HeroRotatingWord } from "../components/hero-rotating-word";
import { homeTitle, homeDescription } from "../lib/seo";
import styles from "./home-v2.module.css";

export default function Home() {
  return <div className={`site-foundation ${styles.shell}`}>
    <PageData path="/" title={homeTitle} description={homeDescription} />
    <SiteHeader immersiveHero />
    <main id="contenu" className={styles.home}>
      <section id="solutions" className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroVisual} aria-hidden="true">
          <HomeCodeField />
        </div>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <h1 id="home-title" aria-label="YVEXOR — Technologie sur mesure" className={`site-display ${styles.heroTitle}`}>
              <span className={styles.heroKicker}>YVEXOR</span>
              <span className={styles.heroTitleLine}>Technologie</span>
              <HeroRotatingWord wrapClassName={styles.heroRotatingWrap} wordClassName={styles.heroRotatingWord} />
            </h1>
            <p className={styles.heroLead}>Du logiciel au terrain, nous construisons la solution autour de votre besoin.</p>
            <nav className={styles.heroActions} aria-label="Choisir un parcours">
              <a className={`site-button ${styles.solutionsAction}`} href="/solutions/">Explorer les solutions</a>
              <a className={styles.secondaryAction} href="/metiers/">Explorer par métier</a>
            </nav>
          </div>
        </div>
      </section>
      <section className={styles.journey} aria-label="Le parcours YVEXOR en bref">
        <ol>
          <li>Votre besoin</li>
          <li>Solution sur mesure</li>
          <li>Du logiciel au terrain</li>
        </ol>
      </section>
    </main>
    <SiteFooter />
  </div>;
}

import { SiteHeader } from "../components/navigation";
import { SiteFooter } from "../components/site-footer";
import { PageData } from "../components/structured-data";
import { HomeCodeField } from "../components/home-code-field";
import { homeTitle, homeDescription } from "../lib/seo";
import { getPublishedProjects } from "../lib/content";
import { HomeJourney } from "./home-journey";
import styles from "./home-v2.module.css";

function FeaturedProjectSection() {
  const project = getPublishedProjects()[0];
  if (!project) return null;
  const media = project.media[0];

  return <section className={styles.project} aria-labelledby="home-project-title">
    <div className={styles.projectCopy}>
      <p className={styles.eyebrow}>Projet YVEXOR</p>
      <h2 id="home-project-title" className="site-display site-heading-lg">{project.title}</h2>
      <p>{project.need}</p>
      <p>{project.outcome}</p>
      <a className="site-link" href="/projets/">Voir les projets documentés <span aria-hidden="true">↗</span></a>
    </div>
    {media && <img className={styles.projectImage} src={media.src} alt={media.decorative ? "" : media.alt} width="1200" height="800" loading="lazy" />}
  </section>;
}

export default function Home() {
  return <div className="site-foundation">
    <PageData path="/" title={homeTitle} description={homeDescription} />
    <SiteHeader />
    <main id="contenu" className={styles.home}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>YVEXOR — Technologie sur mesure</p>
            <h1 id="home-title" className="site-display">Du logiciel au terrain, construisons la solution autour de votre besoin.</h1>
            <p className={styles.heroLead}>Applications, IA, automatisation, systèmes connectés, commerce et infrastructure : YVEXOR conçoit et relie les technologies utiles à votre activité.</p>
            <div className={styles.heroActions}>
              <a className="site-button" href="/solutions/">Découvrir les solutions</a>
              <a className={styles.secondaryAction} href="/metiers/">Explorer par métier</a>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <HomeCodeField />
          </div>
        </div>
      </section>

      <HomeJourney />

      <section id="solutions" className={styles.doors} aria-labelledby="home-doors-title">
        <div className="site-container">
          <header className={styles.doorsHeader}>
            <p className={styles.eyebrow}>Deux façons de commencer</p>
            <h2 id="home-doors-title" className="site-display site-heading-lg">Votre besoin donne le point de départ.</h2>
          </header>
          <div className={styles.doorGrid}>
            <a className={`${styles.door} ${styles.doorSolution}`} href="/solutions/">
              <span className={styles.doorIndex}>01 / SOLUTIONS</span>
              <h3>Je sais ce que je cherche.</h3>
              <p>Logiciel, IA, automatisation, commerce, systèmes connectés ou infrastructure.</p>
              <span className={styles.doorLink}>Explorer les solutions <span aria-hidden="true">↗</span></span>
            </a>
            <a className={`${styles.door} ${styles.doorIndustry}`} href="/metiers/">
              <span className={styles.doorIndex}>02 / MÉTIERS</span>
              <h3>Je pars de mon activité.</h3>
              <p>Décrivez votre métier et ce que vous souhaitez faire évoluer.</p>
              <span className={styles.doorLink}>Explorer les métiers <span aria-hidden="true">↗</span></span>
            </a>
          </div>
        </div>
      </section>

      <FeaturedProjectSection />

      <section className={styles.contact} aria-labelledby="home-contact-title">
        <div className="site-container">
          <p className={styles.eyebrow}>On commence par vous écouter</p>
          <h2 id="home-contact-title" className="site-display site-heading-lg">Vous avez un problème, une idée ou un équipement particulier&nbsp;?</h2>
          <p>YVEXOR construit la solution autour.</p>
          <a className="site-button" href="/contact/">Parler de mon projet</a>
        </div>
      </section>
    </main>
    <SiteFooter />
  </div>;
}

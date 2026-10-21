import { SiteHeader } from "../components/navigation";
import { SiteFooter } from "../components/site-footer";
import { PageData } from "../components/structured-data";
import { v2Solutions } from "../data/v2-solutions";
import { homeTitle, homeDescription } from "../lib/seo";
import { HomeJourney } from "./home-journey";
import styles from "./home-v2.module.css";

type FeaturedProject = {
  title: string;
  need: string;
  image: string;
  imageAlt: string;
  href: string;
};

function FeaturedProjectSection({ project }: { project: FeaturedProject | null }) {
  if (!project) return null; // Publish only a real, approved project.
  return <section className={styles.project} aria-labelledby="v2-project-title">
    <div className={styles.projectCopy}><p className={styles.kicker}>Un projet YVEXOR</p><h2 id="v2-project-title">{project.title}</h2><p>{project.need}</p><a className="v2-text-link" href={project.href}>Voir le projet ↗</a></div>
    <img src={project.image} alt={project.imageAlt} width="1200" height="800" loading="lazy" />
  </section>;
}

export default function Home() {
  return <><PageData path="/" title={homeTitle} description={homeDescription} /><SiteHeader />
    <main id="contenu" className={styles.home}>
      <section className={styles.hero} aria-labelledby="v2-home-title">
        <div className={styles.heroInner}>
          <div className={styles.heroCopy} data-reveal>
            <p className={styles.kicker}>YVEXOR · Des solutions pour le monde réel</p>
            <h1 id="v2-home-title">Du logiciel au terrain.<br /><span>YVEXOR construit la solution.</span></h1>
            <p className={styles.heroLead}>Tu as une idée, un problème ou quelque chose que tu veux améliorer ? Parle-nous. Même si c’est encore flou.</p>
            <div className={styles.heroActions}><a className="v2-button" href="/contact/">On en parle ?</a><a className={styles.heroLink} href="/a-propos/">Découvrir YVEXOR ↗</a></div>
          </div>
          <figure className={styles.heroMedia} data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
            <img src="/images/v2/neutral-placeholder.svg" width="1600" height="1000" alt="Emplacement réservé à une photographie montrant YVEXOR sur le terrain" fetchPriority="high" />
            <figcaption>Photographie YVEXOR à venir · Le réel, sans décor technologique ajouté.</figcaption>
          </figure>
        </div>
      </section>

      <HomeJourney />

      <section className={styles.solutions} id="solutions" aria-labelledby="v2-solutions-title">
        <span id="exemples" className={styles.anchor} />
        <div className={styles.sectionInner}>
          <div className={styles.solutionsHead} data-reveal><div><p className={styles.kicker}>Par où commencer ?</p><h2 id="v2-solutions-title">Ce qu’on peut faire.</h2></div><a className="v2-text-link" href="/solutions/">Toutes les solutions ↗</a></div>
          <div className={styles.solutionGrid}>{v2Solutions.map((solution, index) => <a className={styles.solutionItem} href={solution.href} key={solution.title} data-reveal style={{ "--reveal-delay": `${(index % 4) * 70}ms` } as React.CSSProperties}><span className={styles.solutionNumber}>{String(index + 1).padStart(2, "0")}</span><h3>{solution.title}</h3><p>{solution.cue}</p><span className={styles.solutionArrow} aria-hidden="true">↗</span></a>)}</div>
        </div>
      </section>

      <FeaturedProjectSection project={null} />

      <section className={styles.contact} id="projet" aria-labelledby="v2-contact-title">
        <div className={styles.sectionInner} data-reveal><p className={styles.kicker}>On commence simplement</p><h2 id="v2-contact-title">T’as quelque chose en tête ?</h2><p>Même si c’est encore juste une idée, le plus simple, c’est d’en parler.</p><a className="v2-button" href="/contact/">On en parle ?</a></div>
      </section>
    </main><SiteFooter /></>;
}

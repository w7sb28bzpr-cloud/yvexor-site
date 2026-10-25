import type { Metadata } from "next";
import { SiteHeader } from "../../components/navigation";
import { PageData } from "../../components/structured-data";
import { SiteFooter } from "../../components/site-footer";
import { getPublishedProjects } from "../../lib/content";
import styles from "./projects.module.css";

const title = "Projets YVEXOR — Des réalisations concrètes";
const description = "Découvrez les projets YVEXOR documentés, du besoin initial aux résultats réellement obtenus.";

export function generateMetadata(): Metadata {
  const hasProjects = getPublishedProjects().length > 0;
  return {
    title: hasProjects ? title : "Projets YVEXOR — À venir",
    description: hasProjects ? description : "Des projets YVEXOR documentés seront présentés ici après validation des informations et des visuels partageables.",
    robots: { index: hasProjects, follow: true },
    alternates: { canonical: "https://yvexor.com/projets/" },
  };
}

export default function ProjetsPage() {
  const projects = getPublishedProjects();
  const pageTitle = projects.length ? title : "Projets YVEXOR — À venir";
  const pageDescription = projects.length ? description : "Des projets YVEXOR documentés seront présentés ici après validation des informations et des visuels partageables.";

  return <><PageData path="/projets/" title={pageTitle} description={pageDescription} type="CollectionPage" /><SiteHeader /><main id="contenu" className={`v2-directory ${styles.page}`}>
    <div className="v2-directory__intro" data-reveal><p className="v2-directory__eyebrow">Projets</p><h1>{projects.length ? "Des projets réels, du besoin au résultat." : "Des réalisations concrètes, bientôt ici."}</h1><p>{projects.length ? "Chaque projet présente son contexte, l’intervention YVEXOR et les résultats qui peuvent être partagés." : "Nous publierons des projets réels, avec le besoin de départ, ce qui a été construit et les éléments que nous pouvons partager. Aucun exemple fictif."}</p>
      {projects.length === 0 && <a className="v2-button" href="/contact/">Tu as quelque chose en tête ?</a>}
    </div>
    {projects.length > 0 && <ul className={styles.list}>{projects.map((project) => <li key={project.id} className="site-surface">
      {project.media[0] && <img className={styles.image} src={project.media[0].src} alt={project.media[0].decorative ? "" : project.media[0].alt} />}
      <p className="v2-directory__eyebrow">Projet YVEXOR</p><h2><a href={`/projets/${project.slug}/`}>{project.title}</a></h2><p>{project.need}</p><a className="site-link" href={`/projets/${project.slug}/`}>Découvrir le projet</a>
    </li>)}</ul>}
  </main><SiteFooter /></>;
}

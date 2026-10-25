import type { Industry } from "../../data/content-types";
import { solutionById } from "../../data/solutions";
import styles from "./industries.module.css";

export function IndustryCard({ industry }: { industry: Industry }) {
  const relatedSolutions = industry.solutionIds.map((id) => solutionById[id]).filter(Boolean);

  return <article className={`site-surface ${styles.card}`}>
    <div className={styles.cardIntro}>
      <p className={styles.eyebrow}>Activité</p>
      <h3 className="site-display"><a className="site-link" href={industry.canonicalPath}>{industry.name}</a></h3>
      <p className={`site-copy ${styles.summary}`}>{industry.page.description}</p>
    </div>
    <div className={styles.related}>
      <h4>Des pistes à explorer</h4>
      <ul>
        {relatedSolutions.map((solution) => <li key={solution.id}><a className="site-link" href={solution.canonicalPath}>{solution.page.title}</a></li>)}
      </ul>
    </div>
    <a className={`site-button ${styles.cardAction}`} href={industry.canonicalPath}>Voir les solutions pour cette activité<span aria-hidden="true">↗</span></a>
  </article>;
}

import type { PublicSolution } from "../../lib/content";
import { industryById } from "../../lib/content";
import { SolutionPricing } from "../../components/solution-pricing";
import styles from "./solution-card.module.css";

export function SolutionCard({ solution }: { solution: PublicSolution }) {
  const industries = solution.industryIds.map((id) => industryById[id]).filter(Boolean);
  return <article className={`site-surface ${styles.card}`}>
    <p className={styles.eyebrow}>{solution.eyebrow}</p>
    <h3 className="site-display"><a className="site-link" href={solution.canonicalPath}>{solution.page.title}</a></h3>
    <p className={styles.summary}>{solution.page.description}</p>
    <SolutionPricing pricing={solution.pricing} compact />
    {industries.length > 0 && <nav className={styles.industries} aria-label={`Métiers concernés par ${solution.page.title}`}>
      <span>Pour</span>
      {industries.map((industry) => <a className="site-link" href={industry.canonicalPath} key={industry.id}>{industry.name}</a>)}
    </nav>}
    <a className={`site-button ${styles.action}`} href={solution.primaryAction.href}>
      {solution.primaryAction.label} <span aria-hidden="true">↗</span>
    </a>
  </article>;
}

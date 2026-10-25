import type { Industry, IndustryVisualId } from "../../data/content-types";
import { getPublicToolsForIndustry } from "../../lib/content";
import styles from "./industries.module.css";

function IndustryMark({ kind }: { kind: IndustryVisualId }) {
  return <svg className={styles.mark} viewBox="0 0 240 150" aria-hidden="true" focusable="false">
    <rect x="22" y="24" width="196" height="102" rx="20" className={styles.markFrame} />
    {kind === "restaurant" && <><circle cx="92" cy="75" r="29" className={styles.markRing} /><circle cx="92" cy="75" r="18" className={styles.markAccent} /><path d="M151 48v54M166 48v54M151 67h15" className={styles.markLine} /></>}
    {kind === "hotel" && <><path d="M66 98V58h107v40M66 83h107M85 69h29v14H85zM132 69h28v14h-28z" className={styles.markLine} /><path d="M91 50h56" className={styles.markAccentLine} /></>}
    {kind === "garage" && <><path d="M60 93h120l-9-31a12 12 0 0 0-11-8H80a12 12 0 0 0-11 8zM60 93v15h15V93m90 0v15h15V93M76 83h88" className={styles.markLine} /><circle cx="91" cy="94" r="8" className={styles.markAccent} /><circle cx="149" cy="94" r="8" className={styles.markAccent} /></>}
    {kind === "generic" && <><path d="M120 45v60M90 75h60M99 54l42 42m0-42L99 96" className={styles.markLine} /><circle cx="120" cy="75" r="37" className={styles.markAccentLine} /></>}
  </svg>;
}

export function IndustryCard({ industry }: { industry: Industry }) {
  const tools = getPublicToolsForIndustry(industry);
  return <article className={styles.card}>
    <a className={styles.cardLink} href={industry.canonicalPath} aria-label={`Explorer les solutions YVEXOR pour ${industry.name}`}>
      <IndustryMark kind={industry.visualId} />
      <div className={styles.cardContent}>
        <p className={styles.cardEyebrow}>Univers métier</p>
        <h3 className="site-display">{industry.name}</h3>
        <p className={styles.summary}>{industry.cardDescription}</p>
        <div className={styles.toolNames} aria-label="Outils associés">
          {tools.slice(0, 3).map((tool) => <span key={tool.id}>{tool.name}</span>)}
        </div>
        <span className={styles.explore}>Explorer <span aria-hidden="true">↗</span></span>
      </div>
    </a>
  </article>;
}

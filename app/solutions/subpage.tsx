import type { ReactNode } from "react";
import styles from "./subpage.module.css";

/** Shared building blocks of the Solutions sub-pages (domains and trades): same recipe as the hub. */

export function SubHero({ kicker, title, lead, icon, visual, children }: {
  kicker: string;
  title: string;
  lead: string;
  icon?: ReactNode;
  /** The animated example on the right; without it the copy takes the full width. */
  visual?: ReactNode;
  children: ReactNode;
}) {
  return <div className={`${styles.hero} ${visual ? styles.heroSplit : ""}`}>
    <header className={styles.intro}>
      <a className={styles.back} href="/solutions/#rubriques"><span aria-hidden="true">←</span> Nos solutions</a>
      <div className={styles.titleRow}>
        {icon}
        <p className={styles.kicker}>{kicker}</p>
      </div>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.lead}>{lead}</p>
      <div className={styles.actions}>{children}</div>
    </header>
    {visual}
  </div>;
}

export function ServiceGrid({ id, title, services }: { id: string; title: string; services: { title: string; text: string; more: string }[] }) {
  return <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`} className={styles.sectionTitle}>{title}</h2>
    <ul className={styles.services}>
      {services.map((service, index) => <li key={service.title}>
        <details className={styles.service}>
          <summary>
            <span className={styles.index} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.serviceTitle}>{service.title}</span>
            <span className={styles.serviceText}>{service.text}</span>
            <span className={styles.more} aria-hidden="true">Lire plus</span>
          </summary>
          <p>{service.more}</p>
        </details>
      </li>)}
    </ul>
  </section>;
}

export function HowItWorks() {
  return <section className={styles.section} aria-labelledby="how-title">
    <h2 id="how-title" className={styles.sectionTitle}>Comment ça se passe</h2>
    <ol className={styles.how}>
      <li><span>1</span><strong>Vous nous parlez de votre besoin</strong>Ce qui vous fait perdre du temps, ce que vous voulez changer.</li>
      <li><span>2</span><strong>On fixe le budget ensemble</strong>À partir de ce que vous voulez investir, pas d’une grille imposée.</li>
      <li><span>3</span><strong>On installe et on vous accompagne</strong>Une première version utile, puis on la fait évoluer avec vous.</li>
    </ol>
  </section>;
}

export function BudgetClosing() {
  return <section className={styles.closing} aria-labelledby="closing-title">
    <h2 id="closing-title" className={styles.sectionTitle}>Votre budget, votre rythme.</h2>
    <p>Petit budget ou gros projet, on trouve la solution et on vous accompagne. Une seule application ? <a href="/applications/">Elle est gratuite</a>.</p>
    <a className={styles.primary} href="/contact/">Parler de mon projet <span aria-hidden="true">→</span></a>
  </section>;
}

export { styles as subpageStyles };

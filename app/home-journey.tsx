import styles from "./home-v2.module.css";

const stages = [
  { label: "Votre besoin", detail: "On commence par ce que vous voulez améliorer." },
  { label: "Conception", detail: "On choisit les briques qui ont du sens." },
  { label: "Logiciel & IA", detail: "On crée ou adapte les outils nécessaires." },
  { label: "Connexion au terrain", detail: "On relie les équipements et les systèmes." },
  { label: "Automatisation", detail: "Les actions utiles s’enchaînent." },
  { label: "Suivi & évolution", detail: "La solution s’ajuste avec votre activité." },
];

export function HomeJourney() {
  return <section className={styles.process} aria-labelledby="home-process-title">
    <div className="site-container">
      <header className={styles.processHeader}>
        <p className={styles.eyebrow}>De l’idée à l’usage</p>
        <h2 id="home-process-title" className="site-display site-heading-lg">Les bonnes briques, reliées autour de votre besoin.</h2>
        <p className="site-copy">YVEXOR ne part pas d’un produit imposé. Nous construisons le chemin utile, du logiciel jusqu’aux équipements sur le terrain.</p>
      </header>
      <ol className={styles.processSteps}>
        {stages.map((stage, index) => <li key={stage.label}>
          <span className={styles.stepIndex} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <h3>{stage.label}</h3>
          <p>{stage.detail}</p>
        </li>)}
      </ol>
    </div>
  </section>;
}

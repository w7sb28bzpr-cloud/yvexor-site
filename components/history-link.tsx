import { ActionLink } from "./ui";
import styles from "./history-teaser.module.css";

export function HistoryLink({ short = false }: { short?: boolean }) {
  return <ActionLink href="/histoire/" className={styles.link}>{short ? "Notre approche" : "Découvrir notre approche"}</ActionLink>;
}

export function HistoryTeaser() {
  return <aside className={styles.teaser} aria-labelledby="history-teaser-title">
    <div className={styles.copy}><p className="eyebrow">Au-delà du logiciel</p><h3 id="history-teaser-title">Connecter ce qui ne l’était pas.</h3><p>Un objet, une machine ou un équipement n’a pas forcément besoin d’avoir été conçu comme connecté pour pouvoir communiquer avec une application, un serveur ou un autre système.</p><p>Découvrez comment YVEXOR imagine des solutions où logiciel, automatisation, IA et monde physique peuvent fonctionner ensemble.</p><HistoryLink/></div>
    <figure className={styles.visual}>
      <figcaption><span>Monde physique</span><b aria-hidden="true">↔</b><span>Numérique</span></figcaption>
      <ol aria-label="Échanges possibles dans les deux sens, de l’objet à l’application">
        {["Objet / équipement", "Système", "Serveur / API", "Application"].map((label, index) => <li key={label}><span className={styles.node}><small aria-hidden="true">0{index + 1}</small>{label}</span>{index < 3 && <span className={styles.connector} aria-hidden="true">↕</span>}</li>)}
      </ol>
      <p>Une information. Une action en retour.</p>
    </figure>
  </aside>;
}

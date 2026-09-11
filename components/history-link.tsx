import { ActionLink } from "./ui";
import styles from "./history-teaser.module.css";

export function HistoryLink({ short = false }: { short?: boolean }) {
  return <ActionLink href="/histoire/" className={styles.link}>{short ? "Notre histoire" : "Découvrir l’histoire de YVEXOR"}</ActionLink>;
}

export function HistoryTeaser() {
  return <aside className={styles.teaser} aria-labelledby="history-teaser-title">
    <div><p className="eyebrow">L’histoire YVEXOR</p><h3 id="history-teaser-title">Et si quelque chose qui n’a jamais été connecté pouvait le devenir ?</h3><p>Derrière YVEXOR se trouve une manière de penser : comprendre un fonctionnement, connecter ce qui ne l’était pas et utiliser la technologie pour construire une solution adaptée.</p></div>
    <HistoryLink/>
  </aside>;
}

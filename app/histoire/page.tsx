import type { Metadata } from "next";
import { SiteHeader, MobileTabBar } from "../../components/navigation";
import { HistoryDemo } from "../../components/history-demo";
import { HistoryConnections } from "../../components/history-connections";
import { BrandLogo } from "../../components/brand-logo";
import { ActionLink } from "../../components/ui";
import styles from "./history.module.css";

const title = "L’approche YVEXOR — Au-delà du logiciel";
const description = "Découvrez l’approche YVEXOR : connecter logiciels, automatisations, IA, équipements et systèmes pour construire des solutions adaptées aux besoins réels des entreprises.";
export const metadata: Metadata = {
  title, description, alternates: { canonical: "https://yvexor.com/histoire/" },
  openGraph: { title, description, url: "https://yvexor.com/histoire/", siteName: "YVEXOR", type: "article", images: ["https://yvexor.com/yvexor-social-v1.jpg"] },
  twitter: { card: "summary_large_image", title, description, images: ["https://yvexor.com/yvexor-social-v1.jpg"] },
};

export default function HistoryPage() {
  return <><SiteHeader root/><main className={styles.page} id="histoire">
    <header className={styles.hero}>
      <div className={styles.heroTop}><a href="/#yvexor">YVEXOR / Notre approche</a><span>Au-delà du logiciel</span></div>
      <p className={styles.label}>L’approche YVEXOR</p>
      <h1>Et si quelque chose qui n’a jamais été connecté <em>pouvait le devenir ?</em></h1>
      <div className={styles.heroBottom}><p>YVEXOR n’est pas né avec l’idée de créer un logiciel de plus. À l’origine, il y avait surtout une curiosité : comprendre comment les choses fonctionnent, les modifier et chercher comment leur faire faire davantage.</p><div className={styles.worlds} aria-label="Le monde physique et le monde numérique peuvent échanger"><span>Physique</span><b aria-hidden="true">↕</b><span>Numérique</span></div></div>
    </header>
    <section className={styles.chapter} aria-labelledby="connect-title">
      <div className={styles.copy}><p>De l’informatique à l’électronique, des automatismes aux véhicules, puis au développement et aux systèmes connectés : les technologies changeaient. La question restait la même.</p><p className={styles.question}>Pourquoi est-ce qu’on ne pourrait pas faire autrement ?</p><span className={styles.label}>01 / Faire le lien</span><h2 id="connect-title">Connecter ce qui ne l’était pas.</h2><p>Un objet n’a pas nécessairement besoin d’avoir été conçu comme « connecté » pour pouvoir communiquer avec le numérique. Un interrupteur peut devenir une information sur une application. Une machine peut transmettre son état à un serveur. Et une application peut, en retour, transmettre une instruction à un système physique.</p></div>
      <HistoryDemo/>
    </section>
    <section className={styles.statement} aria-labelledby="communicate-title">
      <p>Le monde physique et le monde numérique ne sont finalement pas deux univers séparés.</p>
      <h2 id="communicate-title">Ils peuvent <em>communiquer.</em></h2>
    </section>
    <section className={styles.chapter} aria-labelledby="screen-title">
      <div className={styles.copy}><span className={styles.label}>02 / Au-delà de l’écran</span><h2 id="screen-title">Le logiciel ne s’arrête plus à l’écran.</h2><p>Une caisse peut communiquer avec un stock. Un site internet avec une machine. Une réservation peut déclencher plusieurs actions. Une application peut centraliser les informations de plusieurs systèmes.</p><p>Un équipement existant peut recevoir de nouvelles fonctionnalités. Et l’intelligence artificielle peut analyser, comprendre ou automatiser une partie de ces échanges.</p></div>
      <HistoryConnections className={styles.ecosystem}>
        <div className={styles.sharedInformation}><span className={styles.label}>Exemple de principe</span><h3>Une information.<br/><span>Plusieurs usages.</span></h3><p>Une disponibilité change.<br/>L’information peut circuler.</p></div>
        <div className={styles.exchange}><span>Serveur / API</span><small>Partager une information commune</small></div>
        <ul className={styles.consumers}>{[["Caisse & stock", "Actualiser une disponibilité"], ["Site & application", "Afficher la même information"], ["IA & automatisation", "Analyser ou déclencher une action"], ["Objet / équipement", "Recevoir une instruction adaptée"]].map(([name, use]) => <li key={name}><strong>{name}</strong><span>{use}</span></li>)}</ul>
      </HistoryConnections>
      <p className={styles.diagramNote}>Schéma conceptuel : les échanges dépendent des interfaces disponibles et des contraintes de chaque système.</p>
      <p className={styles.pullquote}>Le véritable potentiel apparaît lorsque les technologies commencent à communiquer entre elles.</p>
    </section>
    <section className={styles.chapter} aria-labelledby="technologies-title">
      <div className={styles.copy}><span className={styles.label}>03 / Choisir les bons moyens</span><h2 id="technologies-title">Une idée. Plusieurs technologies.</h2><p>C’est pour cette raison que YVEXOR ne se limite pas à une seule technologie. Selon le problème à résoudre, un projet peut nécessiter une application, un logiciel métier, une API, un serveur, une automatisation, de l’intelligence artificielle, de l’électronique ou un système connecté.</p><p>Parfois une seule suffit. Parfois plusieurs doivent fonctionner ensemble.</p><p className={styles.principle}>Le besoin détermine la technologie.<br/><span>Jamais l’inverse.</span></p></div>
      <HistoryConnections className={styles.convergence}>
        <ul>{["Application", "API / serveur", "IA / automatisation", "Électronique / système"].map(name => <li key={name}>{name}</li>)}</ul>
        <svg className={styles.convergingLines} viewBox="0 0 300 200" aria-hidden="true"><path d="M0 15C150 15 130 100 240 100M0 72C130 72 160 100 240 100M0 128C130 128 160 100 240 100M0 185C150 185 130 100 240 100"/><path className={styles.xMark} d="m240 78 38 44m0-44-38 44"/></svg>
        <div><BrandLogo/><p>Plusieurs technologies.<br/>Une solution cohérente.</p></div>
      </HistoryConnections>
    </section>
    <section className={styles.chapter} aria-labelledby="birth-title">
      <div className={styles.copy}><span className={styles.label}>04 / Une vision prend forme</span><h2 id="birth-title">C’est de cette vision qu’est né YVEXOR.</h2><p>Aujourd’hui, YVEXOR imagine et développe des solutions numériques et connectées pour les professionnels.</p><p>L’objectif n’est pas d’ajouter de la technologie partout. Il est de comprendre un fonctionnement, identifier ce qui pourrait être simplifié, connecté ou automatisé, puis construire la solution adaptée.</p><p>Du commerce à la restauration ou à l’hôtellerie, d’une application métier à une plateforme ou à un système connecté, cette logique reste la même.</p><p className={styles.principle}>C’est à la technologie de s’adapter à l’activité.<br/><span>Pas l’activité à la technologie.</span></p></div>
    </section>
    <section className={styles.ending} aria-labelledby="ending-title">
      <div className={styles.copy}><h2 id="ending-title">Et lorsqu’une idée semble impossible ?</h2><p>Certaines demandes commencent simplement par :</p><p className={styles.idea}>« J’aimerais pouvoir faire ça… mais je ne sais pas si c’est possible. »</p><p>C’est souvent là que commence un projet YVEXOR.</p><p className={styles.lastWord}>Voyons comment on peut le construire.</p><p className={styles.signature}>Yannick Marascia<span>Fondateur de YVEXOR</span></p><div className={styles.signoff}><BrandLogo/><p>Des idées qui avancent.</p></div></div>
      <div className={styles.finalLink}><p>Vous avez une idée, un besoin ou un fonctionnement que vous aimeriez améliorer ?</p><ActionLink href="https://client.yvexor.com/" className="secondary">Parler de mon projet</ActionLink></div>
    </section>
  </main><footer className={`footer ${styles.footer}`}><BrandLogo/><p>Des idées qui avancent.</p><div><a href="/#yvexor">Découvrir YVEXOR</a><a href="/mentions-legales/">Mentions légales</a><a href="/politique-confidentialite/">Confidentialité</a></div><small>© 2026 YVEXOR</small></footer><MobileTabBar root/></>;
}

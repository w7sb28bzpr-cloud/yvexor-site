"use client";

import { ResultBubble, SceneFrame, useSceneLoop } from "./scene-frame";
import styles from "./scenes.module.css";

/* One distinct scene per domain (kit references: A07 ticket, A11 assistant, A17 sensor, A12 access).
 * Every scene loops in four steps, pauses off screen and shows its last step with reduced motion. */

const TICKET_MS = [2600, 1800, 1800, 2800];
const ticketResults = ["Ticket imprimé", "Paiement accepté", "Envoyée en cuisine", "Ventes du jour à jour"];

export function TicketScene() {
  const { ref, step, cycle } = useSceneLoop(TICKET_MS);
  return <SceneFrame frameRef={ref} title="Une commande au comptoir" description="Le ticket s’imprime, le paiement est accepté, la commande part en cuisine.">
    <div className={styles.ticketScene}>
      <div className={styles.printerWrap}>
        <span className={styles.printer}><i /></span>
        <div key={cycle} className={styles.ticket}>
          <p className={styles.ticketHead}>YVEXOR · Comptoir<br /><small>Commande #48</small></p>
          <p className={styles.ticketLine}><span>Menu burger</span><span>12,50</span></p>
          <p className={styles.ticketLine}><span>Menu poulet</span><span>10,50</span></p>
          <p className={styles.ticketLine}><span>Boisson</span><span>1,50</span></p>
          <p className={styles.ticketTotal}><span>Total</span><span>24,50 €</span></p>
          {step >= 1 && <span className={styles.stamp}>Payé</span>}
        </div>
      </div>
      <ul className={styles.ticketSide}>
        <li className={step >= 1 ? styles.on : ""}><b>Carte bancaire</b><small>24,50 € · accepté</small></li>
        <li className={step >= 2 ? styles.on : ""}><b>Écran cuisine</b><small>#48 · en préparation</small></li>
        <li className={step >= 3 ? styles.on : ""}><b>Chiffre du jour</b><small>1 284,00 €</small></li>
      </ul>
    </div>
    <ResultBubble stepKey={`${cycle}-${step}`} text={ticketResults[step]} />
  </SceneFrame>;
}

const CHAT_MS = [2200, 1500, 2600, 3200];
const chatResults = ["Message reçu", "L’IA analyse la demande", "Réponse prête à valider", "Fait, sans copier-coller"];

export function ChatScene() {
  const { ref, step, cycle } = useSceneLoop(CHAT_MS);
  return <SceneFrame frameRef={ref} title="Un message client, traité tout seul" description="Un client demande un devis, l’IA le prépare, le dossier est créé et la relance programmée.">
    <div key={cycle} className={styles.chat}>
      <p className={`${styles.bubble} ${styles.bubbleClient}`}><small>Client · 7 h 42</small>Bonjour, je voudrais un devis pour 3 caméras.</p>
      {step === 1 && <p className={`${styles.bubble} ${styles.bubbleAi} ${styles.typing}`}><i /><i /><i /></p>}
      {step >= 2 && <p className={`${styles.bubble} ${styles.bubbleAi}`}><small>IA YVEXOR</small>Bien reçu ! Voici votre devis D-2481 : 1 240 € HT, pose comprise.</p>}
      {step >= 3 && <ul className={styles.actions}>
        <li>✓ Devis créé</li><li>✓ Client ajouté</li><li>✓ Relance à J+3</li>
      </ul>}
    </div>
    <ResultBubble stepKey={`${cycle}-${step}`} text={chatResults[step]} />
  </SceneFrame>;
}

const SENSOR_MS = [2200, 2200, 2200, 3200];
const sensorResults = ["Température normale", "Hausse détectée", "Seuil dépassé", "Alerte envoyée au responsable"];
const sensorValues = ["3,2", "4,1", "6,4", "7,8"];
// Drawn share of the curve and the moving point at each step (viewBox 300 × 140, threshold at y = 58).
const sensorOffsets = [64, 39, 16, 0];
const sensorPoints = [[100, 109], [170, 97], [235, 63], [280, 30]];

export function SensorScene() {
  const { ref, step } = useSceneLoop(SENSOR_MS);
  const alert = step >= 2;
  const [x, y] = sensorPoints[step];
  return <SceneFrame frameRef={ref} title="Chambre froide, surveillée en continu" description="La température monte, dépasse le seuil de 6 degrés et une alerte part au responsable.">
    <div className={styles.sensor}>
      <div className={styles.sensorTop}>
        <span><small>Chambre froide</small><b className={alert ? styles.hot : ""}>{sensorValues[step]} °C</b></span>
        <span className={`${styles.sensorBadge} ${alert ? styles.sensorBadgeAlert : ""}`}>{alert ? "Au-dessus du seuil" : "Normal"}</span>
      </div>
      <svg className={styles.chart} viewBox="0 0 300 140" preserveAspectRatio="none">
        <path className={styles.grid} d="M0 30H300M0 85H300M0 130H300" />
        <path className={styles.threshold} d="M0 58H300" />
        <text className={styles.thresholdLabel} x="296" y="52" textAnchor="end">seuil 6 °C</text>
        <path className={`${styles.curve} ${alert ? styles.curveHot : ""}`} pathLength="100" style={{ strokeDashoffset: sensorOffsets[step] }} d="M0 110 L40 108 L80 112 L120 106 L160 100 L200 88 L240 60 L280 30" />
        <g className={styles.point} style={{ transform: `translate(${x}px, ${y}px)` }}><circle r="5" className={alert ? styles.pointHot : ""} /></g>
      </svg>
      <p className={`${styles.alertCard} ${step >= 3 ? styles.on : ""}`}><b>Alerte envoyée à Julie</b><small>SMS · 22 h 14 · chambre froide</small></p>
    </div>
    <ResultBubble stepKey={step} text={sensorResults[step]} alert={step === 3} />
  </SceneFrame>;
}

const GATE_MS = [2200, 1900, 2000, 2600];
const gateResults = ["Véhicule détecté", "Plaque reconnue : barrière ouverte", "Passage enregistré", "Barrière refermée"];
// Car position across the road (in % of the stage) and barrier state at each step.
const carX = [16, 16, 72, 112];

export function GateScene() {
  const { ref, step, cycle } = useSceneLoop(GATE_MS);
  const open = step === 1 || step === 2;
  return <SceneFrame frameRef={ref} title="Un véhicule, de la rue au parking" description="La plaque est lue, la barrière se lève, le véhicule passe et le passage est enregistré.">
    <div className={styles.gate}>
      <div className={styles.road}><i /></div>
      <div className={styles.post}><span className={styles.cam} /></div>
      <div className={`${styles.arm} ${open ? styles.armUp : ""}`}><i /></div>
      <div key={cycle} className={styles.carTrack} style={{ transform: `translateX(${carX[step]}%)` }}>
        <div className={styles.car}>
          {step <= 1 && <span className={`${styles.plate} ${step === 1 ? styles.plateOk : ""}`}>AB-123-CD</span>}
          <span className={styles.carRoof} /><span className={styles.carBody} />
          <span className={styles.wheel} /><span className={styles.wheel} />
        </div>
      </div>
      <p className={`${styles.log} ${step >= 2 ? styles.on : ""}`}><b>Entrée 08 h 42</b><small>Place 14 · badge visiteur</small></p>
    </div>
    <ResultBubble stepKey={`${cycle}-${step}`} text={gateResults[step]} />
  </SceneFrame>;
}

const BOARD_MS = [2200, 2200, 2200, 3200];
const boardResults = ["Demande reçue de Mme Martin", "Intervention planifiée mardi 9 h", "Terminée et signée sur place", "Tableau de bord à jour"];
const boardColumns = ["À faire", "En cours", "Terminé"];
const boardStatus = ["Nouvelle", "Planifiée", "Terminée", "Terminée"];

export function BoardScene() {
  const { ref, step } = useSceneLoop(BOARD_MS);
  const column = Math.min(step, 2);
  return <SceneFrame frameRef={ref} title="Une intervention, suivie de bout en bout" description="La fiche passe de À faire à En cours puis Terminé, et le tableau de bord se met à jour.">
    <div className={styles.board}>
      <p className={styles.boardStat}>Interventions terminées cette semaine <b className={step >= 3 ? styles.bump : ""}>{step >= 3 ? 13 : 12}</b></p>
      <div className={styles.columns}>
        {boardColumns.map((name) => <div key={name} className={styles.column}><small>{name}</small><i /><i /></div>)}
        <div className={styles.cardTrack} style={{ "--col": column } as React.CSSProperties}>
          <div className={styles.taskCard}>
            <b>Mme Martin</b>
            <small>Installation · mardi 9 h</small>
            <span className={step >= 2 ? styles.done : ""}>{boardStatus[step]}</span>
          </div>
        </div>
      </div>
    </div>
    <ResultBubble stepKey={step} text={boardResults[step]} />
  </SceneFrame>;
}

const SITE_MS = [2200, 2000, 2200, 3200];
const siteResults = ["Un visiteur arrive depuis Google", "Il clique sur « Réserver »", "Demande remplie en 20 secondes", "Réservation confirmée"];

export function SiteScene() {
  const { ref, step, cycle } = useSceneLoop(SITE_MS);
  return <SceneFrame frameRef={ref} title="Un visiteur devient un client" description="Un visiteur arrive sur le site, clique sur Réserver, remplit sa demande et reçoit la confirmation.">
    <div key={cycle} className={styles.browser}>
      <div className={styles.urlBar}><i /><i /><i /><span>votre-site.fr</span></div>
      <div className={styles.page}>
        <span className={styles.pageTitle} /><span className={styles.pageLine} /><span className={`${styles.pageLine} ${styles.short}`} />
        <span className={`${styles.cta} ${step >= 1 ? styles.ctaPressed : ""}`}>Réserver</span>
        {step >= 2 && <div className={styles.form}>
          <p><small>Personnes</small><b>4</b></p>
          <p><small>Date</small><b>Samedi 20 h</b></p>
        </div>}
        {step >= 3 && <p className={styles.toast}>Réservation confirmée · e-mail envoyé</p>}
      </div>
      <span className={`${styles.cursor} ${step >= 1 ? styles.cursorOnCta : ""}`}><svg viewBox="0 0 16 16"><path d="M2 1l11 7-5 1 3 5-2 1-3-5-4 3z" /></svg></span>
    </div>
    <ResultBubble stepKey={`${cycle}-${step}`} text={siteResults[step]} />
  </SceneFrame>;
}

/** The scene of a /solutions/domaines/ slug. */
export function DomainScene({ domain }: { domain: string }) {
  switch (domain) {
    case "caisses-paiement": return <TicketScene />;
    case "ia-automatisation": return <ChatScene />;
    case "domotique-objets-connectes": return <SensorScene />;
    case "acces-parkings-securite": return <GateScene />;
    case "sites-internet": return <SiteScene />;
    default: return <BoardScene />;
  }
}

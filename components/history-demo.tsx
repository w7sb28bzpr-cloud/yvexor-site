"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../app/histoire/history.module.css";

const stages = ["Interrupteur", "Capteur / interface", "Système", "Serveur / API", "Application"];

export function HistoryDemo() {
  const [physical, setPhysical] = useState(false);
  const [digital, setDigital] = useState(false);
  const [step, setStep] = useState(-1);
  const [direction, setDirection] = useState<"forward" | "reverse">("forward");
  const [busy, setBusy] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function transmit(reverse = false) {
    if (busy) return;
    const next = !(reverse ? digital : physical);
    setDirection(reverse ? "reverse" : "forward");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhysical(next); setDigital(next); setStep(-1); return;
    }
    setBusy(true);
    (reverse ? setDigital : setPhysical)(next);
    const order = reverse ? [4, 3, 2, 1, 0] : [0, 1, 2, 3, 4];
    setStep(order[0]);
    timers.current = order.slice(1).map((index, offset) => setTimeout(() => setStep(index), (offset + 1) * 180));
    timers.current.push(setTimeout(() => {
      setPhysical(next); setDigital(next); setStep(-1); setBusy(false);
    }, 950));
  }

  return <figure className={styles.demo} aria-labelledby="demo-title">
    <figcaption id="demo-title"><span className={styles.label}>Une action. Une information.</span><p>Touchez l’interrupteur. Suivez le signal.</p></figcaption>
    <ol className={styles.signalPath} data-direction={direction}>
      {stages.map((label, index) => <li key={label} className={step === index ? styles.receiving : ""}>
        <span className={styles.stageNumber}>0{index + 1}</span><strong>{label}</strong>
        {index === 0 ? <button type="button" role="switch" aria-checked={physical} aria-label="Interrupteur de démonstration" disabled={busy} onClick={() => transmit()} className={styles.switch}><i aria-hidden="true"/><span>{physical ? "ON" : "OFF"}</span></button>
          : index === 4 ? <><output className={styles.digitalState} aria-live="polite">État : {digital ? "ACTIVÉ" : "INACTIF"}</output><button type="button" className={styles.reverseButton} disabled={busy} onClick={() => transmit(true)}>{digital ? "Éteindre" : "Activer"} depuis l’application</button></>
          : <span className={styles.stageMeaning}>{index === 1 ? direction === "reverse" ? "Relayer l’instruction" : "Détecter" : index === 2 ? "Interpréter" : "Transmettre"}</span>}
        {index < 4 && <span className={styles.signalConnector} aria-hidden="true"><i/></span>}
      </li>)}
    </ol>
    <p className={styles.direction} aria-live="polite">{busy ? "Transmission…" : direction === "reverse" ? "Application → système → action physique." : "Action physique → système → information numérique."}</p>
    <p className={styles.disclaimer}>Démonstration pédagogique uniquement. Aucun équipement réel n’est connecté à cette page.</p>
    <noscript><p className={styles.disclaimer}>Activez JavaScript pour essayer l’interrupteur. Le parcours ci-dessus illustre les échanges dans les deux sens.</p></noscript>
  </figure>;
}

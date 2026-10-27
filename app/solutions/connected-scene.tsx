"use client";

import { useEffect, useRef, useState } from "react";
import { TechIcon, type SceneIconId } from "./tech-icon";
import styles from "./solutions.module.css";

/* One site, everything linked to YVEXOR: each device reacts in turn, then the loop starts again.
 * Kit references: A03 (hub connecté) and A17 (capteur + alerte), in the "scène logiciel" style. */
const devices: { icon: SceneIconId; label: string; result: string; alert?: boolean }[] = [
  { icon: "barrier", label: "Parking", result: "Plaque reconnue : barrière ouverte" },
  { icon: "badge", label: "Badge", result: "Badge accepté, accès de 8 h à 19 h" },
  { icon: "door", label: "Porte", result: "Porte du hall déverrouillée" },
  { icon: "bulb", label: "Éclairage", result: "Éclairage allumé à l’arrivée" },
  { icon: "thermo", label: "Chauffage", result: "Chauffage réglé à 20,5 °C" },
  { icon: "camera", label: "Caméra", result: "Mouvement au portail : enregistrement lancé" },
  { icon: "sensor", label: "Capteur", result: "Chambre froide à 7,8 °C : alerte envoyée", alert: true },
];

// Positions on an ellipse around the hub, in % of the stage, starting at the top.
const positions = devices.map((_, index) => {
  const angle = (-90 + (index * 360) / devices.length) * (Math.PI / 180);
  return { x: 50 + 38 * Math.cos(angle), y: 48 + 37 * Math.sin(angle) };
});

const stepMs = 2300;
const restMs = 2600;

export function ConnectedScene() {
  const [step, setStep] = useState(-1);
  const [reduced, setReduced] = useState(false);
  const [running, setRunning] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Runs only while the scene is on screen and the tab is visible.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let onScreen = false;
    const update = () => setRunning(onScreen && document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; update(); }, { threshold: 0.25 });
    observer.observe(root);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    if (!running || reduced) return;
    // After the last device, hold the full picture a moment, then start over.
    const delay = step === -1 ? 700 : step === devices.length - 1 ? restMs : stepMs;
    const timer = window.setTimeout(() => setStep((value) => value >= devices.length - 1 ? -1 : value + 1), delay);
    return () => window.clearTimeout(timer);
  }, [running, reduced, step]);

  const shown = reduced ? devices.length - 1 : step;
  const current = shown >= 0 ? devices[shown] : undefined;

  return <figure ref={rootRef} className={styles.scene} aria-label="Démonstration : un site relié à YVEXOR. Le parking, les badges, les portes, l’éclairage, le chauffage, les caméras et les capteurs réagissent ensemble.">
    <figcaption className={styles.sceneHead} aria-hidden="true">
      <span><i className={styles.sceneDot} /> Votre site, connecté</span>
      <span className={styles.sceneDemo}>Exemple</span>
    </figcaption>

    <div className={styles.stage} aria-hidden="true">
      <svg className={styles.links} viewBox="0 0 100 100" preserveAspectRatio="none">
        {positions.map((point, index) => <line
          key={devices[index].label}
          x1="50" y1="48" x2={point.x} y2={point.y}
          vectorEffect="non-scaling-stroke"
          className={index === shown ? (devices[index].alert ? styles.linkAlert : styles.linkActive) : index < shown ? styles.linkDone : undefined}
        />)}
      </svg>

      <div className={styles.hub} key={reduced ? "static" : `hub-${shown}`}>
        <span className={styles.hubPing} />
        <span className={styles.hubMark}>YVEXOR</span>
      </div>

      <ul className={styles.devices}>
        {devices.map((device, index) => {
          const state = index === shown ? (device.alert ? styles.deviceAlert : styles.deviceActive) : index < shown ? styles.deviceDone : "";
          return <li key={device.label} className={`${styles.device} ${state}`} style={{ left: `${positions[index].x}%`, top: `${positions[index].y}%` }}>
            <span className={styles.deviceTile}><TechIcon icon={device.icon} /></span>
            <span className={styles.deviceLabel}>{device.label}</span>
          </li>;
        })}
      </ul>
    </div>

    {/* Fixed-height band: the result changes, the page never moves. */}
    <div className={styles.resultBand} aria-hidden="true">
      {current && <p key={reduced ? "static" : shown} className={`${styles.result} ${current.alert ? styles.resultAlert : ""}`}>
        <span>{current.alert ? "!" : "✓"}</span>{current.result}
      </p>}
    </div>

    <ol className={styles.srOnly}>
      {devices.map((device) => <li key={device.label}>{device.label} : {device.result}.</li>)}
    </ol>
  </figure>;
}

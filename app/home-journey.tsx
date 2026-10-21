"use client";

import { useEffect, useRef } from "react";
import styles from "./home-v2.module.css";

const stages = [
  { label: "Logiciel", detail: "Une idée devient un outil utile." },
  { label: "Connexion", detail: "Les outils échangent entre eux." },
  { label: "Infrastructure", detail: "L’ensemble tient dans la durée." },
  { label: "Matériel", detail: "La solution rejoint les équipements." },
  { label: "Terrain", detail: "Elle sert les personnes, sur place." },
];

export function HomeJourney() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 900px)");
    let frame = 0;

    const measure = () => {
      frame = 0;
      if (reducedMotion.matches) {
        section.style.setProperty("--journey-progress", "1");
        section.dataset.stage = "all";
        return;
      }

      const bounds = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = compact.matches
        ? (viewport * 0.7 - bounds.top) / Math.max(bounds.height, 1)
        : -bounds.top / Math.max(bounds.height - viewport, 1);
      const clamped = Math.min(1, Math.max(0, progress));
      section.style.setProperty("--journey-progress", clamped.toFixed(3));
      section.dataset.stage = String(Math.min(stages.length - 1, Math.floor(clamped * stages.length)));
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    compact.addEventListener("change", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
      compact.removeEventListener("change", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <section ref={sectionRef} className={styles.approach} data-stage="all" aria-labelledby="v2-approach-title">
    <div className={`${styles.sectionInner} ${styles.approachInner}`}>
      <p className={styles.kicker}>Notre façon de faire</p>
      <div className={styles.approachBody}>
        <h2 id="v2-approach-title"><span>Tu nous expliques.</span><br /><span>On cherche la bonne solution.</span><br /><span>On la construit.</span></h2>
        <div><p>Une base existante peut suffire. Sinon, on conçoit ce qui manque et on le relie à ton quotidien.</p><a className="v2-text-link" href="/a-propos/">Découvrir notre approche ↗</a></div>
      </div>
      <ol className={styles.journeyTrack} aria-label="Du logiciel au terrain">
        {stages.map((stage, index) => <li className={styles.journeyStage} key={stage.label}>
          <span className={styles.journeyIndex}>{String(index + 1).padStart(2, "0")}</span>
          <strong>{stage.label}</strong>
          <span className={styles.journeyDetail}>{stage.detail}</span>
        </li>)}
      </ol>
    </div>
  </section>;
}

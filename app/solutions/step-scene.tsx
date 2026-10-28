"use client";

import { useEffect, useRef, useState } from "react";
import { BusinessToolIcon } from "../../components/business-tool-icon";
import type { SceneStep } from "../../data/solution-rubrics";
import { TechIcon } from "./tech-icon";
import styles from "./step-scene.module.css";

const STEP_MS = 2600;
const LAST_STEP_MS = 3600;

/* A four-step "scène logiciel" (kit, section 5 ter), same language as the /applications/ flow:
 * a rail of steps, one window that changes, a result bubble. Figures are illustrative. */
export function StepScene({ title, steps }: { title: string; steps: SceneStep[] }) {
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Runs only while the scene is on screen and the tab is visible.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let onScreen = false;
    const update = () => setRunning(onScreen && document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; update(); }, { threshold: 0.25 });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    if (!running || reduced) return;
    const timer = window.setTimeout(() => setStep((value) => (value + 1) % steps.length), step === steps.length - 1 ? LAST_STEP_MS : STEP_MS);
    return () => window.clearTimeout(timer);
  }, [running, reduced, step, steps.length]);

  const shown = reduced ? steps.length - 1 : step;
  const current = steps[shown];

  return <figure ref={ref} className={styles.scene} aria-label={`Exemple : ${title}. ${steps.map((item) => item.result).join(", ")}.`}>
    <figcaption className={styles.head} aria-hidden="true">
      <span><i className={styles.dot} />{title}</span>
      <span className={styles.demo}>Exemple</span>
    </figcaption>

    <ol className={styles.rail} aria-hidden="true" style={{ "--progress": shown / (steps.length - 1) } as React.CSSProperties}>
      {steps.map((item, index) => <li key={item.label} className={index === shown ? (item.alert ? styles.alert : styles.active) : index < shown || reduced ? styles.done : undefined}>
        <span className={styles.node}>{item.icon.set === "tool" ? <BusinessToolIcon icon={item.icon.id} /> : <TechIcon icon={item.icon.id} />}</span>
        <span className={styles.label}>{item.label}</span>
      </li>)}
    </ol>

    {/* Fixed-height stage: the window and the bubble change, the page never moves. */}
    <div className={styles.stage} aria-hidden="true">
      <div key={reduced ? "static" : shown} className={styles.window}>
        <p className={styles.windowHead}><i className={current.alert ? styles.dotAlert : styles.dot} />{current.head}</p>
        <p className={styles.primary}>{current.primary}</p>
        <p className={styles.secondary}>{current.secondary}</p>
        <span className={styles.meter}><i /></span>
      </div>
      <p key={`result-${reduced ? "static" : shown}`} className={`${styles.result} ${current.alert ? styles.resultAlert : ""}`}>
        <span>{current.alert ? "!" : "✓"}</span>{current.result}
      </p>
    </div>
  </figure>;
}

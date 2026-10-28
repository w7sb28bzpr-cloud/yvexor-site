"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./scenes.module.css";

/** Step loop shared by the domain scenes: runs only on screen with the tab visible; reduced motion shows the last step. */
export function useSceneLoop(durations: number[]) {
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  // Increments at every new loop so one-shot animations (printing, drawing) replay.
  const [cycle, setCycle] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

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
    const timer = window.setTimeout(() => {
      if (step === durations.length - 1) setCycle((value) => value + 1);
      setStep((value) => (value + 1) % durations.length);
    }, durations[step]);
    return () => window.clearTimeout(timer);
  }, [running, reduced, step, durations]);

  return { ref, step: reduced ? durations.length - 1 : step, cycle, reduced };
}

/** Dark product-screen frame with a title and the "Exemple" label (figures are illustrative). */
export function SceneFrame({ frameRef, title, description, children }: {
  frameRef: React.RefObject<HTMLElement | null>;
  title: string;
  /** What the scene shows, for screen readers. */
  description: string;
  children: ReactNode;
}) {
  return <figure ref={frameRef} className={styles.frame} aria-label={`Exemple : ${title}. ${description}`}>
    <figcaption className={styles.frameHead} aria-hidden="true">
      <span><i className={styles.dot} />{title}</span>
      <span className={styles.demo}>Exemple</span>
    </figcaption>
    <div className={styles.stage} aria-hidden="true">{children}</div>
  </figure>;
}

export function ResultBubble({ text, alert, stepKey }: { text: string; alert?: boolean; stepKey: string | number }) {
  return <p key={stepKey} className={`${styles.result} ${alert ? styles.resultAlert : ""}`}><span>{alert ? "!" : "✓"}</span>{text}</p>;
}

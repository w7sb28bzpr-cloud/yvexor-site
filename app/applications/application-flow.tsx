"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicBusinessTool } from "../../data/content-types";
import { ApplicationIcon } from "./application-icon";
import styles from "./applications.module.css";

/** One demo record travelling through the apps; figures are illustrative and labelled as such. */
const steps = [
  { result: "Opportunité qualifiée", summary: "Atelier Morel devient une opportunité" },
  { result: "Devis prêt depuis la fiche client", summary: "Devis D-2481 : 2 480,00 €" },
  { result: "Facture payée, sans ressaisie", summary: "Facture F-1093 : payée" },
  { result: "Chiffre d’affaires du mois à jour", summary: "Chiffre d’affaires du mois : +2 480 €" },
];
const STEP_MS = 2800;
const LAST_STEP_MS = 3800;

const shortName = (name: string) => name.split(" & ")[0];

export function ApplicationFlow({ tools }: { tools: PublicBusinessTool[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let current = 0;
    let timer: number | undefined;
    const stop = () => { if (timer !== undefined) window.clearTimeout(timer); timer = undefined; };
    const run = () => {
      stop();
      if (!visible || document.hidden || motion.matches) return;
      timer = window.setTimeout(() => {
        current = (current + 1) % steps.length;
        setStep(current);
        run();
      }, current === steps.length - 1 ? LAST_STEP_MS : STEP_MS);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      run();
    }, { threshold: 0.25 });
    observer.observe(element);
    const onMotion = () => { current = 0; setStep(0); run(); };
    document.addEventListener("visibilitychange", run);
    motion.addEventListener("change", onMotion);
    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", run);
      motion.removeEventListener("change", onMotion);
    };
  }, []);

  return <figure ref={ref} className={styles.flow} aria-labelledby="flow-caption">
    <figcaption id="flow-caption" className={styles.flowCaption}>
      <span>Une information, quatre applications</span>
      <span className={styles.flowDemo}>Exemple</span>
    </figcaption>

    <ol className={styles.flowRail} aria-hidden="true" style={{ "--flow-progress": step / (steps.length - 1) } as React.CSSProperties}>
      {tools.map((tool, index) => <li key={tool.id} className={index === step ? styles.flowActive : index < step ? styles.flowDone : undefined}>
        <span className={styles.flowNode}><ApplicationIcon tool={tool} /></span>
        <span className={styles.flowLabel}>{shortName(tool.name)}</span>
      </li>)}
    </ol>

    {/* Animated scene: one record changes shape as it moves from app to app. */}
    <div className={styles.flowStage} aria-hidden="true">
      <div key={step} className={styles.flowScene} data-step={step}>
        {step === 0 && <div className={styles.flowCard}>
          <div className={styles.flowRow}>
            <span className={styles.flowAvatar}>AM</span>
            <span><b>Atelier Morel</b><small>Rénovation de vitrine</small></span>
            <span className={styles.flowPill}>Qualifiée</span>
          </div>
          <div className={styles.flowMeter}><i /></div>
        </div>}
        {step === 1 && <div className={styles.flowCard}>
          <div className={styles.flowDocHead}><b>Devis D-2481</b><small>Atelier Morel</small></div>
          <div className={styles.flowLine}><span>Conception</span><span>1 200,00 €</span></div>
          <div className={styles.flowLine}><span>Intégration</span><span>980,00 €</span></div>
          <div className={styles.flowLine}><span>Mise en service</span><span>300,00 €</span></div>
          <div className={styles.flowTotal}><span>Total</span><span>2 480,00 €</span></div>
        </div>}
        {step === 2 && <div className={styles.flowCard}>
          <div className={styles.flowDocHead}><b>Facture F-1093</b><small>Issue du devis D-2481</small></div>
          <div className={styles.flowAmount}>2 480,00 €</div>
          <div className={styles.flowStatus}><span>Envoyée</span><span>Payée ✓</span></div>
        </div>}
        {step === 3 && <div className={styles.flowCard}>
          <div className={styles.flowDocHead}><b>Chiffre d’affaires</b><small>Ce mois</small></div>
          <div className={styles.flowBars}>{[38, 52, 46, 61, 58].map((height, index) => <i key={index} style={{ "--bar": `${height}%` } as React.CSSProperties} />)}<i className={styles.flowBarNew} /></div>
          <div className={styles.flowGain}>+2 480 €</div>
        </div>}
      </div>
      <p key={`result-${step}`} className={styles.flowResult}><span>✓</span> {steps[step].result}</p>
    </div>

    {/* Text version: read by screen readers, and shown instead of the scene with reduced motion. */}
    <ol className={styles.flowSummary}>
      {tools.map((tool, index) => <li key={tool.id}>
        <span className={styles.flowSummaryIcon} aria-hidden="true"><ApplicationIcon tool={tool} /></span>
        <span><b>{shortName(tool.name)}</b> {steps[index]?.summary}</span>
      </li>)}
    </ol>
  </figure>;
}

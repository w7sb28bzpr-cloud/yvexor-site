"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicBusinessTool } from "../../data/content-types";
import { BusinessToolIcon } from "../../components/business-tool-icon";
import styles from "./applications.module.css";

export function ApplicationFlow({ tools }: { tools: PublicBusinessTool[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let visible = false;
    const update = () => setRunning(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }, { threshold: 0.1 });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return <div ref={ref} role="group" className={`${styles.flow} ${running ? styles.flowRunning : ""}`} aria-label="Exemple de connexion entre les applications YVEXOR">
    <div className={styles.flowHeading}>
      <span>Une information, plusieurs usages.</span>
      <span className={styles.flowStatus} aria-hidden="true"><i /> Flux possible</span>
    </div>
    <ol className={styles.flowSteps}>
      {tools.map((tool, index) => <li key={tool.id} className={styles.flowStep} style={{ "--flow-index": index } as React.CSSProperties}>
        <span className={styles.flowIcon}><BusinessToolIcon icon={tool.icon} /></span>
        <span>{tool.name}</span>
      </li>)}
    </ol>
    <span className={styles.flowLine} aria-hidden="true"><span className={styles.flowSignal} /></span>
  </div>;
}

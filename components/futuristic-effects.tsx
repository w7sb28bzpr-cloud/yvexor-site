"use client";

import { useEffect, useState } from "react";

export function FuturisticEffects() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const updateVisibility = () => setVisible(!document.hidden);
    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target = (event.target as HTMLElement).closest<HTMLElement>(".existing-card,.offer-grid a,.ecosystem-examples article,.budget-card");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
      target.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
    };
    document.addEventListener("visibilitychange", updateVisibility);
    document.addEventListener("pointermove", updatePointer, { passive: true });
    return () => { document.removeEventListener("visibilitychange", updateVisibility); document.removeEventListener("pointermove", updatePointer); };
  }, []);
  return <div className={`future-atmosphere ${visible ? "is-running" : "is-paused"}`} aria-hidden="true"><i className="micro-particle particle-one"/><i className="micro-particle particle-two"/><i className="micro-particle particle-three"/><i className="micro-particle particle-four"/><span className="rare-streak"/></div>;
}

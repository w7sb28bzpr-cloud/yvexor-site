"use client";

import { useEffect, useState } from "react";

export function FuturisticEffects() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const updateVisibility = () => setVisible(!document.hidden);
    const hero = document.getElementById("accueil");
    const observer = hero ? new IntersectionObserver(([entry]) => setVisible(!document.hidden && entry.isIntersecting), { threshold: .05 }) : null;
    if (hero) observer?.observe(hero);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => { observer?.disconnect(); document.removeEventListener("visibilitychange", updateVisibility); };
  }, []);
  return <div className={`future-atmosphere ${visible ? "is-running" : "is-paused"}`} aria-hidden="true"><i className="micro-particle particle-one"/><i className="micro-particle particle-two"/><i className="micro-particle particle-three"/><i className="micro-particle particle-four"/><span className="rare-streak"/></div>;
}

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "../app/histoire/history.module.css";

export function HistoryConnections({ children, className = "" }: { children: ReactNode; className?: string }) {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!element.current || !window.IntersectionObserver) return;
    const node = element.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    node.dataset.pending = "true";
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        delete node.dataset.pending; observer.disconnect();
      }
    }, { threshold: .15 });
    observer.observe(node);
    return () => { observer.disconnect(); delete node.dataset.pending; };
  }, []);
  return <div ref={element} className={`${styles.connections} ${className}`}>{children}</div>;
}

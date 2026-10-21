"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (reducedMotion.matches || !elements.length) {
      elements.forEach(el => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}

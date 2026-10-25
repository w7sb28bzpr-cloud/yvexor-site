"use client";

import { useEffect, useRef } from "react";

/** "sur mesure." stays first: it is the primary, default value the loop always returns to. */
const ROTATING_WORDS = ["sur mesure.", "connectée.", "intelligente.", "automatisée.", "pour votre métier."];
const HOLD_MS = 2600;
const EXIT_MS = 300;
const ENTER_MS = 360;

/** Decorative word swap for the hero title. The H1's own aria-label carries the stable
 * accessible name ("YVEXOR — Technologie sur mesure"); this element is aria-hidden so
 * assistive tech never re-announces a new word every few seconds. */
export function HeroRotatingWord({ wrapClassName, wordClassName }: { wrapClassName?: string; wordClassName?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let index = 0;
    let timer: number | undefined;
    let stopped = false;
    let visible = false;

    const clear = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
    };
    const schedule = () => {
      clear();
      if (!stopped && visible && !document.hidden && !motion.matches) {
        timer = window.setTimeout(swap, HOLD_MS);
      }
    };
    const swap = () => {
      if (stopped || !visible || document.hidden || motion.matches) return;
      const exit = el.animate(
        [{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(-100%)", opacity: 0 }],
        { duration: EXIT_MS, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" },
      );
      exit.onfinish = () => {
        if (stopped) return;
        index = (index + 1) % ROTATING_WORDS.length;
        el.textContent = ROTATING_WORDS[index];
        el.animate(
          [{ transform: "translateY(100%)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }],
          { duration: ENTER_MS, easing: "cubic-bezier(0,0,.2,1)", fill: "forwards" },
        );
        schedule();
      };
    };
    const reset = () => {
      el.getAnimations().forEach((animation) => animation.cancel());
      index = 0;
      el.textContent = ROTATING_WORDS[0];
    };
    const onVisibility = () => {
      clear();
      if (!document.hidden && visible && !motion.matches) schedule();
    };
    const onMotion = () => {
      clear();
      reset();
      if (!motion.matches && visible && !document.hidden) schedule();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) clear();
      else if (!motion.matches && !document.hidden) schedule();
    }, { threshold: 0.01 });
    observer.observe(el);

    if (!motion.matches) {
      const rect = el.getBoundingClientRect();
      visible = rect.bottom > 0 && rect.top < window.innerHeight;
      if (visible && !document.hidden) schedule();
    }

    motion.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stopped = true;
      clear();
      observer.disconnect();
      motion.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <span className={wrapClassName} aria-hidden="true">
    <span ref={ref} className={wordClassName}>{ROTATING_WORDS[0]}</span>
  </span>;
}

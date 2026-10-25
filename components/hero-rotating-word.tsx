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
    let cycle = 0;
    let exitAnimation: Animation | undefined;
    let enterAnimation: Animation | undefined;

    const clear = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
    };
    const cancelAnimations = () => {
      cycle++;
      for (const animation of [exitAnimation, enterAnimation]) {
        if (!animation) continue;
        animation.onfinish = null;
        animation.cancel();
      }
      exitAnimation = undefined;
      enterAnimation = undefined;
    };
    const pause = () => {
      clear();
      cancelAnimations();
    };
    const schedule = () => {
      clear();
      if (!stopped && visible && !document.hidden && !motion.matches) {
        timer = window.setTimeout(swap, HOLD_MS);
      }
    };
    const swap = () => {
      if (stopped || !visible || document.hidden || motion.matches) return;
      cancelAnimations();
      const currentCycle = cycle;
      const exit = el.animate(
        [{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(-100%)", opacity: 0 }],
        { duration: EXIT_MS, easing: "cubic-bezier(.4,0,1,1)" },
      );
      exitAnimation = exit;
      exit.onfinish = () => {
        if (stopped || currentCycle !== cycle || !visible || document.hidden || motion.matches) {
          exit.onfinish = null;
          if (exitAnimation === exit) exitAnimation = undefined;
          exit.cancel();
          return;
        }
        exit.onfinish = null;
        exit.cancel();
        exitAnimation = undefined;
        index = (index + 1) % ROTATING_WORDS.length;
        el.textContent = ROTATING_WORDS[index];
        const enter = el.animate(
          [{ transform: "translateY(100%)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }],
          { duration: ENTER_MS, easing: "cubic-bezier(0,0,.2,1)" },
        );
        enterAnimation = enter;
        enter.onfinish = () => {
          if (enterAnimation !== enter) return;
          enter.onfinish = null;
          enter.cancel();
          enterAnimation = undefined;
        };
        schedule();
      };
    };
    const reset = () => {
      cancelAnimations();
      index = 0;
      el.textContent = ROTATING_WORDS[0];
    };
    const onVisibility = () => {
      if (document.hidden) pause();
      else if (visible && !motion.matches) schedule();
    };
    const onMotion = () => {
      pause();
      reset();
      if (!motion.matches && visible && !document.hidden) schedule();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) pause();
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
      pause();
      observer.disconnect();
      motion.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <span className={wrapClassName} aria-hidden="true">
    <span ref={ref} className={wordClassName}>{ROTATING_WORDS[0]}</span>
  </span>;
}

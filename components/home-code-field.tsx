"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./home-code-field.module.css";

const programs = [
  [
    [
      "const projet = yvexor.concevoir({\n",
      "  besoin: \"simplifier l’activité\",\n",
      "  application: \"métier\"\n",
      "});",
    ].join(""),
    [
      "projet.augmenter({\n",
      "  intelligence: \"IA utile\",\n",
      "  automatisation: true\n",
      "});",
    ].join(""),
    [
      "connecter(projet, {\n",
      "  caisse: true, paiement: true,\n",
      "  api: \"services métier\"\n",
      "});",
    ].join(""),
  ],
  [
    [
      "relierAuTerrain(projet, {\n",
      "  capteur: \"température\",\n",
      "  contrôleur: \"Raspberry Pi\",\n",
      "  équipement: true\n",
      "});",
    ].join(""),
    [
      "superviser(projet, [\n",
      "  \"activité\", \"alertes\",\n",
      "  \"équipement\"\n",
      "]);",
    ].join(""),
    "déployer(projet);\n> deploy OK",
  ],
];

const fullSource = programs.flat(2).join("\n\n");
const capabilities = ["Applications", "IA", "Automatisation", "Systèmes connectés", "Infrastructure", "Équipements & terrain"];

function CodeStream({ startProgram, initialDelay, speedOffset }: { startProgram: number; initialDelay: number; speedOffset: number }) {
  const [text, setText] = useState("");
  const [activeLine, setActiveLine] = useState(-1);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const viewport = viewportRef.current;
    let timer: number | undefined;
    let stopped = false;
    let visible = false;
    let programIndex = startProgram;
    let snippetIndex = 0;
    let charIndex = 0;
    let output = "";
    let charCounter = 0;
    const seedProgram = programs[(startProgram + 1) % programs.length];
    const seed = [...seedProgram, ...seedProgram].join("\n\n");

    const clear = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
    };
    const schedule = (delay: number) => {
      clear();
      if (!stopped && visible && !document.hidden && !motion.matches) {
        timer = window.setTimeout(typeNext, delay);
      }
    };
    const typeNext = () => {
      if (stopped || !visible || document.hidden || motion.matches) return;

      const snippets = programs[programIndex];
      const snippet = snippets[snippetIndex];
      if (charIndex < snippet.length) {
        const character = snippet[charIndex++];
        output += character;
        const lines = output.split("\n");
        if (lines.length > 15) output = lines.slice(-15).join("\n");
        setText(output);
        setActiveLine(output.split("\n").length - 1);
        charCounter++;
        const delay = character === "\n" ? 48 : 18 + ((charCounter * 7 + speedOffset) % 18);
        schedule(delay);
        return;
      }

      snippetIndex++;
      charIndex = 0;
      if (snippetIndex >= snippets.length) {
        snippetIndex = 0;
        programIndex = (programIndex + 1) % programs.length;
      }
      output += "\n";
      const lines = output.split("\n");
      if (lines.length > 15) output = lines.slice(-15).join("\n");
      setText(output);
      setActiveLine(output.split("\n").length - 1);
      schedule(90);
    };
    const onVisibility = () => {
      clear();
      if (!document.hidden && visible && !motion.matches) schedule(80);
    };
    const onMotion = () => {
      clear();
      if (motion.matches) {
        output = fullSource;
        setText(fullSource);
        setActiveLine(-1);
        if (viewport) viewport.scrollTop = 0;
      } else {
        output = seed;
        programIndex = startProgram;
        snippetIndex = 0;
        charIndex = 0;
        setText(seed);
        setActiveLine(seed.split("\n").length - 1);
        if (visible && !document.hidden) schedule(initialDelay);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) clear();
      else if (!motion.matches && !document.hidden) schedule(initialDelay);
    }, { threshold: 0.01 });
    if (viewport) observer.observe(viewport);

    if (motion.matches) {
      output = fullSource;
      setText(fullSource);
      setActiveLine(-1);
    } else {
      output = seed;
      setText(seed);
      setActiveLine(seed.split("\n").length - 1);
      if (viewport) visible = viewport.getBoundingClientRect().bottom > 0 && viewport.getBoundingClientRect().top < window.innerHeight;
      if (visible && !document.hidden) schedule(initialDelay);
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
  }, [initialDelay, speedOffset, startProgram]);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (viewport && activeLine >= 0) viewport.scrollTop = viewport.scrollHeight;
  }, [text, activeLine]);

  return <div ref={viewportRef} className={styles.stream} aria-hidden="true">
    <pre className={styles.code}>{text.split("\n").map((line, index, all) => <span className={index === activeLine ? styles.activeLine : styles.oldLine} key={`${index}-${all.length}`}>{line || " "}{index === activeLine && <span className={styles.caret} />}{index < all.length - 1 ? "\n" : ""}</span>)}</pre>
  </div>;
}

export function HomeCapabilities({ className, activeClassName, separatorClassName }: { className?: string; activeClassName?: string; separatorClassName?: string }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;
    const clear = () => { if (timer !== undefined) window.clearTimeout(timer); timer = undefined; };
    const advance = () => {
      clear();
      if (motion.matches || document.hidden) return;
      timer = window.setTimeout(() => {
        setActive((current) => current === null ? 0 : (current + 1) % capabilities.length);
        advance();
      }, 2600);
    };
    const sync = () => {
      clear();
      if (motion.matches) setActive(null);
      else { setActive(0); advance(); }
    };
    const visibility = () => document.hidden ? clear() : advance();
    sync();
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      clear();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  return <p className={className} aria-label={capabilities.join(", ")}>
    {capabilities.map((capability, index) => <span key={capability}>
      {index > 0 && <span className={separatorClassName} aria-hidden="true"> · </span>}
      <span className={active === index ? activeClassName : undefined} aria-hidden="true">{capability}</span>
    </span>)}
  </p>;
}

export function HomeCodeField() {
  return <div className={styles.field} aria-hidden="true">
    <CodeStream startProgram={0} initialDelay={80} speedOffset={0} />
    <CodeStream startProgram={1} initialDelay={720} speedOffset={5} />
  </div>;
}

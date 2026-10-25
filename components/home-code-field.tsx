"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./home-code-field.module.css";

type Token = { text: string; kind?: "keyword" | "function" | "string" | "comment" | "success" };
const lines: Token[][] = [
  [{ text: "// Une réponse construite autour du besoin", kind: "comment" }],
  [{ text: "const projet = yvexor.concevoir({\n", kind: "keyword" }, { text: "  besoin: ", kind: "function" }, { text: "\"simplifier l’activité\"", kind: "string" }, { text: ",\n  application: ", kind: "function" }, { text: "\"métier\"", kind: "string" }, { text: ",\n});" }],
  [{ text: "projet.augmenter({\n", kind: "function" }, { text: "  intelligence: ", kind: "function" }, { text: "\"IA utile\"", kind: "string" }, { text: ",\n  automatisation: ", kind: "function" }, { text: "true", kind: "keyword" }, { text: ",\n});" }],
  [{ text: "connecter(projet, {\n", kind: "function" }, { text: "  caisse: ", kind: "function" }, { text: "true", kind: "keyword" }, { text: ",\n  paiement: ", kind: "function" }, { text: "true", kind: "keyword" }, { text: ",\n  api: ", kind: "function" }, { text: "\"services métier\"", kind: "string" }, { text: ",\n});" }],
  [{ text: "relierAuTerrain(projet, {\n", kind: "function" }, { text: "  capteur: ", kind: "function" }, { text: "\"température\"", kind: "string" }, { text: ",\n  contrôleur: ", kind: "function" }, { text: "\"Raspberry Pi / microcontrôleur\"", kind: "string" }, { text: ",\n});" }],
  [{ text: "superviser(projet, [", kind: "function" }, { text: "\"alertes\", \"équipement\", \"activité\"", kind: "string" }, { text: "]);\n" }],
  [{ text: "déployer(projet);\n\n" }],
  [{ text: "> deploy OK ✔", kind: "success" }],
];

const tokens = lines.flatMap((line, index) => [...line, ...(index < lines.length - 1 ? [{ text: "\n" }] : [])]);
const source = tokens.map((token) => token.text).join("");
const delayFor = (index: number) => 30 + ((index * 17) % 35);
const capabilities = ["Applications", "IA", "Automatisation", "Systèmes connectés", "Infrastructure", "Équipements & terrain"];

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
  const [position, setPosition] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sourceLength = source.length;

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cursor = 0;
    let timer: number | undefined;
    let stopped = false;

    const clear = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
    };
    const type = () => {
      if (stopped || document.hidden || motion.matches) return;
      if (cursor < sourceLength) {
        const current = cursor++;
        setPosition(cursor);
        timer = window.setTimeout(type, source[current] === "\n" ? 155 : delayFor(current));
        return;
      }
      timer = window.setTimeout(() => {
        if (stopped || document.hidden || motion.matches) return;
        cursor = 0;
        setPosition(0);
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
        timer = window.setTimeout(type, 500);
      }, 1500);
    };
    const syncMotion = () => {
      clear();
      if (motion.matches) {
        cursor = sourceLength;
        setPosition(sourceLength);
      } else {
        cursor = 0;
        setPosition(0);
        if (!document.hidden) timer = window.setTimeout(type, 350);
      }
    };
    const syncVisibility = () => {
      clear();
      if (!document.hidden && !motion.matches) timer = window.setTimeout(type, 120);
    };

    syncMotion();
    motion.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      stopped = true;
      clear();
      motion.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, [sourceLength]);

  useLayoutEffect(() => {
    const viewport = scrollRef.current;
    if (viewport && viewport.scrollHeight > viewport.clientHeight) viewport.scrollTop = viewport.scrollHeight;
  }, [position]);

  let remaining = position;
  return <div className={styles.field} aria-hidden="true">
    <pre className={styles.ambient}>{source.repeat(12)}</pre>
    <div ref={scrollRef} className={styles.viewport}>
      <pre className={styles.code}><code>{tokens.map((token, tokenIndex) => {
        const visible = token.text.slice(0, Math.max(0, Math.min(token.text.length, remaining)));
        remaining -= visible.length;
        return visible ? <span className={token.kind ? styles[token.kind] : undefined} key={tokenIndex}>{visible}</span> : null;
      })}<span className={styles.caret} /></code></pre>
    </div>
  </div>;
}

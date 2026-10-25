"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./home-code-field.module.css";

type Token = { text: string; kind?: "keyword" | "function" | "string" | "comment" | "success" };
const lines: Token[][] = [
  [{ text: "// Une réponse construite autour du besoin", kind: "comment" }],
  [{ text: "const projet = yvexor.concevoir({\n", kind: "keyword" }, { text: "  besoin: ", kind: "function" }, { text: "\"simplifier l’activité\"", kind: "string" }, { text: ",\n  application: ", kind: "function" }, { text: "\"métier\"", kind: "string" }, { text: ",\n});" }],
  [{ text: "projet.augmenter({\n", kind: "function" }, { text: "  intelligence: ", kind: "function" }, { text: "\"IA utile\"", kind: "string" }, { text: ",\n  automatisation: ", kind: "function" }, { text: "true", kind: "keyword" }, { text: ",\n});" }],
  [{ text: "connecter(projet, {\n", kind: "function" }, { text: "  capteur: ", kind: "function" }, { text: "\"température\"", kind: "string" }, { text: ",\n  contrôleur: ", kind: "function" }, { text: "\"microcontrôleur\"", kind: "string" }, { text: ",\n  paiement: ", kind: "function" }, { text: "true", kind: "keyword" }, { text: ",\n});" }],
  [{ text: "superviser(projet, [", kind: "function" }, { text: "\"alertes\", \"équipement\", \"activité\"", kind: "string" }, { text: "]);\n" }],
  [{ text: "déployer(projet);\n\n" }],
  [{ text: "> deploy OK ✔", kind: "success" }],
];

const tokens = lines.flatMap((line, index) => [...line, ...(index < lines.length - 1 ? [{ text: "\n" }] : [])]);
const source = tokens.map((token) => token.text).join("");
const delayFor = (index: number) => 36 + ((index * 17) % 47);

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
        timer = window.setTimeout(type, delayFor(current));
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
    <div className={styles.toolbar}><span className={styles.dots}><i /><i /><i /></span><span>yvexor / solution.ts</span><span className={styles.language}>TypeScript</span></div>
    <div ref={scrollRef} className={styles.viewport}>
      <pre className={styles.code}><code>{tokens.map((token, tokenIndex) => {
        const visible = token.text.slice(0, Math.max(0, Math.min(token.text.length, remaining)));
        remaining -= visible.length;
        return visible ? <span className={token.kind ? styles[token.kind] : undefined} key={tokenIndex}>{visible}</span> : null;
      })}<span className={styles.caret} /></code></pre>
    </div>
    <span className={styles.caption}>Logiciel · connexion · terrain</span>
  </div>;
}

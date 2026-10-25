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

/** Repeats a block of source until there are at least `minLines` lines, so the
 * stream (typed or static) starts already full instead of leaving an empty viewport. */
function padToLines(block: string, minLines: number): string {
  let padded = block;
  while (padded.split("\n").length < minLines) padded += "\n\n" + block;
  return padded;
}

/** Also the line count of the static HTML: enough to overflow common hero heights, so the
 * field is full before hydration and the line budget does not change once it hydrates. */
const MIN_MAX_LINES = 64;
const LINE_BUFFER = 6;
const TEXT_RENDER_INTERVAL = 48;
const GLIDE_MS = 260;

/** Filler history ending on an empty line, so typing starts on its own line. */
const seedLines = (startProgram: number, lines: number) => padToLines(programs[(startProgram + 1) % programs.length].join("\n\n"), lines) + "\n";
const seedFor = (startProgram: number) => seedLines(startProgram, MIN_MAX_LINES).split("\n").slice(-MIN_MAX_LINES).join("\n");
const lastLineIndex = (value: string) => value.split("\n").length - 1;

/** Starts the block `shift` px lower and eases it back. Additive, so a glide started before
 * the previous one ends stacks on it without a jump. */
function glide(code: HTMLElement, shift: number) {
  if (shift <= 0) return;
  code.animate(
    [{ transform: `translateY(${shift}px)` }, { transform: "translateY(0)" }],
    { duration: GLIDE_MS, easing: "cubic-bezier(.22,1,.36,1)", composite: "add" },
  );
}

function CodeStream({ startProgram, initialDelay, speedOffset }: { startProgram: number; initialDelay: number; speedOffset: number }) {
  const [text, setText] = useState(() => seedFor(startProgram));
  /** Running id of the first rendered line, so each line keeps its own element (and key)
   * while it moves up instead of every element swapping its text on each new line. */
  const [firstLine, setFirstLine] = useState(0);
  /** Running id (not index) of the typed line, so it changes once per new line even after
   * the history is trimmed; -1 when no line is active. */
  const [activeLine, setActiveLine] = useState(() => lastLineIndex(seedFor(startProgram)));
  const viewportRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLPreElement>(null);
  const anchorRef = useRef<{ id: number; y: number } | null>(null);
  const maxLinesRef = useRef(MIN_MAX_LINES);

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
    let first = 0;
    let charCounter = 0;
    let lastPaintAt = 0;

    const measure = () => {
      if (!viewport) return;
      const lineHeight = parseFloat(window.getComputedStyle(viewport).lineHeight) || 20;
      const lines = Math.ceil(viewport.clientHeight / lineHeight) + LINE_BUFFER;
      maxLinesRef.current = Math.max(MIN_MAX_LINES, lines);
    };
    measure();

    const seedProgram = programs[(startProgram + 1) % programs.length].join("\n\n");

    const trim = (value: string) => {
      const lines = value.split("\n");
      if (lines.length <= maxLinesRef.current) return value;
      first += lines.length - maxLinesRef.current;
      return lines.slice(-maxLinesRef.current).join("\n");
    };
    const show = (value: string, active: number) => {
      output = value;
      setText(value);
      setActiveLine(active < 0 ? -1 : first + active);
      setFirstLine(first);
      lastPaintAt = performance.now();
    };
    const publish = () => show(output, lastLineIndex(output));
    /** Prepends filler above the existing (unchanged) tail until the new line budget is met. */
    const growToBudget = (value: string) => {
      let result = value;
      while (result.split("\n").length < maxLinesRef.current) result = seedProgram + "\n\n" + result;
      first -= lastLineIndex(result) - lastLineIndex(value);
      return result;
    };

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
        if (character === "\n") output = trim(output);
        charCounter++;
        if (character === "\n" || performance.now() - lastPaintAt >= TEXT_RENDER_INTERVAL) publish();
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
      output = trim(output);
      publish();
      schedule(90);
    };
    const onVisibility = () => {
      clear();
      if (!document.hidden && visible && !motion.matches) schedule(80);
    };
    /** Reduced motion: the complete static source, padded to fill the viewport, without a cursor. */
    const showFullSource = () => {
      output = padToLines(fullSource, maxLinesRef.current);
      setText(output);
      setActiveLine(-1);
      lastPaintAt = performance.now();
    };
    const onMotion = () => {
      clear();
      if (motion.matches) {
        measure();
        showFullSource();
      } else {
        measure();
        programIndex = startProgram;
        snippetIndex = 0;
        charIndex = 0;
        output = trim(seedLines(startProgram, maxLinesRef.current));
        publish();
        if (visible && !document.hidden) schedule(initialDelay);
      }
    };
    const onResize = () => {
      const previousMax = maxLinesRef.current;
      measure();
      if (motion.matches) {
        if (maxLinesRef.current === previousMax) return;
        showFullSource();
        return;
      }
      const lineCount = output.split("\n").length;
      if (lineCount < maxLinesRef.current) output = growToBudget(output);
      else if (lineCount > maxLinesRef.current) output = trim(output);
      else return;
      publish();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) clear();
      else if (!motion.matches && !document.hidden) schedule(initialDelay);
    }, { threshold: 0.01 });
    if (viewport) observer.observe(viewport);

    if (motion.matches) {
      showFullSource();
    } else {
      // Keep the server-rendered tail: only lines hidden above the field change.
      output = growToBudget(trim(seedFor(startProgram)));
      publish();
      if (viewport) visible = viewport.getBoundingClientRect().bottom > 0 && viewport.getBoundingClientRect().top < window.innerHeight;
      if (visible && !document.hidden) schedule(initialDelay);
    }

    motion.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);
    return () => {
      stopped = true;
      clear();
      observer.disconnect();
      motion.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, [initialDelay, speedOffset, startProgram]);

  /** Lines stack from the bottom, so every new line pushes the others up in layout.
   * FLIP: offset the block back to where the previous line was, then glide it to 0
   * with a compositor-only transform instead of letting the text jump. */
  useLayoutEffect(() => {
    const code = codeRef.current;
    const lines = code?.children;
    const current = code && lines && activeLine >= 0 ? lines[activeLine - firstLine] as HTMLElement | undefined : undefined;
    const previous = anchorRef.current;
    anchorRef.current = current ? { id: activeLine, y: current.offsetTop } : null;
    if (!code || !lines || !current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Where the previously typed line sits now: pushed up by the new line, and by its own
    // wrap rows on narrow columns, since the active line only wraps once it is done.
    const anchor = previous && lines[previous.id - firstLine] as HTMLElement | undefined;
    if (anchor) glide(code, previous.y - anchor.offsetTop);
  }, [activeLine]);

  return <div ref={viewportRef} className={styles.stream} aria-hidden="true">
    <pre ref={codeRef} className={styles.code}>{text.split("\n").map((line, index, all) => <span className={firstLine + index === activeLine ? styles.activeLine : styles.oldLine} key={firstLine + index}>{line || " "}{firstLine + index === activeLine && <span className={styles.caret} />}{index < all.length - 1 ? "\n" : ""}</span>)}</pre>
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

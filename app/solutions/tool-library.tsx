"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { BusinessTool, ToolIconId } from "../../data/content-types";
import styles from "./tool-library.module.css";

const iconPaths: Record<ToolIconId, ReactNode> = {
  "cash-register": <><path d="M4 10h16v10H4z"/><path d="M7 10V6h10v4M8 14h3m2 0h3M8 17h2m3 0h3M7 20v2m10-2v2"/><path d="M6 6h2"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3.5 9h17M3.5 15h17M12 3a15 15 0 0 1 0 18m0-18a15 15 0 0 0 0 18"/></>,
  workflow: <><rect x="3.5" y="4" width="7" height="6" rx="1.5"/><rect x="13.5" y="14" width="7" height="6" rx="1.5"/><path d="M10.5 7h3a2 2 0 0 1 2 2v5m-5 3H7a2 2 0 0 1-2-2v-5"/></>,
};

function ToolIcon({ icon }: { icon: ToolIconId }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round">{iconPaths[icon]}</svg>;
}

export function ToolLibrary({ tools }: { tools: BusinessTool[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<BusinessTool | null>(null);

  useEffect(() => {
    if (selected && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
  }, [selected]);

  const close = () => dialogRef.current?.close();

  return <>
    <div className={styles.grid} aria-label="Outils disponibles">
      {tools.map((tool) => <button
        className={styles.tool}
        id={tool.slug === "caisse" ? "commerce" : undefined}
        type="button"
        key={tool.id}
        onClick={() => setSelected(tool)}
        aria-haspopup="dialog"
        aria-label={`${tool.name} : ${tool.shortDescription}`}
      >
        <span className={styles.icon}><ToolIcon icon={tool.icon} /></span>
        <span className={styles.name}>{tool.name}</span>
        <span className={styles.shortDescription}>{tool.shortDescription}</span>
        <span className={styles.openHint}>Explorer <span aria-hidden="true">↗</span></span>
      </button>)}
    </div>

    {tools.length === 0 && <p className={styles.empty}>Les applications disponibles sont en cours de confirmation. Vous pouvez déjà nous décrire votre besoin.</p>}

    <dialog
      className={styles.dialog}
      ref={dialogRef}
      aria-labelledby="tool-dialog-title"
      onClose={() => setSelected(null)}
      onClick={(event) => { if (event.target === dialogRef.current) close(); }}
    >
      {selected && <article className={styles.detail}>
        <div className={styles.detailTop}>
          <span className={styles.icon}><ToolIcon icon={selected.icon} /></span>
          <button type="button" className={styles.close} onClick={close} aria-label="Fermer la présentation">×</button>
        </div>
        <p className={styles.detailCategory}>{selected.category === "commerce" ? "Commerce" : selected.category === "digital" ? "Présence en ligne" : "Gestion"}</p>
        <h2 id="tool-dialog-title" className="site-display">{selected.name}</h2>
        <section><h3>À quoi ça sert ?</h3><p>{selected.shortDescription}</p></section>
        <section><h3>Pour qui ?</h3><ul>{selected.audience.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section><h3>Ce que YVEXOR peut adapter</h3><ul>{selected.capabilities.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section><h3>Connexions possibles</h3><ul>{selected.connections.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section><h3>Évolution</h3><p>{selected.evolution}</p></section>
        <a className="site-button" href={selected.canonicalPath}>Découvrir l’offre <span aria-hidden="true">↗</span></a>
      </article>}
    </dialog>
  </>;
}

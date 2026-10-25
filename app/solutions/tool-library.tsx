"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicBusinessTool } from "../../data/content-types";
import { BusinessToolIcon } from "../../components/business-tool-icon";
import styles from "./tool-library.module.css";

export function ToolLibrary({ tools }: { tools: PublicBusinessTool[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<PublicBusinessTool | null>(null);

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
        <span className={styles.icon}><BusinessToolIcon icon={tool.icon} /></span>
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
          <span className={styles.icon}><BusinessToolIcon icon={selected.icon} /></span>
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

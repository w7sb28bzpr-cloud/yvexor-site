"use client";

import { useEffect, useRef, useState } from "react";
import type { BusinessToolCategoryId, PublicBusinessTool } from "../../data/content-types";
import { BusinessToolIcon } from "../../components/business-tool-icon";
import styles from "./applications.module.css";

type Category = { id: BusinessToolCategoryId; label: string };

export function ApplicationCatalogue({ tools, categories, existingCanonicalPaths }: {
  tools: PublicBusinessTool[];
  categories: Category[];
  existingCanonicalPaths: string[];
}) {
  const [category, setCategory] = useState<BusinessToolCategoryId | "all">("all");
  const [selected, setSelected] = useState<PublicBusinessTool | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const byId = new Map(tools.map((tool) => [tool.id, tool]));
  const publishedPaths = new Set(existingCanonicalPaths);
  const visibleTools = category === "all" ? tools : tools.filter((tool) => tool.categoryId === category);

  useEffect(() => {
    if (selected && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
  }, [selected]);

  const open = (tool: PublicBusinessTool, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setSelected(tool);
  };
  const close = () => dialogRef.current?.close();
  const onClose = () => {
    setSelected(null);
    triggerRef.current?.focus();
  };

  return <>
    <div className={styles.filters} role="group" aria-label="Filtrer les applications">
      <button type="button" aria-controls="applications-grid" aria-pressed={category === "all"} onClick={() => setCategory("all")}>Tout <span>{tools.length}</span></button>
      {categories.map((item) => <button type="button" aria-controls="applications-grid" key={item.id} aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>
        {item.label}<span>{tools.filter((tool) => tool.categoryId === item.id).length}</span>
      </button>)}
    </div>
    <p className={styles.resultCount} role="status">{visibleTools.length} {visibleTools.length === 1 ? "entrée" : "entrées"} à explorer</p>
    <div id="applications-grid" className={styles.grid}>
      {visibleTools.map((tool) => {
        const family = tool.kind === "business-suite";
        const included = tool.includesBusinessToolIds?.map((id) => byId.get(id)).filter((item) => item !== undefined) ?? [];
        return <button
          key={tool.id}
          className={`${styles.appTile} ${family ? styles.familyTile : ""}`}
          type="button"
          aria-haspopup="dialog"
          aria-label={`Ouvrir la fiche ${tool.name}`}
          onClick={(event) => open(tool, event.currentTarget)}
        >
          <span className={styles.tileTop}>
            <span className={styles.appIcon}><BusinessToolIcon icon={tool.icon} /></span>
            <span className={styles.tileArrow} aria-hidden="true">↗</span>
          </span>
          <span className={styles.appName}>{tool.name}</span>
          <span className={styles.appDescription}>{tool.shortDescription}</span>
          {family && <span className={styles.familyModules} aria-label={`${included.length} outils reliés`}>
            {included.slice(0, 3).map((item) => <span key={item.id}>{item.name}</span>)}
            {included.length > 3 && <span>+{included.length - 3}</span>}
          </span>}
          {tool.kind === "capability" && <span className={styles.capabilityTag}>Capacité transversale</span>}
        </button>;
      })}
    </div>

    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="application-dialog-title" onClose={onClose} onClick={(event) => {
      if (event.target === dialogRef.current) close();
    }}>
      {selected && <div className={styles.dialogContent}>
        <div className={styles.dialogTop}>
          <span className={styles.dialogIcon}><BusinessToolIcon icon={selected.icon} /></span>
          <button type="button" className={styles.dialogClose} onClick={close} aria-label="Fermer la fiche">×</button>
        </div>
        <p className={styles.dialogKicker}>{categories.find((item) => item.id === selected.categoryId)?.label}</p>
        <h2 id="application-dialog-title">{selected.name}</h2>
        <p className={styles.dialogSummary}>{selected.shortDescription}</p>
        {selected.kind === "business-suite" && <div className={styles.dialogModules}>
          <h3>Des outils qui travaillent ensemble</h3>
          <ul>{selected.includesBusinessToolIds?.map((id) => byId.get(id)).filter((item) => item !== undefined).map((item) => <li key={item.id}>{item.name}</li>)}</ul>
        </div>}
        <div className={styles.dialogFacts}>
          <section><h3>Pour qui</h3><p>{selected.audience.join(" · ")}</p></section>
          <section><h3>Ce que cela permet</h3><p>{selected.capabilities.join(" · ")}</p></section>
          <section><h3>Connexions possibles</h3><p>{selected.connections.join(" · ")}</p></section>
          <section><h3>Et ensuite</h3><p>{selected.evolution}</p></section>
        </div>
        {publishedPaths.has(selected.canonicalPath) && <a className={styles.dialogLink} href={selected.canonicalPath}>Découvrir la page {selected.name} <span aria-hidden="true">↗</span></a>}
      </div>}
    </dialog>
  </>;
}

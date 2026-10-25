"use client";

import { useEffect, useRef, useState } from "react";
import type { BusinessToolCategoryId, PublicBusinessTool } from "../../data/content-types";
import { ApplicationIcon } from "./application-icon";
import styles from "./applications.module.css";

type Category = { id: BusinessToolCategoryId; label: string };

export function ApplicationCatalogue({ tools, categories, existingCanonicalPaths }: {
  tools: PublicBusinessTool[];
  categories: Category[];
  existingCanonicalPaths: string[];
}) {
  const [category, setCategory] = useState<BusinessToolCategoryId | "all">("all");
  const [filterChanges, setFilterChanges] = useState(0);
  const [selected, setSelected] = useState<PublicBusinessTool | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const byId = new Map(tools.map((tool) => [tool.id, tool]));
  const publishedPaths = new Set(existingCanonicalPaths);
  const visibleTools = category === "all" ? tools : tools.filter((tool) => tool.categoryId === category);
  const categoryLabel = (id: BusinessToolCategoryId) => categories.find((item) => item.id === id)?.label;
  const includedTools = (tool: PublicBusinessTool) =>
    tool.includesBusinessToolIds?.map((id) => byId.get(id)).filter((item): item is PublicBusinessTool => item !== undefined) ?? [];

  useEffect(() => {
    if (selected && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
  }, [selected]);

  const choose = (id: BusinessToolCategoryId | "all", button: HTMLButtonElement) => {
    if (id === category) return;
    setCategory(id);
    setFilterChanges((count) => count + 1);
    // Keep the chosen filter fully visible inside the horizontal bar on narrow screens.
    button.scrollIntoView({ block: "nearest", inline: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const open = (tool: PublicBusinessTool, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setSelected(tool);
  };
  const close = () => dialogRef.current?.close();
  const onClose = () => {
    setSelected(null);
    triggerRef.current?.focus();
  };

  const filters = [{ id: "all" as const, label: "Tout", count: tools.length },
    ...categories.map((item) => ({ ...item, count: tools.filter((tool) => tool.categoryId === item.id).length }))];

  return <>
    <div className={styles.filterBar}>
      <div className={styles.filters} role="group" aria-label="Filtrer les applications">
        {filters.map((item) => <button
          type="button"
          key={item.id}
          aria-controls="applications-grid"
          aria-pressed={category === item.id}
          onClick={(event) => choose(item.id, event.currentTarget)}
        >{item.label}<span aria-hidden="true">{item.count}</span></button>)}
      </div>
    </div>
    <p className={styles.resultCount} role="status">{visibleTools.length} {visibleTools.length > 1 ? "applications" : "application"}{category === "all" ? "" : ` · ${categoryLabel(category)}`}</p>

    <ul id="applications-grid" key={filterChanges} className={`${styles.grid} ${filterChanges ? styles.gridChanged : ""}`}>
      {visibleTools.map((tool, index) => {
        const family = tool.kind === "business-suite";
        const included = includedTools(tool);
        return <li key={tool.id} className={family ? styles.familyItem : undefined} style={{ "--tile-index": Math.min(index, 10) } as React.CSSProperties}>
          <button
            className={`${styles.appTile} ${family ? styles.familyTile : ""}`}
            type="button"
            aria-haspopup="dialog"
            onClick={(event) => open(tool, event.currentTarget)}
          >
            <span className={styles.appIcon}><ApplicationIcon tool={tool} /></span>
            <span className={styles.appText}>
              <span className={styles.appName}>{tool.name}</span>
              <span className={styles.appDescription}>{tool.shortDescription}</span>
            </span>
            {family && <span className={styles.familyModules} aria-hidden="true">
              <span className={styles.moduleNodes}>
                {included.map((item) => <span key={item.id} className={styles.moduleNode} title={item.name}><ApplicationIcon tool={item} /></span>)}
              </span>
              <span className={styles.moduleNames}>{included.length} outils reliés · {included.map((item) => item.name).join(", ")}</span>
            </span>}
            {tool.kind === "capability" && <span className={styles.capabilityTag}>Intégrée aux autres applications</span>}
            <span className={styles.tileOpen} aria-hidden="true" />
            <span className={styles.srOnly}>{family ? `, regroupe ${included.length} outils` : ""}. Ouvrir la fiche</span>
          </button>
        </li>;
      })}
    </ul>

    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="application-dialog-title" aria-describedby="application-dialog-summary" onClose={onClose} onClick={(event) => {
      if (event.target === dialogRef.current) close();
    }}>
      {selected && <div className={styles.dialogContent}>
        <span className={styles.dialogGrabber} aria-hidden="true" />
        <div className={styles.dialogTop}>
          <span className={styles.dialogIcon}><ApplicationIcon tool={selected} /></span>
          <div className={styles.dialogHeading}>
            <p className={styles.dialogKicker}>{categoryLabel(selected.categoryId)}{selected.kind === "business-suite" ? " · Univers métier" : ""}</p>
            <h2 id="application-dialog-title">{selected.name}</h2>
          </div>
          <button type="button" className={styles.dialogClose} onClick={close} aria-label="Fermer la fiche"><span aria-hidden="true" /></button>
        </div>
        <p id="application-dialog-summary" className={styles.dialogSummary}>{selected.shortDescription}</p>

        {selected.kind === "business-suite" && <section className={styles.dialogModules} aria-labelledby="dialog-modules-title">
          <h3 id="dialog-modules-title">Les outils réunis</h3>
          <ul>{includedTools(selected).map((item) => <li key={item.id}><span aria-hidden="true"><ApplicationIcon tool={item} /></span>{item.name}</li>)}</ul>
        </section>}

        <dl className={styles.dialogFacts}>
          <div><dt>Ce qu’elle permet</dt><dd><ul className={styles.factList}>{selected.capabilities.map((item) => <li key={item}>{item}</li>)}</ul></dd></div>
          <div><dt>Pour qui</dt><dd>{selected.audience.join(" · ")}</dd></div>
          <div><dt>Se connecte avec</dt><dd><ul className={styles.chipList}>{selected.connections.map((item) => <li key={item}>{item}</li>)}</ul></dd></div>
          <div><dt>Adaptable</dt><dd>{selected.evolution}</dd></div>
        </dl>

        <div className={styles.dialogActions}>
          {publishedPaths.has(selected.canonicalPath) && <a className={styles.dialogLink} href={selected.canonicalPath}>Voir la page {selected.name} <span aria-hidden="true">→</span></a>}
          <a className={styles.dialogSecondary} href="/contact/">En parler avec YVEXOR</a>
        </div>
      </div>}
    </dialog>
  </>;
}

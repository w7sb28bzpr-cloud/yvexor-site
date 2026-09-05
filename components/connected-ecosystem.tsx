"use client";

import { useState } from "react";
import { SectionHeading } from "./ui";

const modules = ["Site", "Planning", "Caisse", "Mobile", "Stock", "Réservations", "Clients", "IA", "Automatisation", "Systèmes connectés"];
const links: Record<string, string[]> = { Caisse: ["Stock", "Clients", "Site"], Réservations: ["Site", "Planning", "Clients"], IA: ["Stock", "Clients", "Automatisation"], Site: ["Réservations", "Caisse", "Mobile"] };
const flow = ["Burger maison — 17 €", "Caisse", "Site", "Commande en ligne", "Stock"];

export function ConnectedEcosystem() {
  const [active, setActive] = useState<string | null>(null);
  const related = active ? new Set([active, ...(links[active] || [])]) : null;
  return <section className="section ecosystem" id="ecosysteme">
    <SectionHeading eyebrow="Écosystème connecté" title="Une information. Plusieurs usages. Pas de ressaisie inutile." intro="YVEXOR peut concevoir un environnement où les modules concernés partagent les mêmes données. Vos outils peuvent enfin travailler ensemble."/>
    <div className={`ecosystem-map ${active ? "has-active-node" : ""}`} aria-label="Constellation interactive des modules YVEXOR"><svg className="ecosystem-links" viewBox="0 0 720 720" aria-hidden="true">{modules.map((module, index) => {const angle=(index/10)*Math.PI*2-Math.PI/2;const x=360+270*Math.cos(angle);const y=360+270*Math.sin(angle);return <line key={module} x1="360" y1="360" x2={x} y2={y} className={related?.has(module)?"is-lit":""}/>})}</svg><div className="ecosystem-center"><span>Donnée</span><strong>YVEXOR</strong><small>Source partagée</small><i aria-hidden="true"/></div>{modules.map((module,index)=><button type="button" onPointerEnter={()=>setActive(module)} onPointerLeave={()=>setActive(null)} onFocus={()=>setActive(module)} onBlur={()=>setActive(null)} onClick={()=>setActive(active===module?null:module)} className={`ecosystem-node node-${index+1} ${related&&!related.has(module)?"is-muted":""} ${active===module?"is-active":""}`} key={module}>{module}</button>)}</div>
    <div className="data-demo"><span className="solution-type">Démonstration conceptuelle</span><h3>Une modification. Les outils concernés suivent.</h3><div className="data-flow">{flow.map((step,index)=><div key={step} className={index===0?"flow-source":""}><span>{index===0?"Modification":`0${index}`}</span><strong>{step}</strong>{index>0&&<small>Mis à jour</small>}{index<flow.length-1&&<i aria-hidden="true"/>}</div>)}</div><p>Exemple de circulation possible selon la configuration et les modules réellement connectés.</p></div>
    <p className="ecosystem-note"><strong>C’est aussi cela, le sur-mesure YVEXOR :</strong> réunir des briques existantes, les connecter, adapter certaines fonctions et développer uniquement ce qui manque.</p>
  </section>;
}

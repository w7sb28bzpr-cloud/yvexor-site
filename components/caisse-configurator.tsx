"use client";
import {useEffect,useState} from "react";
import catalogue from "../data/caisses.json";
import {professions,professionBySlug} from "../data/caisse-professions";
import {defaultSelection,normalizeSelection,selectionTotals,type CaisseSelection} from "../lib/caisse-config";
const key="yvexor-caisse-selection-v1";
export function CaisseSelectLink({values,children}:{values:Partial<CaisseSelection>;children:React.ReactNode}){return <a href="#configurateur" className="action-link secondary" onClick={()=>window.dispatchEvent(new CustomEvent("caisse-select",{detail:values}))}>{children}</a>}
export function CaisseConfigurator({profession="commerce"}:{profession?:string}){
 const [s,set]=useState<CaisseSelection>(()=>defaultSelection(profession));const[ready,markReady]=useState(false);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(key)||"null");if(saved)set(normalizeSelection({...saved,...(profession==="commerce"?{}:{profession})}));}catch{/* Private mode or invalid draft: use defaults. */}markReady(true)},[profession]);
 useEffect(()=>{if(ready)try{localStorage.setItem(key,JSON.stringify(s))}catch{/* A blocked browser store must not block the form. */}},[s,ready]);
 const change=(values:Partial<CaisseSelection>)=>set(current=>normalizeSelection({...current,...values}));
 useEffect(()=>{const select=(event:Event)=>set(current=>normalizeSelection({...current,...(event as CustomEvent<Partial<CaisseSelection>>).detail}));window.addEventListener("caisse-select",select);return()=>window.removeEventListener("caisse-select",select)},[]);
 const family=professionBySlug[s.profession].family,totals=selectionTotals(s);
 return <section id="configurateur" className="cx-section"><p className="eyebrow">Votre configuration</p><h2>Voyez ce que vous choisissez.</h2><p>Votre sélection reste sur cet appareil, puis accompagne votre demande. Aucun achat n’est déclenché.</p>
 <form className="cx-config" action="https://client.yvexor.com/caisse/preparer/" method="get">
 <div className="cx-config-fields">
 <label className="cx-field">1. Votre activité<select value={s.profession} onChange={e=>change({profession:e.target.value,plan:defaultSelection(e.target.value).plan})}>{["commerce","snack","salon","other"].map(f=><optgroup key={f} label={catalogue.families.find(x=>x.id===f)!.name}>{professions.filter(p=>p.family===f).map(p=><option value={p.slug} key={p.slug}>{p.name}</option>)}</optgroup>)}</select></label>
 <p className="cx-small">Restaurant ou brasserie ? <a href="/solutions-restaurants/">Découvrez Restaurant OS et ses offres indépendantes →</a></p>
 {family!=="other"&&<fieldset><legend>2. Votre logiciel</legend><div className="cx-choice-grid">{catalogue.plans.filter(p=>p.families.includes(family)).map(p=><label className={`cx-choice ${s.plan===p.id?"selected":""}`} key={p.id}><input type="radio" name="plan-choice" checked={s.plan===p.id} onChange={()=>change({plan:p.id})}/><span><strong>{p.name}</strong><small>{p.monthly} € HT / mois</small></span></label>)}</div></fieldset>}
 <fieldset><legend>3. Votre équipement</legend>{catalogue.hardware.map(h=><label className={`cx-choice ${s.hardware===h.id?"selected":""}`} key={h.id}><input type="radio" name="hardware-choice" checked={s.hardware===h.id} onChange={()=>change({hardware:h.id})}/><span><strong>{h.name}</strong><small>{h.once} € HT à l’achat {h.once===0?"de poste YVEXOR":"— une seule fois"}</small><small>{h.description}</small></span></label>)}</fieldset>
 {family!=="other"&&<fieldset><legend>4. Vos options</legend>{catalogue.options.filter(o=>o.families.includes(family)).map(o=><div className="cx-option" key={o.id}>{o.id==="website"||o.id==="mobile"?<label className="cx-check"><input type="checkbox" checked={s[o.id]} onChange={e=>change({[o.id]:e.target.checked})}/><span><strong>{o.name}</strong> · +{o.monthly} € HT / mois</span></label>:<label className="cx-field">{o.name} · +{o.monthly} € HT / mois / {o.unit}<input aria-label={`Nombre de ${o.unit}s`} type="number" min="0" max="20" step="1" value={s[o.id==="kiosk"?"kiosk":"kitchen"]} onChange={e=>change({[o.id]:Number(e.target.value)})}/></label>}<p className="cx-small">{o.description}</p><span className="cx-status">{o.availability}</span></div>)}</fieldset>}
 <fieldset><legend>5. Autres souhaits</legend>{catalogue.intents.map(i=><label key={i.id} className="cx-choice"><input type="checkbox" checked={s[i.id==="tpe"?"tpe":"license"]} onChange={e=>change({[i.id]:e.target.checked})}/><span><strong>{i.name}</strong><small>{i.description}</small></span></label>)}</fieldset>
 </div>
 <aside className="cx-summary" aria-label="Récapitulatif"><p className="eyebrow">Votre sélection</p><h3>{professionBySlug[s.profession].name}</h3><div aria-live="polite" aria-atomic="true"><dl><div><dt>Logiciel {family!=="other"&&catalogue.plans.find(p=>p.id===s.plan)?.name}</dt><dd>{totals.base===null?"Sur devis":s.license?"Licence sur devis":`${totals.base} € HT / mois`}</dd></div>{totals.lines.map(o=><div key={o.name}><dt>{o.name}{o.quantity>1?` × ${o.quantity}`:""}</dt><dd>{o.monthly*o.quantity} € HT / mois</dd></div>)}</dl><div className="cx-total"><span>Total mensuel {s.license?"à confirmer":"estimé"}</span><strong data-testid="monthly-total">{totals.monthly===null?"Sur devis":`${totals.monthly} € HT / mois`}</strong></div><div className="cx-total cx-once"><span>Matériel — paiement unique</span><strong data-testid="hardware-total">{totals.hardware} € HT</strong></div></div>
 {s.license&&<p className="cx-small">Les options mensuelles ci-dessus sont des repères. Le prix de la licence et les services associés seront proposés séparément ; aucun total mensuel n’est présumé.</p>}
 {s.tpe&&<p className="cx-small">TPE demandé · frais et commissions sur proposition, non compris dans ce total.</p>}
 <p className="cx-small">{catalogue.disclaimer}</p>
 {Object.entries(s).map(([name,value])=><input key={name} type="hidden" name={name} value={String(value)}/>)}
 <button className="action-link primary" type="submit">{catalogue.cta} →</button><p className="cx-small">Connexion ou inscription, puis vérification du récapitulatif avant envoi à Yannick.</p><button type="button" className="cx-reset" onClick={()=>set(defaultSelection(profession))}>Réinitialiser mes choix</button>
 <noscript><p>Pour personnaliser votre configuration, activez JavaScript ou <a href="https://client.yvexor.com/requests/new/">décrivez votre besoin dans votre espace client</a>.</p></noscript>
 </aside></form></section>
}

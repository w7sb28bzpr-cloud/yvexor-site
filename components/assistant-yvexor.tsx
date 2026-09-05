"use client";

import { FormEvent, useState } from "react";

const examples = [
  "Je cherche une caisse pour ma boulangerie.",
  "Je veux mieux suivre mes interventions.",
  "Je voudrais automatiser mes réservations.",
  "J’ai une idée d’application.",
];

export function AssistantYvexor() {
  const [message, setMessage] = useState("");
  const [objective, setObjective] = useState("");
  const [notice, setNotice] = useState(false);
  const [focused, setFocused] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    setNotice(true);
  }

  return <section className={`assistant-shell ${focused ? "is-focused" : ""} ${message ? "has-input" : ""} ${notice ? "is-complete" : ""}`} aria-labelledby="assistant-title">
    <div className="assistant-data-field" aria-hidden="true"><i/><i/><i/></div>
    <div className="assistant-head">
      <span className="assistant-status"><i/> Interface locale en préparation</span>
      <h2 id="assistant-title">Expliquez votre besoin avec vos mots.</h2>
      <p>Nous vérifions d’abord si une solution existe, puis quelles données, quels outils et quelles ressaisies doivent être reliés. Sinon, nous cherchons la première version sur mesure la plus cohérente.</p>
    </div>
    <form onSubmit={submit} className="assistant-form">
      <fieldset className="assistant-objectives"><legend>Quel est l’objectif principal du projet ?</legend>{["Améliorer mon entreprise actuelle", "Vendre un nouveau service", "Créer une application payante", "Générer des revenus par abonnement", "Créer une marketplace", "Tester une idée", "Autre"].map(option => <button type="button" className={objective === option ? "is-selected" : ""} aria-pressed={objective === option} onClick={() => setObjective(option)} key={option}>{option}</button>)}</fieldset>
      <label htmlFor="project-idea" className="sr-only">Décrivez votre idée ou votre problème</label>
      <textarea id="project-idea" value={message} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onChange={event => { setMessage(event.target.value); setNotice(false); }} placeholder="Expliquez votre besoin, votre métier ou votre idée…" rows={4}/>
      <div className="assistant-examples" aria-label="Exemples de besoins">
        {examples.map(example => <button type="button" key={example} onClick={() => { setMessage(example); setNotice(false); }}>{example}</button>)}
      </div>
      <div className="assistant-actions">
        <button className="assistant-submit" type="submit" disabled={!message.trim()}><i aria-hidden="true"/>Analyser mon idée <span>→</span></button>
        <a href="mailto:contact@yvexor.com?subject=Mon%20projet%20YVEXOR">Je préfère parler directement à YVEXOR</a>
      </div>
    </form>
    {notice && <div className="assistant-notice" role="status"><div className="analysis-path" aria-label="Étapes de la future analyse"><span>Compréhension</span><span>Structuration</span><span>Première solution</span><span>Budget / modèle</span></div><strong>L’Assistant YVEXOR est en préparation.</strong><p>Aucune analyse automatique n’est simulée. Vous pouvez déjà nous transmettre ce besoin pour une étude humaine.</p><a href={`mailto:contact@yvexor.com?subject=Mon%20projet%20YVEXOR&body=${encodeURIComponent(`${objective ? `Objectif : ${objective}\n\n` : ""}${message}`)}`}>Envoyer mon besoin à YVEXOR →</a></div>}
  </section>;
}

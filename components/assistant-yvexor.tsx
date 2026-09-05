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
  const [notice, setNotice] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    setNotice(true);
  }

  return <section className="assistant-shell" aria-labelledby="assistant-title">
    <div className="assistant-head">
      <span className="assistant-status"><i/> Interface locale en préparation</span>
      <h2 id="assistant-title">Expliquez votre besoin avec vos mots.</h2>
      <p>Nous vérifions d’abord si une solution YVEXOR existe déjà. Sinon, nous cherchons l’adaptation ou la première version sur mesure la plus cohérente.</p>
    </div>
    <form onSubmit={submit} className="assistant-form">
      <label htmlFor="project-idea" className="sr-only">Décrivez votre idée ou votre problème</label>
      <textarea id="project-idea" value={message} onChange={event => { setMessage(event.target.value); setNotice(false); }} placeholder="Expliquez votre besoin, votre métier ou votre idée…" rows={4}/>
      <div className="assistant-examples" aria-label="Exemples de besoins">
        {examples.map(example => <button type="button" key={example} onClick={() => { setMessage(example); setNotice(false); }}>{example}</button>)}
      </div>
      <div className="assistant-actions">
        <button className="assistant-submit" type="submit" disabled={!message.trim()}>Analyser mon idée <span>→</span></button>
        <a href="mailto:contact@yvexor.com?subject=Mon%20projet%20YVEXOR">Je préfère parler directement à YVEXOR</a>
      </div>
    </form>
    {notice && <div className="assistant-notice" role="status"><strong>L’Assistant YVEXOR est en préparation.</strong><p>Aucune analyse automatique n’est simulée. Vous pouvez déjà nous transmettre ce besoin pour une étude humaine.</p><a href={`mailto:contact@yvexor.com?subject=Mon%20projet%20YVEXOR&body=${encodeURIComponent(message)}`}>Envoyer mon besoin à YVEXOR →</a></div>}
  </section>;
}

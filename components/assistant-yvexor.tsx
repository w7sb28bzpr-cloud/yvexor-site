import { SmsLink } from "./sms-link";

export function AssistantYvexor() {
  return <section className="assistant-shell assistant-public" aria-labelledby="assistant-title">
    <div className="assistant-data-field" aria-hidden="true"><i/><i/><i/></div>
    <div className="assistant-head">
      <span className="assistant-status"><i/> Assistant YVEXOR</span>
      <h2 id="assistant-title">Bientôt disponible.</h2>
      <p>Notre assistant de projet est en préparation. En attendant, vous pouvez nous présenter directement votre besoin.</p>
    </div>
    <div className="assistant-form" aria-label="Aperçu non interactif de l’Assistant YVEXOR">
      <label htmlFor="project-idea" className="sr-only">Assistant bientôt disponible</label>
      <textarea id="project-idea" disabled placeholder="Décrivez bientôt votre besoin, votre métier ou votre idée…" rows={3}/>
      <div className="analysis-path is-preview" aria-label="Fonctionnement prévu de l’assistant"><span>Compréhension</span><span>Structuration</span><span>Première solution</span><span>Budget / modèle</span></div>
      <div className="assistant-actions">
        <SmsLink className="assistant-submit"><i aria-hidden="true"/><span>Présenter mon projet à YVEXOR</span><b aria-hidden="true">→</b></SmsLink>
        <SmsLink>Parler à YVEXOR · 07 56 91 30 13</SmsLink>
      </div>
    </div>
  </section>;
}

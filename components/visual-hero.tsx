import { AssistantYvexor } from "./assistant-yvexor";
import { SmsLink } from "./sms-link";
import { ArrowIcon } from "./ui";

export function VisualHero() {
  return <section className="hero hero-with-assistant visual-hero" id="accueil">
    <div className="visual-hero-grid">
      <div className="hero-content">
        <p className="eyebrow">Logiciels sur mesure & systèmes connectés</p>
        <h1>Votre besoin.<br/>Votre idée.<br/><span>Construisons<br/>la solution.</span></h1>
        <p className="hero-copy">Nous concevons des logiciels et applications sur mesure pour améliorer votre activité ou lancer un nouveau service. Une base existe déjà ? Nous pouvons l’adapter, la connecter ou développer ce qui manque.</p>
        <div className="visual-hero-actions">
          <SmsLink className="action-link primary">Discuter de mon projet <ArrowIcon/></SmsLink>
          <a className="visual-secondary" href="#exemples">Explorer les possibilités <span aria-hidden="true">↗</span></a>
        </div>
        <ul className="visual-principles" aria-label="Notre approche"><li>Sur mesure</li><li>Évolutif</li><li>Un interlocuteur direct</li></ul>
      </div>
      <figure className="hero-product-visual">
        <div className="visual-caption-top"><span aria-hidden="true"/> De l’idée au système connecté</div>
        <img src="/yvexor-connected-hero-v1.webp" srcSet="/yvexor-connected-hero-mobile-v1.webp 768w, /yvexor-connected-hero-v1.webp 1280w" sizes="(max-width: 820px) 100vw, 55vw" width="1280" height="853" alt="Concept de service de location : application mobile, tableau de gestion et trottinette connectée." fetchPriority="high" decoding="async"/>
        <div className="visual-capabilities"><span>Application client</span><span>Logiciel de gestion</span><span>Objets connectés</span></div>
        <figcaption>Exemple de conception · Illustration générée, non contractuelle.</figcaption>
      </figure>
    </div>
    <div className="hero-shortcuts" aria-label="Accès directs"><a href="#solutions">Solutions <span>↗</span></a><a href="#budgets">Budgets & tarifs <span>↗</span></a><a href="#exemples">Idées de projets <span>↗</span></a></div>
    <div className="hero-assistant" id="assistant"><AssistantYvexor/></div>
  </section>;
}

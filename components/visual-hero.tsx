import { SmsLink } from "./sms-link";
import { ArrowIcon } from "./ui";

export function VisualHero() {
  return <section className="hero hero-with-assistant visual-hero planet-hero" id="accueil">
    <div className="visual-hero-grid">
      <div className="hero-content">
        <p className="eyebrow">Logiciels sur mesure & systèmes connectés</p>
        <h1>Votre besoin.<br/>Votre idée.<br/><span>Construisons<br/>la solution.</span></h1>
        <p className="hero-copy">Nous concevons des logiciels et applications sur mesure pour améliorer votre activité ou lancer un nouveau service. Une base existe déjà ? Nous pouvons l’adapter, la connecter ou développer ce qui manque.</p>
        <div className="visual-hero-actions">
          <SmsLink className="action-link primary">Discuter de mon projet <ArrowIcon/></SmsLink>
          <a className="visual-secondary" href="#exemples">Explorer les possibilités <span aria-hidden="true">↗</span></a>
        </div>
        <p className="service-area">France, Suisse et au-delà · À distance ou sur place selon le projet.</p><ul className="visual-principles" aria-label="Notre approche"><li>Sur mesure</li><li>Évolutif</li><li>Un interlocuteur direct</li></ul>
      </div>
      <figure className="hero-product-visual">
        <div className="visual-caption-top"><span aria-hidden="true"/> Des idées. Des outils. Des connexions.</div>
        <div className="connected-earth"><img src="/yvexor-connected-earth-1440-v1.webp" srcSet="/yvexor-connected-earth-768-v1.webp 768w, /yvexor-connected-earth-1440-v1.webp 1440w" sizes="(max-width: 820px) 100vw, 60vw" width="1440" height="960" alt="Illustration de la Terre de nuit, avec des connexions lumineuses bleues au-dessus de l’Europe." fetchPriority="high" decoding="async"/><span className="earth-signal earth-signal-one" aria-hidden="true"/><span className="earth-signal earth-signal-two" aria-hidden="true"/></div>
        <div className="visual-capabilities"><span>Logiciels sur mesure</span><span>Applications</span><span>Systèmes connectés</span></div>
        <figcaption>Vision artistique de la connexion · Illustration générée.</figcaption>
      </figure>
    </div>
    <div className="hero-shortcuts" aria-label="Accès directs"><a href="#solutions">Solutions <span>↗</span></a><a href="#budgets">Budgets & tarifs <span>↗</span></a><a href="#exemples">Idées de projets <span>↗</span></a></div>
  </section>;
}

import s from "./home.module.css";
export function VisualHero() {
  return <section className={s.hero} id="accueil">
    <div className={s.heroCopy}>
      <p className={s.label}>YVEXOR / Solutions technologiques pour les professionnels</p>
      <h1>Votre besoin.<br/>Notre <span>solution.</span></h1>
      <p className={s.lead}>Logiciels, applications, IA, automatisation et systèmes connectés. Expliquez-nous ce que vous souhaitez créer ou améliorer : nous cherchons la solution adaptée à votre activité et à votre budget.</p>
      <div className={s.actions}><a className="action-link primary" href="/contact/">Parler de mon projet →</a><a className={s.textLink} href="#solutions">Découvrir nos solutions ↗</a></div>
      <p className={s.heroNote}>Une idée encore floue ? Aucun cahier des charges nécessaire pour un premier échange.</p>
    </div>
    <figure className={s.heroFigure}>
      <div className={s.figureLabel}><span>Du besoin à la mise en place</span><span>Logiciel + matériel</span></div>
      <a href="/logiciel-sur-mesure/" aria-label="Découvrir notre approche sur mesure"><img src="/media/boutique/kds-01-960.webp" srcSet="/media/boutique/kds-01-480.webp 480w, /media/boutique/kds-01-960.webp 960w, /media/boutique/kds-01.webp 1536w" sizes="(max-width: 850px) 100vw, 55vw" width="1536" height="1024" alt="Exemple illustratif : un logiciel associé à un écran en cuisine professionnelle" fetchPriority="high"/></a>
      <figcaption><div><strong>La bonne technologie pour le bon usage.</strong><span>Un exemple en cuisine, parmi d’autres projets.</span></div><a href="/logiciel-sur-mesure/" aria-label="Notre démarche sur mesure">↗</a></figcaption>
      <small>Visuel d’illustration. Interface et raccordement selon configuration.</small>
    </figure>
  </section>;
}

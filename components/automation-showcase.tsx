export function AutomationShowcase() {
  return <section className="automation-showcase" aria-label="Vos outils travaillent ensemble">
    <figure>
      <img src="/yvexor-automation-1440-v1.webp" srcSet="/yvexor-automation-768-v1.webp 768w, /yvexor-automation-1440-v1.webp 1440w" sizes="(max-width: 760px) 100vw, 65vw" width="1536" height="1024" alt="Illustration de documents, e-mails et stocks connectés à un tableau de bord." fetchPriority="high"/>
      <figcaption>Illustration générée · Ne représente pas une interface livrée.</figcaption>
    </figure>
    <div className="automation-showcase-copy"><p className="eyebrow">Moins de tâches. Plus de maîtrise.</p><h2>Vos outils.<br/><span>Enfin reliés.</span></h2><p>Une information arrive. Les bonnes actions suivent, dans le cadre que vous avez défini.</p><nav aria-label="Explorer les automatisations"><a href="#automatisation-2">E-mails & demandes <span>↗</span></a><a href="#automatisation-4">Stocks & prévisions <span>↗</span></a><a href="#automatisation-7">IA métier <span>↗</span></a><a href="#automatisation-9">Budget & abonnement <span>↗</span></a></nav></div>
  </section>;
}

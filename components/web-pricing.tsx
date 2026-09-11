import { solutionOffers } from "../data/public-offer";
export function WebPricing() {
  const offer = solutionOffers.find(item => item.id === "SITE_WEB")!;
  return <section className="section category-pricing" id="tarifs" aria-labelledby="web-pricing-title">
    <p className="eyebrow">Une formule adaptée à votre projet</p><h2 id="web-pricing-title">Votre site. Votre rythme.</h2>
    <div className="category-payment-options">
      <article className="category-price-card"><span>Avec abonnement</span><h3>{offer.startingPriceLabel}</h3><p>Présence web, hébergement et services selon la formule retenue.</p><p className="category-price-note">Création et mise en service chiffrées selon votre projet.</p><a className="action-link primary" href="https://client.yvexor.com/">Parler de mon site</a></article>
      <article className="category-price-card"><span>Sans abonnement de création</span><h3>Paiement en une fois</h3><p>Vous préférez régler la création de votre site en une fois ? Nous vous proposons un devis adapté.</p><p className="category-price-note">Hébergement, domaine et suivi précisés séparément.</p><a className="action-link secondary" href="https://client.yvexor.com/">Demander mon devis</a></article>
    </div>
    <details className="audit-disclosure"><summary>Ce que le devis précise</summary><p>Pages et fonctionnalités, création, mise en ligne, nom de domaine, hébergement, maintenance, frais tiers et conditions d’engagement : vous connaissez le coût de départ et les éventuels frais récurrents avant de vous engager. L’abonnement affiché n’est pas le prix d’une création complète sur mesure.</p></details>
  </section>;
}

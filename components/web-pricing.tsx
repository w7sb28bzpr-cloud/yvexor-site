import { solutionOffers } from "../data/public-offer";
import { SmsLink } from "./sms-link";
export function WebPricing() {
  const offer = solutionOffers.find(item => item.id === "SITE_WEB")!;
  return <section className="section category-pricing" id="tarifs" aria-labelledby="web-pricing-title">
    <p className="eyebrow">Une formule adaptée à votre projet</p><h2 id="web-pricing-title">Votre site. Votre rythme.</h2>
    <div className="category-payment-options">
      <article className="category-price-card"><span>Avec abonnement</span><h3>{offer.startingPriceLabel}</h3><p>Présence web, hébergement et services selon la formule retenue.</p><p className="category-price-note">Création et mise en service chiffrées selon votre projet.</p><SmsLink message="Bonjour YVEXOR, je souhaite un site web et découvrir votre formule à partir de 29 €/mois. Mon activité : " className="action-link primary">Parler de mon site</SmsLink></article>
      <article className="category-price-card"><span>Sans abonnement de création</span><h3>Paiement en une fois</h3><p>Vous préférez régler la création de votre site en une fois ? Nous vous proposons un devis adapté.</p><p className="category-price-note">Hébergement, domaine et suivi précisés séparément.</p><SmsLink message="Bonjour YVEXOR, je souhaite créer un site web avec un paiement en une fois. Mon activité : " className="action-link secondary">Demander mon devis</SmsLink></article>
    </div>
    <details className="audit-disclosure"><summary>Ce que le devis précise</summary><p>Pages et fonctionnalités, création, mise en ligne, nom de domaine, hébergement, maintenance, frais tiers et conditions d’engagement : vous connaissez le coût de départ et les éventuels frais récurrents avant de vous engager. L’abonnement affiché n’est pas le prix d’une création complète sur mesure.</p></details>
  </section>;
}

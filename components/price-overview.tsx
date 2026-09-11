import { offerDestinations, solutionOffers } from "../data/public-offer";
export function PriceOverview() {
  return <div id="sur-mesure" className="price-overview">
    <div className="price-highlights">{solutionOffers.map(offer => <a href={offerDestinations[offer.id]+"#tarifs"} key={offer.id}>
      <span>{offer.name}</span><strong>{offer.startingPriceLabel}</strong><p>{offer.description}</p><b>Voir la formule et les détails →</b>
    </a>)}</div>
    <p className="audit-budget-note">Repères d’abonnement. La création, la mise en service et les éventuels frais tiers sont précisés dans chaque rubrique et au devis.</p>
  </div>;
}

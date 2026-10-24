import type { PublishablePricing } from "../lib/content";

const currency = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

function offerLabel(pricing: PublishablePricing, index: number): string {
  const offer = pricing.offers[index];
  if (pricing.offers.length === 1 && pricing.label) return pricing.label;
  if (offer.kind === "subscription") {
    if (offer.monthlyFixed !== undefined) return `${currency.format(offer.monthlyFixed)} / mois`;
    if (offer.monthlyFrom !== undefined) return `À partir de ${currency.format(offer.monthlyFrom)} / mois`;
    return "Abonnement à définir";
  }
  if (offer.kind === "oneTime") {
    if (offer.amountFrom !== undefined) return `À partir de ${currency.format(offer.amountFrom)} pour l’achat définitif`;
    if (offer.quoteRequired) return "Achat définitif sur devis";
    return "Achat définitif à définir";
  }
  return "Sur devis";
}

export function SolutionPricing({ pricing, compact = false }: { pricing: PublishablePricing | null; compact?: boolean }) {
  return <aside className={`site-surface site-surface--elevated site-pricing${compact ? " site-pricing--compact" : ""}`} aria-label="Modalités tarifaires">
    <span className="site-pricing__title">Modalités</span>
    {pricing ? <>
      <ul className="site-pricing__offers">{pricing.offers.map((offer, index) => <li key={`${offer.kind}-${index}`}>{offerLabel(pricing, index)}</li>)}</ul>
      {pricing.hardwareSeparate && <p className="site-pricing__note">Matériel à part, si nécessaire.</p>}
      {pricing.setupSeparate && <p className="site-pricing__note">Mise en service définie selon le projet.</p>}
      {!compact && pricing.recurringServicesNote && <p className="site-pricing__note">{pricing.recurringServicesNote}</p>}
    </> : <p className="site-pricing__note">Tarif à étudier avec votre besoin.</p>}
  </aside>;
}

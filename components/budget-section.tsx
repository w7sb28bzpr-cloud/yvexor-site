import { PriceOverview } from "./price-overview";
import { budgetGuidance } from "../data/public-offer";
import { ActionLink, SectionHeading } from "./ui";

export function BudgetSection() {
  return <section className="section budget-section" id="budgets">
    <SectionHeading eyebrow="Budgets & tarifs" title="Des repères clairs pour commencer." intro="Prix de création, abonnement et mise en service sont distingués. Le devis confirme les fonctions et les services inclus."/><PriceOverview/>
    <details className="audit-disclosure"><summary>Quel budget pour un projet plus large ?</summary><div className="budget-grid budget-guidance-grid">{budgetGuidance.map((category, index) => <article className="budget-card" key={category.title}>
      <span>0{index + 1}</span><h3>{category.title}</h3><strong>{category.price}</strong><small className="budget-payment-note">{category.note}</small><p>{category.text}</p><span className="budget-badge">{category.badge}</span><a className="budget-card-link" href="/contact/">{category.cta} →</a>
    </article>)}</div></details>
    <div className="payment-value"><span>Prix total ≠ paiement immédiat</span><h3>Une première étape, puis la suite.</h3><p>Selon le dossier et après accord, nous pouvons organiser le projet par phases, prévoir des échéances ou étudier une formule avec abonnement. Le devis précise le coût total, le premier paiement et les engagements.</p></div>
    <div className="budget-foot"><p>Ces repères sont indicatifs et ne constituent pas un devis. Aucune modalité de paiement n’est automatique ; elle dépend du projet et d’une validation YVEXOR.</p><ActionLink href="/contact/" className="primary">Parler de mon budget</ActionLink></div>
    <details className="audit-disclosure"><summary>Une idée ambitieuse ou un budget limité ?</summary><p>Nous pouvons étudier une première version utile, puis un développement par étapes. Un montage commercial spécifique reste exceptionnel et nécessite une étude et un accord contractuel préalable.</p><ActionLink href="/logiciel-sur-mesure/" className="secondary">Découvrir notre approche</ActionLink></details>
    <p className="audit-budget-note" id="services-mensuels">Après la mise en service, l’hébergement, les sauvegardes, la maintenance et l’assistance sont définis selon vos besoins dans la proposition.</p>
  </section>;
}

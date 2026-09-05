import { monthlyServices } from "../data/budget-categories";
import { budgetGuidance } from "../data/public-offer";
import { ActionLink, SectionHeading } from "./ui";

export function BudgetSection() {
  return <section className="section budget-section" id="budgets">
    <SectionHeading eyebrow="Parler du budget" title="Votre budget doit aider à définir la première étape." intro="Vous avez déjà une enveloppe en tête ? Dites-la-nous. Nous regarderons quelle solution existante, quelle première version ou quel montage peut être cohérent."/>
    <div className="budget-grid budget-guidance-grid">{budgetGuidance.map((category, index) => <article className="budget-card" key={category.title}>
      <span>0{index + 1}</span><h3>{category.title}</h3><strong>{category.price}</strong><p>{category.text}</p>
    </article>)}</div>
    <div className="budget-foot"><p>Ces repères sont indicatifs et ne constituent pas un devis. Les fourchettes détaillées restent utilisées pour l’étude et la qualification du projet.</p><ActionLink href="#assistant" className="primary">Parler de mon budget</ActionLink></div>
    <div className="monthly" id="services-mensuels"><div className="monthly-intro"><p className="eyebrow">Et après la mise en service ?</p><h3>Des services mensuels, seulement lorsqu’ils sont utiles.</h3><p>Selon le projet, ils peuvent concerner l’hébergement, les sauvegardes, la maintenance, les API, l’infrastructure, les services connectés ou le support.</p></div><div className="monthly-list">{monthlyServices.map(service => <div key={service.title}><span>{service.title}</span><strong>{service.price}</strong></div>)}</div><small>Le contenu exact est défini dans chaque proposition YVEXOR.</small></div>
  </section>;
}

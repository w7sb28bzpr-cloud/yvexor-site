import { budgetCategories, monthlyServices } from "../data/budget-categories";
import { ActionLink, SectionHeading } from "./ui";

export function BudgetSection() {
  return <section className="section budget-section" id="budgets">
    <SectionHeading eyebrow="Quel budget prévoir ?" title="Des repères clairs avant d’échanger." intro="Choisissez une échelle de départ, pas une liste interminable de fonctionnalités."/>
    <div className="budget-grid">{budgetCategories.map((category, index) => <article className="budget-card" key={category.id}>
      <span>0{index + 1}</span><h3>{category.title}</h3><small>{category.price.startsWith("À") ? "" : "Environ"}</small><strong>{category.price}</strong><p>{category.description}</p>{category.detail && <p className="budget-detail">{category.detail}</p>}
    </article>)}</div>
    <div className="budget-foot"><p>Ordres de grandeur indicatifs. Chaque projet est étudié selon son périmètre. Ces montants ne constituent pas un devis.</p><ActionLink href="#assistant" className="primary">Estimer mon projet</ActionLink></div>
    <div className="monthly" id="services-mensuels"><div className="monthly-intro"><p className="eyebrow">Et après la mise en service ?</p><h3>Des services mensuels, seulement lorsqu’ils sont utiles.</h3><p>Selon le projet, ils peuvent concerner l’hébergement, les sauvegardes, la maintenance, les API, l’infrastructure, les services connectés ou le support.</p></div><div className="monthly-list">{monthlyServices.map(service => <div key={service.title}><span>{service.title}</span><strong>{service.price}</strong></div>)}</div><small>Le contenu exact est défini dans chaque proposition YVEXOR.</small></div>
  </section>;
}

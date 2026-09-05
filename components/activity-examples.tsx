import { ActionLink, ChevronIcon, SectionHeading } from "./ui";

const activities = ["Commerce", "Restaurant", "Garage", "Hôtel", "Immobilier", "Entreprise"];

export function ActivityExamples() {
  return <section className="section sectors" id="exemples">
    <SectionHeading eyebrow="Quelques exemples" title="Des problèmes très différents. Une même approche." intro="Ces exemples ne représentent qu’une partie des projets que YVEXOR peut étudier."/>
    <div className="sector-rail">{activities.map((activity, index) => <a href="#assistant" key={activity}><span>0{index + 1}</span><h3>{activity}</h3><ChevronIcon/></a>)}</div>
    <div className="other-activity"><div><span>07</span><h3>Autre métier / autre idée</h3><p>Votre activité n’est pas affichée ? Ce n’est pas une limite. Artisan, cabinet, association, transport, salle de sport, indépendant ou startup : expliquez-nous simplement votre besoin.</p></div><ActionLink href="#assistant" className="primary">Décrire mon besoin</ActionLink></div>
  </section>;
}

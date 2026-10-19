import { ActivityExamples } from "../components/activity-examples";
import { VisualHero } from "../components/visual-hero";

import { BudgetSection } from "../components/budget-section";
import { ConnectedEcosystem } from "../components/connected-ecosystem";

import { MobileTabBar, SiteHeader } from "../components/navigation";
import { SectionHeading } from "../components/ui";
import { SolutionDoors } from "../components/solution-doors";
import { HistoryTeaser } from "../components/history-link";
import { EquipmentSelection } from "../components/equipment-selection";
import { PageData } from "../components/structured-data";
import { SiteFooter } from "../components/site-footer";
import { homeTitle, homeDescription } from "../lib/seo";

const reasons = [
  ["01", "Une relation directe", "Vous parlez à des personnes qui comprennent réellement le projet et ses contraintes."],
  ["02", "Une base existante quand elle peut servir", "Nous ne recréons pas obligatoirement ce qui existe déjà."],
  ["03", "Des outils qui communiquent", "Une donnée peut alimenter plusieurs fonctions lorsque les modules sont reliés."],
  ["04", "Un projet adapté à votre réalité", "Besoin, budget, temps disponible et priorités sont pris en compte."],
  ["05", "Une solution qui évolue", "Commencez par l’essentiel puis ajoutez ce qui devient utile."],
  ["06", "Une tarification transparente", "Des repères publics, puis une proposition adaptée au périmètre."],
];

export default async function Home() {

  return <><PageData path="/" title={homeTitle} description={homeDescription}/><SiteHeader/><main id="contenu">
    <VisualHero/>

    <SolutionDoors/>
    <EquipmentSelection/>

    <ConnectedEcosystem/>

    <BudgetSection/>

    <ActivityExamples/>

    <section className="section why" id="yvexor"><SectionHeading eyebrow="Pourquoi YVEXOR" title="Le besoin d’abord. La technologie ensuite."/><div className="reason-list">{reasons.map(reason => <article key={reason[0]}><span>{reason[0]}</span><div><h3>{reason[1]}</h3><p>{reason[2]}</p></div></article>)}</div><HistoryTeaser/></section>

    <section className="final-cta" id="projet"><p className="eyebrow">Préparons votre installation</p><h2>Parlons de ce qui<br/>se passe chez vous.</h2><p>Votre activité, vos équipements et ce que vous voulez améliorer. C’est le point de départ d’une proposition utile.</p><div className="hero-actions"><a className="action-link primary" href="/contact/">Parler de mon projet →</a><a href="https://client.yvexor.com/" className="phone">Accéder à mon espace client ↗</a></div></section>
  </main><SiteFooter/><MobileTabBar/></>;
}

import { ActivityExamples } from "../components/activity-examples";
import { AssistantYvexor } from "../components/assistant-yvexor";
import { BrandLogo } from "../components/brand-logo";
import { BudgetSection } from "../components/budget-section";
import { MobileTabBar, SiteHeader } from "../components/navigation";
import { ActionLink, ChevronIcon, SectionHeading } from "../components/ui";
import { collaborationModels, existingSolutions, solutionOffers } from "../data/public-offer";

const doors = ["Caisse & Commerce", "Restauration", "Site & présence web", "Application métier", "IA & automatisation", "Systèmes connectés", "Autre besoin"];

const reasons = [
  ["01", "Une solution existe peut-être déjà", "Nous ne développons pas obligatoirement tout depuis zéro."],
  ["02", "Construit autour du besoin", "Nous partons du fonctionnement réel de l’entreprise, pas d’une technologie à vendre."],
  ["03", "Une solution qui peut évoluer", "Commencez avec ce qui est utile aujourd’hui, puis ajoutez ce qui devient pertinent."],
  ["04", "Plusieurs technologies, un projet", "Logiciel, web, mobile, IA, automatisation et systèmes connectés peuvent communiquer."],
  ["05", "Plusieurs modèles possibles", "Projet, abonnement, licence ou développement progressif sont étudiés selon le dossier."],
];

export default function Home() {
  return <><SiteHeader/><main>
    <section className="hero hero-with-assistant" id="accueil"><div className="hero-orbit" aria-hidden="true"><i/><i/><i/></div><div className="hero-content"><BrandLogo compact/><p className="eyebrow">YVEXOR · La solution la plus cohérente</p><h1>Votre problème métier.<br/><span>Construisons la solution.</span></h1><p className="hero-copy">Une solution existe peut-être déjà. Sinon, nous pouvons l’adapter ou construire la vôtre.</p></div><div className="hero-assistant" id="assistant"><AssistantYvexor/></div></section>

    <section className="section direct-doors" id="solutions"><SectionHeading eyebrow="Vous savez déjà ce qu’il vous faut ?" title="Accédez directement à votre point de départ." intro="Ces accès sont des portes d’entrée, jamais des limites."/><div className="door-grid">{doors.map((door, index) => <a href={index < 2 ? `#${index === 0 ? "caisse-commerce" : "restauration"}` : "#sur-mesure"} key={door} className={index === 0 ? "door-featured" : ""}><span>0{index + 1}</span><strong>{door}</strong><ChevronIcon/></a>)}</div></section>

    <section className="section existing-section" id="solutions-yvexor"><SectionHeading eyebrow="Solutions YVEXOR disponibles" title="Une base existe peut-être déjà pour votre besoin." intro="Avant de concevoir un nouveau logiciel, nous regardons ce qui peut être configuré, adapté ou complété."/><div className="existing-grid">{existingSolutions.map((solution, index) => <article className={`existing-card ${index === 0 ? "existing-primary" : ""}`} id={solution.id === "yvexor-pos" ? "caisse-commerce" : "restauration"} key={solution.id}><div className="solution-labels"><span>Solution disponible</span>{solution.adaptable && <span>Adaptable</span>}</div><h3>{solution.name}</h3>{"startingPriceLabel" in solution && <strong className="existing-price">{solution.startingPriceLabel}</strong>}<p className="existing-lead">{solution.problem}</p><p>{solution.clients}</p><div className="capability-cloud" aria-label={`Fonctions possibles de ${solution.name}`}>{solution.capabilities.map(capability => <span key={capability}>{capability}</span>)}</div><p className="configuration-note">Selon la configuration, la solution peut intégrer ces fonctions. Le matériel, les options et la mise en service sont étudiés selon le besoin.</p><div className="model-line">{solution.models.map(model => <span key={model}>{model}</span>)}</div><ActionLink href="#assistant" className={index === 0 ? "primary" : "secondary"}>{solution.cta}</ActionLink></article>)}</div></section>

    <section className="section problem-bridge"><p className="eyebrow">Vous avez plutôt un problème à résoudre ?</p><h2>Nous ne vendons pas une technologie.<br/>Nous cherchons ce qui résout réellement votre problème.</h2><p>Expliquez votre fonctionnement actuel, les personnes concernées et ce que vous aimeriez améliorer. YVEXOR cherchera d’abord une base existante, puis l’adaptation ou la première solution utile.</p><ActionLink href="#assistant" className="primary">Trouver ma solution</ActionLink></section>

    <section className="section custom-section" id="sur-mesure"><SectionHeading eyebrow="Solutions & possibilités" title="Une porte d’entrée claire, puis la solution adaptée." intro="Le prix mensuel correspond à un point de départ. La configuration, la mise en service et le développement spécifique dépendent du besoin réel."/><div className="custom-grid offer-grid">{solutionOffers.map((offer, index) => <a href={offer.id === "CAISSE_COMMERCE" ? "#caisse-commerce" : "#assistant"} key={offer.id} className={offer.id === "CAISSE_COMMERCE" ? "offer-featured" : ""}><span className="solution-type">{offer.status}</span><b>0{index + 1}</b><h3>{offer.name}</h3><strong className="starting-price">{offer.startingPriceLabel}</strong><p>{offer.description}</p><small>{offer.pricingDisclaimer}</small><em>{offer.cta} →</em></a>)}</div><div className="pricing-clarifier"><div><span>A</span><strong>Abonnement / utilisation</strong><p>Le prix mensuel donne accès à une formule ou à des services définis.</p></div><div><span>B</span><strong>Mise en service / configuration</strong><p>Elle dépend du besoin, des intégrations et du matériel éventuel.</p></div><div><span>C</span><strong>Développement spécifique</strong><p>Il est étudié sur devis lorsque la fonction n’existe pas encore.</p></div></div><div className="limited-budget"><h3>Votre budget est limité ? Dites-nous votre priorité.</h3><p>Nous regarderons s’il est possible de commencer avec une solution existante ou une première version plus simple.</p><ActionLink href="#assistant" className="secondary">Parler de mon budget</ActionLink></div></section>

    <BudgetSection/>

    <section className="section scale-section" id="echelle"><SectionHeading eyebrow="Commencer à la bonne échelle" title="Un budget serré ne doit pas conduire à une mauvaise solution." intro="Nous étudions d’abord une base existante, un périmètre réduit ou une première version. La flexibilité ne diminue ni la qualité ni la valeur du travail."/><div className="scale-flow">{["Besoin", "Base existante", "Périmètre utile", "MVP", "Évolution"].map((step, index) => <div key={step}><span>0{index + 1}</span><strong>{step}</strong>{index < 4 && <i aria-hidden="true">→</i>}</div>)}</div><div className="scale-example"><span>Principe</span><p>Si le projet complet dépasse l’enveloppe, nous réduisons le périmètre : les fonctions essentielles d’abord, les fonctions secondaires ensuite.</p></div></section>

    <section className="section collaboration"><div><p className="eyebrow">Comment pouvons-nous construire le projet ?</p><h2>Le bon modèle dépend de la solution.</h2><p>Accessible ne veut pas dire bas de gamme. Flexible ne veut pas dire gratuit. Chaque formule fait l’objet d’une proposition YVEXOR.</p></div><div className="collaboration-models">{collaborationModels.map(model => <span key={model}>{model}</span>)}</div></section>

    <ActivityExamples/>

    <section className="section why" id="yvexor"><SectionHeading eyebrow="Pourquoi YVEXOR" title="Le besoin d’abord. La technologie ensuite."/><div className="reason-list">{reasons.map(reason => <article key={reason[0]}><span>{reason[0]}</span><div><h3>{reason[1]}</h3><p>{reason[2]}</p></div></article>)}</div></section>

    <section className="final-cta" id="projet"><div className="final-glow" aria-hidden="true"/><BrandLogo compact/><h2>Vous avez un besoin. Cherchons la solution la plus cohérente.</h2><p>Solution disponible, adaptation, première version ou projet entièrement nouveau : commençons par comprendre ce qui doit être résolu.</p><div className="hero-actions"><ActionLink href="#assistant" className="primary">Décrire mon besoin</ActionLink><a className="phone" href="tel:+33756913013">Parler à YVEXOR · 07 56 91 30 13</a></div></section>
  </main><footer className="footer"><BrandLogo/><p>Solutions digitales, logiciels métier, IA et systèmes connectés.</p><div><a href="/mentions-legales/">Mentions légales</a><a href="/politique-confidentialite/">Confidentialité</a></div><small>© 2026 YVEXOR</small></footer><MobileTabBar/></>;
}

import { ActivityExamples } from "../components/activity-examples";
import { AssistantYvexor } from "../components/assistant-yvexor";
import { BrandLogo } from "../components/brand-logo";
import { BudgetSection } from "../components/budget-section";
import { MobileTabBar, SiteHeader } from "../components/navigation";
import { ActionLink, ChevronIcon, SectionHeading } from "../components/ui";
import { collaborationModels, customCapabilities, existingSolutions } from "../data/public-offer";

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

    <section className="section existing-section" id="solutions-yvexor"><SectionHeading eyebrow="Solutions YVEXOR disponibles" title="Une base existe peut-être déjà pour votre besoin." intro="Avant de concevoir un nouveau logiciel, nous regardons ce qui peut être configuré, adapté ou complété."/><div className="existing-grid">{existingSolutions.map((solution, index) => <article className={`existing-card ${index === 0 ? "existing-primary" : ""}`} id={solution.id === "yvexor-pos" ? "caisse-commerce" : "restauration"} key={solution.id}><div className="solution-labels"><span>Solution disponible</span>{solution.adaptable && <span>Adaptable</span>}</div><h3>{solution.name}</h3><p className="existing-lead">{solution.problem}</p><p>{solution.clients}</p><div className="capability-cloud" aria-label={`Fonctions possibles de ${solution.name}`}>{solution.capabilities.map(capability => <span key={capability}>{capability}</span>)}</div><p className="configuration-note">Selon la configuration, la solution peut intégrer ces fonctions. Le matériel, les options et la mise en service sont étudiés selon le besoin.</p><div className="model-line">{solution.models.map(model => <span key={model}>{model}</span>)}</div><ActionLink href="#assistant" className={index === 0 ? "primary" : "secondary"}>{solution.cta}</ActionLink></article>)}</div></section>

    <section className="section problem-bridge"><p className="eyebrow">Vous avez plutôt un problème à résoudre ?</p><h2>Nous ne vendons pas une technologie.<br/>Nous cherchons ce qui résout réellement votre problème.</h2><p>Expliquez votre fonctionnement actuel, les personnes concernées et ce que vous aimeriez améliorer. YVEXOR cherchera d’abord une base existante, puis l’adaptation ou la première solution utile.</p><ActionLink href="#assistant" className="primary">Trouver ma solution</ActionLink></section>

    <section className="section custom-section" id="sur-mesure"><SectionHeading eyebrow="Possibilités sur mesure" title="Lorsque la solution n’existe pas encore, construisons la bonne première version." intro="Une fonction spécifique, une application métier, une plateforme ou un système connecté peuvent être développés progressivement."/><div className="custom-grid">{customCapabilities.map((capability, index) => <a href="#assistant" key={capability.name}><span className="solution-type">{capability.status}</span><b>0{index + 1}</b><h3>{capability.name}</h3><p>{capability.text}</p><ChevronIcon/></a>)}</div></section>

    <BudgetSection/>

    <section className="section scale-section" id="echelle"><SectionHeading eyebrow="Commencer à la bonne échelle" title="Un budget serré ne doit pas conduire à une mauvaise solution." intro="Nous étudions d’abord une base existante, un périmètre réduit ou une première version. La flexibilité ne diminue ni la qualité ni la valeur du travail."/><div className="scale-flow">{["Besoin", "Base existante", "Périmètre utile", "MVP", "Évolution"].map((step, index) => <div key={step}><span>0{index + 1}</span><strong>{step}</strong>{index < 4 && <i aria-hidden="true">→</i>}</div>)}</div><div className="scale-example"><span>Principe</span><p>Si le projet complet dépasse l’enveloppe, nous réduisons le périmètre : les fonctions essentielles d’abord, les fonctions secondaires ensuite.</p></div></section>

    <section className="section collaboration"><div><p className="eyebrow">Comment pouvons-nous construire le projet ?</p><h2>Le bon modèle dépend de la solution.</h2><p>Accessible ne veut pas dire bas de gamme. Flexible ne veut pas dire gratuit. Chaque formule fait l’objet d’une proposition YVEXOR.</p></div><div className="collaboration-models">{collaborationModels.map(model => <span key={model}>{model}</span>)}</div></section>

    <ActivityExamples/>

    <section className="section why" id="yvexor"><SectionHeading eyebrow="Pourquoi YVEXOR" title="Le besoin d’abord. La technologie ensuite."/><div className="reason-list">{reasons.map(reason => <article key={reason[0]}><span>{reason[0]}</span><div><h3>{reason[1]}</h3><p>{reason[2]}</p></div></article>)}</div></section>

    <section className="final-cta" id="projet"><div className="final-glow" aria-hidden="true"/><BrandLogo compact/><h2>Vous avez un besoin. Cherchons la solution la plus cohérente.</h2><p>Solution disponible, adaptation, première version ou projet entièrement nouveau : commençons par comprendre ce qui doit être résolu.</p><div className="hero-actions"><ActionLink href="#assistant" className="primary">Décrire mon besoin</ActionLink><a className="phone" href="tel:+33756913013">Parler à YVEXOR · 07 56 91 30 13</a></div></section>
  </main><footer className="footer"><BrandLogo/><p>Solutions digitales, logiciels métier, IA et systèmes connectés.</p><div><a href="/mentions-legales/">Mentions légales</a><a href="/politique-confidentialite/">Confidentialité</a></div><small>© 2026 YVEXOR</small></footer><MobileTabBar/></>;
}

import { ActivityExamples } from "../components/activity-examples";
import { AssistantYvexor } from "../components/assistant-yvexor";
import { BrandLogo } from "../components/brand-logo";
import { BudgetSection } from "../components/budget-section";
import { ConnectedEcosystem } from "../components/connected-ecosystem";
import { FuturisticEffects } from "../components/futuristic-effects";
import { MobileTabBar, SiteHeader } from "../components/navigation";
import { SmsLink } from "../components/sms-link";
import { ActionLink, ChevronIcon, SectionHeading } from "../components/ui";
import { collaborationModels, existingSolutions, solutionOffers } from "../data/public-offer";

const doors = ["Caisse & Commerce", "Restauration", "Site & présence web", "Application métier", "IA & automatisation", "Systèmes connectés", "Autre besoin"];

const reasons = [
  ["01", "Une relation directe", "Vous parlez à des personnes qui comprennent réellement le projet et ses contraintes."],
  ["02", "Une base existante quand elle peut servir", "Nous ne recréons pas obligatoirement ce qui existe déjà."],
  ["03", "Des outils qui communiquent", "Une donnée peut alimenter plusieurs fonctions lorsque les modules sont reliés."],
  ["04", "Un projet adapté à votre réalité", "Besoin, budget, temps disponible et priorités sont pris en compte."],
  ["05", "Une solution qui évolue", "Commencez par l’essentiel puis ajoutez ce qui devient utile."],
  ["06", "Une tarification transparente", "Des repères publics, puis une proposition adaptée au périmètre."],
];

export default function Home() {
  return <><FuturisticEffects/><SiteHeader/><main>
    <section className="hero hero-with-assistant" id="accueil"><div className="hero-orbit" aria-hidden="true"><i/><i/><i/></div><div className="hero-content"><div className="hero-logo-pulse"><BrandLogo compact/></div><p className="eyebrow">YVEXOR · La solution la plus cohérente</p><h1><span className="hero-line-one">Votre problème métier.</span><br/><span className="hero-line-two">Construisons la solution.</span></h1><p className="hero-copy">Une solution existe peut-être déjà. Sinon, nous pouvons l’adapter ou construire la vôtre.</p></div><div className="hero-assistant" id="assistant"><AssistantYvexor/></div></section>

    <section className="section direct-doors" id="solutions"><SectionHeading eyebrow="Vous savez déjà ce qu’il vous faut ?" title="Accédez directement à votre point de départ." intro="Ces accès sont des portes d’entrée, jamais des limites."/><div className="door-grid">{doors.map((door, index) => <a href={index < 2 ? `#${index === 0 ? "caisse-commerce" : "restauration"}` : "#sur-mesure"} key={door} className={index === 0 ? "door-featured" : ""}><span>0{index + 1}</span><strong>{door}</strong><ChevronIcon/></a>)}</div></section>

    <section className="section existing-section" id="solutions-yvexor"><SectionHeading eyebrow="Solutions YVEXOR disponibles" title="Une base existe peut-être déjà pour votre besoin." intro="Avant de concevoir un nouveau logiciel, nous regardons ce qui peut être configuré, adapté ou complété."/><div className="existing-grid">{existingSolutions.map((solution, index) => <article className={`existing-card ${index === 0 ? "existing-primary" : ""}`} id={solution.id === "yvexor-pos" ? "caisse-commerce" : "restauration"} key={solution.id}><div className="solution-labels"><span>Solution disponible</span>{solution.adaptable && <span>Adaptable</span>}</div><h3>{solution.name}</h3>{"startingPriceLabel" in solution && <strong className="existing-price">{solution.startingPriceLabel}</strong>}<p className="existing-lead">{solution.problem}</p><p>{solution.clients}</p><div className="capability-cloud" aria-label={`Fonctions possibles de ${solution.name}`}>{solution.capabilities.map(capability => <span key={capability}>{capability}</span>)}</div><p className="configuration-note">Selon la configuration, la solution peut intégrer ces fonctions. Le matériel, les options et la mise en service sont étudiés selon le besoin.</p><div className="model-line">{solution.models.map(model => <span key={model}>{model}</span>)}</div><ActionLink href="#assistant" className={index === 0 ? "primary" : "secondary"}>{solution.cta}</ActionLink></article>)}</div></section>

    <section className="section problem-bridge"><p className="eyebrow">Chez YVEXOR, un projet commence par une conversation</p><h2>Pas un numéro de dossier.<br/>Une relation directe, sans usine à gaz.</h2><p>Vous nous expliquez votre activité, votre quotidien, vos contraintes et votre budget. Notre objectif n’est pas de vendre la solution la plus chère, mais celle qui a du sens pour votre activité.</p><ActionLink href="#assistant" className="primary">Parler à YVEXOR</ActionLink></section>

    <section className="section custom-section" id="sur-mesure"><SectionHeading eyebrow="Solutions & possibilités" title="Une porte d’entrée claire, puis la solution adaptée." intro="Le prix mensuel correspond à un point de départ. La configuration, la mise en service et le développement spécifique dépendent du besoin réel."/><div className="custom-grid offer-grid">{solutionOffers.map((offer, index) => <a href={offer.id === "CAISSE_COMMERCE" ? "#caisse-commerce" : "#assistant"} key={offer.id} className={offer.id === "CAISSE_COMMERCE" ? "offer-featured" : ""}><span className="solution-type">{offer.status}</span><b>0{index + 1}</b><h3>{offer.name}</h3><strong className="starting-price">{offer.startingPriceLabel}</strong><p>{offer.description}</p><small>{offer.pricingDisclaimer}</small><em>{offer.cta} →</em></a>)}</div><p className="swipe-hint" aria-hidden="true">Glisser pour découvrir <span>••••••</span></p><div className="pricing-clarifier"><div><span>A</span><strong>Abonnement / utilisation</strong><p>Le prix mensuel donne accès à une formule ou à des services définis.</p></div><div><span>B</span><strong>Mise en service / configuration</strong><p>Elle dépend du besoin, des intégrations et du matériel éventuel.</p></div><div><span>C</span><strong>Développement spécifique</strong><p>Il est étudié sur devis lorsque la fonction n’existe pas encore.</p></div></div><div className="limited-budget"><h3>Votre budget est limité ? Dites-nous votre priorité.</h3><p>Nous regarderons s’il est possible de commencer avec une solution existante ou une première version plus simple.</p><ActionLink href="#assistant" className="secondary">Parler de mon budget</ActionLink></div></section>

    <ConnectedEcosystem/>

    <BudgetSection/>

    <section className="section scale-section" id="echelle"><SectionHeading eyebrow="Commencer à la bonne échelle" title="Un budget serré ne doit pas conduire à une mauvaise solution." intro="Nous étudions d’abord une base existante, un périmètre réduit ou une première version. La flexibilité ne diminue ni la qualité ni la valeur du travail."/><div className="scale-flow">{["Besoin", "Base existante", "Périmètre utile", "MVP", "Évolution"].map((step, index) => <div key={step}><span>0{index + 1}</span><strong>{step}</strong>{index < 4 && <i aria-hidden="true">→</i>}</div>)}</div><div className="scale-example"><span>Principe</span><p>Si le projet complet dépasse l’enveloppe, nous réduisons le périmètre : les fonctions essentielles d’abord, les fonctions secondaires ensuite.</p></div></section>

    <section className="section collaboration"><div><p className="eyebrow">Un projet doit aussi avoir du sens financièrement</p><h2>Le bon modèle dépend de la solution.</h2><p>Vous avez déjà un budget en tête ? Dites-le-nous. Si tout ne peut pas être réalisé immédiatement, nous pouvons commencer par l’essentiel et faire évoluer la solution. Un budget plus petit implique un périmètre initial plus petit.</p></div><div className="collaboration-models">{collaborationModels.map(model => <span key={model}>{model}</span>)}</div><aside className="compare-offer"><div><span>Vous avez déjà un devis ?</span><h3>Envoyez-le-nous.</h3><p>S’il correspond à un périmètre réellement comparable, nous regarderons ce que YVEXOR peut proposer. Prix, fonctionnalités, matériel, services et conditions seront comparés à périmètre égal.</p><small>Tout alignement ou valeur complémentaire reste soumis à validation YVEXOR.</small></div><ActionLink href="mailto:contact@yvexor.com?subject=Comparaison%20de%20mon%20offre" className="secondary">Comparer mon offre</ActionLink></aside></section>

    <ActivityExamples/>

    <section className="section why" id="yvexor"><SectionHeading eyebrow="Pourquoi YVEXOR" title="Le besoin d’abord. La technologie ensuite."/><div className="reason-list">{reasons.map(reason => <article key={reason[0]}><span>{reason[0]}</span><div><h3>{reason[1]}</h3><p>{reason[2]}</p></div></article>)}</div></section>

    <section className="final-cta" id="projet"><div className="final-glow" aria-hidden="true"/><BrandLogo compact/><h2>Vous avez un besoin. Cherchons la solution la plus cohérente.</h2><p>Solution disponible, adaptation, première version ou projet entièrement nouveau : commençons par comprendre ce qui doit être résolu.</p><div className="hero-actions"><ActionLink href="#assistant" className="primary">Décrire mon besoin</ActionLink><SmsLink className="phone">Parler à YVEXOR · 07 56 91 30 13</SmsLink></div></section>
  </main><footer className="footer"><BrandLogo/><p>Solutions digitales, logiciels métier, IA et systèmes connectés.</p><div><a href="/mentions-legales/">Mentions légales</a><a href="/politique-confidentialite/">Confidentialité</a></div><small>© 2026 YVEXOR</small></footer><MobileTabBar/></>;
}

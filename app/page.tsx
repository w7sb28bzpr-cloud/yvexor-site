import { ActivityExamples } from "../components/activity-examples";
import { VisualHero } from "../components/visual-hero";
import { BrandLogo } from "../components/brand-logo";
import { BudgetSection } from "../components/budget-section";
import { ConnectedEcosystem } from "../components/connected-ecosystem";
import { FuturisticEffects } from "../components/futuristic-effects";
import { MobileTabBar, SiteHeader } from "../components/navigation";
import { SmsLink } from "../components/sms-link";
import { ActionLink, SectionHeading } from "../components/ui";
import { SolutionDoors } from "../components/solution-doors";
import { collaborationModels, solutionOffers } from "../data/public-offer";

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
    <VisualHero/>

    <SolutionDoors/>


    <section className="section problem-bridge"><p className="eyebrow">Chez YVEXOR, un projet commence par une conversation</p><h2>Pas un numéro de dossier.<br/>Une relation directe, sans usine à gaz.</h2><p>Vous nous expliquez votre activité, votre quotidien, vos contraintes et votre budget. Notre objectif n’est pas de vendre la solution la plus chère, mais celle qui a du sens pour votre activité.</p><ActionLink href="/contact/" className="primary">Parler à YVEXOR</ActionLink></section>

    <section className="section custom-section" id="sur-mesure"><SectionHeading eyebrow="Solutions & possibilités" title="Une porte d’entrée claire, puis la solution adaptée." intro="Le prix mensuel correspond à un point de départ. La configuration, la mise en service et le développement spécifique dépendent du besoin réel."/><div className="custom-grid offer-grid">{solutionOffers.map((offer, index) => <a href={offer.id === "CAISSE_COMMERCE" ? "/logiciel-caisse-marseille/" : "/contact/"} key={offer.id} className={offer.id === "CAISSE_COMMERCE" ? "offer-featured" : ""}><span className="solution-type">{offer.status}</span><b>0{index + 1}</b><h3>{offer.name}</h3><strong className="starting-price">{offer.startingPriceLabel}</strong><p>{offer.description}</p><small>{offer.pricingDisclaimer}</small><em>{offer.cta} →</em></a>)}</div><p className="swipe-hint" aria-hidden="true">Glisser pour découvrir <span>••••••</span></p><div className="pricing-clarifier"><div><span>A</span><strong>Abonnement / utilisation</strong><p>Le prix mensuel donne accès à une formule ou à des services définis.</p></div><div><span>B</span><strong>Mise en service / configuration</strong><p>Elle dépend du besoin, des intégrations et du matériel éventuel.</p></div><div><span>C</span><strong>Développement spécifique</strong><p>Il est étudié sur devis lorsque la fonction n’existe pas encore.</p></div></div><div className="limited-budget"><h3>Votre budget est limité ? Dites-nous votre priorité.</h3><p>Nous regarderons s’il est possible de commencer avec une solution existante ou une première version plus simple.</p><ActionLink href="/contact/" className="secondary">Parler de mon budget</ActionLink></div></section>

    <ConnectedEcosystem/>

    <BudgetSection/>

    <section className="section scale-section" id="echelle"><SectionHeading eyebrow="Commencer à la bonne échelle" title="Un budget serré ne doit pas conduire à une mauvaise solution." intro="Nous étudions d’abord une base existante, un périmètre réduit ou une première version. La flexibilité ne diminue ni la qualité ni la valeur du travail."/><div className="scale-flow">{["Besoin", "Base existante", "Périmètre utile", "MVP", "Évolution"].map((step, index) => <div key={step}><span>0{index + 1}</span><strong>{step}</strong>{index < 4 && <i aria-hidden="true">→</i>}</div>)}</div><div className="scale-example"><span>Principe</span><p>Si le projet complet dépasse l’enveloppe, nous réduisons le périmètre : les fonctions essentielles d’abord, les fonctions secondaires ensuite.</p></div></section>

    <section className="section collaboration"><div><p className="eyebrow">Un projet doit aussi avoir du sens financièrement</p><h2>Le bon modèle dépend de la solution.</h2><p>Vous avez déjà un budget en tête ? Dites-le-nous. Si tout ne peut pas être réalisé immédiatement, nous pouvons commencer par l’essentiel et faire évoluer la solution. Un budget plus petit implique un périmètre initial plus petit.</p></div><div className="collaboration-models">{collaborationModels.map(model => <span key={model}>{model}</span>)}</div><aside className="compare-offer"><div><span>Vous avez déjà un devis ?</span><h3>Envoyez-le-nous.</h3><p>S’il correspond à un périmètre réellement comparable, nous regarderons ce que YVEXOR peut proposer. Prix, fonctionnalités, matériel, services et conditions seront comparés à périmètre égal.</p><small>Tout alignement ou valeur complémentaire reste soumis à validation YVEXOR.</small></div><ActionLink href="mailto:contact@yvexor.com?subject=Comparaison%20de%20mon%20offre" className="secondary">Comparer mon offre</ActionLink></aside></section>

    <ActivityExamples/>

    <section className="section why" id="yvexor"><SectionHeading eyebrow="Pourquoi YVEXOR" title="Le besoin d’abord. La technologie ensuite."/><div className="reason-list">{reasons.map(reason => <article key={reason[0]}><span>{reason[0]}</span><div><h3>{reason[1]}</h3><p>{reason[2]}</p></div></article>)}</div></section>

    <section className="final-cta horizon-banner" id="projet"><img className="horizon-photo" src="/yvexor-alpine-horizon-1600-v1.webp" srcSet="/yvexor-alpine-horizon-768-v1.webp 768w, /yvexor-alpine-horizon-1600-v1.webp 1600w" sizes="100vw" width="1600" height="576" alt="" loading="lazy" decoding="async"/><p className="eyebrow">Des idées qui vont plus loin</p><h2>De votre idée<br/>à <span>de nouvelles possibilités.</span></h2><p>Solution disponible, adaptation ou projet entièrement nouveau : commençons par comprendre votre besoin, puis construisons la première étape utile.</p><div className="hero-actions"><SmsLink className="action-link primary">Discuter de mon projet →</SmsLink><a href="/contact/" className="phone">Tous les moyens de contact</a></div></section>
  </main><footer className="footer"><BrandLogo/><p>Solutions digitales, logiciels métier, IA et systèmes connectés.</p><div><a href="/mentions-legales/">Mentions légales</a><a href="/politique-confidentialite/">Confidentialité</a></div><small>© 2026 YVEXOR</small></footer><MobileTabBar/></>;
}

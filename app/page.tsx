import { ActivityExamples } from "../components/activity-examples";
import { AssistantYvexor } from "../components/assistant-yvexor";
import { BrandLogo } from "../components/brand-logo";
import { BudgetSection } from "../components/budget-section";
import { MobileTabBar, SiteHeader } from "../components/navigation";
import { ActionLink, ChevronIcon, SectionHeading } from "../components/ui";

const solutions = [
  { title: "Applications métier", problem: "Vos informations sont dispersées ?", answer: "Réunissons l’activité dans un outil adapté à vos équipes." },
  { title: "Web & mobile", problem: "Votre parcours digital vous limite ?", answer: "Créons une expérience rapide et accessible à vos clients." },
  { title: "IA & automatisation", problem: "Des tâches répétitives ralentissent le travail ?", answer: "Automatisons ce qui peut l’être, avec les validations utiles." },
  { title: "Commerce & restauration", problem: "Commandes, clients et gestion communiquent mal ?", answer: "Construisons un fonctionnement plus cohérent." },
  { title: "Systèmes connectés", problem: "Vos équipements produisent des données difficiles à exploiter ?", answer: "Relions matériel, alertes et pilotage." },
  { title: "Plateformes & sur mesure", problem: "Votre idée n’existe dans aucune solution actuelle ?", answer: "Étudions une première version réaliste pour la rendre concrète." },
];

const reasons = [
  ["01", "Construit autour de votre métier", "Nous partons du fonctionnement réel, même si nous n’avons jamais rencontré votre activité auparavant."],
  ["02", "Une solution cohérente", "Les informations circulent dans un même système plutôt qu’entre des outils isolés."],
  ["03", "Plusieurs technologies, un projet", "Logiciel, mobile, IA et systèmes connectés peuvent fonctionner ensemble lorsque c’est pertinent."],
  ["04", "Une évolution maîtrisée", "La solution grandit avec les usages, les retours et les besoins confirmés."],
];

export default function Home() {
  return <><SiteHeader/><main>
    <section className="hero hero-with-assistant" id="accueil"><div className="hero-orbit" aria-hidden="true"><i/><i/><i/></div><div className="hero-content"><BrandLogo compact/><p className="eyebrow">YVEXOR · Solutions digitales sur mesure</p><h1>Votre problème métier.<br/><span>Construisons la solution.</span></h1><p className="hero-copy">Quel que soit votre métier, commencez par nous expliquer ce qui vous ralentit, ce que vous aimeriez améliorer ou l’idée que vous souhaitez construire.</p></div><div className="hero-assistant" id="assistant"><AssistantYvexor/></div></section>
    <BudgetSection/>
    <section className="section solutions" id="solutions"><SectionHeading eyebrow="Ce que YVEXOR peut construire" title="Une solution peut prendre plusieurs formes." intro="Votre projet n’a pas besoin d’entrer parfaitement dans l’une de ces familles. Le problème et les usages déterminent la bonne réponse."/><div className="solution-grid">{solutions.map((solution, index) => <a className="solution-card" href="#assistant" key={solution.title}><span>0{index + 1}</span><h3>{solution.title}</h3><p className="problem">{solution.problem}</p><p>{solution.answer}</p><ChevronIcon/></a>)}</div></section>
    <section className="section scale-section" id="echelle"><SectionHeading eyebrow="Commencer à la bonne échelle" title="Pas besoin de construire la version finale dès le premier jour." intro="Une grande idée peut commencer avec quelques fonctions essentielles, un nombre limité d’utilisateurs ou une première zone géographique."/><div className="scale-flow">{["Idée", "Première version", "MVP", "Premiers utilisateurs", "Évolution"].map((step, index) => <div key={step}><span>0{index + 1}</span><strong>{step}</strong>{index < 4 && <i aria-hidden="true">→</i>}</div>)}</div><div className="scale-example"><span>Exemple</span><p>Une marketplace nationale peut commencer avec une seule catégorie, une seule zone et un parcours essentiel.</p></div></section>
    <ActivityExamples/>
    <section className="section why" id="yvexor"><SectionHeading eyebrow="Pourquoi YVEXOR" title="Comprendre avant de construire." intro="Un boulanger, un artisan, un cabinet ou une startup n’ont pas le même contexte. Notre méthode commence pourtant toujours par le même point : ce qui doit réellement être amélioré."/><div className="reason-list">{reasons.map(reason => <article key={reason[0]}><span>{reason[0]}</span><div><h3>{reason[1]}</h3><p>{reason[2]}</p></div></article>)}</div></section>
    <section className="section collaboration"><div><p className="eyebrow">Modes de collaboration</p><h2>Une proposition adaptée au projet.</h2></div><div><p>Selon le besoin, YVEXOR peut proposer un projet ponctuel, une licence ou des services mensuels. Un paiement échelonné peut être étudié et reste soumis à validation.</p><ActionLink href="#services-mensuels" className="secondary">Voir les repères mensuels</ActionLink></div></section>
    <section className="final-cta" id="projet"><div className="final-glow" aria-hidden="true"/><BrandLogo compact/><h2>Votre métier n’est pas dans une case ? Votre idée non plus ?</h2><p>Décrivez ce qui vous ralentit ou ce que vous souhaitez construire. YVEXOR étudiera la première solution adaptée.</p><div className="hero-actions"><ActionLink href="#assistant" className="primary">Décrire mon besoin</ActionLink><a className="phone" href="tel:+33756913013">07 56 91 30 13</a></div></section>
  </main><footer className="footer"><BrandLogo/><p>Applications, logiciels, IA et systèmes connectés sur mesure.</p><div><a href="/mentions-legales/">Mentions légales</a><a href="/politique-confidentialite/">Confidentialité</a></div><small>© 2026 YVEXOR</small></footer><MobileTabBar/></>;
}

import { ActivityExamples } from "../components/activity-examples";
import { VisualHero } from "../components/visual-hero";
import { BrandLogo } from "../components/brand-logo";
import { BudgetSection } from "../components/budget-section";
import { ConnectedEcosystem } from "../components/connected-ecosystem";
import { FuturisticEffects } from "../components/futuristic-effects";
import { MobileTabBar, SiteHeader } from "../components/navigation";
import { SmsLink } from "../components/sms-link";
import { SectionHeading } from "../components/ui";
import { SolutionDoors } from "../components/solution-doors";

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




    <ConnectedEcosystem/>

    <BudgetSection/>



    <ActivityExamples/>

    <section className="section why" id="yvexor"><SectionHeading eyebrow="Pourquoi YVEXOR" title="Le besoin d’abord. La technologie ensuite."/><div className="reason-list">{reasons.map(reason => <article key={reason[0]}><span>{reason[0]}</span><div><h3>{reason[1]}</h3><p>{reason[2]}</p></div></article>)}</div></section>

    <section className="final-cta horizon-banner" id="projet"><img className="horizon-photo" src="/yvexor-alpine-horizon-1600-v1.webp" srcSet="/yvexor-alpine-horizon-768-v1.webp 768w, /yvexor-alpine-horizon-1600-v1.webp 1600w" sizes="100vw" width="1600" height="576" alt="" loading="lazy" decoding="async"/><p className="eyebrow">Des idées qui vont plus loin</p><h2>De votre idée<br/>à <span>de nouvelles possibilités.</span></h2><p>Solution disponible, adaptation ou projet entièrement nouveau : commençons par comprendre votre besoin, puis construisons la première étape utile.</p><div className="hero-actions"><SmsLink className="action-link primary">Discuter de mon projet →</SmsLink><a href="/contact/" className="phone">Tous les moyens de contact</a></div></section>
  </main><footer className="footer"><BrandLogo/><p>Solutions digitales, logiciels métier, IA et systèmes connectés.</p><div><a href="/mentions-legales/">Mentions légales</a><a href="/politique-confidentialite/">Confidentialité</a></div><small>© 2026 YVEXOR</small></footer><MobileTabBar/></>;
}

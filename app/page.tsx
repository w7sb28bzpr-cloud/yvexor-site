import {VisualHero} from "../components/visual-hero";
import {ProjectMethod} from "../components/project-method";
import {SolutionDoors} from "../components/solution-doors";
import {AvailableSolutions} from "../components/available-solutions";
import {BudgetSection} from "../components/budget-section";
import {ActivityExamples} from "../components/activity-examples";
import {SiteHeader,MobileTabBar} from "../components/navigation";
import {SiteFooter} from "../components/site-footer";
import {PageData} from "../components/structured-data";
import {homeTitle,homeDescription} from "../lib/seo";
export default function Home(){return <><PageData path="/" title={homeTitle} description={homeDescription}/><SiteHeader/><main id="contenu"><VisualHero/><ProjectMethod/><SolutionDoors/><AvailableSolutions/><BudgetSection/><ActivityExamples/><section className="final-cta" id="projet"><span id="yvexor"/><span id="materiel"/><p className="eyebrow">Petit ou grand projet</p><h2>Expliquez-nous ce que<br/>vous voulez améliorer.</h2><p>Une idée, un problème ou une envie. Nous verrons ensemble ce qu’il est possible de construire.</p><div className="hero-actions"><a className="action-link primary" href="/contact/">Parler de mon projet →</a><a className="phone" href="/histoire/">Découvrir YVEXOR ↗</a></div></section></main><SiteFooter/><MobileTabBar/></>}

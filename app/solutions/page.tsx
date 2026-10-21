import { SiteHeader } from "../../components/navigation";
import { SiteFooter } from "../../components/site-footer";
import { PageData } from "../../components/structured-data";
import { pageMetadata } from "../../lib/seo";
import { v2Solutions } from "../../data/v2-solutions";

const title = "Solutions YVEXOR | Du logiciel au terrain";
const description = "Explorez les domaines dans lesquels YVEXOR conçoit, développe, connecte et déploie des solutions adaptées à des besoins concrets.";
export const metadata = pageMetadata("/solutions/", title, description);

export default function SolutionsPage() {
  return <><PageData path="/solutions/" title={title} description={description} /><SiteHeader />
    <main id="contenu" className="v2-directory">
      <div className="v2-directory__intro" data-reveal><p className="v2-directory__eyebrow">Solutions YVEXOR</p><h1>Partons de ce que tu veux faire.</h1><p>Un logiciel, un lieu, un équipement ou plusieurs systèmes à relier : voici quelques portes d’entrée. Si ton idée ne rentre dans aucune, parle-nous quand même.</p></div>
      <div className="v2-directory__list">{v2Solutions.map((solution, index) => <a id={index === 2 ? "commerce" : index === 5 ? "infrastructure" : undefined} key={solution.title} href={index === 2 ? "/caisse/" : index === 5 ? "/contact/" : solution.href} data-reveal style={{ "--reveal-delay": `${Math.min(index, 5) * 55}ms` } as React.CSSProperties}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{solution.title}</h2><p>{solution.cue}</p></div><span aria-hidden="true">↗</span></a>)}</div>
      <p className="v2-directory__note">Une billetterie, des bornes et un contrôle d’accès peuvent former un même projet à étudier. <a href="/caisse/">La gamme Caisses</a> est une base distincte déjà présentée sur le site.</p>
      <p className="v2-directory__note">L’hébergement et l’infrastructure se définissent avec le projet : <a href="/contact/">explique-nous ce qu’il faut faire fonctionner</a>.</p>
    </main><SiteFooter /></>;
}

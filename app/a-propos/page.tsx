import { SiteHeader } from "../../components/navigation";
import { SiteFooter } from "../../components/site-footer";
import { PageData } from "../../components/structured-data";
import { pageMetadata } from "../../lib/seo";

const title = "À propos de YVEXOR | Notre approche";
const description = "YVEXOR part d’un besoin réel, cherche la solution adaptée, puis la construit du logiciel au terrain.";
export const metadata = pageMetadata("/a-propos/", title, description);

export default function AProposPage() {
  return <><PageData path="/a-propos/" title={title} description={description} type="AboutPage" /><SiteHeader />
    <main id="contenu" className="v2-directory v2-directory--short">
      <div className="v2-directory__intro" data-reveal><p className="v2-directory__eyebrow">L’approche YVEXOR</p><h1>Le besoin d’abord.<br />La technologie ensuite.</h1><p>Tu nous expliques ce qui se passe. On cherche ce qui peut aider, on adapte l’existant quand il suffit et on construit ce qui manque. Du logiciel jusqu’au terrain, si nécessaire.</p><a className="v2-text-link" href="/histoire/">Découvrir l’histoire et la vision YVEXOR ↗</a></div>
    </main><SiteFooter /></>;
}

import {PageData} from "../../components/structured-data";
import {SiteHeader} from "../../components/navigation";
import {SiteFooter} from "../../components/site-footer";
import {ShopCatalogue} from "../../components/shop-catalogue";
import {pageMetadata} from "../../lib/seo";
import s from "../../components/boutique.module.css";
export const metadata=pageMetadata("/boutique/","Boutique matériel professionnel | YVEXOR","Bornes, caisses POS, affichage, imprimantes, accessoires et robotique : découvrez les équipements YVEXOR et leurs caractéristiques.");
export default function Boutique(){return <><PageData path="/boutique/" title="Boutique matériel professionnel | YVEXOR" description="Les équipements professionnels YVEXOR pour votre activité." type="CollectionPage"/><SiteHeader root/><main id="contenu" className={s.page}><nav className={s.breadcrumb} aria-label="Fil d’Ariane"><a href="/">Accueil</a><span>/</span><span aria-current="page">Boutique</span></nav><div className={s.intro}><div><p className={s.eyebrow}>YVEXOR / MATÉRIEL PROFESSIONNEL</p><h1>Le matériel. <span>Votre solution.</span></h1><p>Équipez votre activité, du comptoir à la cuisine.<br/>Des équipements sélectionnés pour vos projets YVEXOR.</p></div><a href="/materiel/">Accéder aux articles de mon espace client ↗</a></div><ShopCatalogue/></main><SiteFooter/></>;}

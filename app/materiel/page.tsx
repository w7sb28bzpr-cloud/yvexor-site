import type { Metadata } from "next";
import { SiteHeader, MobileTabBar } from "../../components/navigation";
import { MaterialCatalogue } from "../../components/material-catalogue";
import styles from "../../components/material-catalogue.module.css";
import { getCatalogue } from "../../lib/catalogue";
import { pageMetadata } from "../../lib/seo";
import { PageData } from "../../components/structured-data";
import { SiteFooter } from "../../components/site-footer";

const title="Matériel professionnel et écrans tactiles | YVEXOR";
const description="Consultez le matériel YVEXOR, les écrans tactiles, les prix TTC et les disponibilités. Retrouvez la commande et ses conditions dans votre espace client.";
export const metadata:Metadata=pageMetadata("/materiel/",title,description);
export default async function MaterialPage(){const catalogue=await getCatalogue();return <><PageData path="/materiel/" title={title} description={description} type="CollectionPage"/><SiteHeader root/><main id="contenu" className={`section ${styles.page}`}><nav className="seo-breadcrumb" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span aria-hidden="true"> / </span><span aria-current="page">Matériel professionnel</span></nav><p className="eyebrow">MATÉRIEL</p><h1>Matériel professionnel pour vos solutions YVEXOR</h1><p>Consultez les équipements actuellement disponibles. Prix TTC et disponibilité sont actualisés à l’ouverture ; la commande est vérifiée dans votre espace client.</p><MaterialCatalogue initialData={catalogue}/><p>Besoin d’une configuration complète ? Découvrez notre <a href="/logiciel-caisse-marseille/">logiciel de caisse</a> ou <a href="/contact/">demandez une vérification de compatibilité</a>.</p></main><SiteFooter/><MobileTabBar root/></>;}

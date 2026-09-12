import type { Metadata } from "next";
import { SiteHeader, MobileTabBar } from "../../components/navigation";
import { MaterialCatalogue } from "../../components/material-catalogue";
import styles from "../../components/material-catalogue.module.css";

export const metadata:Metadata={title:"Matériel professionnel | YVEXOR",description:"Découvrez le matériel disponible auprès de YVEXOR. Catalogue et prix actualisés, achat depuis votre espace client.",alternates:{canonical:"https://yvexor.com/materiel/"}};
export default function MaterialPage(){return <><SiteHeader root/><main className={`section ${styles.page}`}><p className="eyebrow">MATÉRIEL</p><h1>Le matériel qui complète vos solutions YVEXOR.</h1><p>Écrans, imprimantes, scanners et équipements professionnels disponibles directement auprès de YVEXOR.</p><MaterialCatalogue/></main><MobileTabBar root/></>;}

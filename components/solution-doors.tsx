import s from "./home.module.css";
const categories = [
 ["01", "Logiciels & applications", "Un logiciel métier, une application pour vos clients ou un outil pour vos équipes.", "/applications-metier/"],
 ["02", "IA & automatisation", "Moins de tâches répétitives. Des informations qui circulent entre vos outils.", "/automatisation-entreprise/"],
 ["03", "Systèmes connectés", "Relier le logiciel au matériel : capteurs, bornes, écrans et équipements.", "/systemes-connectes/"]
];
export function SolutionDoors() {
 return <section className={s.solutions} id="creations" aria-labelledby="creations-title"><div className={s.sectionIntro}><p className={s.label}>Ce que nous pouvons créer</p><h2 id="creations-title">La solution part<br/>de votre besoin.</h2><p>Une seule technologie ou plusieurs ensemble. Vous expliquez l’objectif ; nous étudions comment l’atteindre.</p><a className={s.textLink} href="/contact/">Autre chose en tête ? Parlez-nous-en ↗</a></div><div className={s.solutionList}>{categories.map(([number,title,text,href])=><a href={href} key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div><b aria-hidden="true">↗</b></a>)}</div></section>;
}

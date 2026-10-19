import s from "./home.module.css";
const solutions = [
 ["01", "Commerce & caisse", "Encaissement, articles et suivi de votre activité.", "/caisse/"],
 ["02", "Restauration", "Du service à la cuisine, un périmètre adapté à votre établissement.", "/solutions-restaurants/"],
 ["03", "Hôtellerie", "Accueil, équipes et équipements à relier selon vos besoins.", "/solutions-hotels/"],
 ["04", "Votre métier", "Applications, automatisation et développement sur mesure.", "/logiciel-sur-mesure/"]
];
export function SolutionDoors() {
 return <section className={s.solutions} id="solutions" aria-labelledby="solutions-title"><div className={s.sectionIntro}><p className={s.label}>Votre activité, notre point de départ</p><h2 id="solutions-title">Ce qui compte,<br/>c’est votre quotidien.</h2><p>Un comptoir qui tourne. Une équipe qui retrouve l’information. Des outils adaptés au lieu et aux personnes qui les utilisent.</p><a className={s.textLink} href="/contact/">Parlons de votre installation ↗</a></div><div className={s.solutionList}>{solutions.map(([number,title,text,href])=><a href={href} key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div><b aria-hidden="true">↗</b></a>)}</div></section>;
}

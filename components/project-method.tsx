import s from "./home.module.css";
export const projectSteps = [
 ["Vous nous expliquez", "Votre problème, votre idée ou ce que vous souhaitez améliorer."],
 ["Nous cherchons la solution", "Nous étudions les possibilités, vos contraintes et vos moyens."],
 ["Nous concevons", "Nous adaptons l’existant ou construisons les outils nécessaires."],
 ["Nous déployons", "Mise en place, accompagnement et évolutions selon la solution choisie."]
];
export function ProjectMethod(){return <section className={s.method} id="methode"><p className={s.label}>Comment ça marche</p><h2>Vous connaissez votre métier.<br/>Nous cherchons comment vous aider.</h2><ol>{projectSteps.map(([title,text])=><li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ol></section>}

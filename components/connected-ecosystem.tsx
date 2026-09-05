import { SectionHeading } from "./ui";

const modules = ["Site", "Planning", "Caisse", "Mobile", "Stock", "Réservations", "Clients", "IA", "Statistiques"];

const examples = [
  { title: "Restaurant", action: "Un plat est modifié une fois", result: "Lorsque les modules sont connectés, la caisse, le site, la carte et la commande en ligne peuvent utiliser la même information." },
  { title: "Commerce", action: "Un article est vendu en caisse", result: "La vente peut réduire le stock, alimenter les statistiques, mettre à jour l’historique et déclencher une alerte." },
  { title: "Rendez-vous", action: "Un client réserve depuis le site", result: "La réservation peut rejoindre le planning, la fiche client, les confirmations, les rappels et l’historique autorisé." },
];

export function ConnectedEcosystem() {
  return <section className="section ecosystem" id="ecosysteme">
    <SectionHeading eyebrow="Écosystème connecté" title="Une information. Plusieurs usages. Pas de ressaisie inutile." intro="YVEXOR peut concevoir un environnement où les modules concernés partagent les mêmes données. Vos outils peuvent enfin travailler ensemble."/>
    <div className="ecosystem-map" aria-label="Exemple de modules pouvant être reliés"><div className="ecosystem-center"><span>Donnée</span><strong>YVEXOR</strong><small>Source partagée</small></div>{modules.map((module, index) => <span className={`ecosystem-node node-${index + 1}`} key={module}>{module}</span>)}</div>
    <div className="ecosystem-examples">{examples.map(example => <article key={example.title}><span>{example.title}</span><h3>{example.action}</h3><p>{example.result}</p><small>Exemple de fonctionnement possible selon la configuration du projet.</small></article>)}</div>
    <p className="ecosystem-note"><strong>C’est aussi cela, le sur-mesure YVEXOR :</strong> réunir des briques existantes, les connecter, adapter certaines fonctions et développer uniquement ce qui manque.</p>
  </section>;
}

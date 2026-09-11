import { ActionLink, ChevronIcon, SectionHeading } from "./ui";

const activities = ["Commerce", "Restaurant", "Garage", "Hôtel", "Immobilier", "Entreprise"];
const projects = [
  { title: "Lancer une location en libre-service", text: "Trottinettes, vélos ou matériel : application client, réservation, paiement et gestion du parc peuvent être conçus sur mesure.", detail: "Le déverrouillage et le suivi à distance dépendent des équipements et interfaces compatibles." },
  { title: "Créer votre plateforme de services", text: "Mise en relation, réservations, comptes clients et espace professionnel : réunissez les outils nécessaires à votre propre activité.", detail: "Les paiements et intégrations sont définis selon les prestataires retenus." },
  { title: "Construire le logiciel de votre métier", text: "Planning, devis, interventions, stock et notifications : un outil pensé pour votre façon de travailler.", detail: "Nous adaptons une base existante ou développons les fonctions manquantes." },
];

export function ActivityExamples() {
  return <section className="section sectors" id="exemples">
    <SectionHeading eyebrow="Logiciels & applications sur mesure" title="Vous imaginez un service. Nous pouvons en concevoir les outils." intro="Voici des exemples de projets à étudier ensemble, pas des produits déjà disponibles : nous définissons une première version utile, puis ses évolutions."/>
    <div className="bespoke-projects">{projects.map(project => <article key={project.title}><h3>{project.title}</h3><p>{project.text}</p><details><summary>Selon votre projet</summary><p>{project.detail}</p></details><ActionLink href="/contact/" className="secondary">Parler de mon idée</ActionLink></article>)}</div>
    <div className="sector-rail">{activities.map((activity, index) => <a href="/contact/" key={activity}><span>0{index + 1}</span><h3>{activity}</h3><ChevronIcon/></a>)}</div>
    <div className="other-activity"><div><span>07</span><h3>Autre métier / autre idée</h3><p>Votre activité n’est pas affichée ? Ce n’est pas une limite. Artisan, cabinet, association, transport, salle de sport, indépendant ou startup : expliquez-nous simplement votre besoin.</p></div><ActionLink href="/contact/" className="primary">Décrire mon besoin</ActionLink></div>
  </section>;
}

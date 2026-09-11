import { offerDestinations, solutionOffers } from "../data/public-offer";
import { SmsLink } from "./sms-link";

export function CategoryPrice({slug}: {slug:string}) {
  const offer = solutionOffers.find(item => offerDestinations[item.id] === `/${slug}/`);
  if (!offer) return null;
  return <section className="section category-pricing" id="tarifs" aria-labelledby="category-price-title">
    <p className="eyebrow">Budget & formule</p><h2 id="category-price-title">Un point de départ clair.</h2>
    <article className="category-price-card"><span>{offer.name}</span><h3>{offer.startingPriceLabel}</h3><p>{offer.description}</p><p className="category-price-note">{offer.pricingDisclaimer}</p><SmsLink className="action-link primary" message={`Bonjour YVEXOR, je souhaite parler de votre offre ${offer.name}, ${offer.startingPriceLabel.toLowerCase()}. Mon besoin : `}>Étudier mon projet</SmsLink></article>
    <details className="audit-disclosure"><summary>Abonnement et coût du projet</summary><p>Ce repère concerne l’utilisation ou les services de la formule retenue. Il ne couvre pas automatiquement la création complète d’un logiciel sur mesure. Le devis distingue la mise en place, les développements, les coûts tiers et les conditions d’engagement.</p></details>
  </section>;
}

export function WebContent() {
  const possibilities = [
    ["Présenter votre activité", "Vos services, vos réalisations et un contact facile à trouver."],
    ["Recevoir des demandes", "Devis, prises de rendez-vous ou réservations selon votre activité."],
    ["Vendre ou lancer un service", "Boutique, espace client ou parcours en ligne adapté à votre idée."],
  ];
  return <section className="section category-possibilities" id="solutions"><p className="eyebrow">Un site utile à vos clients</p><h2>Que voulez-vous rendre possible ?</h2>
    <div className="category-benefits">{possibilities.map(([title,text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
    <div className="category-reassurance"><h2>Pourquoi le construire avec YVEXOR ?</h2><p>Un interlocuteur direct, un affichage pensé pour le mobile et un site qui peut évoluer avec votre activité.</p><details className="audit-disclosure"><summary>Et vos autres outils ?</summary><p>Les demandes de votre site peuvent être reliées à votre messagerie, votre planning ou vos logiciels, selon les interfaces disponibles. Une application métier sert plutôt à gérer les opérations : équipes, dossiers, stocks ou processus internes.</p><a href="/applications-metier/">Découvrir les applications métier →</a></details></div>
  </section>;
}

export function CommerceBenefits() {
  return <section className="section category-possibilities"><p className="eyebrow">Caisse & Commerce</p><h2>Pourquoi choisir YVEXOR ?</h2><div className="category-benefits">
    <article><h3>Commencer simplement</h3><p>Une caisse centrée sur l’encaissement, puis des fonctions de gestion selon la formule choisie.</p></article>
    <article><h3>Adapter à votre métier</h3><p>Articles, stock ou fidélité : le périmètre est défini avec vous, pas ajouté par défaut.</p></article>
    <article><h3>Un interlocuteur direct</h3><p>Logiciel, matériel et mise en service étudiés ensemble selon vos besoins.</p></article>
  </div><h2 className="category-sector-title">Quel est votre commerce ?</h2><div className="category-sectors">
    <article><img src="/solution-commerce-v1.webp" width="960" height="640" alt="" loading="lazy"/><div><h3>Boutiques & commerces de proximité</h3><p>Vente au comptoir, articles et suivi du stock selon la formule.</p><SmsLink message="Bonjour YVEXOR, je cherche une caisse pour ma boutique ou mon commerce de proximité. Mon besoin : ">Étudier ma caisse →</SmsLink></div></article>
    <article><img src="/solution-restaurant-v1.webp" width="960" height="1440" alt="" loading="lazy"/><div><h3>Restauration & vente à emporter</h3><p>Service, commandes et cuisine : découvrez le parcours dédié.</p><a href="/solutions-restaurants/">Voir la restauration →</a></div></article>
  </div><p className="category-price-note">Visuels d’illustration. Votre activité n’est pas citée ? Nous étudions aussi votre besoin.</p></section>;
}

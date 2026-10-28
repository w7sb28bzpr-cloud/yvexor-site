import type { TechIconId } from "./trades";

/** The six doors of /solutions/: what the client wants to do. Each opens /solutions/domaines/<slug>/. */
export type SolutionRubric = {
  slug: string;
  name: string;
  short: string;
  lead: string;
  icon: TechIconId;
  /** Home-screen tone of the icon tile. */
  tone: "blue" | "pink" | "teal" | "orange" | "green" | "violet";
  services: { title: string; text: string; more: string }[];
  /** Catalogue offer pages that give example prices for this rubric. */
  offers?: string[];
  /** An existing, more detailed page. */
  deeper?: { label: string; href: string };
};

export const solutionRubrics: SolutionRubric[] = [
  {
    slug: "logiciels-applications",
    name: "Logiciels & applications",
    short: "L’outil qui manque à votre activité, sur ordinateur et téléphone.",
    lead: "Une application interne, un espace client, un planning, un tableau de bord : on construit le logiciel qui colle à votre façon de travailler.",
    icon: "app",
    tone: "blue",
    services: [
      { title: "Application métier", text: "Vos clients, vos dossiers, vos équipes au même endroit.", more: "Plannings, suivi des interventions, devis, stocks, tableaux de bord : on part de votre organisation réelle, pas d’un logiciel générique." },
      { title: "Espace client", text: "Vos clients suivent leurs demandes et leurs documents.", more: "Commandes, rendez-vous, devis à signer, factures, messages : un espace à vos couleurs, accessible sur téléphone." },
      { title: "Application mobile", text: "Votre propre application, à votre nom.", more: "Réservations, fidélité, notifications, commande : une application publiée sur les stores ou utilisable directement dans le navigateur." },
      { title: "Plateforme ou projet à lancer", text: "Une idée à tester ? On commence petit.", more: "On construit d’abord une première version utile, on la met entre les mains de vrais utilisateurs, puis on la fait grandir." },
    ],
    deeper: { label: "Le logiciel sur mesure en détail", href: "/logiciel-sur-mesure/" },
  },
  {
    slug: "ia-automatisation",
    name: "IA & automatisation",
    short: "Les tâches répétitives se font toutes seules.",
    lead: "Relances, tri des demandes, lecture de factures, réponses aux clients : on automatise ce qui vous prend du temps, avec l’IA YVEXOR, Claude ou ChatGPT.",
    icon: "ai",
    tone: "pink",
    services: [
      { title: "Assistant IA", text: "Il répond, résume et prépare pour vous.", more: "Branché sur vos documents et vos outils : réponses aux clients, comptes rendus, préparation de devis. Avec l’IA YVEXOR ou connecté à Claude ou ChatGPT." },
      { title: "Automatisations", text: "Vos outils se parlent sans copier-coller.", more: "Une commande crée la facture, un formulaire arrive dans le bon dossier, un rappel part tout seul. Fini la double saisie." },
      { title: "Lecture de documents", text: "Factures et bons lus et classés automatiquement.", more: "Montants, fournisseurs, dates : l’IA extrait les informations et les range dans vos outils, vous n’avez plus qu’à vérifier." },
      { title: "Rapports et prévisions", text: "Vos chiffres expliqués simplement.", more: "Ventes, marges, tendances : des rapports clairs envoyés automatiquement, et des prévisions pour anticiper." },
    ],
    deeper: { label: "L’automatisation en détail", href: "/automatisation-entreprise/" },
  },
  {
    slug: "domotique-objets-connectes",
    name: "Domotique & objets connectés",
    short: "Lumière, chauffage, capteurs : tout se pilote à distance.",
    lead: "On relie vos équipements, même anciens, à un seul système : vous voyez tout, vous êtes prévenu, et beaucoup de choses se font toutes seules.",
    icon: "home",
    tone: "teal",
    services: [
      { title: "Domotique", text: "Lumière, chauffage, volets et prises automatiques.", more: "Scénarios d’arrivée, de fermeture ou de nuit, programmation selon l’occupation, suivi de la consommation. Pour un hôtel, un bureau, un gîte ou une maison." },
      { title: "Capteurs & alertes", text: "Température, humidité, fuite, présence, niveau.", more: "Dès qu’une valeur sort de la normale, la bonne personne reçoit un message. Tout est enregistré pour la traçabilité." },
      { title: "Équipements anciens", text: "On connecte aussi ce qui ne l’est pas.", more: "Une machine, une chambre froide, une pompe ou un éclairage sans connexion peut être équipé pour remonter ses informations et se piloter." },
      { title: "Écrans & affichage", text: "Les bonnes informations au bon endroit.", more: "Affichage dynamique à l’accueil, écrans en cuisine ou en atelier, tableaux de bord de suivi en temps réel." },
    ],
    deeper: { label: "Les systèmes connectés en détail", href: "/systemes-connectes/" },
  },
  {
    slug: "acces-parkings-securite",
    name: "Accès, parkings & sécurité",
    short: "Badges, barrières, portes et caméras reliés entre eux.",
    lead: "Qui entre, quand et par où : on gère vos accès, vos parkings et vos caméras dans un même système, pilotable depuis votre téléphone.",
    icon: "badge",
    tone: "orange",
    services: [
      { title: "Contrôle d’accès", text: "Badge, code, QR ou téléphone.", more: "Droits par personne et par horaire, ouverture à distance, historique des passages, accès temporaires pour un client, un livreur ou un prestataire." },
      { title: "Parkings & barrières", text: "Par badge, code ou plaque d’immatriculation.", more: "Ouverture automatique, réservation et suivi des places libres, paiement en ligne, alertes en cas de blocage." },
      { title: "Vidéo & caméras", text: "Être prévenu au bon moment.", more: "Une détection déclenche une alerte, une lumière ou un enregistrement. Vidéo des terrains de sport et analyse par IA." },
      { title: "Billetterie & portiques", text: "Pour les parcs, zoos, salles et événements.", more: "Billets avec QR code, portiques et tourniquets connectés, comptage des visiteurs en temps réel." },
    ],
    offers: ["tennis-padel"],
    deeper: { label: "Les systèmes connectés en détail", href: "/systemes-connectes/" },
  },
  {
    slug: "caisses-paiement",
    name: "Caisses & paiement",
    short: "Encaisser, commander et suivre vos ventes.",
    lead: "Caisse certifiée NF525, commande au comptoir, sur mobile ou sur borne, écrans en cuisine et paiement : pour les commerces, snacks, restaurants et salons.",
    icon: "screen",
    tone: "green",
    services: [
      { title: "Caisse certifiée", text: "Sur votre tablette, votre ordinateur ou nos packs.", more: "Ventes, tickets, clôtures, stocks et statistiques. Gardez votre matériel compatible ou équipez-vous avec un pack tablette ou fixe." },
      { title: "Commande mobile & QR", text: "Vos clients commandent et paient sur leur téléphone.", more: "Une seule carte pour la caisse, le QR et le site. La commande arrive directement en caisse et en cuisine." },
      { title: "Bornes & écrans cuisine", text: "Moins d’attente, moins d’erreurs.", more: "Bornes de commande, écrans en cuisine et au bar, suivi de préparation et serveur prévenu quand le plat est prêt." },
      { title: "Gestion & pilotage", text: "Stocks, marges et chiffres à distance.", more: "Inventaire, fournisseurs, fidélité, rapports pour votre comptable, et tout ça consultable depuis votre téléphone." },
    ],
    offers: ["commerces", "snacks", "restaurants", "coiffure-beaute"],
    deeper: { label: "Configurer ma caisse", href: "/caisse/" },
  },
  {
    slug: "sites-internet",
    name: "Sites internet",
    short: "Être trouvé, présenter votre activité, vendre en ligne.",
    lead: "Un site clair à votre image, relié à vos outils : réservations, commandes ou boutique en ligne si vous en avez besoin.",
    icon: "globe",
    tone: "violet",
    services: [
      { title: "Site vitrine", text: "Présenter votre activité, vos horaires, vos contacts.", more: "Un site rapide, lisible sur téléphone, que vous pouvez faire évoluer. Bien référencé pour être trouvé près de chez vous." },
      { title: "Réservation & prise de contact", text: "Les demandes arrivent directement chez vous.", more: "Formulaires, prise de rendez-vous, réservation de tables, de chambres ou de terrains, reliées à vos outils." },
      { title: "Boutique en ligne", text: "Vendre vos produits 24 h/24.", more: "Catalogue, paiement, suivi des commandes, stock relié à votre caisse." },
      { title: "Hébergement & suivi", text: "On s’occupe de la technique.", more: "Hébergement, sécurité, sauvegardes et mises à jour : votre site reste en ligne et à jour." },
    ],
    deeper: { label: "La présence web en détail", href: "/site-presence-web/" },
  },
];

export const solutionRubricBySlug = Object.fromEntries(solutionRubrics.map((rubric) => [rubric.slug, rubric])) as Record<string, SolutionRubric>;

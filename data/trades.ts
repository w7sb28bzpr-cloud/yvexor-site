/** What YVEXOR connects, whatever the trade. Each icon id is drawn in app/solutions/tech-icon.tsx. */
export type Technology = { id: string; icon: TechIconId; name: string; short: string; more: string };
export type TechIconId = "home" | "badge" | "barrier" | "camera" | "sensor" | "ai" | "screen" | "app";

export const technologies: Technology[] = [
  { id: "domotique", icon: "home", name: "Domotique", short: "Lumière, chauffage, volets et prises pilotés à distance.", more: "Scénarios automatiques (arrivée, fermeture, nuit), programmation selon l’occupation, suivi de la consommation. Chez vous, dans un hôtel, un bureau ou un gîte." },
  { id: "acces", icon: "badge", name: "Contrôle d’accès", short: "Badge, code, QR ou téléphone pour ouvrir les bonnes portes.", more: "Droits par personne et par horaire, ouverture à distance, historique des passages, accès temporaires pour un client, un livreur ou un prestataire." },
  { id: "parking", icon: "barrier", name: "Parkings & barrières", short: "Barrières, places et paiement, avec ou sans ticket.", more: "Ouverture par badge, code ou plaque d’immatriculation, réservation et suivi des places libres, paiement en ligne, alertes en cas de blocage." },
  { id: "video", icon: "camera", name: "Vidéo & caméras", short: "Voir ce qui se passe, être prévenu quand il le faut.", more: "Caméras reliées au reste du système : une détection déclenche une alerte, une lumière ou un enregistrement. Vidéo des terrains de sport et analyse par IA." },
  { id: "capteurs", icon: "sensor", name: "Capteurs & alertes", short: "Température, humidité, fuite, présence, niveau.", more: "On équipe même les appareils anciens. Dès qu’une valeur sort de la normale, la bonne personne reçoit un message, et tout est enregistré pour la traçabilité." },
  { id: "ia", icon: "ai", name: "IA & automatisation", short: "Les tâches répétitives se font toutes seules.", more: "Relances, tri des demandes, lecture de documents, réponses aux clients, rapports. Avec l’IA YVEXOR, ou connectée à Claude ou ChatGPT." },
  { id: "bornes", icon: "screen", name: "Bornes, écrans & paiement", short: "Commande, affichage et encaissement sur place.", more: "Bornes de commande, écrans en cuisine ou à l’accueil, affichage dynamique, caisse certifiée et paiement intégré." },
  { id: "logiciel", icon: "app", name: "Logiciels & applications", short: "Le logiciel qui relie tout, sur ordinateur et téléphone.", more: "Applications web et mobiles, espaces clients, tableaux de bord, sites internet. Tout ce qui est connecté remonte au même endroit." },
];

/** Every trade YVEXOR can serve, shown on /solutions/: one line, then "Lire plus". Not an exhaustive list. */
export type Trade = {
  id: string;
  name: string;
  short: string;
  more: string;
  /** Catalogue offer page, when the trade has one. */
  offer?: string;
};

export const trades: Trade[] = [
  { id: "hotel", name: "Hôtels & hébergements", short: "Réservations, accueil, chambres et services reliés.", more: "Planning des chambres et du ménage, arrivée autonome avec code ou badge, messages aux clients avant le séjour, suivi du remplissage. On peut aussi relier vos serrures, votre éclairage ou votre chauffage pour piloter l’établissement à distance." },
  { id: "restaurant", name: "Restaurants & bars", short: "Salle, cuisine, bar et gestion dans un seul système.", more: "Caisse, commandes en salle sur téléphone, écrans en cuisine, réservations, planning et suivi des marges. L’IA lit vos factures fournisseurs et vous aide à anticiper.", offer: "restaurants" },
  { id: "snack", name: "Snacks & vente à emporter", short: "Comptoir, QR code, mobile ou borne : tout arrive en cuisine.", more: "Une seule carte pour la caisse, le QR et le site. Commande et paiement sur mobile, affichage cuisine, stocks et chiffres consultables depuis votre téléphone.", offer: "snacks" },
  { id: "commerce", name: "Commerces & boutiques", short: "Encaisser, suivre le stock et vendre aussi en ligne.", more: "Caisse certifiée, codes-barres, inventaire, fidélité et site internet. Pesée reliée à la caisse, suivi des dates de péremption ou boutique en ligne selon votre activité.", offer: "commerces" },
  { id: "beauty", name: "Coiffure, beauté & bien-être", short: "Agenda, rappels, encaissement et vente de produits.", more: "Réservation en ligne jour et nuit, rappels par SMS, acomptes, cartes cadeaux et boutique en ligne. Un espace de réservation à vos couleurs, voire votre propre application.", offer: "coiffure-beaute" },
  { id: "sport", name: "Clubs & salles de sport", short: "Réservations, membres, vidéo des terrains et accès.", more: "Tennis, padel, fitness ou multisport : vidéo des matchs, analyse par IA, réservation des terrains, abonnements, éclairage et ouverture des portes à distance.", offer: "tennis-padel" },
  { id: "garage", name: "Garages & ateliers", short: "Rendez-vous, devis, suivi des réparations et clients prévenus.", more: "Planning de l’atelier, historique des véhicules, devis envoyés en un clic, message automatique quand la voiture est prête, suivi des pièces commandées." },
  { id: "craft", name: "Artisans & bâtiment", short: "Devis sur le chantier, planning des équipes et suivi des interventions.", more: "Devis et photos depuis le téléphone, planning partagé, comptes rendus d’intervention, relances automatiques. Pour un électricien, un plombier, un peintre ou une entreprise générale." },
  { id: "office", name: "Cabinets & professions libérales", short: "Rendez-vous en ligne, rappels, documents et suivi des dossiers.", more: "Prise de rendez-vous, rappels automatiques, partage sécurisé de documents, tri des demandes par l’IA. Pour les avocats, comptables, architectes, thérapeutes et autres cabinets." },
  { id: "realestate", name: "Immobilier & location", short: "Biens, visites, locataires et suivi des demandes.", more: "Fiches des biens, prise de rendez-vous de visite, échanges avec les locataires, remise des clés par boîte connectée ou code, alertes en cas de fuite ou de panne." },
  { id: "transport", name: "Transport & logistique", short: "Tournées, livraisons et suivi des véhicules.", more: "Planification des tournées, preuve de livraison sur téléphone, suivi de flotte en temps réel, alertes d’entretien et clients prévenus de l’heure d’arrivée." },
  { id: "association", name: "Associations & événements", short: "Adhésions, billetterie, bénévoles et communication.", more: "Inscriptions et cotisations en ligne, billetterie avec QR code, planning des bénévoles, envoi de messages aux membres et suivi des dons." },
  { id: "industry", name: "Agriculture, industrie & production", short: "Capteurs, alertes et suivi de vos équipements.", more: "Température, humidité, niveau d’une cuve ou état d’une machine : on connecte vos équipements, même anciens, et vous êtes prévenu dès qu’il faut agir. Traçabilité et rapports automatiques." },
  { id: "leisure", name: "Zoos, parcs & loisirs", short: "Billetterie, portiques, comptage des visiteurs et capteurs.", more: "Billets avec QR code, portiques et tourniquets connectés, comptage en temps réel, écrans d’information, application de visite. Des capteurs surveillent la température ou l’eau des enclos et des bassins, et vous alertent." },
  { id: "camping", name: "Campings & résidences de vacances", short: "Barrière, réservations, bornes et hébergements connectés.", more: "Barrière par code ou plaque d’immatriculation, réservations en ligne, bornes électriques, mobil-homes et chalets avec chauffage, éclairage et serrure pilotés à distance entre deux séjours." },
  { id: "building", name: "Copropriétés, bureaux & parkings", short: "Badges, interphone, parking, éclairage et chauffage automatiques.", more: "Contrôle d’accès par badge, code ou téléphone, interphone vidéo, places de parking et barrières, salles de réunion à réserver, éclairage et chauffage qui s’adaptent à la présence." },
  { id: "public", name: "Collectivités, écoles & équipements", short: "Accès aux bâtiments, salles à réserver et éclairage programmé.", more: "Accès aux gymnases et salles municipales, réservation par les associations, éclairage des terrains programmé, affichage d’informations et suivi de la consommation d’énergie." },
  { id: "business", name: "PME, startups & projets", short: "Outils internes, plateformes et premières versions à tester.", more: "Une application interne, un portail client, une plateforme à lancer ou un assistant IA branché sur vos outils. On commence par une première version utile, puis on la fait grandir." },
];

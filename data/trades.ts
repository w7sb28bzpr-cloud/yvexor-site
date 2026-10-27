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
  { id: "business", name: "PME, startups & projets", short: "Outils internes, plateformes et premières versions à tester.", more: "Une application interne, un portail client, une plateforme à lancer ou un assistant IA branché sur vos outils. On commence par une première version utile, puis on la fait grandir." },
];

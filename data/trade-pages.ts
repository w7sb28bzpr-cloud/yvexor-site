import type { Trade } from "./trades";

/** A trade that deserves its own page (/solutions/metiers/<id>/): everything we can do, then the featured offer. */
export type TradePage = {
  id: string;
  title: string;
  lead: string;
  services: { title: string; text: string; more: string }[];
  /** Activities covered, shown as tags. */
  scope: string[];
  /** Technology that does not exist yet: we build it. */
  invent: { title: string; text: string };
  featured?: { offer: string; title: string; text: string };
};

export const tradePages: TradePage[] = [
  {
    id: "sport",
    title: "Clubs & salles de sport",
    lead: "Tennis, padel, foot, basket, fitness, piscine… On équipe et on connecte tous les sports. Et si la technologie dont vous avez besoin n’existe pas encore, on la construit.",
    services: [
      { title: "Vidéo des terrains", text: "Chaque match filmé, revu sur le téléphone.", more: "Caméras fixes par terrain, replays disponibles pour les joueurs, extraits partagés sur les réseaux du club. Pour les raquettes comme pour le foot à 5 ou le basket." },
      { title: "Analyse par IA", text: "Statistiques, trajectoires et meilleurs moments.", more: "Suivi de balle, zones de jeu, déplacements des joueurs, nombre d’échanges, séquences à revoir créées automatiquement. Utile aux joueurs comme aux entraîneurs." },
      { title: "Réservation & paiement", text: "Terrains, cours et créneaux réservés en ligne.", more: "Planning en temps réel, paiement à la réservation, tarifs membres et visiteurs, cours collectifs, liste d’attente et rappels automatiques." },
      { title: "Accès & éclairage", text: "La porte et la lumière suivent la réservation.", more: "Ouverture par QR code, badge ou téléphone, éclairage allumé seulement pendant le créneau réservé, accès payant à la lumière, historique des passages." },
      { title: "Scores & écrans", text: "Tableaux de score et affichage du club.", more: "Scores connectés sur le terrain, écrans à l’accueil avec planning et résultats, gestion des tournois et classements en direct." },
      { title: "Membres & application du club", text: "Abonnements, actualités et notifications.", more: "Une application à vos couleurs : adhésions, cartes de membre, actualités, messages aux joueurs, organisation des matchs et des tournois." },
      { title: "Accueil, bar & boutique", text: "Une caisse pour tout ce qui se vend au club.", more: "Encaissement à l’accueil, au snack et à la boutique, relié aux réservations et aux comptes des membres." },
      { title: "Capteurs & entretien", text: "Arrosage, piscine, chauffage et consommation.", more: "Température et qualité de l’eau des bassins, arrosage des terrains en gazon, chauffage des vestiaires, suivi de l’énergie : vous êtes prévenu dès qu’il faut agir." },
    ],
    scope: ["Tennis", "Padel", "Foot à 5 & city-stades", "Basket", "Squash & badminton", "Golf", "Fitness & musculation", "Piscine", "Escalade", "Arts martiaux", "Équitation", "Multisport"],
    invent: { title: "Une idée qui n’existe nulle part ?", text: "Un capteur pour votre discipline, un écran sur mesure, un objet connecté que personne ne vend : on le conçoit avec vous, de l’électronique au logiciel, jusqu’à l’installation." },
    featured: { offer: "tennis-padel", title: "Notre offre phare : tennis & padel", text: "La vidéo connectée pour les clubs, avec des forfaits pour tout le club ou un abonnement par terrain. La même solution s’adapte au foot à 5, au basket et aux autres terrains, sur devis." },
  },
];

export const tradePageById = Object.fromEntries(tradePages.map((page) => [page.id, page])) as Record<string, TradePage>;

/** Where a trade card leads: its own page, else its catalogue offer, else its domain. */
export function tradeHref(trade: Pick<Trade, "id" | "offer" | "rubric">) {
  if (tradePageById[trade.id]) return `/solutions/metiers/${trade.id}/`;
  if (trade.offer) return `/solutions/offres/${trade.offer}/`;
  return `/solutions/domaines/${trade.rubric}/`;
}

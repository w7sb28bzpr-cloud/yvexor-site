import type { SolutionClusterId } from "./content-types";

export type SolutionCluster = {
  id: SolutionClusterId;
  label: string;
  description: string;
};

export const solutionClusters: SolutionCluster[] = [
  { id: "logiciel-ia", label: "Logiciel & IA", description: "Logiciels métier, intelligence artificielle et automatisations utiles." },
  { id: "commerce-paiement", label: "Commerce & paiement", description: "Caisse, réservation, billetterie, paiement et accueil." },
  { id: "connecte-terrain", label: "Connecté & terrain", description: "Objets, lieux et équipements reliés aux outils numériques." },
  { id: "digital-infrastructure", label: "Digital & infrastructure", description: "Sites, applications, hébergement et services qui les font fonctionner." },
];

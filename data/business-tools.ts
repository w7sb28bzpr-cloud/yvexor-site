import type { BusinessTool } from "./content-types";

/** Only confirmed, offer-backed tools are available to public views. */
export const businessTools: BusinessTool[] = [
  {
    id: "business-website",
    slug: "site-web",
    name: "Site web",
    shortDescription: "Présenter votre activité et recevoir des demandes.",
    category: "digital",
    icon: "globe",
    solutionIds: ["sites-applications", "hosting-infrastructure"],
    audience: ["Entreprises qui veulent présenter leur activité en ligne"],
    capabilities: ["Présentation, horaires et contact", "Formulaire ou parcours ciblé selon le projet"],
    connections: ["Messagerie ou outils métier selon les interfaces", "Réservation ou catalogue après configuration"],
    evolution: "Le site peut évoluer avec de nouveaux contenus et des fonctions adaptées au projet.",
    canonicalPath: "/site-presence-web/",
    availabilityStatus: "available",
  },
  {
    id: "business-management-app",
    slug: "application-metier",
    name: "Gestion métier",
    shortDescription: "Une application adaptée pour structurer les opérations utiles.",
    category: "gestion",
    icon: "workflow",
    solutionIds: ["management-reservation", "custom-software", "ai-automation"],
    audience: ["Entreprises avec un processus, un planning ou des informations à centraliser"],
    capabilities: ["Application web ou mobile selon le projet", "Planning, réservation, espace client ou tableaux de bord selon le périmètre"],
    connections: ["Outils existants lorsque leurs interfaces le permettent", "Données et processus définis au cadrage"],
    evolution: "Une première version utile peut évoluer au fil des usages et des besoins confirmés.",
    canonicalPath: "/applications-metier/",
    availabilityStatus: "available",
  },
  {
    id: "cash-register",
    slug: "caisse",
    name: "Caisse",
    shortDescription: "Encaisser et suivre les ventes du commerce.",
    category: "commerce",
    icon: "cash-register",
    solutionIds: ["commerce-caisse-ticketing", "connected-systems"],
    audience: ["Commerces", "Boutiques", "Activités avec un point d’encaissement"],
    capabilities: ["Encaissement et tickets", "Suivi des ventes", "Configuration selon l’activité"],
    connections: ["Matériel compatible selon vérification", "Autres outils selon les interfaces disponibles"],
    evolution: "Le périmètre peut évoluer selon les fonctions retenues, le matériel et les besoins de l’activité.",
    canonicalPath: "/logiciel-caisse-marseille/",
    availabilityStatus: "available",
  },
];

export const businessToolById = Object.fromEntries(businessTools.map((tool) => [tool.id, tool]));

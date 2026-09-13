import caisseCatalogue from "./caisses.json";
const caisseStart=caisseCatalogue.plans[0].monthly;
export const offerDestinations: Record<string, string> = { SITE_WEB: "/site-presence-web/", CAISSE_COMMERCE: "/caisse/", IA_AUTOMATISATION: "/automatisation-entreprise/", APPLICATION_METIER: "/applications-metier/", SYSTEMES_CONNECTES: "/systemes-connectes/", PLATEFORME_SAAS: "/logiciel-sur-mesure/" };

export const existingSolutions = [
  {
    id: "yvexor-pos",
    name: "YVEXOR Caisses",
    status: "Solution YVEXOR disponible",
    problem: "Encaissement, gestion et outils métier dans une solution qui peut évoluer avec votre commerce.",
    clients: "Commerces de proximité, boutiques, alimentation, boulangeries, snacks et activités nécessitant encaissement et gestion.",
    capabilities: ["Encaissement", "Articles et catégories", "TVA", "Historique des ventes", "Stock selon formule et validation", "Pilotage selon périmètre confirmé"],
    adaptable: true,
    startingMonthlyPrice: caisseStart,
    startingPriceLabel: `À partir de ${caisseStart} € HT/mois`,
    setupRequired: true,
    customDevelopmentPossible: true,
    hardwarePossible: true,
    pricingDisclaimer: "Matériel, installation et configuration selon le besoin.",
    models: ["Abonnement", "Licence", "Matériel + logiciel", "Mise en service", "Options", "Configuration personnalisée"],
    cta: "Étudier ma caisse",
  },
  {
    id: "restaurant-os",
    name: "Restauration",
    status: "Base évolutive",
    problem: "Une caisse peut devenir le point de départ d’un environnement réunissant les opérations utiles au restaurant.",
    clients: "Restaurants, snacks, bars et établissements souhaitant faire évoluer leur organisation.",
    capabilities: ["Caisse", "Service", "Cuisine", "Bar", "Stocks", "Réservation", "Planning", "Pilotage"],
    adaptable: true,
    models: ["Configuration", "Modules", "Abonnement", "Licence", "Projet + services"],
    cta: "Étudier mon organisation",
  },
] as const;

export const customCapabilities = [
  { name: "Site & présence web", status: "Adaptable", text: "Présenter, informer, réserver ou capter une demande avec une première solution ciblée." },
  { name: "Application métier", status: "Sur mesure", text: "Centraliser les opérations, les équipes, les clients et les informations utiles." },
  { name: "IA & automatisation", status: "Adaptable ou sur mesure", text: "Réduire les tâches répétitives et mieux faire circuler l’information." },
  { name: "Systèmes connectés", status: "Sur mesure", text: "Relier équipements, données, alertes et interfaces de pilotage." },
  { name: "Plateforme & SaaS", status: "Sur mesure", text: "Tester une idée ambitieuse avec un prototype ou un MVP avant de l’étendre." },
] as const;

export const solutionOffers = [
  { id: "SITE_WEB", name: "Site & présence web", status: "Adaptable", startingMonthlyPrice: 29, startingPriceLabel: "À partir de 29 €/mois", description: "Présence web, hébergement et services selon la formule.", setupRequired: true, customDevelopmentPossible: true, hardwarePossible: false, pricingDisclaimer: "Conception et mise en service selon le projet.", cta: "Découvrir" },
  { id: "CAISSE_COMMERCE", name: "YVEXOR Caisses", status: "Configuration selon votre métier", startingMonthlyPrice: caisseStart, startingPriceLabel: `À partir de ${caisseStart} € HT/mois`, description: "Commerce, snack et beauté : un écosystème commun, configuré selon votre métier.", setupRequired: true, customDevelopmentPossible: true, hardwarePossible: true, pricingDisclaimer: "Essentiel sans stock. Matériel et logiciel séparés ; fonctions et compatibilité confirmées au devis.", cta: "Découvrir les caisses" },
  { id: "IA_AUTOMATISATION", name: "IA & automatisation", status: "Adaptable ou sur mesure", startingMonthlyPrice: 49, startingPriceLabel: "À partir de 49 €/mois", description: "Automatisations, assistants et services intelligents selon le besoin.", setupRequired: true, customDevelopmentPossible: true, hardwarePossible: false, pricingDisclaimer: "Configuration, intégrations et consommation de services tiers selon le projet.", cta: "Étudier mon besoin" },
  { id: "APPLICATION_METIER", name: "Application métier", status: "Base adaptable", startingMonthlyPrice: 69, startingPriceLabel: "À partir de 69 €/mois", description: "Pour une solution basée sur une configuration ou une base YVEXOR adaptée.", setupRequired: true, customDevelopmentPossible: true, hardwarePossible: false, pricingDisclaimer: "Le développement spécifique et la mise en service sont étudiés selon le projet.", cta: "Construire ma première version" },
  { id: "SYSTEMES_CONNECTES", name: "Systèmes connectés", status: "Adaptable ou sur mesure", startingMonthlyPrice: 99, startingPriceLabel: "À partir de 99 €/mois", description: "Pilotage, données, alertes ou services connectés selon le projet.", setupRequired: true, customDevelopmentPossible: true, hardwarePossible: true, pricingDisclaimer: "Matériel et installation chiffrés séparément lorsqu’ils sont nécessaires.", cta: "Présenter mon besoin" },
  { id: "PLATEFORME_SAAS", name: "Plateforme & SaaS", status: "Sur mesure", startingMonthlyPrice: 149, startingPriceLabel: "À partir de 149 €/mois", description: "Services et infrastructure pour une plateforme évolutive.", setupRequired: true, customDevelopmentPossible: true, hardwarePossible: false, pricingDisclaimer: "Conception et développement initial étudiés selon l’ambition du projet.", cta: "Présenter mon idée" },
] as const;

export const budgetGuidance = [
  { title: "Solution existante", price: "À partir de quelques dizaines d’euros par mois", note: "Selon la solution et la configuration.", text: "Caisse, logiciel existant ou services.", badge: "Abonnement, licence ou formule adaptée selon le dossier", cta: "Trouver ma solution" },
  { title: "Premier besoin digital", price: "À partir de quelques centaines d’euros", note: "Conception et mise en service selon le besoin.", text: "Site, formulaire, réservation ou besoin ciblé.", badge: "Première étape adaptée au périmètre", cta: "Décrire mon besoin" },
  { title: "Première solution métier", price: "Souvent quelques milliers d’euros de projet", note: "Pas nécessairement à régler ou à construire en une seule fois.", text: "Application, gestion, espace client ou automatisation selon le périmètre.", badge: "Paiement / développement adaptable selon le dossier", cta: "Voir comment démarrer" },
  { title: "Projet ambitieux", price: "Définissons d’abord la première version", note: "Le budget d’une plateforme complète peut être important.", text: "L’objectif est d’abord de définir la première version réellement utile : prototype, MVP, lancement limité ou développement progressif.", badge: "Tester l’usage avant d’étendre", cta: "Construire mon MVP" },
] as const;

export const collaborationModels = ["Projet", "Abonnement", "Licence", "Projet + services", "Paiement échelonné", "Développement par étapes", "MVP", "Formule adaptée"] as const;

export const examples = ["Boulanger", "Commerçant", "Artisan", "Restaurant", "Hôtel", "Garage", "Transport", "Immobilier", "Association", "Cabinet", "Salle de sport", "PME", "Startup"] as const;

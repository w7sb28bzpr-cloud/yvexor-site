export const existingSolutions = [
  {
    id: "yvexor-pos",
    name: "Caisse & Commerce",
    status: "Solution YVEXOR disponible",
    problem: "Encaissement, gestion et outils métier dans une solution qui peut évoluer avec votre commerce.",
    clients: "Commerces de proximité, boutiques, alimentation, boulangeries, snacks et activités nécessitant encaissement et gestion.",
    capabilities: ["Encaissement", "Articles et catégories", "TVA", "Stock", "Clients et historique", "Fournisseurs", "Promotions et fidélité", "Statistiques", "Multi-utilisateurs", "Multi-sites"],
    adaptable: true,
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

export const budgetGuidance = [
  { title: "Solution existante", price: "À partir de quelques dizaines d’euros par mois", text: "Caisse, logiciel existant ou services selon la solution et la configuration." },
  { title: "Premier besoin digital", price: "À partir de quelques centaines d’euros", text: "Site, formulaire, réservation ou besoin ciblé." },
  { title: "Première solution métier", price: "Souvent quelques milliers d’euros", text: "Application, gestion, espace client ou automatisation selon le périmètre." },
  { title: "Projet ambitieux", price: "Définissons d’abord la première version", text: "Prototype, MVP et développement progressif avant une plateforme complète." },
] as const;

export const collaborationModels = ["Projet", "Abonnement", "Licence", "Projet + services", "Paiement échelonné", "Développement par étapes", "MVP", "Formule adaptée"] as const;

export const examples = ["Boulanger", "Commerçant", "Artisan", "Restaurant", "Hôtel", "Garage", "Transport", "Immobilier", "Association", "Cabinet", "Salle de sport", "PME", "Startup"] as const;

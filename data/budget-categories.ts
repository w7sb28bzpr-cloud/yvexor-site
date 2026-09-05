export const budgetCategories = [
  { id: "SITE_SIMPLE", title: "Site & première solution", price: "500 à 1 500 €", description: "Site vitrine, landing page, formulaire, réservation simple ou premier besoin digital.", detail: undefined },
  { id: "PROJET_DIGITAL", title: "Projet digital / outil métier", price: "1 500 à 4 000 €", description: "Espace client, gestion, réservation, PWA ou première application métier.", detail: undefined },
  { id: "APPLICATION_STRUCTUREE", title: "Application structurée", price: "3 000 à 10 000 €", description: "Plusieurs utilisateurs, administration, mobile, planning, notifications, automatisations ou tableaux de bord.", detail: undefined },
  { id: "PROJET_AMBITIEUX", title: "Plateforme / connecté / projet ambitieux", price: "À partir de plusieurs milliers d’euros", description: "SaaS, marketplace, IoT, tracking, temps réel ou projet à forte ambition.", detail: "Un projet très ambitieux peut nécessiter 8 000 à 25 000 €+ ou davantage selon son périmètre." },
] as const;

export const publicBudgetRanges = {
  SITE_SIMPLE: "500–1 500 €",
  PROJET_DIGITAL: "1 500–4 000 €",
  APPLICATION_STRUCTUREE: "3 000–10 000 €",
  SOLUTION_CONNECTEE: "3 000–15 000 €+",
  PLATEFORME: "8 000–25 000 €+",
  PROJET_AMBITIEUX: "Sur étude",
} as const;

export const monthlyServices = [
  { title: "Web simple", price: "≈ 19–49 €/mois" },
  { title: "Application / outil métier", price: "≈ 49–99 €/mois" },
  { title: "Solution professionnelle", price: "≈ 69–199 €/mois" },
  { title: "Plateforme / infrastructure importante", price: "≈ 149 €/mois et plus" },
] as const;

import type { EditorialPage, Pricing, Solution, SolutionClusterId } from "./content-types";
import { seoPageBySlug } from "./seo-pages";
import { v2Solutions } from "./v2-solutions";
import { solutionOffers } from "./public-offer";

const offerById = Object.fromEntries(solutionOffers.map((offer) => [offer.id, offer]));
const v2SolutionById = Object.fromEntries(v2Solutions.map((solution) => [solution.id, solution]));

function pricingFromExistingOffer(offerId: string): Pricing {
  const offer = offerById[offerId];
  if (!offer) return { offers: [{ kind: "quote" }], validated: false };

  return {
    offers: [{ kind: "subscription", monthlyFrom: offer.startingMonthlyPrice }],
    label: offer.startingPriceLabel,
    hardwareSeparate: offer.hardwarePossible,
    setupSeparate: offer.setupRequired,
    recurringServicesNote: offer.pricingDisclaimer,
    // Existing offers are already published and verified in the project data.
    validated: true,
  };
}

function unpricedQuote(): Pricing {
  return { offers: [{ kind: "quote" }], validated: false };
}

function editorialPage(sourceSlug: string | undefined, fallbackTitle: string, fallbackIntro: string): EditorialPage {
  const source = sourceSlug ? seoPageBySlug[sourceSlug] : undefined;
  if (!source) return { title: fallbackTitle, description: fallbackIntro, intro: fallbackIntro, sections: [] };
  return {
    title: source.title,
    metaTitle: source.metaTitle,
    description: source.description,
    intro: source.intro,
    sections: source.sections,
    faq: source.faq,
    cta: source.cta,
  };
}

const solutionSeeds: {
  id: string;
  v2SourceId: (typeof v2Solutions)[number]["id"];
  slug: string;
  canonicalPath: string;
  cluster: SolutionClusterId;
  primaryAction: { label: string; href: string };
  page?: EditorialPage;
  sourceSlug?: string;
  offerId?: string;
  industries: string[];
}[] = [
  { id: "custom-software", v2SourceId: "custom-software", slug: "sur-mesure", canonicalPath: "/logiciel-sur-mesure/", cluster: "logiciel-ia", primaryAction: { label: "Étudier mon projet", href: "/contact/" }, sourceSlug: "logiciel-sur-mesure", offerId: "PLATEFORME_SAAS", industries: ["restaurant", "hotel", "garage"] },
  { id: "ai-automation", v2SourceId: "ai-automation", slug: "ia-automatisation", canonicalPath: "/automatisation-entreprise/", cluster: "logiciel-ia", primaryAction: { label: "Étudier mon besoin", href: "/contact/" }, sourceSlug: "automatisation-entreprise", offerId: "IA_AUTOMATISATION", industries: ["restaurant", "hotel", "garage"] },
  { id: "commerce-caisse-ticketing", v2SourceId: "commerce-caisse-ticketing", slug: "commerce-caisse-billetterie", canonicalPath: "/logiciel-caisse-marseille/", cluster: "commerce-paiement", primaryAction: { label: "Configurer cette solution", href: "/caisse/" }, sourceSlug: "logiciel-caisse-marseille", offerId: "CAISSE_COMMERCE", industries: ["restaurant"] },
  { id: "management-reservation", v2SourceId: "management-reservation", slug: "gestion-reservation", canonicalPath: "/applications-metier/", cluster: "commerce-paiement", primaryAction: { label: "Étudier mon projet", href: "/contact/" }, sourceSlug: "applications-metier", offerId: "APPLICATION_METIER", industries: ["restaurant", "hotel"] },
  { id: "sites-applications", v2SourceId: "sites-applications", slug: "sites-applications", canonicalPath: "/site-presence-web/", cluster: "digital-infrastructure", primaryAction: { label: "Obtenir cette solution", href: "/contact/" }, sourceSlug: "site-presence-web", offerId: "SITE_WEB", industries: ["restaurant", "hotel"] },
  { id: "hosting-infrastructure", v2SourceId: "hosting-infrastructure", slug: "hebergement-infrastructure", canonicalPath: "/solutions/hebergement-infrastructure/", cluster: "digital-infrastructure", primaryAction: { label: "Étudier mon besoin", href: "/contact/" }, industries: [], page: { title: "Hébergement & infrastructure", description: "Définir la base technique nécessaire pour faire fonctionner un service numérique YVEXOR.", intro: "Un site, une application ou un logiciel a besoin d’une base adaptée à son usage. YVEXOR étudie l’hébergement et les services d’infrastructure avec le périmètre réel du projet.", sections: [{ title: "Partir du service à faire fonctionner", text: "Les besoins d’accès, de stockage, de disponibilité et d’évolution sont définis avec le projet, sans imposer une architecture unique." }, { title: "Prévoir les services associés", text: "Hébergement, maintenance et sauvegarde peuvent être étudiés séparément selon le service et le niveau d’accompagnement attendu." }] } },
  { id: "connected-systems", v2SourceId: "connected-systems", slug: "systemes-connectes", canonicalPath: "/systemes-connectes/", cluster: "connecte-terrain", primaryAction: { label: "Étudier mon besoin", href: "/contact/" }, sourceSlug: "systemes-connectes", offerId: "SYSTEMES_CONNECTES", industries: ["hotel", "garage"] },
  { id: "field-equipment", v2SourceId: "field-equipment", slug: "equipements-terrain", canonicalPath: "/boutique/", cluster: "connecte-terrain", primaryAction: { label: "Découvrir le matériel", href: "/boutique/" }, industries: [] },
];

const catalogueSolutions: Solution[] = solutionSeeds.map((seed) => {
  const item = v2SolutionById[seed.v2SourceId];
  if (!item) throw new Error(`Missing V2 solution source: ${seed.v2SourceId}`);
  return {
    id: seed.id,
    slug: seed.slug,
    canonicalPath: seed.canonicalPath,
    cluster: seed.cluster,
    eyebrow: item.title,
    primaryAction: seed.primaryAction,
    industryIds: [...seed.industries],
    projectIds: [],
    page: seed.page ?? editorialPage(seed.sourceSlug, item.title, item.cue),
    pricing: seed.offerId ? pricingFromExistingOffer(seed.offerId) : unpricedQuote(),
  };
});

const retrofitSolution: Solution = {
  id: "equipment-retrofit",
  slug: "retrofit-equipement-non-connecte",
  canonicalPath: "/solutions/retrofit-equipement-non-connecte/",
  cluster: "connecte-terrain",
  eyebrow: "Retrofit & connexion d’équipements",
  primaryAction: { label: "Étudier mon projet", href: "/contact/" },
  industryIds: ["restaurant", "hotel", "garage"],
  projectIds: [],
  page: {
    title: "Connecter un équipement existant",
    description: "Relier un équipement qui n’était pas connecté à l’origine à des capteurs, un logiciel et des automatisations adaptés.",
    intro: "Une machine fonctionne seule ? YVEXOR peut étudier l’ajout de capteurs, d’un microcontrôleur, d’une passerelle et d’un logiciel pour suivre son état, recevoir des alertes ou piloter certaines actions.",
    sections: [
      { title: "Partir de la machine et du besoin", text: "Le matériel, ses interfaces, les contraintes de sécurité et les actions attendues sont vérifiés avant de définir une solution." },
      { title: "Relier les éléments utiles", text: "Selon la machine, les contraintes et le besoin, certains éléments seulement seront nécessaires. Le paiement ou le pilotage à distance ne sont envisagés que si le projet le demande et si le matériel le permet.", items: ["Capteur adapté à l’équipement", "Microcontrôleur, si nécessaire", "Connexion adaptée au lieu", "Logiciel de suivi ou de pilotage", "Automatisation utile", "Supervision", "Alertes selon le besoin", "Paiement éventuel, si pertinent et techniquement possible"] },
    ],
  },
  pricing: unpricedQuote(),
};

export const solutions: Solution[] = [...catalogueSolutions, retrofitSolution];
export const solutionById = Object.fromEntries(solutions.map((solution) => [solution.id, solution]));

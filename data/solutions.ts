import type { EditorialPage, Pricing, Solution, SolutionClusterId } from "./content-types";
import { seoPageBySlug } from "./seo-pages";
import { v2Solutions } from "./v2-solutions";
import { solutionOffers } from "./public-offer";

const offerById = Object.fromEntries(solutionOffers.map((offer) => [offer.id, offer]));

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
  slug: string;
  cluster: SolutionClusterId;
  sourceSlug?: string;
  offerId?: string;
  industries: string[];
}[] = [
  { id: "custom-software", slug: "sur-mesure", cluster: "logiciel-ia", sourceSlug: "logiciel-sur-mesure", offerId: "PLATEFORME_SAAS", industries: ["restaurant", "hotel", "garage"] },
  { id: "ai-automation", slug: "ia-automatisation", cluster: "logiciel-ia", sourceSlug: "automatisation-entreprise", offerId: "IA_AUTOMATISATION", industries: ["restaurant", "hotel", "garage"] },
  { id: "commerce-caisse-ticketing", slug: "commerce-caisse-billetterie", cluster: "commerce-paiement", sourceSlug: "logiciel-caisse-marseille", offerId: "CAISSE_COMMERCE", industries: ["restaurant"] },
  { id: "management-reservation", slug: "gestion-reservation", cluster: "commerce-paiement", sourceSlug: "applications-metier", offerId: "APPLICATION_METIER", industries: ["restaurant", "hotel"] },
  { id: "sites-applications", slug: "sites-applications", cluster: "digital-infrastructure", sourceSlug: "site-presence-web", offerId: "SITE_WEB", industries: ["restaurant", "hotel"] },
  { id: "hosting-infrastructure", slug: "hebergement-infrastructure", cluster: "digital-infrastructure", industries: [] },
  { id: "connected-systems", slug: "systemes-connectes", cluster: "connecte-terrain", sourceSlug: "systemes-connectes", offerId: "SYSTEMES_CONNECTES", industries: ["hotel", "garage"] },
  { id: "field-equipment", slug: "equipements-terrain", cluster: "connecte-terrain", industries: [] },
];

const catalogueSolutions: Solution[] = solutionSeeds.map((seed, index) => {
  const item = v2Solutions[index];
  return {
    id: seed.id,
    slug: seed.slug,
    cluster: seed.cluster,
    eyebrow: item.title,
    industryIds: [...seed.industries],
    projectIds: [],
    page: editorialPage(seed.sourceSlug, item.title, item.cue),
    pricing: seed.offerId ? pricingFromExistingOffer(seed.offerId) : unpricedQuote(),
  };
});

const retrofitSolution: Solution = {
  id: "equipment-retrofit",
  slug: "retrofit-equipement-non-connecte",
  cluster: "connecte-terrain",
  eyebrow: "Retrofit & connexion d’équipements",
  industryIds: ["restaurant", "hotel", "garage"],
  projectIds: [],
  page: {
    title: "Connecter un équipement existant",
    description: "Relier un équipement qui n’était pas connecté à l’origine à des capteurs, un logiciel et des automatisations adaptés.",
    intro: "Une machine fonctionne seule ? YVEXOR peut étudier l’ajout de capteurs, d’un microcontrôleur, d’une passerelle et d’un logiciel pour suivre son état, recevoir des alertes ou piloter certaines actions.",
    sections: [
      { title: "Partir de la machine et du besoin", text: "Le matériel, ses interfaces, les contraintes de sécurité et les actions attendues sont vérifiés avant de définir une solution." },
      { title: "Relier les éléments utiles", text: "Capteur, microcontrôleur, connexion, automatisation et tableau de bord peuvent composer un même système. Paiement, alertes ou pilotage à distance sont étudiés seulement si le projet le demande." },
    ],
  },
  pricing: unpricedQuote(),
};

export const solutions: Solution[] = [...catalogueSolutions, retrofitSolution];
export const solutionById = Object.fromEntries(solutions.map((solution) => [solution.id, solution]));

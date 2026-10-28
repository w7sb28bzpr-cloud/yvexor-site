/** The B2B catalogue (YVEXOR_Catalogue_Complet.pdf), one page per activity. Prices follow the PDF. */

export type OfferPlan = {
  name: string;
  /** Amount as printed, e.g. "89 €". */
  price: string;
  period: string;
  /** A floor price, quoted at the end. */
  from?: boolean;
  badge?: string;
  lead: string;
  items: string[];
  note?: string;
};

export type OfferCard = { title: string; text: string; price?: string };

export type OfferSection =
  | { kind: "plans"; id: string; eyebrow: string; title: string; intro?: string; plans: OfferPlan[]; note?: string }
  | { kind: "table"; id: string; eyebrow: string; title: string; intro?: string; head: string[]; rows: string[][]; note?: string }
  | { kind: "cards"; id: string; eyebrow: string; title: string; intro?: string; cards: OfferCard[]; note?: string };

export type CatalogueOffer = {
  slug: string;
  name: string;
  brand: string;
  eyebrow: string;
  title: string;
  lead: string;
  summary: string;
  startingPrice: string;
  sections: OfferSection[];
  conditions: string[];
  /** The caisse configurator for this activity, when one exists. */
  configure?: string;
  /** A real photo for the header. Free licence, no credit required. */
  image?: { src: string; alt: string; width: number; height: number };
};

const hardwarePacks: OfferSection = {
  kind: "plans",
  id: "materiel",
  eyebrow: "B · Le matériel",
  title: "Votre équipement, à votre rythme.",
  intro: "Packs complets avec imprimante et tiroir-caisse. Logiciel en supplément.",
  plans: [
    { name: "Pack tablette", price: "309 €", period: "à l’achat · ou 4 × 77,25 €", lead: "Tablette tactile, imprimante thermique 80 mm et tiroir-caisse.", items: ["Configuration YVEXOR, connexions et tests inclus"] },
    { name: "Pack fixe", price: "489 €", period: "à l’achat · ou 4 × 122,25 €", lead: "Terminal tactile fixe, imprimante thermique 80 mm et tiroir-caisse.", items: ["Configuration YVEXOR, connexions et tests inclus"] },
  ],
  note: "Exemple avec un logiciel à 49 € : pack tablette 77,25 € + 49 € = 126,25 € pendant 4 mois, puis 49 € / mois. Le matériel et le logiciel sont distincts : le paiement en 4 fois n’engage pas le logiciel. Scannette en option : +60 €.",
};

export const catalogueOffers: CatalogueOffer[] = [
  {
    slug: "tennis-padel",
    name: "Tennis & padel",
    brand: "YVEXOR Tennis",
    eyebrow: "Vidéo connectée pour les clubs",
    title: "Filmez vos terrains, à votre rythme.",
    lead: "Commencez avec deux terrains, puis équipez les suivants quand vous le souhaitez.",
    summary: "Vidéo des terrains, forfaits club ou abonnement par terrain.",
    startingPrice: "89 €",
    image: { src: "/media/solutions/terrains-padel.webp", alt: "Deux terrains de padel bleus avec parois vitrées et projecteurs, en plein jour", width: 1440, height: 810 },
    sections: [
      {
        kind: "plans",
        id: "forfaits",
        eyebrow: "A · Les forfaits club",
        title: "Un seul prix pour tout le club.",
        intro: "89 €, 149 € ou 249 € par mois : ces prix ne se multiplient pas par le nombre de terrains.",
        plans: [
          { name: "Liberté", price: "89 €", period: "/ mois pour le club", lead: "Vous financez le matériel, avec une mensualité basse.", items: ["Au départ : 380 €, premier terrain équipé et mis en service", "Terrain en plus : dès 199 €, une seule fois", "Accès vidéo, caméra, serveur central, boîtier réseau et câblage du premier terrain", "Sans engagement"], note: "Exemple : 2 terrains dès 579 € au départ, puis 89 € / mois." },
          { name: "Duo", price: "149 €", period: "/ mois pour le club", lead: "Un terrain offert pour chaque terrain acheté.", items: ["Au départ : 380 € de mise en service, plus les terrains achetés, chiffrés au devis", "Exemple : 2 terrains, dont 1 acheté et 1 offert", "Accès vidéo, déploiement progressif et support renforcé", "Caméras couvertes et remplacées en cas de défaut pendant l’abonnement"], note: "Engagement précisé au devis." },
          { name: "Sérénité", price: "249 €", period: "/ mois pour le club", badge: "Terrains illimités", lead: "Tous vos terrains, sans rien payer au départ.", items: ["0 € au départ, engagement de 24 mois", "Une caméra par terrain, serveur central, boîtiers réseau et câblage inclus", "Installation, maintenance et remplacement du matériel défectueux", "Support prioritaire"] },
        ],
      },
      {
        kind: "table",
        id: "par-terrain",
        eyebrow: "B · L’abonnement par terrain",
        title: "Un tarif par terrain, matériel inclus.",
        intro: "0 € au départ, engagement de 36, 48 ou 60 mois. Votre mensualité = tarif par terrain × nombre de terrains.",
        head: ["Engagement", "1 à 2 terrains", "3 à 4", "5 à 6", "7 à 8", "9 à 10"],
        rows: [
          ["36 mois", "49 €", "43 €", "39 €", "36 €", "34 €"],
          ["48 mois", "42 €", "37 €", "33 €", "31 €", "29 €"],
          ["60 mois", "33 €", "29 €", "26 €", "25 €", "23 €"],
        ],
        note: "Prix par terrain et par mois. Exemple sur 36 mois : 3 terrains = 3 × 43 € = 129 € / mois. Cette formule remplace les forfaits club, elle ne s’y ajoute pas. Installation et maintenance précisées au devis.",
      },
      {
        kind: "cards",
        id: "options",
        eyebrow: "Installation et options",
        title: "À vous de choisir.",
        cards: [
          { title: "Installation par YVEXOR", text: "Pose, câblage et mise en service. Installation standard incluse dans Sérénité." },
          { title: "Installation par votre club", text: "Kit préconfiguré et guide fournis. Assistance à distance si le site le permet." },
          { title: "Analyse vidéo par IA", price: "Sur devis", text: "Suivi de balle, statistiques de jeu et séquences à revoir créées automatiquement." },
          { title: "Application du club", price: "Sur devis", text: "Réservations, planning, espace membres, actualités et notifications." },
          { title: "Autres besoins du club", text: "Caisse pour l’accueil ou le snack, éclairage des terrains à distance ou payant, ouverture à distance des serrures compatibles." },
          { title: "Foot, basket et autres terrains", price: "Sur devis", text: "La même vidéo connectée s’adapte au foot à 5, au city-stade, au basket, au squash et aux autres terrains." },
        ],
      },
    ],
    conditions: ["Les conditions propres à chaque formule sont précisées au devis.", "Analyse vidéo : fonctions et prix après vérification des caméras et des conditions de prise de vue."],
  },
  {
    slug: "coiffure-beaute",
    name: "Coiffure & beauté",
    brand: "YVEXOR Coiffure & Beauté",
    eyebrow: "Coiffeurs · barbiers · instituts",
    title: "Votre salon, à votre rythme.",
    lead: "Vos rendez-vous. Votre caisse. Une solution selon vos besoins.",
    summary: "Rendez-vous, encaissement et vente en ligne.",
    startingPrice: "59 €",
    configure: "/caisse/coiffure/#configurateur",
    sections: [
      {
        kind: "plans",
        id: "formules",
        eyebrow: "A · Votre logiciel",
        title: "Trois formules sans engagement.",
        intro: "Matériel en supplément.",
        plans: [
          { name: "Agenda", price: "59 €", period: "/ mois", lead: "Pour gérer vos rendez-vous.", items: ["Réservation en ligne 24h/24, agenda et fichier clients", "300 SMS de rappel inclus par mois", "Acomptes, prépaiement et lien sur vos réseaux sociaux"] },
          { name: "Agenda + Caisse", price: "69 €", period: "/ mois", lead: "Pour organiser et encaisser.", items: ["Toute l’offre Agenda", "Caisse, gestion des stocks et cartes cadeaux", "Vente de prestations en ligne et exports comptables"] },
          { name: "La formule complète", price: "89 €", period: "/ mois", lead: "Pour gérer votre salon et vendre en ligne.", items: ["Toute l’offre Agenda + Caisse", "Boutique en ligne pour vos produits", "Espace de réservation aux couleurs de votre salon"] },
        ],
      },
      {
        kind: "cards",
        id: "materiel",
        eyebrow: "B · Votre matériel",
        title: "Gardez le vôtre ou équipez votre accueil.",
        cards: [
          { title: "Votre tablette ou ordinateur", text: "Utilisez votre équipement compatible. Nous vérifions votre installation, vous ajoutez seulement ce qui manque." },
          { title: "Une caisse fixe", price: "Sur devis", text: "Vous partez de zéro ou préférez éviter la tablette ? Un poste de caisse adapté à votre salon." },
          { title: "Équipements à l’unité", text: "Imprimante à tickets, tiroir-caisse ou scannette : choisissez seulement ce qui vous est utile." },
          { title: "Votre application mobile", price: "Sur devis", text: "Une application personnalisée aux couleurs de votre salon. Option facultative." },
        ],
      },
    ],
    conditions: ["Les abonnements concernent le logiciel ; le matériel est en supplément.", "Frais de paiement et SMS au-delà des 300 inclus précisés au devis.", "Solution TPE en préparation, disponibilité à confirmer."],
  },
  {
    slug: "commerces",
    name: "Commerces de proximité",
    brand: "YVEXOR Caisse",
    eyebrow: "Caisse connectée pour les commerces",
    title: "Commencez à votre rythme.",
    lead: "Votre tablette aujourd’hui. Une caisse complète quand vous le souhaitez.",
    summary: "Caisse, stocks, site internet et équipements.",
    startingPrice: "49 €",
    configure: "/caisse/commerce/#configurateur",
    sections: [
      {
        kind: "plans",
        id: "formules",
        eyebrow: "A · Le logiciel",
        title: "Votre caisse, sur votre matériel.",
        intro: "Tablette, ordinateur ou caisse compatible. Sans engagement.",
        plans: [
          { name: "Essentiel", price: "49 €", period: "/ mois", lead: "Tout pour commencer à vendre.", items: ["Catalogue, ventes, remises, tickets et clôture quotidienne", "Suivi de stock de base et sauvegardes", "Scannette compatible ou appareil photo du téléphone", "Assistance à distance incluse"] },
          { name: "Commerce Pro", price: "89 €", period: "/ mois", lead: "Pour piloter votre magasin.", items: ["Toute l’offre Essentiel", "Inventaire, fournisseurs, marges et fidélité", "Accès de l’équipe et statistiques avancées", "Ventes et stocks à distance depuis votre téléphone", "Codes-barres et QR codes à imprimer", "Site internet inclus"] },
          { name: "Sur mesure", price: "129 €", period: "/ mois", lead: "Un système adapté à votre façon de travailler.", items: ["Toute l’offre Commerce Pro", "Suivi des lots et des dates de péremption", "Adaptations définies ensemble : planning, comptabilité, rapports, catalogue, site premium ou paiement en ligne"] },
        ],
      },
      hardwarePacks,
      {
        kind: "cards",
        id: "options",
        eyebrow: "Installation et options",
        title: "Achetez seulement ce qui vous manque.",
        cards: [
          { title: "Avec ou sans scannette", text: "La lecture des codes-barres est incluse dès Essentiel : l’appareil photo du téléphone suffit, ou ajoutez une scannette (+60 €)." },
          { title: "Un seul équipement", text: "Pas besoin du pack complet. Ajoutez une imprimante, un tiroir-caisse ou les deux, et complétez plus tard." },
          { title: "Pesée reliée à la caisse", price: "Sur devis", text: "Pour les produits vendus au poids : matériel et compatibilité étudiés avec vous." },
          { title: "Aide au démarrage", price: "Sur devis", text: "Configuration personnalisée, reprise de vos produits et intervention sur site." },
          { title: "Licence perpétuelle", price: "Sur devis", text: "Achetez le logiciel une seule fois : la version acquise reste utilisable sans limite de durée." },
          { title: "Matériel avec engagement", price: "Sur devis", text: "Pour payer moins au départ : apport, mensualité, durée et équipements définis dans votre devis." },
        ],
      },
    ],
    conditions: ["Matériel et TPE vendus séparément. Site vitrine inclus dès 89 €.", "Offre Sur mesure : adaptations définies avec vous, selon vos besoins et leur faisabilité. Frais du prestataire de paiement en ligne en supplément.", "Paiement en 4 fois selon conditions et acceptation ; frais éventuels et échéancier précisés avant validation."],
  },
  {
    slug: "snacks",
    name: "Snacks & restauration rapide",
    brand: "YVEXOR Snack",
    eyebrow: "Snacks · fast-foods · vente à emporter",
    title: "Votre snack, à votre rythme.",
    lead: "Au comptoir, sur mobile ou sur borne. Les commandes arrivent en cuisine.",
    summary: "Comptoir, carte QR, commande mobile et cuisine.",
    startingPrice: "49 €",
    configure: "/caisse/snack/#configurateur",
    sections: [
      {
        kind: "plans",
        id: "formules",
        eyebrow: "A · Votre logiciel",
        title: "Trois façons de faire tourner votre snack.",
        intro: "Sans engagement. Matériel en supplément.",
        plans: [
          { name: "Snack Essentiel", price: "49 €", period: "/ mois", lead: "Pour encaisser et transmettre en cuisine.", items: ["Caisse, produits, menus, options, tickets et suivi des ventes", "Carte QR consultable par vos clients", "Commandes imprimées en cuisine, sur une ou deux imprimantes"], note: "Affichage cuisine sur écran en option, sur devis." },
          { name: "Snack Connecté", price: "89 €", period: "/ mois", lead: "Vos clients commandent aussi sur leur mobile.", items: ["Toute l’offre Snack Essentiel", "Commande et paiement sur mobile depuis la carte QR", "Affichage cuisine avec suivi de préparation", "Stocks simples et ventes à distance", "Site internet avec accès à la commande", "Une seule carte pour la caisse, le QR et le site"] },
          { name: "Snack Sur mesure", price: "129 €", period: "/ mois · sur devis", from: true, lead: "Votre snack, votre façon de travailler.", items: ["Caisse, commande et paiement mobile, cuisine et site", "Stocks détaillés, achats fournisseurs, coûts et marges", "Rapports et exports pour votre comptable", "Bornes, planning, fidélité et tableaux de bord"] },
        ],
      },
      {
        kind: "cards",
        id: "commandes",
        eyebrow: "Commandes et cuisine",
        title: "De la commande à la préparation.",
        cards: [
          { title: "Au comptoir", price: "Dès 49 €", text: "Votre équipe saisit la commande dans la caisse et encaisse le client." },
          { title: "Carte QR", price: "Dès 49 €", text: "Le client scanne et consulte la carte. À 49 €, il commande auprès de votre équipe." },
          { title: "Sur mobile", price: "Dès 89 €", text: "Le client compose sa commande et paie sur son téléphone. Elle arrive en caisse et en cuisine." },
          { title: "Sur borne", price: "Sur devis", text: "Le client choisit ses produits sur une borne. Paiement et modèles définis au devis." },
          { title: "Une ou deux imprimantes", price: "Dès 49 €", text: "Les commandes sortent en cuisine, sur un ou deux postes de préparation." },
          { title: "Affichage cuisine", price: "Inclus dès 89 €", text: "Les commandes s’affichent sur une tablette ou un écran, l’équipe les marque comme prêtes." },
        ],
      },
      hardwarePacks,
      {
        kind: "cards",
        id: "options",
        eyebrow: "Installation et options",
        title: "Achetez seulement ce qui vous manque.",
        cards: [
          { title: "Une caisse fixe", price: "Sur devis", text: "Un poste de caisse adapté à votre comptoir." },
          { title: "Une borne de commande", price: "Sur devis", text: "Sur comptoir, sur pied ou au mur. Connexion au logiciel avec l’offre Sur mesure." },
          { title: "Équipements cuisine", text: "Tablette ou écran dédié, une ou deux imprimantes. Tous facultatifs, vendus séparément." },
          { title: "Votre application mobile", price: "Sur devis", text: "Une application personnalisée aux couleurs de votre snack." },
          { title: "Licence perpétuelle", price: "Sur devis", text: "Achetez le logiciel une seule fois : la version achetée reste utilisable sans limite de durée." },
        ],
      },
    ],
    conditions: ["Les prix concernent le logiciel. Caisse, bornes, écrans, imprimantes et TPE en supplément.", "Le paiement sur mobile est inclus dès 89 € ; les frais du prestataire de paiement restent à votre charge.", "Offre Sur mesure : tarif final et fonctions définis au devis."],
  },
  {
    slug: "restaurants",
    name: "Restaurants",
    brand: "YVEXOR Restaurant OS",
    eyebrow: "Salle · cuisine · bar · gestion",
    title: "Votre restaurant, à votre rythme.",
    lead: "Une caisse pour commencer. Un système connecté pour aller plus loin.",
    summary: "Salle, cuisine, équipes et pilotage du restaurant.",
    startingPrice: "49 €",
    sections: [
      {
        kind: "plans",
        id: "formules",
        eyebrow: "A · Votre logiciel",
        title: "Trois niveaux pour votre service.",
        intro: "Logiciel seul, sans engagement. Matériel vendu séparément.",
        plans: [
          { name: "Caisse+", price: "49 €", period: "/ mois", lead: "Le point de départ de votre restaurant.", items: ["Produits, plan de salle, additions, tickets, clôtures et comptes employés", "Un téléphone serveur, tickets cuisine et bar", "Stocks simples et statistiques de base", "YVEXOR Connect : réseau de restaurateurs et recherche de personnel"] },
          { name: "Service", price: "99 €", period: "/ mois", lead: "Votre service connecté, votre restaurant visible.", items: ["Toute l’offre Caisse+", "Jusqu’à 5 téléphones, cuisine connectée et suivi à distance", "Site et carte QR inclus, mis à jour avec votre carte", "Messagerie d’équipe et recherche de renforts"] },
          { name: "Restaurant", price: "179 €", period: "/ mois", lead: "Service, réservations et gestion réunis.", items: ["Toute l’offre Service", "Téléphones illimités, cuisine et bar connectés, alertes bracelets", "Réservations, avis et réponses depuis le téléphone", "Commande et paiement sur mobile, envoyés au bar ou en cuisine", "Planning, suivi financier et 30 factures fournisseurs / mois"] },
        ],
      },
      {
        kind: "plans",
        id: "aller-plus-loin",
        eyebrow: "Pour aller plus loin",
        title: "Un système adapté à votre restaurant.",
        intro: "Gestion avancée, intelligence artificielle et installation équipée.",
        plans: [
          { name: "Intelligence", price: "389 €", period: "/ mois", lead: "Comprendre votre rentabilité et anticiper.", items: ["Toute l’offre Restaurant", "Comptabilité et fiches de paie via un moteur ou partenaire compatible", "IA avancée : lecture des factures, rapprochement achats et stocks, coûts, marges et prévisions", "Votre assistant : Carla IA ou connexion personnalisée à ChatGPT, sur devis"] },
          { name: "Executive Full", price: "699 €", period: "/ mois", from: true, lead: "Votre Restaurant OS local, équipé et complet.", items: ["Toute l’offre Intelligence", "Serveur, caisses et équipements prévus au devis, installés sur place", "Comptes bancaires, encaissements et dépenses via les partenaires connectés", "Fiches de paie illimitées et pilotage de direction", "Connexions et automatisations définies ensemble"] },
        ],
        note: "Un seul environnement au lieu de plusieurs abonnements : dans notre exemple comparatif, cinq logiciels spécialisés couvrant un périmètre proche représentent environ 1 350 € / mois (repères consultés le 31/08/2026, offres non strictement équivalentes).",
      },
      {
        kind: "cards",
        id: "service",
        eyebrow: "Le service au quotidien",
        title: "Des outils adaptés à chaque poste.",
        cards: [
          { title: "En salle", price: "Pads de 60 € à 350 €", text: "Les téléphones compatibles de votre équipe ou des pads professionnels. Les commandes partent vers la cuisine et le bar." },
          { title: "En cuisine", text: "Tablette, écran ou poste fixe pour afficher les commandes, ou une ou plusieurs imprimantes." },
          { title: "Plat prêt ? Le serveur est prévenu.", price: "Dès 179 €", text: "La cuisine signale un plat prêt et le bracelet compatible du serveur vibre." },
          { title: "Depuis votre téléphone", text: "Activité, stocks, rapports et, dans les niveaux avancés, coûts et marges, même à distance." },
        ],
      },
      hardwarePacks,
      {
        kind: "cards",
        id: "options",
        eyebrow: "Options",
        title: "Votre solution, à votre façon.",
        cards: [
          { title: "Bar connecté", price: "+15 € / mois", text: "Avec l’offre Service. Inclus dès Restaurant." },
          { title: "Planning", price: "+20 € / mois", text: "Avec l’offre Service. Inclus dès Restaurant." },
          { title: "Tiroirs et comptes employés", text: "Un tiroir commun ou un tiroir par employé, ouvert selon les droits du compte." },
          { title: "Bornes et application", price: "Sur devis", text: "Bornes fixes et application mobile aux couleurs du restaurant, connectées à vos outils." },
          { title: "Licence perpétuelle", price: "Sur devis", text: "Achetez le logiciel une seule fois : la version achetée reste utilisable sans limite de durée." },
        ],
      },
    ],
    conditions: ["Bracelets : alertes incluses dès 179 €, équipements chiffrés au devis. Commande et paiement par QR inclus dès 179 €, frais du prestataire séparés.", "Factures : 30 par mois à 179 €, volumes définis au devis dès 389 €. Paie incluse dès Intelligence.", "Executive Full : matériel, adaptations, installation et engagement précisés au devis. Le cœur du système tourne localement ; paiements en ligne et services internet nécessitent une connexion.", "Solution TPE bientôt disponible, à confirmer."],
  },
];

export const catalogueOfferBySlug = Object.fromEntries(catalogueOffers.map((offer) => [offer.slug, offer])) as Record<string, CatalogueOffer>;

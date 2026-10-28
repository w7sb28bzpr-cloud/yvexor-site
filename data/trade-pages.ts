import type { Trade } from "./trades";

/** A trade that deserves its own page (/solutions/metiers/<id>/): everything we can do, then the featured offer. */
export type TradePage = {
  id: string;
  title: string;
  lead: string;
  services: { title: string; text: string; more: string }[];
  /** Activities or places covered, shown as tags under scopeTitle. */
  scopeTitle: string;
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
    scopeTitle: "Pour toutes les disciplines",
    scope: ["Tennis", "Padel", "Foot à 5 & city-stades", "Basket", "Squash & badminton", "Golf", "Fitness & musculation", "Piscine", "Escalade", "Arts martiaux", "Équitation", "Multisport"],
    invent: { title: "Une idée qui n’existe nulle part ?", text: "Un capteur pour votre discipline, un écran sur mesure, un objet connecté que personne ne vend : on le conçoit avec vous, de l’électronique au logiciel, jusqu’à l’installation." },
    featured: { offer: "tennis-padel", title: "Notre offre phare : tennis & padel", text: "La vidéo connectée pour les clubs, avec des forfaits pour tout le club ou un abonnement par terrain. La même solution s’adapte au foot à 5, au basket et aux autres terrains, sur devis." },
  },
  {
    id: "public",
    title: "Collectivités, écoles & équipements",
    lead: "Mairies, écoles, gymnases, salles municipales : on simplifie la vie des agents, des familles et des associations, et on rend les bâtiments plus économes. Une seule solution pour tout gérer, ou juste ce qui vous manque.",
    services: [
      { title: "Accès aux bâtiments", text: "Badge, code ou téléphone, avec les bons horaires.", more: "Chaque association, agent ou prestataire a ses droits et ses créneaux. Accès temporaires pour un événement, ouverture à distance, historique des passages, fini les clés qui circulent." },
      { title: "Réservation des salles", text: "Gymnases, salles et terrains réservés en ligne.", more: "Les associations et les habitants voient les disponibilités et font leur demande en ligne. Les agents valident, le planning se met à jour et l’accès s’ouvre au bon créneau." },
      { title: "Qualité de l’air dans les classes", text: "Capteurs de CO₂ et de température.", more: "Un voyant indique quand il faut aérer, les mesures sont enregistrées et consultables. Utile pour le confort des élèves et pour suivre la qualité de l’air intérieur des établissements." },
      { title: "Énergie & chauffage", text: "Chauffer et éclairer seulement quand c’est occupé.", more: "Chauffage et éclairage programmés selon les réservations et l’emploi du temps, suivi des consommations par bâtiment, alertes en cas d’anomalie. Une aide concrète pour réduire la facture et suivre vos objectifs d’économie d’énergie." },
      { title: "Cantine & périscolaire", text: "Inscriptions, réservations et paiement en ligne.", more: "Les familles inscrivent les enfants à la cantine, à la garderie ou au centre de loisirs et paient en ligne. Les équipes ont les effectifs du jour, sans tableau papier." },
      { title: "Portail famille & citoyen", text: "Démarches, rendez-vous et signalements en ligne.", more: "Prise de rendez-vous en mairie, formulaires, signalement d’un problème sur la voirie ou un équipement avec photo, suivi de la demande jusqu’à sa résolution." },
      { title: "Information & affichage", text: "Écrans et messages au bon endroit.", more: "Écrans d’information à l’accueil, menus de la cantine, actualités de la commune, messages envoyés aux familles ou aux habitants en quelques clics." },
      { title: "Alertes & sécurité", text: "Prévenir vite les bonnes personnes.", more: "Alarme et détection d’intrusion dans les bâtiments, boutons d’alerte, messages de mise en sûreté envoyés instantanément aux équipes concernées." },
    ],
    scopeTitle: "Pour tous les lieux publics",
    scope: ["Écoles, collèges & lycées", "Mairies", "Gymnases & salles de sport", "Salles des fêtes", "Médiathèques", "Piscines municipales", "Cantines & périscolaire", "Centres de loisirs", "Terrains & city-stades", "Services techniques"],
    invent: { title: "Un besoin propre à votre commune ?", text: "Un équipement à connecter, un outil pour vos agents, un service pour vos habitants qui n’existe pas encore : on le conçoit avec vous, à la mesure de votre budget." },
  },
  {
    id: "hotel",
    title: "Hôtels & hébergements",
    lead: "Hôtels, chambres d’hôtes, gîtes, résidences : de la réservation au départ du client, on relie l’accueil, les chambres, le ménage et la technique. Vous gagnez du temps, vos clients aussi.",
    services: [
      { title: "Réservations & planning", text: "Toutes vos réservations au même endroit.", more: "Réservations directes sur votre site, planning des chambres, tarifs selon la saison, arrivées et départs du jour en un coup d’œil." },
      { title: "Arrivée autonome", text: "Le client entre avec un code ou son téléphone.", more: "Code envoyé avant l’arrivée, serrure connectée, boîte à clés sécurisée : vos clients arrivent à toute heure, sans attendre quelqu’un à l’accueil." },
      { title: "Ménage & maintenance", text: "Les équipes savent quelle chambre préparer.", more: "Liste des chambres à faire, statut en temps réel depuis le téléphone, signalement d’une panne avec photo, suivi jusqu’à la réparation." },
      { title: "Chambres connectées", text: "Chauffage et lumière selon l’occupation.", more: "La chambre se met en économie quand elle est vide et retrouve le confort avant l’arrivée. Suivi des consommations par chambre ou par bâtiment." },
      { title: "Messages aux clients", text: "Avant, pendant et après le séjour.", more: "Confirmation, informations pratiques, livret d’accueil sur le téléphone, demande d’avis au départ : tout part automatiquement, au bon moment." },
      { title: "Caisse, bar & services", text: "Petit-déjeuner, bar et extras facturés simplement.", more: "Encaissement au bar ou au restaurant, ajout à la note de la chambre, facture finale propre au départ." },
    ],
    scopeTitle: "Pour tous les hébergements",
    scope: ["Hôtels", "Chambres d’hôtes", "Gîtes & locations saisonnières", "Résidences & apparthôtels", "Auberges", "Résidences étudiantes"],
    invent: { title: "Un service que votre établissement est le seul à offrir ?", text: "Une expérience client originale, un équipement à relier, un outil pour votre équipe : on le construit avec vous, à la mesure de votre budget." },
  },
  {
    id: "garage",
    title: "Garages & ateliers",
    lead: "Garages, carrosseries, ateliers de réparation : on organise l’atelier, on accélère les devis et on prévient vos clients au bon moment. Moins de téléphone, plus de réparations.",
    services: [
      { title: "Rendez-vous en ligne", text: "Vos clients choisissent leur créneau.", more: "Prise de rendez-vous selon la charge de l’atelier et le type d’intervention, rappels automatiques la veille." },
      { title: "Ordres de réparation", text: "Chaque véhicule suivi étape par étape.", more: "Réception, diagnostic, devis, réparation, contrôle, prêt : l’équipe voit où en est chaque véhicule, depuis l’ordinateur ou le téléphone." },
      { title: "Devis rapides", text: "Envoyés et validés en un clic.", more: "Devis avec photos des pièces à changer, validation en ligne par le client, transformation directe en facture." },
      { title: "Client prévenu", text: "« Votre véhicule est prêt » par SMS.", more: "Messages automatiques à chaque étape importante, sans décrocher le téléphone." },
      { title: "Historique des véhicules", text: "Tout l’historique d’un véhicule retrouvé en un clic.", more: "Interventions passées, kilométrage, pièces posées, prochaine révision à rappeler au client." },
      { title: "Pièces & stock", text: "Commandes et stock de pièces suivis.", more: "Pièces commandées pour chaque réparation, réception, stock de consommables et alertes de réapprovisionnement." },
    ],
    scopeTitle: "Pour tous les ateliers",
    scope: ["Garages", "Carrosseries", "Centres auto", "Motos & scooters", "Vélos & trottinettes", "Poids lourds & engins"],
    invent: { title: "Un outil d’atelier qui n’existe pas ?", text: "Un suivi propre à votre spécialité, un équipement à connecter, un écran pour vos clients en attente : on le conçoit avec vous." },
  },
  {
    id: "craft",
    title: "Artisans & bâtiment",
    lead: "Électriciens, plombiers, maçons, peintres, entreprises générales : vos devis, vos chantiers et vos équipes, depuis le téléphone. Moins de paperasse le soir, plus de temps sur le terrain.",
    services: [
      { title: "Devis sur le chantier", text: "Préparé et envoyé depuis le téléphone.", more: "Bibliothèque de prestations et de prix, photos du chantier, signature en ligne par le client, relance automatique s’il ne répond pas." },
      { title: "Planning des équipes", text: "Qui va où, et quand.", more: "Planning partagé des chantiers et des interventions, mis à jour en temps réel, avec adresse et itinéraire pour chaque compagnon." },
      { title: "Comptes rendus d’intervention", text: "Photos, signature, et c’est envoyé.", more: "Bon d’intervention rempli sur place, avec photos avant et après, signature du client et envoi immédiat." },
      { title: "Suivi des chantiers", text: "Avancement, achats et heures passées.", more: "Où en est chaque chantier, ce qu’il a coûté en matériel et en heures, ce qu’il reste à facturer." },
      { title: "Factures & relances", text: "Facturer vite, être payé plus vite.", more: "Situations de travaux, factures depuis le devis, relances automatiques des impayés." },
      { title: "Site & demandes de devis", text: "Les demandes arrivent toutes seules.", more: "Un site qui montre vos réalisations, un formulaire de demande de devis qui arrive directement dans vos outils." },
    ],
    scopeTitle: "Pour tous les corps de métier",
    scope: ["Électricité", "Plomberie & chauffage", "Maçonnerie", "Peinture & décoration", "Menuiserie", "Couverture", "Paysagistes", "Entreprises générales"],
    invent: { title: "Un besoin propre à votre métier ?", text: "Un calcul de devis particulier, un capteur sur vos machines, un suivi de chantier sur mesure : on le construit avec vous." },
  },
  {
    id: "office",
    title: "Cabinets & professions libérales",
    lead: "Avocats, comptables, architectes, thérapeutes, consultants : moins d’administratif, des clients mieux suivis et des rendez-vous qui se prennent tout seuls.",
    services: [
      { title: "Rendez-vous en ligne", text: "Vos clients réservent, vous êtes prévenu.", more: "Agenda en ligne selon vos disponibilités, rappels automatiques, moins de rendez-vous oubliés." },
      { title: "Espace client sécurisé", text: "Documents échangés en toute confidentialité.", more: "Vos clients déposent et récupèrent leurs documents dans un espace protégé, au lieu de pièces jointes perdues dans les mails." },
      { title: "Suivi des dossiers", text: "Chaque dossier, ses étapes et ses échéances.", more: "Tableau de suivi des dossiers, tâches de l’équipe, alertes avant les dates importantes." },
      { title: "Tri des demandes par l’IA", text: "Les messages arrivent classés.", more: "L’IA lit les demandes entrantes, les classe, prépare un brouillon de réponse et vous signale les urgences." },
      { title: "Temps & facturation", text: "Le temps passé devient une facture.", more: "Saisie simple du temps par dossier, facturation au forfait ou au temps, relances automatiques." },
      { title: "Modèles de documents", text: "Courriers et contrats préremplis.", more: "Vos modèles se remplissent avec les informations du dossier : moins de copier-coller, moins d’erreurs." },
    ],
    scopeTitle: "Pour tous les cabinets",
    scope: ["Avocats", "Experts-comptables", "Architectes", "Thérapeutes & praticiens", "Consultants", "Agences"],
    invent: { title: "Un outil propre à votre cabinet ?", text: "Un calculateur, un suivi spécifique, un assistant IA branché sur vos documents : on le conçoit avec vous." },
  },
  {
    id: "realestate",
    title: "Immobilier & location",
    lead: "Agences, gestionnaires, propriétaires : vos biens, vos visites et vos locataires suivis simplement, avec des logements qui se gèrent à distance.",
    services: [
      { title: "Fiches des biens", text: "Tous vos biens et leurs documents.", more: "Photos, diagnostics, baux, travaux et historique de chaque bien, accessibles depuis le téléphone." },
      { title: "Visites", text: "Prises de rendez-vous et accès simplifiés.", more: "Les candidats réservent un créneau, reçoivent un code d’accès temporaire si besoin, et vous gardez l’historique des visites." },
      { title: "Locataires", text: "Demandes, documents et échanges au même endroit.", more: "Espace locataire pour envoyer une demande, déposer un document ou suivre une intervention, sans multiplier les appels." },
      { title: "Remise des clés connectée", text: "Code, boîte à clés ou serrure connectée.", more: "Entrées et sorties de locataires ou de voyageurs sans déplacement, avec des accès qui expirent tout seuls." },
      { title: "Logements surveillés", text: "Fuite, température, humidité.", more: "Des capteurs préviennent en cas de fuite, de gel ou d’humidité excessive, avant que le problème ne coûte cher." },
      { title: "Interventions & prestataires", text: "Du signalement à la réparation.", more: "Chaque demande d’intervention est transmise au bon prestataire, suivie et clôturée avec photos." },
    ],
    scopeTitle: "Pour tous les biens",
    scope: ["Agences immobilières", "Gestion locative", "Locations saisonnières", "Syndics", "Propriétaires bailleurs", "Résidences gérées"],
    invent: { title: "Un service que vos concurrents n’ont pas ?", text: "Une visite à distance, un outil pour vos propriétaires, un logement entièrement piloté : on le construit avec vous." },
  },
  {
    id: "transport",
    title: "Transport & logistique",
    lead: "Transporteurs, livreurs, entrepôts, flottes d’entreprise : tournées optimisées, véhicules suivis et clients informés en temps réel.",
    services: [
      { title: "Tournées", text: "Planifiées et envoyées sur le téléphone.", more: "Ordre des arrêts optimisé, itinéraires, modifications en cours de journée transmises directement aux chauffeurs." },
      { title: "Preuve de livraison", text: "Photo, signature et heure exacte.", more: "Le livreur valide chaque livraison sur son téléphone, le client reçoit la preuve immédiatement." },
      { title: "Suivi de flotte", text: "Où sont vos véhicules, en temps réel.", more: "Position, kilométrage, temps de conduite, alertes d’entretien et de contrôle technique." },
      { title: "Clients informés", text: "« Votre livraison arrive dans 20 minutes ».", more: "Messages automatiques avec l’heure estimée d’arrivée : moins d’absences, moins d’appels." },
      { title: "Entrepôt & stock", text: "Réception, préparation et expédition.", more: "Stock par emplacement, préparation des commandes avec scanner ou téléphone, expéditions suivies." },
      { title: "Capteurs de température", text: "Pour le transport sous froid.", more: "Température des camions et des chambres froides enregistrée en continu, alertes en cas d’écart, traçabilité prête pour les contrôles." },
    ],
    scopeTitle: "Pour toutes les activités",
    scope: ["Transporteurs", "Livraison du dernier kilomètre", "Coursiers", "Entrepôts", "Transport frigorifique", "Flottes d’entreprise", "Ambulances & VTC"],
    invent: { title: "Un suivi qu’aucun logiciel ne fait ?", text: "Un capteur sur une remorque, une étiquette connectée, un tableau de bord sur mesure : on le conçoit avec vous." },
  },
  {
    id: "association",
    title: "Associations & événements",
    lead: "Associations, clubs, organisateurs d’événements : adhésions, billetterie, bénévoles et communication, sans y passer vos soirées.",
    services: [
      { title: "Adhésions & cotisations", text: "Inscriptions et paiement en ligne.", more: "Formulaire d’adhésion, paiement de la cotisation en ligne, cartes de membre et relances automatiques au renouvellement." },
      { title: "Billetterie", text: "Billets avec QR code, contrôlés à l’entrée.", more: "Vente en ligne, tarifs multiples, scan des billets à l’entrée avec un simple téléphone, comptage en temps réel." },
      { title: "Bénévoles", text: "Qui fait quoi, et quand.", more: "Planning des bénévoles, inscriptions aux missions, rappels automatiques la veille." },
      { title: "Communication", text: "Messages aux membres en quelques clics.", more: "E-mails et SMS aux membres ou à un groupe, actualités sur votre site, inscriptions aux activités." },
      { title: "Dons", text: "Collecte en ligne et reçus automatiques.", more: "Page de don, paiement sécurisé, reçus envoyés automatiquement et suivi des donateurs." },
      { title: "Matériel & salles", text: "Prêts et réservations suivis.", more: "Qui a emprunté quoi, quelle salle est réservée, et quand tout doit revenir." },
    ],
    scopeTitle: "Pour toutes les structures",
    scope: ["Associations", "Clubs", "Comités des fêtes", "Organisateurs d’événements", "Festivals", "Salons & congrès"],
    invent: { title: "Un événement hors du commun ?", text: "Un parcours connecté, un jeu, un affichage en direct, un outil pour vos bénévoles : on le construit avec vous." },
  },
  {
    id: "industry",
    title: "Agriculture, industrie & production",
    lead: "Exploitations, ateliers, usines : on connecte vos machines et vos installations, même anciennes, pour savoir ce qui se passe et agir avant la panne.",
    services: [
      { title: "Capteurs sur les installations", text: "Température, humidité, niveau, pression.", more: "Cuves, serres, chambres froides, bâtiments d’élevage : les mesures remontent en continu et sont consultables depuis le téléphone." },
      { title: "Alertes", text: "Prévenu dès qu’il faut agir.", more: "Une valeur sort de la normale, une machine s’arrête : la bonne personne reçoit un message, jour et nuit." },
      { title: "Machines anciennes connectées", text: "Pas besoin de tout remplacer.", more: "On ajoute des capteurs et des boîtiers aux équipements existants pour les surveiller et, si besoin, les piloter à distance." },
      { title: "Suivi de production", text: "Cadences, arrêts et rendement.", more: "Compteurs de production, temps d’arrêt, causes des pannes et indicateurs simples pour améliorer le rendement." },
      { title: "Traçabilité", text: "Lots, températures et contrôles enregistrés.", more: "Chaque lot garde son historique : origine, conditions de stockage, contrôles. Rapports prêts en cas d’audit." },
      { title: "Maintenance", text: "Entretiens planifiés, pannes suivies.", more: "Calendrier d’entretien des machines, demandes d’intervention, historique des réparations et des pièces." },
    ],
    scopeTitle: "Pour toutes les exploitations",
    scope: ["Agriculture & élevage", "Serres & maraîchage", "Viticulture", "Agroalimentaire", "Ateliers & usines", "Énergie & eau"],
    invent: { title: "Une mesure que personne ne sait faire ?", text: "Un capteur pour une contrainte unique, un automate à moderniser, un tableau de bord pour vos équipes : on le conçoit avec vous, de l’électronique au logiciel." },
  },
  {
    id: "leisure",
    title: "Zoos, parcs & loisirs",
    lead: "Zoos, parcs d’attractions, aquariums, musées, sites touristiques : billetterie, accès, information des visiteurs et surveillance des installations, dans un seul système.",
    services: [
      { title: "Billetterie en ligne", text: "Billets datés avec QR code.", more: "Vente en ligne, créneaux de visite, tarifs famille et groupes, abonnements annuels, paiement sécurisé." },
      { title: "Portiques & contrôle d’accès", text: "Entrée fluide, comptage en temps réel.", more: "Tourniquets et portiques connectés, scan des billets, nombre de visiteurs sur le site à chaque instant." },
      { title: "Application de visite", text: "Plan, horaires et parcours sur le téléphone.", more: "Plan interactif, horaires des animations et des nourrissages, temps d’attente, notifications pendant la visite." },
      { title: "Capteurs pour les animaux et les bassins", text: "Température, qualité de l’eau, humidité.", more: "Enclos, vivariums, bassins : les conditions sont surveillées en continu et les soigneurs sont alertés au moindre écart." },
      { title: "Écrans & information", text: "Les bonnes infos au bon endroit.", more: "Écrans aux entrées et près des attractions, messages en direct, informations multilingues." },
      { title: "Caisse, restauration & boutique", text: "Tout ce qui se vend sur le site.", more: "Caisses aux snacks et à la boutique, commandes sur mobile, chiffres de la journée en temps réel." },
    ],
    scopeTitle: "Pour tous les sites de loisirs",
    scope: ["Zoos & parcs animaliers", "Parcs d’attractions", "Aquariums", "Musées", "Sites touristiques", "Parcs aquatiques", "Accrobranche & activités"],
    invent: { title: "Une expérience visiteur unique ?", text: "Une animation interactive, un parcours connecté, un capteur pour une espèce particulière : on le construit avec vous." },
  },
  {
    id: "camping",
    title: "Campings & résidences de vacances",
    lead: "Campings, villages vacances, résidences : de la barrière à l’hébergement, tout est connecté pour accueillir plus simplement et dépenser moins d’énergie.",
    services: [
      { title: "Barrière & accès", text: "Par code, badge ou plaque d’immatriculation.", more: "Ouverture automatique pour les clients, accès temporaires pour les visiteurs, historique des passages." },
      { title: "Réservations", text: "Emplacements et hébergements en ligne.", more: "Réservation directe sur votre site, plan du camping, tarifs selon la saison et les options." },
      { title: "Hébergements connectés", text: "Chauffage, éclairage et serrure à distance.", more: "Mobil-homes et chalets mis en économie entre deux séjours et remis en confort avant l’arrivée, code d’accès propre à chaque client." },
      { title: "Bornes électriques", text: "Électricité suivie et facturée.", more: "Bornes pour emplacements et véhicules électriques, consommation mesurée et ajoutée à la note." },
      { title: "Accueil & animations", text: "Infos, planning et inscriptions sur le téléphone.", more: "Livret d’accueil numérique, programme des animations, inscriptions, messages aux vacanciers." },
      { title: "Entretien & ménage", text: "Les équipes savent quoi préparer.", more: "Hébergements à préparer, état en temps réel, signalement des pannes avec photo." },
    ],
    scopeTitle: "Pour tous les hébergements de plein air",
    scope: ["Campings", "Villages vacances", "Résidences de tourisme", "Aires de camping-car", "Glampings", "Gîtes de groupe"],
    invent: { title: "Une idée pour vos vacanciers ?", text: "Un service original, un équipement de loisir connecté, un outil pour vos saisonniers : on le conçoit avec vous." },
  },
  {
    id: "building",
    title: "Copropriétés, bureaux & parkings",
    lead: "Copropriétés, immeubles de bureaux, parkings : accès, sécurité, énergie et réservations gérés depuis un seul système, pour les gestionnaires comme pour les occupants.",
    services: [
      { title: "Contrôle d’accès", text: "Badge, code ou téléphone.", more: "Droits par personne et par horaire, badges perdus désactivés en un clic, accès temporaires pour les livreurs et les prestataires." },
      { title: "Interphone vidéo", text: "Ouvrir la porte depuis son téléphone.", more: "Appel vidéo sur le téléphone de l’occupant, ouverture à distance, plus besoin d’être chez soi pour recevoir." },
      { title: "Parking & barrières", text: "Places attribuées ou partagées.", more: "Ouverture par badge ou plaque, réservation des places, suivi de l’occupation et des véhicules électriques en charge." },
      { title: "Énergie & bâtiments", text: "Chauffage et éclairage selon la présence.", more: "Parties communes et bureaux éclairés et chauffés seulement quand c’est utile, suivi des consommations, alertes en cas de dérive." },
      { title: "Salles & espaces partagés", text: "Réservés en ligne par les occupants.", more: "Salles de réunion, buanderie, salle commune : planning en ligne, accès ouvert au bon créneau." },
      { title: "Incidents & interventions", text: "Signalés, transmis, suivis.", more: "Un occupant signale une panne avec photo, le gestionnaire la transmet au bon prestataire et suit la réparation." },
    ],
    scopeTitle: "Pour tous les bâtiments",
    scope: ["Copropriétés", "Immeubles de bureaux", "Parkings", "Espaces de coworking", "Résidences services", "Zones d’activité"],
    invent: { title: "Un bâtiment avec des besoins particuliers ?", text: "Un accès spécifique, un équipement à connecter, un portail pour vos occupants : on le construit avec vous." },
  },
  {
    id: "business",
    title: "PME, startups & projets",
    lead: "Une entreprise qui grandit, une idée à lancer, un processus à automatiser : on construit l’outil qu’il vous faut, en commençant par une première version utile.",
    services: [
      { title: "Outil interne sur mesure", text: "Votre façon de travailler, en logiciel.", more: "Suivi des clients, des commandes, des projets ou des équipes : un outil fait pour votre organisation, pas l’inverse." },
      { title: "Portail client", text: "Vos clients autonomes, 24 h/24.", more: "Commandes, suivi, documents, factures et support dans un espace à vos couleurs." },
      { title: "Première version (MVP)", text: "Tester une idée sans tout construire.", more: "On réalise l’essentiel, on le met entre les mains de vrais utilisateurs, puis on décide ensemble de la suite." },
      { title: "IA & automatisation", text: "Les tâches répétitives disparaissent.", more: "Assistant IA branché sur vos données, tri des demandes, génération de documents, rapports automatiques. Avec l’IA YVEXOR, Claude ou ChatGPT." },
      { title: "Connexion de vos outils", text: "Vos logiciels se parlent enfin.", more: "On relie votre site, vos ventes, votre stock et vos outils de gestion pour supprimer la double saisie." },
      { title: "Tableaux de bord", text: "Vos chiffres clés en un coup d’œil.", more: "Ventes, marges, production, satisfaction : des indicateurs clairs, mis à jour tout seuls, sur ordinateur et téléphone." },
    ],
    scopeTitle: "Pour tous les projets",
    scope: ["PME", "Startups", "Indépendants", "Franchises", "Réseaux multisites", "Projets innovants"],
    invent: { title: "Une idée que personne n’a encore faite ?", text: "C’est exactement notre terrain de jeu : logiciel, IA, objets connectés. On la construit avec vous, étape par étape, à la mesure de votre budget." },
  },
];

export const tradePageById = Object.fromEntries(tradePages.map((page) => [page.id, page])) as Record<string, TradePage>;

/** Where a trade card leads: its own page, else its catalogue offer, else its domain. */
export function tradeHref(trade: Pick<Trade, "id" | "offer" | "rubric">) {
  if (tradePageById[trade.id]) return `/solutions/metiers/${trade.id}/`;
  if (trade.offer) return `/solutions/offres/${trade.offer}/`;
  return `/solutions/domaines/${trade.rubric}/`;
}

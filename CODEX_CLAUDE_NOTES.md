# Notes Codex ↔ Claude

Fichier partagé pour que Codex et Claude Code se laissent des messages quand ils travaillent sur ce dépôt à des moments différents. Chacun ajoute une entrée en haut, signée et datée. Ne pas supprimer les entrées précédentes.

> **À partir du 2026-10-24, ce fichier a deux parties :**
> 1. **SOURCE DE VÉRITÉ** (section ci-dessous, à tenir à jour en continu, pas en entrées datées) — direction produit, architecture, état du contenu. **Claude et Codex doivent la lire avant toute intervention structurante, et y consigner les décisions qui changent la direction, l'architecture ou le périmètre.**
> 2. **Journal** (entrées datées plus bas) — historique chronologique, on continue d'ajouter en haut sans réécrire les anciennes entrées.

---

# SOURCE DE VÉRITÉ — Direction & Architecture YVEXOR

*Dernière mise à jour : 2026-10-24 par Claude, après réconciliation avec `CODEX_AUDIT.md` (audit technique indépendant de Codex, lecture seule, même date). Les deux analyses convergent sur l'essentiel — voir §9 pour le détail des points d'accord/désaccord. Ce brief remplace les décisions de design précédentes (voir journal du 21/10 pour l'historique) sur les points où il les contredit — notamment la palette bleue et le hero en code.*

## 1. Positionnement — ce que YVEXOR N'EST PAS et CE QU'IL EST

**À ne jamais laisser le site suggérer :** une simple société de caisse, une agence web, ou une entreprise d'IA.

**Message central :** YVEXOR part d'un besoin réel et construit la solution autour — même si ce besoin n'existe pas encore sous forme de produit standard. Conçoit, développe, connecte et automatise des solutions complètes, **du logiciel jusqu'au terrain physique**.

**Risque concret identifié dans l'existant (voir §3) :** le site a aujourd'hui 17 pages "caisse par métier" quasi identiques (une par type de commerce) contre 1 seule page logiciel sur mesure — en volume de pages, le site *donne l'impression* d'être une société de caisse, même si le texte dit autre chose. C'est probablement la source du malaise de l'utilisateur. La priorité n'est pas d'ajouter du contenu, c'est de **rééquilibrer le poids visuel/structurel** entre caisse et le reste.

## 2. Les deux axes de navigation voulus

Le site doit pouvoir se parcourir de deux façons, en plus de l'accueil :

**A. Par solution** — logiciels métier, IA, automatisation, caisse & commerce, gestion/ERP/CRM, sites & e-commerce, applications, hébergement & infrastructure, IoT, domotique, capteurs, Raspberry/ESP/microcontrôleurs, matériel, bornes, paiements, billetterie, contrôle d'accès, réservation, affichage, équipements industriels, connexion/automatisation d'objets ou machines non connectés à l'origine, projets sur mesure.

**B. Par métier** — restaurant, fast-food, commerce, hôtel, coiffure/beauté, padel/tennis/sport, immobilier, industrie, automobile, loisirs, parc/zoo, événementiel, construction, services, etc.

Ouverture prévue (non prioritaire, à valider licences avant tout développement) : intégration/adaptation de briques open source type Odoo Community quand c'est pertinent.

## 3. Inventaire de l'existant — ce qui est déjà là (à conserver, à réutiliser)

Le contenu écrit est **beaucoup plus riche que ce qu'on pourrait croire** — ne rien réécrire à l'aveugle, remapper d'abord.

**Système "par solution" (déjà bien entamé) :**
- `data/v2-solutions.ts` — 8 catégories larges utilisées sur l'accueil/`/solutions/` (V2, créées le 21/10) : Sur mesure, IA & automatisation, Commerce/caisse/billetterie, Gestion & réservation, Sites & applications, Hébergement & infrastructure, Systèmes connectés & bâtiments, Équipements & terrain.
- `data/seo-pages.ts` — 17 pages `[slug]` détaillées et bien écrites (ancien design) : `domotique-batiments`, `applications-metier`, `systemes-connectes`, `site-presence-web`, `agence-ia-marseille`, `automatisation-entreprise`, `intelligence-artificielle-entreprise`, `logiciel-caisse-marseille`, `logiciel-garage`, `logiciel-sur-mesure`, `solutions-hotels`, `solutions-restaurants`, `tarifs-partenariat`, + `contact`, `faq`, `mentions-legales`, `politique-confidentialite`.
- **Trous confirmés dans "par solution" :** rien de dédié pour gestion/ERP/CRM, hébergement/infrastructure (juste une case du grid), IoT générique (seule la domotique résidentielle/bâtiment existe), capteurs/Raspberry/ESP/microcontrôleurs (absent), bornes/paiement/billetterie/contrôle d'accès/réservation/affichage (mentionnés en passant dans solutions-hotels/restaurants, jamais en page dédiée), équipements industriels (absent), Odoo/open source (absent, nouveau).

**Système "par métier" (faible, à renforcer) :**
- `data/caisse-professions.ts` — 17 pages `/caisse/[metier]/` (commerce, alimentation, epicerie, superette, boulangerie, patisserie, boucherie, primeur, fleuriste, vetements, bijoux, tabac-presse, snack, coiffure, barber, esthetique, autre). **Problème : ces pages ne parlent QUE de caisse/encaissement**, pas de la solution YVEXOR complète pour ce métier (pas d'IA, pas d'IoT, pas de site web, etc.) — c'est exactement le biais "société de caisse" à corriger.
- Quelques pages "cas d'usage" plus larges déjà écrites dans `seo-pages.ts` : `solutions-restaurants`, `solutions-hotels`, `logiciel-garage` — celles-ci couvrent déjà plusieurs solutions pour un même métier, c'est le bon modèle à répliquer.
- **Métiers demandés par l'utilisateur et absents aujourd'hui :** padel/tennis/sport, immobilier, industrie, automobile (au-delà du garage), loisirs, parc/zoo, événementiel, construction, services.

**Autres briques à conserver telles quelles :**
- `lib/boutique.ts` + `data/boutique-products.json` (20 produits) + `/boutique/`, `/boutique/[slug]/`, `/materiel/` — catalogue matériel (bornes, imprimantes, tablettes, robot humanoïde, etc.). Reste la couche "équipement" transverse, utile à la fois pour les pages solution et métier. Pas de changement structurel nécessaire.
- Système caisse (`/caisse/`, `components/caisse-configurator.tsx`, `data/caisses.json`) — le configurateur fonctionne bien, le garder, mais le **re-situer** comme LA solution "Commerce & caisse" parmi d'autres, pas comme un univers parallèle à "métiers".
- `app/home-journey.tsx` (section scroll "Logiciel → Connexion → Infrastructure → Matériel → Terrain") — bon début pour les animations "explicatives" demandées, à faire évoluer vers quelque chose de plus diagrammatique (voir §6) plutôt qu'à jeter.
- `components/scroll-reveal.tsx`, les primitives boutons/liens de `v2-shell.css` — mécaniques réutilisables, indépendantes de la palette de couleur.
- Tous les tests (`scripts/seo-check.cjs`, `scripts/theme-check.cjs`, `scripts/caisse-sync.cjs`) doivent continuer à passer à chaque étape.

## 4. Système visuel — ce qui doit changer

**État actuel (à corriger) :** deux systèmes de design coexistent, et **les deux sont teintés bleu**, pas noir/blanc :
- L'ancien système (`app/themes.css`, 544 tokens `--palette-N`, utilisé par `histoire`, `caisse`, `boutique`, `materiel`, les pages `seo-pages.ts`) — bleu `#176bd6`/`#0098d6`.
- Le système V2 que j'ai créé le 21/10 (`app/v2-shell.css`, utilisé par l'accueil, `/solutions/`, `/projets/`, `/a-propos/`) — bleu `#176bcc` aussi.

**Direction validée (nouvelle) :** premium, noir/blanc, grandes vraies photos, grandes typographies, beaucoup d'espace, peu de texte. Inspiration Tesla (impact visuel) / Apple (simplicité, animations) — sans copier.

→ **Décision à prendre avant tout code** : soit (a) on introduit un troisième token set neutre et on migre progressivement, soit (b) on redéfinit les tokens `--v2-*` existants en neutre (plus rapide, casse moins de choses, mais le nom "v2" perd son sens). Recommandation : option (b), en gardant le bleu uniquement comme accent minimal (liens, focus), pas comme couleur de marque dominante. **Pas encore implémenté, en attente de validation utilisateur sur la palette exacte.**

## 5. Page d'accueil — écarts entre l'existant et le brief

L'accueil actuel (depuis le 21/10) est déjà structurellement proche de ce qui est demandé : hero plein cadre (image derrière texte), section "parcours" en scroll, grille de solutions, CTA final. Mais :

| Demandé | Existant | Écart |
|---|---|---|
| Hero = grande vraie photo/vidéo de travail technologique concret | Hero = capture d'écran de code stylisée | À remplacer — nécessite un vrai visuel (photo/vidéo réelle), pas une image générée (principe déjà validé avec l'utilisateur le 21/10, continue de s'appliquer) |
| 2 CTA : "Découvrir YVEXOR" / "Explorer les solutions" | 2 CTA actuels : "On en parle ?" (contact) / "Découvrir YVEXOR" | À ajuster — le 2ᵉ CTA doit pointer vers `/solutions/`, pas vers une approche contact en premier |
| Tagline envisagée : *"Du logiciel aux objets physiques, nous connectons et automatisons ce qui ne l'était pas."* | *"Du logiciel au terrain. YVEXOR construit la solution."* | Proche dans l'esprit, à trancher avec l'utilisateur laquelle garder |
| Homepage = portail court, pas une landing page | Déjà relativement court (hero, parcours, solutions, contact) | Globalement OK, à surveiller en l'étoffant |
| Palette noir/blanc premium | Dark bleu partout (sauf la grille solutions, repassée claire le 21/10) | Voir §4 |

## 6. Animations — direction demandée

Veut **plus** d'interactions/animations, mais toujours **explicatives**, jamais décoratives. Exemples donnés par l'utilisateur :
- Ordinateur → logiciel → capteur → machine → paiement → tableau de bord
- IoT : équipement classique → connecté
- Billetterie : ticket → QR → contrôle d'accès
- Automatisation : capteur → condition → action
- Paiement : borne → transaction → logiciel de gestion
- Format "AVANT → INTERVENTION YVEXOR → APRÈS" (utile pour de futures pages projets)

Ton visé : sobre, fluide, premium — **pas cyberpunk, pas "site IA"**. C'est cohérent avec ce qu'on a déjà évité (pas de particules, pas de glow gratuit, pas de photos stock IA pour le hero).

Le `ScrollReveal` (fade/translate au scroll) et le `HomeJourney` (barre de progression liée au scroll) actuels sont une bonne base technique mais restent abstraits/textuels — pas encore de vrais diagrammes de flux. Nouveau pattern à concevoir, pas encore commencé.

## 7. Architecture définitive proposée (à valider avant tout code)

```
/                    Accueil — portail court : hero (vraie photo/vidéo) → process strip animé
                     → double entrée "Par solution" / "Par métier" → projet phare (si dispo) → CTA
/solutions/          Hub "par solution", organisé en clusters (pas une grille plate de 8) :
                       · Logiciel & IA           (sur mesure, IA, automatisation)
                       · Commerce & paiement     (caisse, billetterie, paiement, bornes, contrôle d'accès, réservation)
                       · Connecté & terrain      (IoT, domotique, capteurs/microcontrôleurs, équipements industriels,
                                                   connexion d'objets existants)
                       · Digital & infrastructure (sites, e-commerce, applications, gestion/ERP/CRM, hébergement)
                     Chaque sous-solution a sa page (réutilise seo-pages.ts existant, comble les trous du §3)
/metiers/            NOUVEAU hub "par métier" (n'existe pas aujourd'hui), liste tous les métiers,
                     chaque page métier = les solutions pertinentes pour CE métier (pas que la caisse)
                     Réutilise/élargit solutions-restaurants, solutions-hotels, logiciel-garage comme modèle ;
                     réutilise caisse-professions.ts mais reframé au-delà du seul encaissement ;
                     complète les métiers manquants (§3)
/caisse/...          Conservé tel quel techniquement (configurateur), mais re-rattaché dans la nav comme
                     LA page de la solution "Commerce & paiement", pas comme concurrent de /metiers/
/boutique/ /materiel/ Conservés tels quels — couche équipement transverse
/projets/            Conservé — vitrine "AVANT → INTERVENTION → APRÈS" quand des projets réels existent
/a-propos/ /histoire/ À CONSOLIDER : une seule page "Découvrir YVEXOR" définitive. Aujourd'hui les deux existent
                     (a-propos = stub V2 créé le 21/10, histoire = récit fondateur plus riche, ancien design).
                     Proposition : garder l'URL /a-propos/ (c'est là que pointe le CTA "Découvrir YVEXOR"),
                     y mettre le contenu de fond de /histoire/, rediriger /histoire/ dessus. PAS FAIT, à valider.
/contact/ /faq/ /tarifs-partenariat/ /mentions-legales/ /politique-confidentialite/   Conservés tels quels
```

Nav principale proposée : **Accueil · Solutions · Métiers · Projets · À propos · Contact**

## 8. Ce qui n'est PAS encore fait (ne rien exécuter sans validation)

- Aucun changement de palette couleur appliqué.
- Aucune nouvelle page métier créée.
- Aucune restructuration de `/solutions/` en clusters.
- Aucun `/metiers/` créé.
- Hero pas encore changé (toujours le code screenshot).
- Fusion `/a-propos/` + `/histoire/` pas faite.
- Odoo/open source : rien entamé, nécessite une vérification de licences avant tout développement.
- **Aucune des décisions ci-dessous (§9-10) n'est encore implémentée.** Cette mise à jour du 24/10 est le résultat de la réconciliation Claude ↔ `CODEX_AUDIT.md`, pas un changement de code.

## 9. ARCHITECTURE TECHNIQUE VALIDÉE

*Réconciliation entre la proposition initiale de Claude (§1-7 ci-dessus), l'audit indépendant de Codex (`CODEX_AUDIT.md`, lecture seule) et le principe éditorial validé par l'utilisateur : **Solution ↕ Métier ↕ Projet réel**, une solution pouvant apparaître dans plusieurs métiers.*

### 9.1 Structure Solutions / Métiers / Projets

Trois entités de contenu, reliées par ID, jamais par duplication de page :

- **Solution** — une capacité YVEXOR (ex. Réservation, Caisse & commerce, Domotique, IA documentaire...). Appartient à un cluster de navigation (§9.2) mais le cluster n'est qu'une facette de rangement, pas une limite de catalogue.
- **Métier** (type `Industry` en code, cohérent avec le reste du code en anglais) — un secteur d'activité (restaurant, hôtel, padel, coiffure, parc de loisirs...). Référence les solutions pertinentes pour lui, dans l'ordre de pertinence.
- **Projet réel** — un cas concret, relie une ou plusieurs solutions **et** un ou plusieurs métiers, avec statut de publication explicite (voir §9.2 type `Project`). Aucun projet fictif, jamais (principe déjà en vigueur sur `/projets/`).

Une solution (ex. "Réservation") peut donc apparaître sous Restaurant, Hôtel, Padel, Coiffure, Parc de loisirs sans que son contenu soit recopié cinq fois — seule la relation `industryIds` change, et chaque page Métier peut adapter le contexte/bénéfices d'une solution partagée sans dupliquer sa prose.

### 9.2 Modèle de données

Fichiers retenus (proposition de Codex, reprise telle quelle — elle est propre et correspond exactement au principe validé) :

```
data/solution-clusters.ts   // 4 portes de navigation, métadonnées seulement (id, label, description)
data/solutions.ts           // catalogue des solutions
data/industries.ts          // catalogue des métiers
data/projects.ts            // cas réels, statut de publication
```

Types communs (évolution du type `SeoPage` déjà existant dans `data/seo-pages.ts`, pas une invention parallèle — `SeoPage` devient `EditorialPage` + métadonnées de relation portées par l'entité) :

```ts
type EditorialSection = { title: string; text: string; items?: string[] };
type EditorialPage = {
  title: string; metaTitle?: string; description: string; intro: string;
  sections: EditorialSection[]; faq?: EditorialSection[]; cta?: string;
};

type Cluster = "logiciel-ia" | "commerce-paiement" | "connecte-terrain" | "digital-infrastructure";

type Solution = {
  id: string;            // stable, ex. "commerce-caisse" — ne change jamais même si le slug/titre évolue
  slug: string;
  cluster: Cluster;
  eyebrow: string;
  industryIds: string[];
  projectIds: string[];
  page: EditorialPage;
};

type Industry = {
  id: string;
  slug: string;
  name: string;           // "métier" dans le contenu FR, "Industry" dans le code (cohérence avec le reste du repo)
  solutionIds: string[];  // ordonné par pertinence
  projectIds: string[];
  page: EditorialPage;
};

type Project = {
  id: string;
  slug: string;
  title: string;
  need: string;
  intervention: string;         // ou string[] pour un déroulé avant/pendant/après
  outcome: string;
  solutionIds: string[];
  industryIds: string[];
  media: { src: string; alt: string }[];
  publicationStatus: "draft" | "approved";   // seuls les "approved" sont rendus publiquement — règle "zéro contenu fictif" appliquée en code, pas juste par convention
};
```

**Pourquoi reprendre la proposition de Codex plutôt qu'en inventer une autre :** elle est strictement alignée avec le principe Solution↕Métier↕Projet validé par l'utilisateur, elle réutilise la forme de `SeoPage` déjà écrite (pas de réécriture de contenu), et elle permet à une solution d'apparaître dans plusieurs métiers sans duplication — exactement ce qui est demandé.

### 9.3 Stratégie de migration (séquencement, pas de big-bang)

Reprend explicitement la recommandation de Codex : pas de nettoyage aveugle avant migration, suppression seulement après preuve de non-usage.

1. **Créer la couche data** (`solutions.ts`, `industries.ts`, `projects.ts`, `solution-clusters.ts`) en **réutilisant** le contenu existant : les 8 entrées de `v2-solutions.ts` et les pages pertinentes de `seo-pages.ts` (`logiciel-caisse-marseille`, `automatisation-entreprise`, `domotique-batiments`, etc.) deviennent des `Solution`. `solutions-restaurants`, `solutions-hotels` deviennent les deux premiers `Industry` (ce sont déjà, de fait, des pages métier multi-solutions — le bon gabarit à répliquer). Rien n'est réécrit à ce stade, seulement retagué/déplacé dans le nouveau schéma.
2. **Construire `/metiers/` et `/solutions/` par-dessus cette donnée**, sans toucher aux pages existantes qui restent à leur URL actuelle (voir §9.5).
3. **Combler les trous de catalogue** (ERP/CRM, hébergement dédié, capteurs/Raspberry/ESP, bornes/billetterie/contrôle d'accès/réservation/affichage, équipements industriels) comme nouvelles `Solution`, et les métiers manquants (padel/tennis, immobilier, industrie, automobile, loisirs, parc/zoo, événementiel, construction, services) comme nouveaux `Industry`, en priorisant selon §10.
4. **Seulement après** que les nouvelles routes sont en place et stables : passe de style/tokens (§9.4), puis suppression des composants/styles prouvés orphelins (§9.11).

### 9.4 Stratégie CSS

- **Pas de grand nettoyage préalable.** Les familles de pages existantes (ancien design : `histoire`, `caisse`, `boutique`, `materiel`, pages `seo-pages.ts` ; V2 : accueil, `/solutions/`, `/projets/`, `/a-propos/`) gardent leurs styles actuels tant qu'elles n'ont pas été migrées individuellement.
- Isoler les styles par famille de page (déjà globalement le cas via CSS Modules + classes préfixées `v2-`/`seo-`/`cx-`) ; ne retirer une règle de l'ancien `globals.css`/`themes.css` qu'après avoir vérifié qu'aucune page ne l'utilise plus.
- La palette (bleu partout aujourd'hui, dans les deux systèmes) est traitée comme un chantier **séparé et explicite**, pas comme un sous-produit de la migration de contenu — voir §10, couleur d'accent encore ouverte.
- Tailwind est présent en dépendance/config mais sans usage visible significatif (relevé Codex) — candidat à suppression, à confirmer par recherche d'usage avant de le retirer (pas fait maintenant).

### 9.5 Stratégie SEO / routes

- **Aucune URL indexée existante ne bouge sans redirection.** Le mécanisme existe déjà et est éprouvé : `components/migration-redirect.tsx` (meta-refresh + page `noindex`), déjà utilisé pour `/realisations/` et `/yvexor-pos/`. On réutilise ce même pattern pour toute future dépréciation d'URL, on n'en invente pas un autre.
- **Décision de routing retenue :** les pages existantes (les 17 `/caisse/[metier]/`, les 17 pages `/[slug]/` de `seo-pages.ts`) **restent à leur URL actuelle** — elles sont retaguées dans le graphe de données (`solutionIds`/`industryIds`) et deviennent des cibles de lien croisé depuis les nouvelles pages, mais ne sont pas déplacées. Les **nouvelles** solutions/métiers créés à partir de maintenant vivent sous les espaces propres `/solutions/[slug]/` et `/metiers/[slug]/`. Raison : déplacer 17+17 URLs déjà indexées imposerait un inventaire de redirections lourd pour un bénéfice cosmétique ; mieux vaut un namespace propre pour le nouveau contenu et des liens croisés généreux vers l'existant.
- `/projets/` reste `noindex` tant qu'aucun projet réel n'est `publicationStatus:"approved"` ; repasser en indexable et l'ajouter au sitemap seulement à ce moment-là.
- Revalider `scripts/seo-check.cjs` (titres/descriptions uniques, H1, canonical, JSON-LD, alt/dimensions, liens internes, sitemap/robots) à chaque étape de migration — c'est déjà l'outil de garde-fou, on le garde comme critère de non-régression.
- Écart "17 vs 18" relevé par Codex (comptage lexical de `slug:`) : vérifié — 17 métiers caisse réels + 1 occurrence du mot "slug" dans la définition du type `Profession`. Pas un vrai écart, juste un artefact de comptage. Classé.

### 9.6 Stratégie animations

Approche légère validée par l'utilisateur, confirmée par l'audit Codex : **CSS d'abord, `IntersectionObserver` pour les reveals, SVG pour les schémas/flux, `requestAnimationFrame` seulement si une progression liée au scroll est réellement nécessaire.** Pas de librairie d'animation tant qu'un besoin de séquencement complexe n'est pas concret (et ce besoin n'existe pas aujourd'hui).

Les animations doivent **raconter une connexion**, jamais décorer : ordinateur → logiciel → capteur → machine → paiement → tableau de bord ; objet non connecté → YVEXOR → objet connecté ; ticket → QR → contrôle d'accès ; capteur → condition → action ; borne → paiement → gestion ; AVANT → YVEXOR → APRÈS (utile pour les futures pages projets réels).

Base technique déjà en place à faire évoluer, pas à jeter : `ScrollReveal` (reveal au scroll, respecte `prefers-reduced-motion`), `HomeJourney` (progression liée au scroll). Composants à regarder comme inspiration pour les futurs schémas explicatifs (pas de refonte technique imposée) : `history-demo`, `history-connections`, `automation-showcase`, `connected-ecosystem`, `project-method`.

### 9.7 Stratégie responsive / accessibilité

- Conserver les paliers responsive déjà codés (1050/900/820/760/600/520/430/375px) comme base ; les nouvelles pages (solutions/métiers/projets) s'alignent dessus plutôt que d'en inventer de nouveaux.
- `prefers-reduced-motion` obligatoire sur **toute** nouvelle interaction, comme c'est déjà le cas sur `ScrollReveal`/`v2-shell.css`/`home-v2.module.css`/`home-journey.tsx`.
- Checklist a11y à vérifier avant publication de chaque nouvelle famille de page (relevé Codex, pas encore mesuré) : contrastes réels clair/sombre une fois la palette tranchée, ordre de tabulation et focus visible sur les contrôles natifs (configurateur inclus), annonce des changements dynamiques, comportement focus après fermeture du menu mobile, lecture SVG/diagrammes par lecteur d'écran, alt des visuels décoratifs vs informatifs, zoom texte 200 %, taille des cibles tactiles.
- Navigation sans JS : vérifier que les pages restent lisibles/navigables si un script échoue (cohérent avec le choix CSS/observer plutôt que JS lourd en §9.6).

### 9.8 Stratégie médias

- `public/` pèse actuellement ~34,3 Mo (quasi uniquement des images). Avant d'ajouter la photo/vidéo hero réelle : faire l'inventaire des assets utilisés vs orphelins, et définir un budget de poids par page plutôt que d'empiler.
- Hero futur : prévoir dès le départ les variantes responsive (mobile/desktop, `srcSet`/`sizes` ou `<picture>`) — l'asset mobile existe déjà dans `public/` pour l'ancien hero mais n'était pas branché ; ne pas reproduire cet oubli.
- Pas de vidéo dans le repo actuellement : si le hero devient une vidéo, prévoir compression, poster statique de repli, et désactivation sur `prefers-reduced-motion`/connexion lente.
- Le service worker (`public/sw.js`) met en cache les assets à chemin fixe — règle déjà établie le 21/10 et confirmée pertinente par l'audit : **toute modification d'un asset à chemin fixe doit s'accompagner d'un bump de `CACHE`** dans ce fichier.

### 9.9 Éléments existants conservés (confirmé par les deux analyses)

Next.js/React/TypeScript + export statique · le configurateur caisse et `data/caisses.json` · le catalogue boutique (`lib/boutique.ts`, `data/boutique-products.json`, `/boutique/`, `/materiel/`) · tout le contenu éditorial de `seo-pages.ts` et `caisse-professions.ts` (remappé, pas réécrit) · `scripts/seo-check.cjs` / `theme-check.cjs` / `caisse-sync.cjs` · `ScrollReveal`, `HomeJourney`, les primitives `v2-shell.css` · le pattern `MigrationRedirect` pour les dépréciations d'URL · la structure de nav proposée (Accueil · Solutions · Métiers · Projets · À propos · Contact).

### 9.10 Éléments progressivement remplacés

La grille plate de `v2-solutions.ts` (remplacée par `data/solutions.ts`, voir §9.3) · la déclinaison caisse-only des 17 métiers (reste en place à son URL, mais n'est plus le seul point d'entrée "par métier" une fois `/metiers/` construit) · la double page entreprise `/a-propos/` + `/histoire/` (fusion vers une seule, l'autre devient un `MigrationRedirect`) · les tokens couleur bleus des deux systèmes (remplacés progressivement par la palette tranchée en §10, chantier séparé de la migration de contenu).

### 9.11 Éléments à NE PAS supprimer immédiatement (vérifier l'usage d'abord)

Liste de candidats orphelins relevée par l'audit Codex — **à vérifier (imports, pages générées, usages indirects), pas à supprimer maintenant** : `components/star-sky` + `star-sky.css`, `components/assistant-yvexor` (état "bientôt disponible"), `components/visual-hero`, Tailwind (dépendance + config, usage non confirmé). Ne pas étendre cette liste sans vérification équivalente.

## 10. DÉCISIONS ENCORE OUVERTES

Limité à ce qui bloque réellement le début de l'implémentation :

1. **Couleur d'accent définitive** — base noir/blanc/neutres validée, mais l'accent (actuellement bleu dans les deux systèmes) n'est **pas** tranché. Ne pas réutiliser le bleu par défaut.
2. **Média hero réel** (photo ou vidéo d'un vrai travail technique, logiciel + physique) — en attente de l'utilisateur, remplace le hero code-screenshot actuel.
3. **Priorisation des métiers à écrire en premier** — la liste demandée est longue (restaurant, fast-food, commerce, hôtel, coiffure/beauté, padel/tennis/sport, immobilier, industrie, automobile, loisirs, parc/zoo, événementiel, construction, services) ; par quoi commencer au-delà de restaurant/hôtel/garage qui existent déjà en embryon ?
4. **Contenu de la page "Découvrir YVEXOR" fusionnée** — reprendre `/histoire/` intégralement, ou le condenser pour coller au ton "peu de texte" de la nouvelle direction ?

---

## [Claude — 2026-10-21, suite]

Tout ce qui est décrit dans l'entrée ci-dessous a été mergé sur `main` et **déployé en production** (yvexor.com) le même jour. État actuel, pour éviter de refouiller l'historique :

- Hero accueil : full-bleed, `hero-code-v1.webp` en fond flouté (`filter: blur(1.5px) saturate(.8) brightness(.9)`, `opacity: .75`) derrière un dégradé (`.hero::after` dans `home-v2.module.css`), texte en overlay à gauche — demandé explicitement par l'utilisateur pour coller à sa maquette Figma (hero plein cadre, image derrière le texte). A demandé plusieurs allers-retours de réglage (le voile était d'abord trop fort → quasi invisible, rééquilibré avec du flou plutôt que juste de l'opacité).
- Section "Ce qu'on peut faire" : repassée en fond clair (#f4f5f7) avec cartes à icônes (`components/solution-icon.tsx`, 8 icônes SVG inline simples, pas d'assets externes) — remplace l'ancienne grille numérotée sombre, pour coller à la maquette.
- Bug corrigé : `object-position` de l'image de fond à 115% créait un vide visible sur les largeurs ~900-1050px (fenêtre/tablette) — repassé à 100%.
- Le service worker (`public/sw.js`) n'avait pas changé de nom de cache depuis le 19/09 malgré les déploiements — bumpé à `yvexor-solutions-2026-10-21`. **Si tu retouches des assets statiques à chemin fixe (images, pas les chunks JS/CSS hashés), pense à bumper `CACHE` dans ce fichier sinon les visiteurs récurrents gardent l'ancienne version en cache.**
- L'utilisateur a explicitement validé : garder le thème sombre pour le reste (hero/journey/contact), mais passer "Ce qu'on peut faire" en clair comme la maquette. Pas demandé d'aligner le reste du site sur l'alternance sombre/clair de la maquette au-delà de ça.

Toujours en attente (inchangé depuis l'entrée précédente) : pages `histoire`, `caisse`, `boutique`, `materiel`, pages génériques (`seo-page.tsx`) encore sur l'ancien design. `npm audit` (11 vulnérabilités transitives) pas traité.

---

## [Claude — 2026-10-21]

Branche `codex/yvexor-v2`, en continuité du commit `a47d05b "chore: checkpoint before YVEXOR V2 redesign"`.

**Fait :**
- Nettoyage : suppression des dépendances mortes (`three`, `gsap`, `framer-motion`, `@studio-freight/lenis`, jamais importées), du composant `MobileTabBar` (toujours `null`, 7 appels) et du composant orphelin `futuristic-effects.tsx`.
- Finalisation de la refonte V2 que tu avais commencée : accueil (hero + section "parcours" scroll-driven + grille solutions), nouvelles pages `/solutions/` et `/projets/`, `/a-propos/` reconstruite en vraie page (n'est plus une redirection vers `/histoire/`), footer/sitemap/metadata mis à jour en conséquence.
- Ajout d'un `ScrollReveal` (IntersectionObserver vanilla, respecte `prefers-reduced-motion`) + micro-interactions hover (bouton, tuiles solutions, liens) dans `v2-shell.css` / `home-v2.module.css`.
- Hero de l'accueil : l'utilisateur a proposé 2 photos (maquette Figma trop basse résolution, puis une image IA trop "démo IA" de son propre aveu) — on a tranché pour autre chose : `public/images/v2/hero-code-v1.webp`, un screenshot (rendu via Edge headless, lossless) de `data/v2-solutions.ts` mis en forme façon éditeur de code. 100% authentique, zéro image générée. `neutral-placeholder.svg` supprimé.
- 3 commits : `chore: remove unused deps and dead MobileTabBar code`, `feat: finish V2 redesign (home, solutions, projets, à-propos) and add motion polish`, `feat: replace hero placeholder with real source-code visual`.

**En attente / pas fait :**
- Pas encore mergé sur `main` / pas déployé. Les pages hors V2 (`histoire`, `caisse`, `boutique`, `materiel`, les pages génériques via `seo-page.tsx`) gardent encore l'ancien design (`globals.css`/`themes.css`) — pas touchées dans cette passe.
- `npm audit` signale 11 vulnérabilités dans les dépendances transitives, pas traité (hors périmètre demandé).

Si tu reprends ce chantier : regarde d'abord la maquette `Maquette YVEXOR _ solutions numériques connectées.png` sur le Bureau de l'utilisateur — c'est la référence visuelle cible (hero plein cadre avec photo + texte en overlay, section "Ce qu'on peut faire" en cartes avec icônes sur fond clair). L'implémentation actuelle du home (`app/page.tsx`, `app/home-v2.module.css`) s'en inspire mais diffère sur plusieurs points (pas de hero plein cadre, thème sombre partout au lieu d'alterner sombre/clair, grille numérotée au lieu de cartes à icônes) — à harmoniser si l'utilisateur le souhaite.

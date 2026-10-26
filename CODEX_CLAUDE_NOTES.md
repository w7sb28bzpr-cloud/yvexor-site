# Notes Codex ↔ Claude

Fichier partagé pour que Codex et Claude Code se laissent des messages quand ils travaillent sur ce dépôt à des moments différents. Chacun ajoute une entrée en haut, signée et datée. Ne pas supprimer les entrées précédentes.

> **À partir du 2026-10-24, ce fichier a deux parties :**
> 1. **SOURCE DE VÉRITÉ** (section ci-dessous, à tenir à jour en continu, pas en entrées datées) — direction produit, architecture, état du contenu. **Claude et Codex doivent la lire avant toute intervention structurante, et y consigner les décisions qui changent la direction, l'architecture ou le périmètre.**
> 2. **Journal** (entrées datées plus bas) — historique chronologique, on continue d'ajouter en haut sans réécrire les anciennes entrées.

---

# SOURCE DE VÉRITÉ — Direction & Architecture YVEXOR

### Modèle des applications — préparation du futur hub (2026-10-25)

- `data/business-tools.ts` reste l’unique source des applications, suites composées et capacités transversales. `kind` distingue `application`, `business-suite` et `capability`; les suites référencent leurs briques par `includesBusinessToolIds` sans recopier leur contenu.
- Les catégories publiques sont `manage`, `sell`, `business`, `digital` et `automate`, avec leurs libellés dans `data/business-tool-categories.ts`. `catalogSurfaces` sépare le catalogue historique de `/solutions/` du futur catalogue `/applications/`; aucun hub ni route `/applications/` n’est créé dans cette préparation.
- Les outils disponibles issus du brief sont traités comme disponibles, y compris lorsqu’ils pourront être adaptés à partir de briques existantes. `implementationPlatformId` reste interne et n’est jamais inclus dans la projection publique; aucune marque de plateforme n’est affichée.
- Les canoniques existants restent propriétaires de leurs pages. Les nouveaux outils portent des destinations futures sous `/applications/`, sans génération de page. Les métiers continuent de référencer les IDs des outils dans `data/industries.ts`.

### Référentiel d’animations

La bibliothèque documentaire principale est `docs/animations/yvexor-kit/`, issue de `yvexor-animations-kit.zip`. Elle n’est pas chargée au runtime et reste subordonnée à l’état du dépôt et aux décisions produit actuelles. `5858` est une ancienne référence complémentaire, non dupliquée. Codex et Claude Code peuvent créer mieux que les exemples si cela sert davantage le produit et respecte l’identité YVEXOR.

### État actuel — expérience Métiers (2026-10-25)

- Le portail `/metiers/` et les trois activités publiées restent pilotés par `data/industries.ts`. Le modèle Industry porte désormais `businessToolIds` explicites, avec les outils et leur contenu conservés uniquement dans `data/business-tools.ts`; la validation refuse IDs inconnus, doublons et outils non publiés. Les futures industries peuvent employer le visuel générique sans élargir l’union des secteurs à chaque ajout.
- Le portail affiche Restaurant, Hôtel et Garage comme premiers univers structurés et conserve une porte Contact pour les activités non listées. Les visuels sont des pictogrammes cohérents, sans dépendance à des photos manquantes.
- Les trois expériences détaillées sont reconstruites aux canoniques existantes `/solutions-restaurants/`, `/solutions-hotels/`, `/logiciel-garage/`. Les métadonnées, FAQ, contenu éditorial, liens liés et schémas restent issus des pages SEO existantes; aucun `/metiers/{restaurant,hotel,garage}/` n’est généré.
- Les outils visibles sont filtrés par disponibilité et ordonnés selon `businessToolIds`. Les Solutions présentées viennent de `solutionIds`; les clusters ne structurent pas les pages Métiers. La section du logiciel au terrain s’affiche à partir des Solutions liées de connexion/retrofit.
- Revue navigateur effectuée sur le hub et les trois destinations, aux largeurs 320, 375, 390, 430, 768, 1024 et 1440 px : pas de scroll horizontal, H1, outils et CTA contenus. Les détails FAQ utilisent les éléments natifs `details/summary`; les nouvelles pages n’ajoutent pas d’animation.
- Le champ du code de l’accueil conserve ses textes et CTA, mais son fond occupe explicitement toute la zone du hero et se répartit en colonnes sur téléphone afin de montrer du code aux deux bords. La frappe est plus lisible avec une pause rythmée aux retours à la ligne; pause onglet masqué et source statique complète en `prefers-reduced-motion` sont maintenues.
- `SiteFooter` est minimal sur toutes les pages qui l’utilisent : copyright et liens légaux uniquement. Les URLs légales restent inchangées; le footer ne répète plus la navigation.

*Direction produit consolidée le 2026-10-24 par Claude; état d’implémentation mis à jour le 2026-10-25 par Codex après la Phase 6 et son itération immersive. Ce document reste la source de vérité produit. La Phase 6 a initialement livré la homepage portail décrite ci-dessous; l’itération du 25-10 la simplifie selon §1bis sans changer les hubs ni les données Solutions/Métiers/Projets. La revue visuelle constate deux erreurs de cache du service worker préexistant (`public/sw.js:11`, `Response.clone()` sur un corps déjà consommé); elles sont consignées dans `CODEX_AUDIT.md` et restent à examiner séparément.*

### État livré — Phase 6 (2026-10-25)

- La homepage est désormais un portail court : hero, processus statique en six étapes, deux entrées Solutions/Métiers, projet uniquement si approuvé, puis CTA contact.
- Le hero utilise une animation illustrative de code autonome, sans dépendance externe. Elle est masquée aux lecteurs d’écran, s’arrête avec `prefers-reduced-motion` et lorsque l’onglet est masqué. Le brief Phase 6 a autorisé cette visualisation temporaire; une photographie réelle reste une évolution de direction artistique, pas une condition de publication de cette phase.
- La séquence du processus est lisible sans animation ni JavaScript. L’ancienne ancre `/#solutions` est conservée sur la section des deux entrées pour les liens historiques.
- La homepage consomme les destinations canoniques des hubs existants. Aucun projet, métier, prix, route ou contenu public n’a été ajouté. Les sections détaillées plus bas qui décrivent l’accueil précédent sont un constat historique, et non la spécification actuelle.
- Intégration de marque après Phase 6 : le `BrandLogo` partagé utilise le lockup officiel transparent bleu/cyan + YVEXOR dans le header et le footer; un mot-symbole sombre est utilisé sur les surfaces claires et le mot-symbole blanc sur les surfaces sombres. Le bleu/cyan reste une signature ponctuelle, pas une nouvelle palette globale. Le visuel vertical sur fond noir est conservé dans `public/brand/` pour un usage ultérieur et n’est pas imposé au hero ni aux métadonnées sociales.

### Itération homepage immersive — 2026-10-25

- La homepage actuelle est une porte d’entrée immersive : hero de `100svh` incluant visuellement le header superposé, code animé pleine zone en fond, titre et phrase validés, exactement deux CTA vers `/solutions/` et `/metiers/`, puis le footer commun.
- Le header transparent et lisible au chargement devient une capsule sombre translucide après défilement. Cette variante est limitée à l’accueil; les autres routes conservent le header commun.
- Le parcours détaillé en six étapes, la ligne de capacités, les cartes explicatives, le projet conditionnel et le CTA répété ne sont plus rendus sur l’accueil. Le parcours est condensé en trois repères visuels sous le hero; le catalogue reste dans les hubs et pages dédiés. L’ancre historique `/#solutions` pointe maintenant le hero.
- Le code reste décoratif pour les technologies d’assistance et respecte `prefers-reduced-motion`. Le logo courant reste provisoire. Aucune route, donnée, caisse, pricing, service worker ou phase 7 n’a été modifié.

## 1bis. PRINCIPE STRUCTURANT — Reconstruction visuelle complète (ajouté 2026-10-25 par Claude, décision de l'utilisateur)

*Clarification de philosophie après la Phase 6. S'applique à **toutes les prochaines phases** ; remplace toute lecture de §3/§5/§7 ci-dessous comme consigne de préserver l'apparence ou la structure des anciennes pages — ces sections restent utiles pour le contenu/SEO/architecture de données, pas pour la direction visuelle.*

**Principe :** nous conservons ce qui est utile **derrière** l'expérience (données, contenus pertinents, SEO, URLs historiques nécessaires, configurateurs, fonctionnalités, relations Solutions/Métiers/Projets) — voir §9.3/§9.5, toujours valides pour la couche donnée/routing. Mais **l'expérience publique (visuel, structure de page, mise en page) est reconstruite de A à Z** avec la nouvelle direction YVEXOR. Les anciennes pages et leur structure ne doivent plus dicter la nouvelle expérience simplement parce qu'elles existent déjà.

**Homepage — porte d'entrée immersive :** première vue = header transparent intégré au hero, hero quasiment plein écran, code animé en fond, "YVEXOR", "Technologie sur mesure.", une phrase très courte, puis **exactement deux portes** : *Explorer les solutions* / *Explorer par métier*. Le visiteur choisit immédiatement son chemin. La homepage **ne doit plus** essayer de présenter tout le catalogue ni enchaîner de grandes sections explicatives (parcours détaillé, offres, applications, métiers) — ce contenu vit dans ses espaces dédiés (`/solutions/`, `/metiers/`, etc.), pas sur l'accueil. **Statut :** mise en œuvre le 25-10 selon le brief utilisateur : header superposé, hero `100svh`, code en fond, les deux portes convenues, puis un parcours condensé en trois repères sous le hero et le footer commun. Les capacités et sections longues ont été retirées de l’accueil.

**Principe de répartition des rôles par page :**
- **Accueil** = entrer dans l'univers.
- **Solutions** = ce que YVEXOR peut construire.
- **Métiers** = ce que YVEXOR peut faire pour votre activité.
- **Projets** = partir d'un problème/besoin spécifique (cas réels).
- **À propos** = comprendre YVEXOR et son histoire.

**Métiers — ne pas enfermer des capacités générales dans des niches artificielles :** exemple donné par l'utilisateur — le produit historiquement pensé autour du padel doit pouvoir servir plus largement au **sport** ; le futur `Industry` est donc plutôt "Sport & loisirs" ou "Clubs & installations sportives" (cas couverts : padel, tennis, football, futsal, fitness, clubs multisports, complexes sportifs, etc.) plutôt qu'un métier "Padel" isolé. Une page spécialisée Padel ne doit exister plus tard que si elle a un contenu réellement spécifique en quantité suffisante — sinon elle reste un cas au sein du métier plus large. Même logique à appliquer aux autres métiers listés en §3 (coiffure/beauté, immobilier, industrie, automobile, loisirs, parc/zoo, événementiel, construction, services) : regrouper par univers cohérent plutôt que multiplier les niches, avant de fragmenter plus tard si le contenu le justifie.

**Conséquence pour Codex et Claude à partir de maintenant :** ne pas chercher à préserver l'apparence/structure des anciennes pages lors des prochaines phases. Préserver leur valeur technique/SEO/contenu quand c'est nécessaire (voir §9.5 — aucune URL indexée ne bouge sans redirection), mais reconstruire leur expérience visuelle avec la nouvelle direction YVEXOR plutôt que de les prendre comme gabarit.

## 1. Positionnement — ce que YVEXOR N'EST PAS et CE QU'IL EST

**À ne jamais laisser le site suggérer :** une simple société de caisse, une agence web, ou une entreprise d'IA.

**Message central :** YVEXOR part d'un besoin réel et construit la solution autour — même si ce besoin n'existe pas encore sous forme de produit standard. Conçoit, développe, connecte et automatise des solutions complètes, **du logiciel jusqu'au terrain physique**.

**Risque concret identifié dans l'existant (voir §3) :** le site a aujourd'hui 17 pages "caisse par métier" quasi identiques (une par type de commerce) contre 1 seule page logiciel sur mesure — en volume de pages, le site *donne l'impression* d'être une société de caisse, même si le texte dit autre chose. C'est probablement la source du malaise de l'utilisateur. La priorité n'est pas d'ajouter du contenu, c'est de **rééquilibrer le poids visuel/structurel** entre caisse et le reste.

**Retrofit d'équipements non connectés — partie fondamentale du positionnement, à ne pas sous-représenter :** YVEXOR doit pouvoir prendre un équipement qui n'était pas connecté à l'origine et lui ajouter capteurs, télémétrie, automatisation, supervision, contrôle à distance, paiement, alertes, statistiques, intégration logicielle. Exemple de référence (brief 24/10) : *une ancienne machine fonctionne seule → capteur → microcontrôleur → connexion → logiciel → automatisation → tableau de bord → paiement éventuel → alertes.* Aujourd'hui ce positionnement n'existe qu'en creux dans `domotique-batiments`/`systemes-connectes` — aucune page ne le porte explicitement comme sa propre promesse. À traiter comme une `Solution` à part entière (cluster "Connecté & terrain"), pas juste une ligne dans une autre page.

**Open source / Odoo — cadrage précis :** des briques open source (Odoo Community, autres ERP/outils métier, bibliothèques) pourront être intégrées quand pertinent, **toujours après vérification des licences**. Mais YVEXOR ne doit **jamais** être présenté comme "revendeur Odoo" ou intégrateur Odoo classique — l'open source est une **brique parmi d'autres** d'une solution YVEXOR (ex. Odoo/ERP + interface YVEXOR + automatisation + IA + matériel + IoT + déploiement terrain), jamais le produit fini lui-même.

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
- **Trous confirmés dans "par solution" :** rien de dédié pour gestion/ERP/CRM, hébergement/infrastructure (juste une case du grid), IoT générique (seule la domotique résidentielle/bâtiment existe), capteurs/Raspberry/ESP/microcontrôleurs (absent), bornes/paiement/billetterie/contrôle d'accès/réservation/affichage (mentionnés en passant dans solutions-hotels/restaurants, jamais en page dédiée), équipements industriels (absent), retrofit d'objets non connectés comme promesse autonome (absent, voir §1), Odoo/open source (absent, nouveau).
- **Catalogue élargi confirmé le 24/10** (brief business), à traiter comme extension future du même système, pas comme un chantier séparé : marketing, communication, VoIP, gestion documentaire, analyse de données, automatisation de processus, RH, planning, production, maintenance. Rien n'est stubé pour l'instant — à prioriser après les trous ci-dessus.

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

*Le détail de la ligne `/` ci-dessous est dépassé par §1bis (2026-10-25) : homepage = hero immersif + exactement deux portes, pas de process strip ni de succession de sections sur l'accueil. Le reste de l'arborescence ci-dessous reste valide.*

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
  pricing: Pricing;       // voir §12 — absorbe les champs déjà présents dans data/public-offer.ts
};

type Industry = {
  id: string;
  slug: string;
  name: string;           // "métier" dans le contenu FR, "Industry" dans le code (cohérence avec le reste du repo)
  canonicalPath: string;  // l'URL qui fait autorité pour ce métier — voir §9.5 (ex. restaurant/hôtel gardent leur page racine existante)
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
- **Précision de Codex, retenue telle quelle :** chaque `Industry` porte un `canonicalPath` unique (champ ajouté au type en §9.2). Pour restaurant et hôtel, `canonicalPath` pointe vers leur page racine déjà indexée (`/solutions-restaurants/`, `/solutions-hotels/`) — le hub `/metiers/` **lie** vers ces URLs, il ne génère **jamais** de page concurrente `/metiers/restaurant/` ou `/metiers/hotel/` avec le même contenu. Seuls les métiers réellement nouveaux (sans page existante) reçoivent un `canonicalPath` sous `/metiers/[slug]/`.
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

Liste de candidats orphelins relevée par l'audit Codex — **à vérifier (imports, pages générées, usages indirects), pas à supprimer maintenant** : `components/star-sky` + `star-sky.css`, `components/assistant-yvexor` (état "bientôt disponible", confirmé non importé nulle part — mais à garder comme matière de départ, voir §12), `components/visual-hero`, Tailwind (dépendance + config, usage non confirmé). Ne pas étendre cette liste sans vérification équivalente.

## 9bis. Baseline technique (Codex, 24/10) — statut et clarification

Codex a exécuté un baseline complet (détail dans `CODEX_AUDIT.md`, section "BASELINE AVANT V2") et un plan d'implémentation en 10 phases (Phase 0 à 9) qui **opérationnalise §9.3 ci-dessus** — on ne duplique pas ce plan ici, `CODEX_AUDIT.md` en est la version de référence détaillée (fichiers concernés, risques, critères "terminé" par phase).

Résultat du baseline : build/TS/tests SEO/thème OK, `npx next build` direct réussit (69 pages), mais `npm run build` échoue sur le garde-fou `node scripts/caisse-sync.cjs --check` (`portal/core/caisse_catalogue.json` ne correspondrait pas au contenu dérivé).

**Clarification à verser au dossier avant Phase 0 :** ce même échec a déjà été rencontré par Claude le 21/10 sur cette machine, et diagnostiqué comme un **faux positif lié à `core.autocrlf=true`** (fins de ligne CRLF réécrites localement par Git sous Windows, alors que le script compare le contenu en LF strict). Vérifié à l'époque : le contenu correspond exactement une fois les fins de ligne normalisées, et `npm run build` passe sans modification sur GitHub Actions (Linux, pas de conversion). Comme Codex tourne vraisemblablement sur la même machine/repo (même chemin, même config Git locale), il est probable que ce soit exactement le même faux positif plutôt qu'une vraie régression. **Ne pas "corriger" `caisse_catalogue.json` ou le script sur la base de ce seul symptôme** — vérifier d'abord avec `npx next build` (sans le precheck) et/ou en environnement Linux avant de conclure à un vrai problème. Si Phase 0 confirme malgré tout un écart réel (pas qu'une différence de fin de ligne), le traiter normalement.

## 10. MODÈLE COMMERCIAL & PRICING

*Domaine entièrement nouveau dans ce mémo — absent des versions précédentes. Vision business détaillée par l'utilisateur le 24/10.*

### 10.1 Stade de l'entreprise et philosophie commerciale

YVEXOR démarre, peu/pas de références clients majeures à ce jour. Priorité actuelle : **acquérir des clients et des projets réels**, pas maximiser la marge. Grâce à l'IA/aux outils modernes, YVEXOR peut produire plus vite qu'une structure classique — donc accepter au départ prix agressifs/marge faible/plus de travail pour moins cher, en échange de références, MRR, réalisations, témoignages.

**Mais jamais positionné comme marque discount.** Pas *"nous sommes les moins chers"* — plutôt *"nous essayons de mettre le maximum de technologie utile dans votre budget"* / *"plus de technologie pour votre budget"*.

**Clients fondateurs** (stratégie interne, pas forcément publique) : premiers clients à prix particulièrement avantageux, en échange (avec leur accord) de pouvoir présenter le projet, utiliser des images, récupérer un témoignage, construire un vrai cas client pour `/projets/`.

### 10.2 Les trois modes de prix

- **Standard** — prix affiché, produit très clairement défini (ex. "49 €/mois").
- **À partir de** — solution adaptable (ex. "À partir de 49 €/mois").
- **Sur devis / budget** — projets complexes ("Sur devis" / "Parlez-nous de votre budget"). Ne jamais inventer un prix fixe pour un projet à périmètre trop variable.

### 10.3 Abonnement + achat définitif

Pour de nombreuses solutions (site, application, PWA, logiciel, système métier, certaines automatisations) : proposer **à la fois** abonnement **et** achat/licence perpétuelle sur devis. Après achat définitif, des services récurrents peuvent rester séparés (hébergement, maintenance, sauvegarde, IA, API, assistance, mises à jour, supervision).

**Déjà présent dans le code, à faire évoluer plutôt qu'à recréer** : `components/budget-section.tsx` a déjà un volet "Achat ou abonnement ?" qui dit exactement ça ("L'abonnement n'est pas obligatoire..."). Pas un nouveau concept à inventer, une base à reprendre.

### 10.4 Hypothèses tarifaires — PAS DES PRIX OFFICIELS

⚠️ **Les chiffres suivants, donnés par l'utilisateur le 24/10 comme pistes de structure, sont des HYPOTHÈSES COMMERCIALES À ÉTUDIER — pas des tarifs validés.** Ils ne doivent apparaître nulle part sur le site tant qu'ils n'ont pas été confirmés (coûts réels, temps humain, API, hébergement, matériel, maintenance, marge, concurrence) :

| Famille | Idées à l'étude |
|---|---|
| Site web | Vitrine ~29 €/mois · Pro administrable ~49 €/mois · Avec réservation ~69 €/mois · E-commerce ~69–79 €/mois · Achat définitif sur devis |
| Application / PWA | Petite app ~39–49 €/mois · App métier connectée ~69–89 €/mois · Projet complexe/achat définitif sur devis |
| IA | Assistant simple ~19–29 €/mois · Assistant métier ~49–89 €/mois · IA avancée sur devis (coûts API séparés) |
| Automatisation | Simple ~29–39 €/mois · Multi-outils ~59–99 €/mois · Complexe sur devis |
| IoT | Équipement simple ~39–49 €/mois + matériel · Supervision/capteurs ~69–99 €/mois + matériel · Installation complexe sur devis |
| Gestion/CRM/ERP | Entrée ~39–49 €/mois · Avancé ~79–129 €/mois · Sur mesure sur devis |

### 10.5 Tarifs déjà existants dans le code — vérifiés, à ne pas écraser

**Important : les chiffres ci-dessus (§10.4) et ceux cités par l'utilisateur comme "déjà existants" ne correspondent pas exactement à ce qui est réellement dans le code aujourd'hui — vérifié en lisant les fichiers, pas supposé.** Ce qui est **réellement live** dans `data/caisses.json` et `data/public-offer.ts` :

- Caisse Commerce/Snack : Essentiel 49 €/mois, Stock 79 €/mois, Pilotage 119 €/mois.
- Caisse Coiffure & Beauté (Salon) : 60 €/mois, formule unique.
- `solutionOffers` (`data/public-offer.ts`) a déjà des "à partir de" pour Site web (29 €), IA & automatisation (49 €), Application métier (69 €), Systèmes connectés (99 €), Plateforme & SaaS (149 €) — avec `pricingDisclaimer`, `hardwarePossible`, `setupRequired`, `customDevelopmentPossible` déjà modélisés par offre.
- Restaurant (`restaurant-os`) et Tennis/padel n'ont **pas** de prix chiffré dans le code actuel (juste un statut "Base évolutive"/à définir) — les montants "49/99/179/389/699" et "plusieurs modèles club/terrain" cités par l'utilisateur ne sont pas (encore) dans `data/caisses.json` ; probablement issus du catalogue B2B PDF (§10.7). **À réconcilier avec l'utilisateur avant de les publier**, pas à recopier aveuglément depuis le brief.

Consigne de l'utilisateur confirmée : **ne pas écraser ces modèles déjà spécifiques avec une grille tarifaire universelle** — chaque produit garde sa propre structure.

### 10.6 Budget client

Le client n'a pas besoin de connaître ERP/API/ESP/IoT/agent IA. Il donne : activité, problème, objectif, budget initial, budget mensuel. YVEXOR propose ensuite ce qui apporte le plus de valeur — **si le client annonce 10 000 € et que la bonne solution coûte 4 000 €, ne pas chercher à consommer artificiellement le budget annoncé.** Le budget délimite le champ des possibles, ce n'est pas un objectif de facturation.

Tranches indicatives données par l'utilisateur (budget initial : 0–300 / 300–1 000 / 1 000–3 000 / 3 000–10 000 / 10 000+ ; budget mensuel : <50 / 50–100 / 100–300 / 300–1 000 / 1 000+) — même statut que §10.4, hypothèses de structure, pas validées.

**Déjà présent dans le code, à faire évoluer** : `budgetGuidance` dans `data/public-offer.ts` est déjà une échelle de 4 paliers ("Solution existante" → "Premier besoin digital" → "Première solution métier" → "Projet ambitieux") avec prix indicatif, note et CTA par palier — c'est quasiment déjà la mécanique demandée en §10.8, pas un nouveau concept.

### 10.7 Rôle du catalogue B2B (PDF)

Le catalogue PDF YVEXOR existant = base commerciale, preuve de profondeur d'offre, document de vente, source pour les pages métier — **pas à reproduire intégralement sur le site**, qui doit rester plus simple. Utilisé en conversation commerciale pour aller plus loin. Utile comme source de contenu/chiffres à vérifier quand on écrit une nouvelle page `Industry` (ex. les prix restaurant/tennis mentionnés en §10.5 y figurent probablement).

### 10.8 Page Budget / Projet

Pas forcément une page "Tarifs" classique. Ton proposé par l'utilisateur : *"Votre budget. Votre évolution."* / *"Jusqu'où voulez-vous faire évoluer votre activité ?"*. Contenu : repères tarifaires, "à partir de", produits standardisés, achat définitif possible, formulaire problème/objectif/budget initial/budget mensuel. Option : *"Vous avez déjà un devis ? Montrez-le-nous"* → *"Nous regarderons si nous pouvons proposer davantage pour le même budget..."* — **ne jamais promettre automatiquement d'être moins cher.**

Pas une nouvelle entité de contenu dans le graphe Solution/Industry/Project — c'est une **page de conversion** qui lit `budgetGuidance` + les `pricing` des solutions pertinentes. Le site n'a aujourd'hui aucun backend de formulaire (tout passe par mailto/SMS préparés dans le navigateur ou vers `client.yvexor.com`, cf. `/politique-confidentialite/`) — cette page suit la même logique, pas besoin d'un nouveau service.

### 10.9 CTA des pages Solution

Une page solution montre : comprendre → fonctionnalités → usages → prix de départ éventuel → métiers compatibles → CTA. CTA possibles selon le cas : *Configurer cette solution* (quand un configurateur existe, ex. caisse) · *Obtenir cette solution* · *Parler à YVEXOR* · *Étudier mon projet*. Le site ne doit pas laisser croire que tout est un logiciel téléchargeable immédiatement — certaines solutions s'obtiennent après contact.

### 10.10 Philosophie de communication

YVEXOR reste humain, accessible, proche, compréhensible, passionné, généreux. Éviter le jargon excessif — expliquer simplement une techno complexe. Le visiteur doit se reconnaître même sans rien connaître à la technique. (Déjà globalement respecté dans le ton actuel du contenu `seo-pages.ts` — à maintenir, pas à réinventer.)

## 11. VISION — LE SITE COMME SYSTÈME VIVANT (pilotage assistant/GPT)

*Domaine entièrement nouveau — absent des versions précédentes du mémo. Changement de positionnement stratégique important.*

**Rupture voulue :** un site YVEXOR n'est plus *"une agence crée un site, puis le livre"* mais un **système vivant**. À terme, le client dispose d'un espace YVEXOR pour le gérer, et peut y rattacher un assistant/GPT à qui parler directement : *"Change mes horaires"*, *"Ajoute mon nouveau menu"*, *"Remplace cette photo"*, *"Modifie mes tarifs"*...

Boucle cible pour les changements importants : **DEMANDE → MODIFICATION PRÉPARÉE → APERÇU → VALIDATION → PUBLICATION**, avec historique et rollback quand pertinent. Argument commercial qui en découle : *"Votre site continue d'évoluer avec votre entreprise"*, pas seulement *"nous fabriquons votre site"*. Logique extensible aux autres logiciels YVEXOR plus tard.

**Composant existant à noter, pas à confondre :** `components/assistant-yvexor.tsx` existe déjà (état "bientôt disponible", non branché à aucune page aujourd'hui) mais répond à un besoin différent — c'est un **assistant de cadrage pré-vente** ("décrivez votre projet/métier/idée" avant devis), pas l'assistant de **gestion post-vente** d'un site déjà livré décrit ci-dessus. Les deux concepts sont complémentaires mais distincts ; garder `assistant-yvexor.tsx` comme matière de départ pour le premier, pas comme brouillon du second.

**Représentation dans l'architecture (réponse au point F de la mission) : les deux à la fois, comme demandé.**
- **Capacité transversale** : un champ sur `Solution` (ex. `assistantManaged?: boolean` ou tag) indiquant que cette solution peut être pilotée/éditée via l'assistant une fois livrée — affichable comme bénéfice sur n'importe quelle page site/application/gestion/caisse concernée, sans dupliquer le discours.
- **Solution à part entière** : une entrée propre dans `data/solutions.ts` (ex. "Site & système pilotés par assistant") pour les visiteurs qui cherchent spécifiquement cette capacité, avec sa propre page expliquant la boucle demande→aperçu→validation→publication.

**Séquencement retenu :** ne pas construire la plomberie technique (webhook, API, modèle de conversation) maintenant — c'est un chantier Phase 6+ (homepage/solutions avancées), pas Phase 0/1. Mais le modèle de données (Phase 1) doit rester **extensible** pour porter ce champ plus tard sans migration lourde : prévoir la place, ne pas l'implémenter.

## 12. Modèle de données pricing recommandé

La proposition de l'utilisateur (`mode: "fixed"|"startingAt"|"quote"|"budget"` + champs optionnels) fonctionne mais ne représente pas bien le cas très demandé en §10.3 : **une solution avec abonnement ET achat définitif en même temps** — un seul champ `mode` ne peut pas porter deux offres simultanées sans empiler des optionnels ambigus.

**Proposition retenue — un tableau d'offres plutôt qu'un mode unique**, construite pour absorber l'existant (`solutionOffers`/`caisses.json`) sans renommer ce qui marche déjà :

```ts
type PricingOffer =
  | { kind: "subscription"; monthlyFrom?: number; monthlyFixed?: number }
  | { kind: "oneTime"; amountFrom?: number; quoteRequired?: boolean }   // achat / licence perpétuelle
  | { kind: "quote" };                                                   // sur devis pur / "parlez-nous de votre budget"

type Pricing = {
  offers: PricingOffer[];           // 1 à N offres ; ex. [subscription, oneTime] quand les deux existent
  label?: string;                   // label prêt à afficher, ex. "À partir de 49 € HT/mois" (reprend startingPriceLabel)
  hardwareSeparate?: boolean;       // reprend hardwarePossible
  setupSeparate?: boolean;          // reprend setupRequired
  recurringServicesNote?: string;   // reprend pricingDisclaimer
  validated: boolean;               // false = hypothèse commerciale (§10.4/§10.6), true = tarif confirmé (ex. caisses.json)
};

// Solution (voir §9.2) gagne un champ :
// pricing: Pricing
```

**Pourquoi celle-ci plutôt que reprendre le sketch tel quel :**
1. **Gère le cas abonnement+achat simultané** demandé en §10.3, que l'enum `mode` unique ne peut pas exprimer proprement.
2. **`validated: boolean` rend la règle "ne jamais afficher un prix non confirmé" vérifiable en code** (un composant/script peut refuser de rendre `monthlyFrom` sans disclaimer si `validated` est `false`), pas seulement une consigne éditoriale à retenir.
3. **Continuité avec l'existant** : les noms de champs reprennent `startingPriceLabel`/`hardwarePossible`/`setupRequired`/`pricingDisclaimer` déjà présents dans `data/public-offer.ts`, donc la migration des 6 `solutionOffers` actuels vers `Solution.pricing` est un renommage, pas une réécriture.

## 13. DÉCISIONS ENCORE OUVERTES

*Mise à jour du 24/10 — remplace la liste précédente (4 points), élargie suite au brief business. Limité à ce qui bloque réellement le début de l'implémentation :*

1. **Couleur d'accent définitive** — base noir/blanc/neutres validée, mais l'accent (bleu dans les deux systèmes actuels) n'est **pas** tranché. Ne pas réutiliser le bleu par défaut.
2. **Média hero réel** (photo ou vidéo d'un vrai travail technique, logiciel + physique) — en attente de l'utilisateur, remplace le hero code-screenshot actuel.
3. **Priorisation des métiers à écrire en premier** — liste demandée longue ; par quoi commencer au-delà de restaurant/hôtel/garage qui existent déjà en embryon ? Voir §1bis : regrouper par univers cohérent (ex. "Sport & loisirs" plutôt que "Padel" isolé), fragmenter en page dédiée seulement si le contenu spécifique le justifie.
4. **Contenu de la page "Découvrir YVEXOR" fusionnée** — reprendre `/histoire/` intégralement, ou le condenser pour coller au ton "peu de texte" ?
5. **Validation réelle des hypothèses tarifaires (§10.4)** — nécessite une étude coûts/marge/concurrence avant toute publication ; tant que non fait, ces chiffres restent `validated:false` et hors site.
6. **Prix restaurant/tennis-padel cités par l'utilisateur (§10.5)** — à réconcilier avec le catalogue B2B PDF avant de les saisir dans `data/caisses.json`, ils ne sont pas dans le code aujourd'hui.

---

## [Claude — 2026-10-26] — Décision produit : l’escalier des offres + rangement de `/applications/`

**Décision de Yannick (à respecter partout sur le site).** Les deux offres sont deux étapes d’un même chemin, pas deux mondes :

1. **Essayer** : gratuit, sans engagement. La forme (essai limité dans le temps ou version gratuite limitée) reste **ouverte**.
2. **Une application** : elle fait une chose. Petit abonnement, sans engagement. → « Nos applications ».
3. **Des applications reliées** : on paie la connexion entre les outils, pas un outil de plus. Abonnement connecté.
4. **Votre système** : tout circule (ventes, équipe, gestion, IA). Sur devis. → « Nos solutions ».

Phrase-règle : **« Le prix suit ce que vous reliez, pas ce que vous essayez. »** Le catalogue B2B PDF suit déjà cet escalier dans chaque métier (ex. Commerce 49 → 89 → 129 €, Restaurant 49 → 99/179 → 389/699 €).

**Posture prix (à discuter, rien n’est publié).** Les tarifs du catalogue sont des repères négociables. Yannick ne veut pas de « à partir de » (le client lit « ça sera plus cher »). Piste retenue en discussion : présenter le prix affiché comme un **plafond** (« au devis, il ne peut que baisser ») et proposer « Envoyez-nous votre devis, on vous fait une contre-proposition », plutôt qu’un « −20 % garanti » figé (risque de marge et cadre de la publicité comparative). Aucun prix ni aucune de ces promesses n’est encore sur le site.

**Point ouvert, vocabulaire.** Dans le PDF, « Sur mesure » est une formule à 129 € (Commerce, Snack). Sur le site, « sur mesure » = marche 4 (« Nos solutions »). À trancher par Yannick : renommer la formule 129 € ou réserver « sur mesure » à la marche 4.

**Ce qui a changé dans le code.**
- Catégories d’applications (`data/business-tool-categories.ts`, `BusinessToolCategoryId`) : `sell` Vendre & encaisser, `customers` Clients & équipe, `operations` Stock & logistique, `finance` Gestion & finances, `digital` En ligne, `automate` Automatiser & IA, `business` Packs métier. `manage` disparaît ; l’ancien « Vendre » fourre-tout (compta, achats, stock…) est éclaté.
- `/applications/` : les packs métier (`kind: "business-suite"`, Restaurant, Club & Sport) sortent de la grille et des filtres et passent dans un bloc « Vous voulez tout pour votre métier ? » sous la bibliothèque, avec un lien vers `/metiers/`. Un filtre sans application est masqué.
- `/applications/` : nouvelle section « Commencez petit. Grandissez quand vous voulez. » entre le hero et la bibliothèque, avec les 4 marches (en escalier sur ordi, en liste avec un rail sur mobile, sans animation). L’accroche du hero passe de « L’écosystème YVEXOR » à « Nos applications ».
- `app/solutions/tool-library.tsx` n’a pas changé : son libellé de repli « Gestion » couvre toujours `business-management-app`.

**À reprendre ailleurs ensuite** (non fait) : le même escalier sur l’accueil (sous les deux boutons) et sur chaque page métier, avec les prix du métier une fois la posture prix tranchée.

## [Claude — 2026-10-25] — Finition visuelle de `/applications/` (commit `ff7cb19`, non poussé)

- J’ai gardé toute l’architecture de `334bff8` : `BusinessTool` comme source, 21 entrées, 5 filtres, familles, canonicals seulement si la page existe, `dialog` natif. Seuls les fichiers de `app/applications/` sont touchés.
- **Visuel.** Même palette neutre que l’accueil (`#090909`, cyan en accent) au lieu du fond teinté bleu-vert. La page suit le thème global : elle passe en clair de 7 h à 19 h en mode auto, contrairement à l’accueil qui reste toujours sombre. La scène et la fiche restent sombres dans les deux thèmes.
- **Flux.** C’est une scène logiciel (kit, section 5 ter) : un même enregistrement de démonstration passe de fiche CRM à devis, puis à facture payée, puis à chiffre d’affaires. Une bulle de résultat apparaît à chaque étape, sur une hauteur fixe (CLS 0). Le flux est en pause hors écran ou onglet masqué. Avec `prefers-reduced-motion`, un résumé texte des 4 étapes le remplace ; ce même résumé sert aux lecteurs d’écran.
- **Icônes.** `app/applications/application-icon.tsx` ajoute 6 glyphes propres à la page pour les entrées qui partageaient une icône (devis/facture, catalogue/stock, gestion/automatisations, commerce/boutique). Le repli se fait sur `BusinessToolIcon`, sans changer les données ni les autres pages.
- **Mesures** (Edge headless) : CLS 0 et 60 fps à 375, 430 et 1440 px. Pas de scroll horizontal de 320 à 1440 px, et pas de remontée automatique du scroll. Validé au clavier : filtres, ouverture de la fiche, focus dans la fiche, Échap, retour du focus.

## [Claude — 2026-10-25] — Fluidité du champ de code de l’accueil

Fichiers touchés : `components/home-code-field.tsx` et `components/home-code-field.module.css`. Sur yvexor.com avant ce changement, le CLS de l’accueil mesuré en Edge headless était de **1,05 sur ordi et 1,54 sur mobile**.

- **Le code sautait au lieu de glisser.** Le `.stream` est ancré en bas, donc le texte débordait vers le haut, là où le défilement est impossible : `scrollTop` restait à 0 et le `scrollTo({ behavior: "smooth" })` ne faisait rien. Remplacé par un FLIP : à chaque nouvelle ligne, `useLayoutEffect([activeLine])` replace le `<pre>` à la position de la ligne précédente, puis le fait glisser jusqu’à 0 avec une animation `transform` additive (`composite: "add"`, 260 ms).
- **Pourquoi `activeLine` et `firstLine` sont des identifiants continus.** `activeLine` n’est plus un index : sinon il ne change plus une fois l’historique plein, et la règle de `theme-check` (lectures de layout seulement quand la ligne active change) empêcherait de détecter les nouvelles lignes. Les `<span>` ont la clé stable `firstLine + index`, ce qui évite qu’ils échangent leur texte à chaque ligne et que Chrome compte des décalages.
- **Le `<pre>` a une hauteur fixe.** CSS : `height: 100%`, `display: flex`, `justify-content: flex-end`. Le bloc lui-même ne bouge jamais, seules les lignes bougent, et elles sont compensées par la transform de leur parent. Chrome compte en effet le déplacement du nœud animé lui-même même quand il est compensé.
- **`.activeLine { white-space: pre }`.** Dans les colonnes mobiles étroites, la ligne en cours ne passe plus à la ligne pendant la frappe, mais une fois terminée, en même temps que le glissement de la ligne suivante. La fin d’une ligne longue est donc brièvement coupée au bord de la colonne pendant qu’elle s’écrit.
- **Chargement.** Le HTML statique rendait un `<pre>` vide, rempli seulement à l’hydratation. Il contient désormais exactement 64 lignes (`MIN_MAX_LINES`, qui sert aussi de plancher au budget de lignes) et se termine par une ligne vide. Corrige aussi un bug existant : la frappe démarrait collée au texte de départ (`> deploy OKconst projet…`).
- **Mesures.** Edge headless, 15 s, CDP : CLS **0,030** à 1440 px, **0,035** à 977 px et entre **0,029 et 0,039** sur mobile (375, 390 et 430 px), 60 fps stables (p95 16,8 ms). `tsc`, `next build`, `test:seo`, `test:theme` et `test:content` passent. Le rendu `prefers-reduced-motion` n’a pas été retesté en émulation.
- **Déploiement.** Le premier push (`6c11393`) a échoué au déploiement parce que `test:theme` exige `useLayoutEffect(..., [activeLine])` : c’est corrigé. `node scripts/caisse-sync.cjs --check` échoue sous Windows à cause des fins de ligne CRLF de `portal/core/caisse_catalogue.json` (contenu identique), mais passe en CI Linux.

## [Codex — 2026-10-25] — Refonte de l’expérience Métiers

- Ajout des associations métier → outils via `Industry.businessToolIds` : Restaurant (`cash-register`, `business-management-app`, `business-website`), Hôtel (`business-management-app`, `business-website`), Garage (`business-management-app`). Le validateur vérifie unicité, existence et disponibilité; aucun contenu d’outil n’est copié dans Industry.
- `/metiers/` présente ces trois univers avec des pictogrammes cohérents et une voie de contact pour toute autre activité. Les canoniques détaillées sont reconstruites à `/solutions-restaurants/`, `/solutions-hotels/` et `/logiciel-garage/`; les métadonnées, contenu éditorial, FAQ et liens viennent des pages SEO existantes. Aucun nouveau métier ou chemin `/metiers/{slug}/` n’est publié.
- Le modèle de page consomme les outils via le filtre public, les Solutions liées par ID, et les solutions de connexion/retrofit pour le contenu logiciel ↔ terrain. Les icônes BusinessTool sont partagées avec la bibliothèque existante.
- Contrôles : `npm run test:content`, `npm run test:seo` (64 pages indexables), `npm run test:theme`, `npx tsc --noEmit`, `npx next build` (72 routes) et `git diff --check` réussissent. Le premier build sandboxé a été bloqué par le fetch existant de `/materiel/`; le build autorisé avec accès réseau passe.
- Revue Edge : `/metiers/` et les trois pages détaillées contrôlées à 320, 375, 390, 430, 768, 1024 et 1440 px. Aucun scroll horizontal; H1, cartes/outils et CTA dans le viewport. Aucun changement homepage, Solution hub en contenu, caisse, projet, À propos ou service worker.

## [Codex — 2026-10-25] — Champ de code mobile et footer minimal

- Le fond de `HomeCodeField` est désormais bord à bord, sans largeur maximale; le texte ambiant utilise deux colonnes mobiles remplies sur la hauteur. La frappe gagne un rythme modéré et marque brièvement les retours à la ligne. Les pauses à onglet masqué et le rendu statique complet `prefers-reduced-motion` restent actifs.
- `SiteFooter`, partagé par les pages du site, n’affiche plus que `© 2026 YVEXOR`, `Mentions légales` et `Confidentialité`. Les deux destinations légales n’ont pas changé.
- Cette correction touche uniquement le fond/animation du hero, le footer partagé et leurs contrôles; le contenu principal de l’accueil et de `/solutions/` n’est pas modifié.

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

## Décision produit — bibliothèque d’outils YVEXOR (2026-10-25)

- `Solution` reste le modèle des capacités/offres globales. `BusinessTool` est une entrée de bibliothèque distincte qui référence une ou plusieurs Solutions par ID, sans recopier leur prix ni leur contenu éditorial SEO.
- Seuls les outils dont la disponibilité est explicitement confirmée (`availabilityStatus: "available"`) sont rendus. Les brouillons restent invisibles. Aucun outil comptable, CRM, facturation, stock, RH, e-commerce ou Odoo n’est déclaré disponible sans validation produit.
- `/solutions/` est le portail des deux parcours « Construire une solution sur mesure » et « Les outils pour mon entreprise ». Les entrées d’outils renvoient aux canonicals existants ; elles ne créent pas de routes concurrentes.
- Premier catalogue confirmé : Caisse, Site web et Gestion métier (offre d’application métier adaptable ; la réservation n’est pas présentée comme un produit autonome). Odoo pourra servir ultérieurement de plateforme commune à plusieurs outils, sans devenir le positionnement YVEXOR.
- Le champ optionnel `implementationPlatformId` permet à plusieurs outils de référencer ultérieurement la même plateforme technique ; aucun identifiant de plateforme n’est renseigné à ce stade.

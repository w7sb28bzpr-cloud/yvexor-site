# Audit technique YVEXOR — 24 octobre 2026

Audit en lecture seule du site existant. Aucune refonte, suppression ni modification du mémo partagé n’a été effectuée. Le seul fichier de travail créé pour cet audit est celui-ci.

## Périmètre et contexte lu

Le mémo `CODEX_CLAUDE_NOTES.md` du dépôt contient la source de vérité principale mise à jour par Claude le 24/10/2026, la section `ARCHITECTURE TECHNIQUE VALIDÉE` (§9), les décisions ouvertes (§10) et le journal antérieur. Aucun mémo texte/Markdown YVEXOR n’avait été trouvé directement sur le Bureau; le mémo du dépôt est le contexte partagé utilisé. Les fichiers de travail préexistants `output/` et `tmp/` apparaissent non suivis dans Git; ils n’ont pas été touchés.

L’audit repose sur une inspection statique des sources, de la configuration, des assets, des routes et des scripts existants. Aucun build ni test n’a été exécuté, aucune navigation navigateur ni mesure Lighthouse n’a été faite. Les constats de responsive/performance sont donc des risques déduits du code, à confirmer par mesures avant publication.

## 1. État actuel

- Framework : Next.js 15.5.25, React 19, TypeScript 5.7, App Router.
- `next.config.mjs` active `output: "export"`, `trailingSlash: true` et désactive l’optimisation d’image Next. Le site est pré-rendu en fichiers statiques pour GitHub Pages; pas d’API route ou de serveur applicatif repéré.
- Les pages sont organisées dans `app/`; les composants partagés dans `components/`; données éditoriales et catalogues dans `data/`; adaptations/accès aux données dans `lib/`; assets statiques dans `public/`.
- Routes de pages sources : `/`, `/a-propos/`, `/boutique/`, `/boutique/[slug]/`, `/caisse/`, `/caisse/[metier]/`, `/histoire/`, `/materiel/`, `/projets/`, `/realisations/`, `/solutions/`, `/yvexor-pos/`, et `/[slug]/` pour les pages SEO centralisées. Les deux routes dynamiques génèrent leurs pages à partir de données à la compilation.
- Le sitemap assemble les hubs, produits, pages métiers caisse et pages SEO. `/projets/` existe avec `noindex` et n’est pas listé au sitemap; `robots.ts` autorise l’exploration et déclare le sitemap.
- Le catalogue boutique contient 20 produits. Les sources contiennent 17 pages métiers caisse; le précédent comptage lexical à 18 était un faux positif, causé par le champ `slug` de la définition du type `Profession`.
- Il n’y a pas de services/API applicatifs visibles dans le site public. Des destinations externes existent, notamment l’espace client.

## 2. Pages : utilité, état et réutilisation

| Famille | État observé | Réutilisation / risque |
|---|---|---|
| Accueil `/` | Home V2 : hero, parcours au scroll, huit catégories, contact. | Structure distincte et réutilisable comme portail. Le hero est un rendu de code, non une photo de terrain; CTA et tagline diffèrent du brief actuel. Projet vedette volontairement masqué (`null`). |
| `/solutions/` | Liste de huit catégories issue de `data/v2-solutions.ts`. | Données centralisées mais navigation encore provisoire : certains items vont vers une ancre ou le contact; pas de modèle métier ni regroupement par clusters. |
| `/a-propos/` et `/histoire/` | Deux pages parallèles : stub éditorial court et récit plus complet avec schémas. | Doublon de rôle et de message; la page riche contient le meilleur matériau de fond selon le mémo. Risque de confusion navigation/SEO si maintenues sans articulation. |
| `/projets/` et `/realisations/` | Projets affiche un état vide/noindex; réalisations est une page de migration. | La structure de portfolio reste à créer quand les projets partageables sont approuvés; ne pas publier d’exemples fictifs. |
| `/caisse/` et `/caisse/[metier]/` | Offre, configurateur et pages métier dédiées à la caisse. | Le configurateur constitue une vraie fonctionnalité à conserver. La déclinaison par métier surpondère la caisse dans l’arborescence globale. |
| `/[slug]/` | Générateur statique de pages éditoriales à partir de `data/seo-pages.ts`; le slug caisse est routé au composant caisse. | Bon mécanisme centralisé, mais le contenu reste une famille plate et plusieurs pages sont des pages métier/solution sans relations typées visibles. |
| `/boutique/`, `/boutique/[slug]/`, `/materiel/` | Catalogue, détails produit, tarifs et sélection matériel. | Bonne séparation des données produits et des composants. Ensemble d’images important et expérience de catalogue partiellement cliente. |
| `/yvexor-pos/` | Destination/migration historique. | À vérifier au regard des anciennes URLs entrantes et de l’indexation, plutôt que supprimer sans inventaire de redirections. |

## 3. Composants et modularité

- Briques partagées utiles : `navigation`, `site-footer`, `structured-data`, `scroll-reveal`, `brand-logo`, `ui`, cartes produits, catalogue matériel, configurateur caisse, liens/CTA.
- Éléments plus spécialisés mais porteurs de valeur : `history-demo`, `history-connections`, `home-journey`, `automation-showcase`, `connected-ecosystem`, `project-method`. Ils peuvent inspirer de futurs modules explicatifs sans imposer une refonte technique.
- Les expériences `/caisse/`, pages SEO, boutique, V2 et histoire sont fortement différentes. Des composants globaux (notamment en-tête/pied de page et CSS) tentent de les faire cohabiter; leurs styles doivent rester bornés par familles pour éviter les régressions croisées.
- Des composants semblent orphelins ou au moins non utilisés par les pages repérées : `star-sky`, `assistant-yvexor` (état « bientôt disponible »), `visual-hero`, et plusieurs briques de l’ancien site. Confirmer les imports globaux, usages indirects et pages générées avant toute suppression. Les CSS de ciel étoilé et certains styles d’effets semblent ne plus correspondre à la direction premium décrite.
- Le générateur de composants pour les pages SEO est un point de départ réutilisable. Les composants métier/solution ne devraient pas être dupliqués page par page; il manque aujourd’hui une couche explicite de contenu transversal entre solutions, secteurs et cas réels.

## 4. Styles et système visuel

- CSS classique, CSS Modules sur quelques composants/pages, Tailwind présent en dépendance/configuration mais sans usage significatif visible dans les pages inspectées.
- La feuille historique `app/globals.css` est volumineuse (environ 54 Ko, largement compactée/minifiée), et `themes.css` fait environ 28 Ko. `brand.css` applique ensuite un traitement éditorial global. La feuille V2 et le CSS module de l’accueil ajoutent un second système. Plusieurs autres feuilles sont importées globalement depuis `layout.tsx`.
- Le mémo confirme deux familles de tokens teintées de bleu : environ 544 variables historiques `--palette-*` et variables `--v2-*`. Le mode clair/sombre dynamique et le contrôle de thème sont encore une contrainte transversale à concilier avec la direction noir/blanc finale.
- Les règles globales historiques et les surcharges successives augmentent le coût de compréhension, le risque de cascade et la taille CSS chargée sur toutes les pages. Les styles d’anciennes sections persistent même si leurs composants ont disparu.
- Typographie basée essentiellement sur les polices système; pas de webfont téléchargée repérée. Les grandes tailles utilisent `clamp()` à plusieurs endroits, ce qui aide l’adaptation. L’inventaire des contrastes n’a pas été mesuré.

## 5. Responsive

- Plusieurs paliers sont codés : 1050, 900, 820, 760, 600, 520, 430 et 375 px. L’accueil a une mise en page dédiée tablette/mobile, et le header bascule vers un menu `<details>`.
- Les composants catalogue, configurateur et sections en grille ont leurs propres règles; le CSS caisse inclut des adaptations ciblées, mais l’accumulation globale rend difficile la garantie qu’un correctif ne casse pas une ancienne famille.
- Risques à tester sur appareils réels : header fixe et espace de compensation, menu mobile clavier/tactile, largeur de tableaux/configurateur et résumé sticky, grilles 2 colonnes, cartes horizontales à scroll-snap, boutons et texte sur largeur 320–375 px, images hautes de certains produits, ancres sous header fixe.
- L’accueil protège quelques titres contre les débordements aux très petites largeurs, ce qui est positif. Cela ne remplace pas un passage réel à 320/375, 768, 1024 et écran large.

## 6. Animations et stratégie conseillée

- Les dépendances `framer-motion`, `gsap`, `three` et `lenis` ne sont plus présentes dans `package.json`; le mémo indique qu’elles ont été retirées comme dépendances mortes. Aucun usage installé de Framer Motion, GSAP ou Motion One n’est repéré. L’animation repose actuellement sur CSS et API navigateur.
- `ScrollReveal` utilise `IntersectionObserver` pour faire apparaître une fois les éléments marqués; `HomeJourney` et `HistoryConnections` ont du code client lié au scroll/visibilité. Plusieurs transitions hover sont CSS. Les styles de `star-sky` ont des animations infinies mais leur composant paraît inutilisé.
- Les composants client explicites identifiés comprennent navigation, thème, reveal global, journey, PWA, configurateur/catégories et démonstrations d’histoire/catalogue. Le site reste majoritairement rendu côté serveur/statique, avec petits îlots d’hydratation plutôt qu’une application entièrement cliente.
- Préconisation à ce stade : conserver CSS pour survols et transitions courtes; `IntersectionObserver` pour reveals ponctuels et accessibles; SVG/CSS pour les flux et étapes; `requestAnimationFrame` uniquement pour une progression au scroll réellement nécessaire et en lecture passive. Ne pas ajouter de bibliothèque d’animation pour des effets faisables nativement. Évaluer une bibliothèque uniquement si un besoin de séquencement complexe devient concret.
- Respect de `prefers-reduced-motion` présent dans `ScrollReveal`, `v2-shell.css`, `home-v2.module.css`, `solution-doors.css`, `star-sky.css` et `history-connections`. À maintenir pour chaque nouvelle interaction, ainsi que l’état visible si JS/observer échoue.
- Recommandations par besoin : reveal sobre en CSS/observer; parallax au plus léger et désactivé sur petit écran/réduction de mouvement; transitions de page uniquement si une valeur UX mesurable existe en export statique; lignes SVG et schémas en CSS/SVG; cartes via hover/focus synchronisés; avant/après avec contenu compréhensible sans animation; micro-interactions sur transform/opacity, éviter filtres/blur permanents et animations de layout.

## 7. Performance et rendu

- `public/` compte 94 fichiers pour environ 34,3 Mo (dont 34,29 Mo d’images/visuels selon extension). Le poids du dépôt public est notable; les variantes 480/960/pleine taille des produits sont utiles, mais les tailles réelles des fichiers n’ont pas toutes pu être extraites du relevé abrégé. Contrôler les assets non utilisés et les doublons avant d’ajouter des photos/vidéos.
- Beaucoup d’images utilisent `loading="lazy"`, `width`/`height` et parfois `srcSet`/`sizes`; le hero utilise `fetchPriority="high"`. En export statique avec `images.unoptimized`, pas de redimensionnement serveur Next : chaque appel doit choisir les variantes statiques adaptées. Vérifier que la photo hero mobile a réellement un `picture/srcSet` de mobile; l’asset mobile existe dans `public/` mais son usage n’est pas visible dans le hero actuel.
- Les styles importés depuis le layout sont globaux et peuvent être livrés sur toutes les routes. Les données produits/SEO sont incluses dans le graphe de compilation; éviter d’importer des jeux de données lourds dans composants clients.
- Le service worker `public/sw.js` met en cache des ressources statiques et porte une clé de version manuelle; toute modification future d’asset à chemin fixe doit être accompagnée d’une stratégie d’invalidation cohérente. PWA = complexité cache à prendre en compte lors des validations.
- Aucun fichier vidéo n’est repéré dans `public/`; pas de font externe repérée. Pas d’analyse de bundle ni mesure Core Web Vitals faite. Les risques principaux sont le CSS historique global, les variantes images inutiles téléchargées, et une éventuelle vidéo hero future.

## 8. SEO et accessibilité

- Bons éléments présents : `metadataBase`, titres/descriptions par page, canonicals, Open Graph/Twitter, sitemap/robots statiques, pages paramétrées statiquement, données JSON-LD Organization/WebSite et PageData, breadcrumb, images avec dimensions et `alt` observables dans le script SEO.
- Le script `scripts/seo-check.cjs` vérifie déjà export, unicité titres/descriptions, H1 unique, landmarks, canonical, OG, données structurées, alt/dimensions, liens internes, sitemap/robots, 404 et pages d’alias. C’est une couverture utile à réexécuter lors d’une phase de validation autorisée.
- Limites/conflits constatés : sitemap omet `/projets/` (actuellement noindex, probablement volontaire), `/histoire/` reste indexable alors que `/a-propos/` tient le rôle de page entreprise; certaines routes d’alias ont un rendu de migration plutôt qu’une redirection HTTP native compatible statique. Il faut inventorier les backlinks/URLs avant changement de routes.
- Navigation : lien d’évitement, landmarks, `aria-current`, libellés nav et focus-visible sont présents. Le menu mobile est basé sur `<details>` avec fermeture Escape et fermeture au clic de lien.
- À vérifier : contrastes calculés dans les thèmes clair/sombre, focus sur tous les éléments interactifs (y compris contrôles natifs/formulaires), ordre de tabulation, annonce des changements du configurateur, focus et retour après fermeture du menu, navigation sans JS, lecteurs d’écran des SVG/diagrammes, alt des visuels décoratifs, zoom texte à 200 %, taille des cibles. `prefers-reduced-motion` est déjà traité dans les interactions listées.

## 9. Architecture de contenu future

Conserver les pages et les contenus comme données typées, avec relations par identifiants stables, et des gabarits de rendu partagés. Exemple conceptuel :

```ts
type Solution = { id: string; slug: string; title: string; summary: string; cluster: string; industryIds: string[]; projectIds: string[]; page: EditorialPage };
type Industry = { id: string; slug: string; title: string; solutionIds: string[]; projectIds: string[]; page: EditorialPage };
type Project = { id: string; slug: string; title: string; need: string; intervention: string[]; outcome: string; solutionIds: string[]; industryIds: string[]; media: Media[]; publicationStatus: "draft" | "approved" };
```

Recommandation pratique : `data/solutions.ts`, `data/industries.ts`, `data/projects.ts`, `data/solution-clusters.ts`, chacun validé par des types communs et des IDs plutôt que des objets imbriqués dupliqués. Un modèle de page éditoriale commun fournit intro, sections, FAQ facultative, médias et liens; les pages particulières peuvent enrichir un schéma de données pour les configurateurs/offres. Générer les routes et relations croisées à partir de ces données et vérifier les références cassées pendant le build.

Les solutions sont l’entité réutilisable; les métiers associent uniquement les solutions pertinentes et peuvent adapter le contexte, les bénéfices et les cas d’usage. Les projets réels sont une troisième entité factuelle reliant solutions et métiers, avec statut de publication et contrôle explicite des médias autorisés. Ne pas transformer chaque combinaison métier-solution en page indépendante sans contenu distinct. Migrer progressivement les pages caisse existantes vers cette relation, tout en gardant le configurateur comme outil de la solution commerce.

## 10. Préparation et dette avant implémentation

1. Après synchronisation avec la version finale du mémo, établir une matrice routes → contenu source → destination, y compris alias, URLs SEO et liens entrants.
2. Fixer les décisions visuelles encore ouvertes (palette exacte, thèmes clair/sombre, rôle de l’ancien bleu) avant de modifier tokens.
3. Identifier l’autorité éditoriale de chaque page et inventorier les sections réutilisables; conserver les textes vérifiables plutôt que réécrire.
4. Définir les types et IDs de contenu, validation des relations et règles de publication d’un projet avant d’ajouter le hub métiers.
5. Faire un inventaire asset (usage, poids, dimensions, droits/attribution) et planifier image hero réelle/mobile. Contrôler aussi le comportement de cache PWA.
6. À la mise en œuvre, isoler les styles par famille de page puis retirer les règles obsolètes uniquement après recherche d’usage/imports. Éviter un nettoyage massif préalable non relié à une route livrée.
7. Préserver le SEO : canonicals, sitemap, redirections compatibles hébergement statique, métadonnées, H1, données structurées et liens internes.

## Synthèse technique

Le site possède déjà une base crédible et assez de contenus pour construire la direction demandée sans repartir de zéro : App Router statique, données produit/SEO centralisées, configurateur de caisse, schémas explicatifs et métadonnées structurées. Les freins sont surtout éditoriaux et de cohérence : deux générations de design, une feuille CSS historique massive, une présence disproportionnée des pages caisse par métier, des pages entreprise qui se recouvrent et l’absence d’un véritable graphe solutions–métiers–projets.

Je conserverais Next/React et l’export statique, les données/contrôles SEO, le configurateur, les catalogues, les composants de flux explicatifs et les petits mécanismes CSS/IntersectionObserver. Je refactoriserais progressivement les tokens/styles et l’accès au contenu autour de données relationnelles et de gabarits communs. Je supprimerais uniquement après preuve d’inutilité les composants/styles historiques orphelins. Les risques les plus importants pour la suite sont les régressions de cascade, les routes entrantes lors de la restructuration, le poids cumulatif des médias et la cohérence mobile/clavier des nouvelles animations.

Avant tout code structurant, comparer cet audit à la version actualisée du mémo partagé et résoudre les écarts de direction, de routes et de palette.

## Contrôle de cohérence de l’architecture validée

La section §9 du mémo est cohérente avec l’audit sur les points structurants : entités `Solution` / `Industry` / `Project` liées par IDs, réemploi de contenu, maintien de l’export statique Next, migration sans big bang, animations CSS/SVG/observer, et suppression seulement après vérification. Je prends ces décisions comme validées et le mémo prévaut sur les recommandations provisoires de cet audit. Aucun conflit de framework ou de modèle de données ne bloque la préparation.

Un conflit de routage/contenu doit toutefois être résolu dans l’implémentation : le mémo classe `solutions-restaurants` et `solutions-hotels` parmi les premiers métiers tout en imposant de garder leur URL racine indexée et de placer les nouveaux métiers sous `/metiers/[slug]/`. Générer en parallèle une page identique à `/metiers/restaurant/` ou `/metiers/hotel/` créerait deux URLs canoniques pour le même contenu. La table de migration devra donner à chaque Industry un unique `canonicalPath` : les deux pages déjà indexées restent la page canonique et le hub `/metiers/` les lie à ces URLs; les nouveaux métiers prennent `/metiers/[slug]/`. Une redirection vers le nouveau namespace ne sera envisagée que comme décision explicite de migration SEO, avec mise à jour du sitemap et contrôle des liens entrants.

Les décisions ouvertes du mémo (§10) ne bloquent pas le modèle de données ni les gabarits : l’accent peut rester neutre/noir-blanc jusque décision, et les contenus existants restaurant/hôtel/garage peuvent amorcer le hub. En revanche, le hero photo final dépend d’un média réel fourni/validé; la fusion éditoriale À propos/Histoire dépend du choix entre reprise longue et condensation. Ces points peuvent être différés sans inventer de contenu ni imposer une direction concurrente.

## BASELINE AVANT V2

Vérifications demandées, exécutées le 24 octobre 2026 sans correction des sources :

| Vérification | Résultat initial |
|---|---|
| Synchronisation locale | `main` et `origin/main` sont au même commit `9ddd82647303ff0cc4bf1936e9eaf882acbc3be5`, confirmé par le HEAD GitHub. Aucun changement suivi local au début de la phase. `output/` et `tmp/` sont non suivis préexistants. |
| `npm run build` | ÉCHEC avant le build Next : `caisse-sync --check` compare strictement LF et détecte les CRLF Windows dans `portal/core/caisse_catalogue.json`. Vérification Phase 0 ci-dessous : après normalisation, le contenu généré et le fichier sont exactement identiques; aucun écart de données. Le JSON et le script sont laissés inchangés. |
| `npx next build` (contrôle diagnostique direct, sans précheck) | RÉUSSI : compilation, validation lint/types Next, génération de 69 pages statiques et export terminés. JS partagé initial annoncé : 103 kB; la route d’accueil affiche 106 kB First Load JS. Cette commande a rafraîchi les artefacts ignorés `.next/` et `out/`, pas les sources suivies. |
| `npm run test:seo` | RÉUSSI après l’export : 61 pages indexables, métadonnées uniques, canonicals, contenu HTML, JSON-LD, images, liens internes, sitemap, robots et 404. |
| `npm run test:theme` | RÉUSSI : bascules automatiques jour/nuit, choix manuel, préférences invalides, stockage bloqué et script de pré-peinture. |
| `node scripts/caisse-sync.cjs --check` | ÉCHEC local sur les fins de ligne CRLF malgré égalité exacte après normalisation. Aucun `caisse-sync` sans `--check` n’a été lancé. |
| `npx tsc --noEmit` | RÉUSSI, aucune sortie/diagnostic. |
| Lint dédié | Aucun script `lint` configuré dans `package.json`. La build Next directe a terminé son étape intégrée lint/types. |

Le faux positif CRLF est confirmé, pas une divergence de contenu. La commande `npm run build` continuera à échouer sur cette machine tant que le script comparera strictement les fins de ligne; le code de déploiement Linux utilise LF et le build Next direct passe. Ne pas modifier le script ni le JSON pour contourner cet état. Aucun autre problème de build n’a été observé dans l’exécution directe de Next.

### Routes publiques, indexation et propriétaire canonique — Phase 0

Le sitemap statique et `out/` fraîchement exporté identifient 61 URLs indexables. Les familles dynamiques sont produites statiquement : 20 produits boutique, 17 professions caisse et les pages éditoriales de `seo-pages.ts`. Chaque URL du sitemap a un canonical propre et unique; le script SEO vérifie aussi métadonnées, liens et routes exportées.

| Famille publique | Propriétaire canonique / état |
|---|---|
| `/` et `/solutions/` | Pages dédiées, canoniques propres. |
| `/a-propos/` et `/histoire/` | Deux pages distinctes, actuellement indexables, chacune canonique sur elle-même. Fusion future seulement en phase dédiée avec redirection de `/histoire/`. |
| `/solutions-restaurants/`, `/solutions-hotels/`, `/logiciel-garage/` | Pages éditoriales racine déjà indexées; chacune reste l’unique canonique de son contenu métier. Les Industry correspondantes réutilisent ces `canonicalPath`; aucun doublon `/metiers/restaurant/` ou `/metiers/hotel/` ne doit être généré. |
| Autres pages éditoriales `/{slug}/` | `data/seo-pages.ts` et `app/[slug]/page.tsx`; canonical de chaque slug sur sa propre URL. Cela inclut les pages solution existantes qui ne seront pas déplacées vers `/solutions/[slug]/`. |
| `/caisse/` et `/caisse/{metier}/` | Pages offre/configurateur et déclinaisons spécialisées; canoniques propres, distinctes des pages métier éditoriales. |
| `/boutique/`, `/boutique/{slug}/`, `/materiel/` | Catalogue et produits générés; canoniques propres. |
| `/projets/` | Route présente, `noindex`, canonical propre, absente du sitemap tant qu’aucun projet réel approuvé n’existe. |
| `/realisations/` | Alias `noindex`, canonical `/`, meta-refresh 0 vers `/#exemples` et lien de repli. Aucun redirect HTTP 301 n’est disponible dans l’export statique. |
| `/yvexor-pos/` | Alias `noindex`, canonical `/logiciel-caisse-marseille/`, meta-refresh 0 vers cette page et lien de repli. |
| `404.html` | Page introuvable `noindex`, non canonique. `robots.txt` autorise le site et référence le sitemap. |

Les deux alias reposent sur `components/migration-redirect.tsx` : balise meta refresh immédiate et lien HTML utilisable si le navigateur ignore le refresh. Les métadonnées `noindex` et canoniques sont cohérentes avec leur rôle. Le comportement a été confirmé dans les sources et l’export; la plateforme GitHub Pages ne fournit pas de redirection serveur via ce composant.

## Plan d’implémentation proposé

Ordre guidé par la dépendance entre contenu et rendu : sécuriser d’abord les routes et le baseline; créer ensuite le graphe de données et ses validations; établir les fondations neutres sans retoucher globalement l’ancien site; migrer les hubs, puis l’accueil et les détails en utilisant les mêmes entités. Les pages existantes restent publiées pendant les migrations.

### Phase 0 — Sécurisation, baseline, sauvegarde et routes

- **Objectif :** conserver un état de référence reproductible, inventorier les URLs publiées/indexables, les alias et les règles de canonical; comprendre le décalage de `caisse_catalogue.json`.
- **Fichiers concernés :** `package.json`, `scripts/caisse-sync.cjs`, `portal/core/caisse_catalogue.json`, `data/caisses.json`, `data/caisse-professions.ts`, `app/sitemap.ts`, `app/robots.ts`, `app/[slug]/page.tsx`, `app/caisse/[metier]/page.tsx`, `app/realisations/page.tsx`, `app/yvexor-pos/page.tsx`, `components/migration-redirect.tsx`, `CODEX_AUDIT.md`.
- **Réutiliser :** scripts SEO/thème/caisse, `MigrationRedirect`, canonicals et sitemap déjà en place.
- **Nouveau :** manifeste de routes/canonical path utilisé comme checklist; sauvegarde/commit de référence selon le flux Git du projet.
- **Risques :** la vérification stricte de LF échoue sur le checkout Windows même si le contenu correspond; pas de suppression/déplacement d’URL.
- **Vérifications :** comparer le JSON généré en mémoire avec le fichier après normalisation CRLF/LF; ne pas exécuter le générateur s’il s’agit seulement des fins de ligne; `npx next build`, `npm run test:seo`, `npm run test:theme`, `node scripts/caisse-sync.cjs --check`, `npx tsc --noEmit`; comparer URLs du sitemap et routes.
- **Terminé quand :** l’état distant/local est documenté, le faux positif CRLF est confirmé, les URLs indexées ont un propriétaire canonique, Next direct et les scripts applicatifs passent. Le précontrôle `npm run build` reste connu en échec uniquement sous autocrlf Windows; le build CI/Linux reste la référence pour ce contrôle.

### Phase 1 — Modèle Solutions / Métiers / Projets

- **Objectif :** créer des entités typées et des références par IDs sans changer le rendu ni les URLs existantes.
- **Fichiers concernés :** nouveaux `data/content-types.ts`, `data/solution-clusters.ts`, `data/solutions.ts`, `data/industries.ts`, `data/projects.ts`; sources de migration `data/seo-pages.ts`, `data/v2-solutions.ts`, `data/caisse-professions.ts`; potentiellement `lib/content.ts` pour indexer par ID/slug.
- **Réutiliser :** `SeoPage` comme source des `EditorialPage`, 8 catégories V2 comme matière des clusters/solutions, pages restaurants/hôtels/garage comme matières des Industry, métiers caisse comme spécialisations, sans déplacer leur URL.
- **Nouveau :** types communs, index de lookup et validation sans dépendance d’exécution lourde. Pricing dérivé des offres `public-offer` avec drapeau `validated`; pas de nouvel objet Budget. Extensibilité optionnelle pour capacités transversales assistant/open source, sans plomberie ni activation. Ajouter le retrofit comme Solution autonome. Valider IDs/slugs, références réciproques, canonical paths, brouillons, et filtrage du pricing non validé.
- **Risques :** migration avec perte de champs SEO existants, liens cycliques/incohérents, confusion de chemins canoniques; ne pas transformer toutes les pages caisse en pages métiers génériques.
- **Vérifications :** `npm run test:content`, TypeScript, `caisse-sync --check` (écart LF connu), Next direct, tests SEO/thème; comparer textes/sections et routes/canonicals avant/après migration.
- **Terminé quand :** toute donnée retenue est représentée une fois, les relations sont validées, aucune page/routes publiques ne change, aucun contenu éditorial n’est supprimé.

### Phase 2 — Fondations visuelles neutres et composants communs

- **Objectif :** fournir une base noir/blanc/neutre pour les nouvelles pages sans recolorer globalement les pages historiques.
- **Fichiers concernés :** nouveau `app/site-tokens.css` ou tokens communs isolés, `app/layout.tsx` pour son import si nécessaire, `app/v2-shell.css`, `app/home-v2.module.css` seulement si une migration V2 ciblée le requiert, `components/navigation.tsx`, `components/site-footer.tsx`.
- **Réutiliser :** header, footer, logo, contrôles, primitives de focus et transitions courtes. Préfixer/isoler les styles et garder `.seo-`, `.cx-` et les familles historiques intactes.
- **Nouveau :** tokens sémantiques neutres (fond, surface, texte, bordure, espace, typo, focus); état de focus à contraste mesuré. Ne pas présumer l’accent non choisi; le garder neutre et remplaçable.
- **Risques :** cascade héritée de `globals.css`/`brand.css`, thème jour/nuit actuel, différence d’apparence entre nouvelles pages et existantes; aucune suppression de token à cette phase.
- **Vérifications :** revue visuelle sur routes représentatives V2 et anciennes, contraste WCAG des couples retenus, focus clavier, 320/375/768/1024/large, `prefers-reduced-motion`, tests de régression SEO/build.
- **Terminé quand :** les nouveaux gabarits utilisent les tokens isolés, les pages non migrées n’ont pas changé, la palette neutre est lisible dans les états utiles et le choix d’accent est documenté quand il sera tranché.

### Phase 3 — Hub Solutions et pages Solution

- **Objectif :** livrer `/solutions/` par clusters et gabarit `/solutions/[slug]/` à partir du modèle de données; cette fondation est posée avant l’accueil pour que ses CTA aient des destinations stables.
- **Fichiers concernés :** `app/solutions/page.tsx`, nouvelle `app/solutions/[slug]/page.tsx`, `data/solution-clusters.ts`, `data/solutions.ts`, `lib/content.ts`, nouveaux composants de cards/sections de solutions au besoin, CSS module dédié.
- **Réutiliser :** contenu `seo-pages.ts`, icônes `solution-icon.tsx`, `ScrollReveal`, diagrammes existants lorsque pertinents; les pages racine existantes restent accessibles/canoniques.
- **Nouveau :** pages statiques générées par `generateStaticParams`, cross-links métiers/projets filtrés depuis IDs.
- **Risques :** liens vers anchors provisoires, deux pages sur la même solution si le slug historique est déjà occupé, contenu SEO copié plutôt qu’adapté.
- **Vérifications :** validation graphe, `next build`, SEO (metadata/canonical/JSON-LD/sitemap/links), responsive, clavier, reduced motion.
- **Terminé quand :** chaque route solution annoncée se construit, les clusters montrent les bonnes relations, les contenus racine historiques ne sont pas dupliqués et les liens inverses sont justes.

### Phase 4 — Hub Métiers et pages Industry

- **Objectif :** offrir la navigation par secteur et des pages qui regroupent les solutions réellement pertinentes.
- **Fichiers concernés :** nouveaux `app/metiers/page.tsx`, `app/metiers/[slug]/page.tsx`, `data/industries.ts`, lookups du contenu, `app/sitemap.ts`, navigation/footer.
- **Réutiliser :** contenu de `solutions-restaurants`, `solutions-hotels`, `logiciel-garage`, `caisse-professions.ts`; présenter les pages caisse comme liens spécialisés. Les industries restaurant/hôtel gardent leur URL indexée existante comme `canonicalPath`; le hub les lie à ces routes jusqu’à décision de redirection, sans produire des copies `/metiers/restaurant/` et `/metiers/hotel/`.
- **Nouveau :** hub `/metiers/` et pages pour les métiers nouveaux, génération statique à partir des IDs, liens croisés vers solution et projets approuvés.
- **Risques :** duplication sémantique entre ancienne page racine et nouvelle page métier, surpromesse métier, priorité des secteurs non arrêtée; commencer restaurant/hôtel/garage et n’ajouter les autres que sur contenu distinct validé.
- **Vérifications :** liens canoniques, sitemap, contenu unique, aucune régression des 17 routes caisse, responsive/a11y sur grilles et cartes.
- **Terminé quand :** chaque secteur a exactement une page canonique, les relations ordonnées sont cohérentes, et le hub permet d’explorer sans faire croire que tous les métiers offrent toutes les solutions.

### Phase 5 — Projets / réalisations

- **Objectif :** transformer les projets réels approuvés en preuve transversale reliant secteurs et solutions, sans exemples fictifs.
- **Fichiers concernés :** `data/projects.ts`, `app/projets/page.tsx`, éventuel `app/projets/[slug]/page.tsx`, `app/sitemap.ts`, metadata, composants de récit avant/intervention/après.
- **Réutiliser :** `ProjectMethod`, `HomeJourney` ou diagrammes existants comme inspiration, `FeaturedProjectSection` actuellement masquée, `PageData` et composants média accessibles.
- **Nouveau :** affichage filtré `publicationStatus === "approved"`, détail de projet uniquement si les preuves et médias sont autorisés.
- **Risques :** publication d’un projet non autorisé, affirmation invérifiable, page vide indexée, médias lourds/non responsive.
- **Vérifications :** drafts absents du HTML/sitemap; pages approved complètes, alt/captions, droits, performance, schema adapté seulement si correct.
- **Terminé quand :** aucun brouillon n’est rendu; les projets publiés relient au moins une solution et un métier; `/projets/` reste `noindex`/absent du sitemap s’il n’y a aucun projet approuvé, puis les métadonnées changent ensemble lorsqu’il y en a.

### Phase 6 — Homepage définitive

- **Objectif :** réorganiser la page d’accueil en portail court : Hero → processus animé → entrées Solutions/Métiers → projet phare approuvé → CTA.
- **Fichiers concernés :** `app/page.tsx`, `app/home-journey.tsx`, `app/home-v2.module.css`, `data/solutions.ts`, `data/industries.ts`, `data/projects.ts`, `public/` pour médias validés, `public/sw.js` pour version de cache d’assets fixes.
- **Réutiliser :** `HomeJourney` et `ScrollReveal` en les rendant diagrammatiques, `SolutionIcon`, CTA, projet vedette uniquement à partir de projets approuvés.
- **Nouveau :** composant de processus/flux SVG-CSS, deux cartes d’entrée, `picture/srcSet/sizes` pour photo réelle desktop/mobile; vidéo uniquement avec poster/repli et respect réduction de mouvement si retenue.
- **Risques :** absence actuelle de photo réelle, poids LCP, crop mobile, animation qui masque l’information, réintroduction du contact comme CTA principal.
- **Vérifications :** poids et dimensions d’image, performance/LCP, mise en page 320–large, clavier, reduced motion, JS désactivé, SEO et PWA cache bump.
- **Terminé quand :** photo réelle validée ou média explicitement différé, séquence est lisible sans animation, deux entrées principales mènent à leur hub, projet vedette absent tant qu’aucun projet approuvé, portail reste court.

### Phase 7 — À propos / Histoire

- **Objectif :** consolider l’approche et l’histoire sur `/a-propos/`, conserver les idées et schémas validés, puis faire de `/histoire/` une migration compatible avec l’export statique.
- **Fichiers concernés :** `app/a-propos/page.tsx`, `app/histoire/page.tsx`, `app/histoire/history.module.css`, `components/history-demo.tsx`, `components/history-connections.tsx`, `components/migration-redirect.tsx`, `app/sitemap.ts`.
- **Réutiliser :** récit et schémas historiques, avec composition plus concise si décision éditoriale le demande.
- **Nouveau :** aucun composant requis; une page about structurée peut réutiliser les diagrammes de connexion.
- **Risques :** choix ouvert entre reprise complète et condensation, canonical/sitemap et redirection meta-refresh, liens internes anciens.
- **Vérifications :** une page indexable, redirects lisibles avec JavaScript désactivé, sitemap/canonical, navigation interne sans liens cassés, reduced motion et a11y diagrammes.
- **Terminé quand :** `/a-propos/` devient l’unique page entreprise, `/histoire/` a un chemin de migration clair, tout contenu utile est conservé et les anciennes URLs sont traitées.

### Phase 8 — Responsive, accessibilité, performance et SEO

- **Objectif :** audit de finition de toutes les familles nouvelles et migrées avant publication.
- **Fichiers concernés :** CSS/modules des phases précédentes, `app/sitemap.ts`, `app/robots.ts`, `lib/seo.ts`, `components/structured-data.tsx`, `public/` et `public/sw.js`, scripts existants.
- **Réutiliser :** `seo-check.cjs`, `theme-check.cjs`, `caisse-sync.cjs`, les règles reduced motion et le skip link; ajouter une vérification seulement si un manque de non-régression concret est identifié.
- **Nouveau :** matrice manuelle de test viewport/lecteur d’écran/clavier et budget image; mesures Lighthouse/Core Web Vitals avant/après si disponible.
- **Risques :** test d’une seule page au lieu de chaque gabarit, oubli des pages caisse/boutique historiques, scripts qui relisent un `out/` stale.
- **Vérifications :** build standard, SEO, thème, sync caisse, TypeScript, liens/canonicals, contraste, zoom 200 %, tailles tactiles, focus et retour de menu, JS en échec, plusieurs viewports, poids images/JS.
- **Terminé quand :** scripts passent sur l’export fraîchement produit, gabarits représentatifs passent les contrôles clavier/mobile, aucune motion obligatoire, pas de route cassée ou canonique dupliqué.

### Phase 9 — Nettoyage après migration

- **Objectif :** retirer uniquement ce qui n’est plus référencé après que toutes les nouvelles pages sont stables.
- **Fichiers concernés :** imports/styles candidats `components/star-sky.tsx`, `app/star-sky.css`, `components/assistant-yvexor.tsx`, `components/visual-hero.tsx`, `tailwind.config.ts`, dépendances/config correspondantes; règles ciblées de `globals.css`/`themes.css`.
- **Réutiliser :** recherche globale des imports, comparaison des routes/pages avant-après, baseline Phase 0.
- **Nouveau :** aucun nettoyage préventif; liste de suppression annotée par preuves d’absence d’usage.
- **Risques :** usage dynamique/indirect, styles partagés invisibles dans JSX, configuration utile au portail.
- **Vérifications :** recherche références et chemins statiques, `npm run build`, trois scripts, TypeScript, revue visuelle des pages historiques.
- **Terminé quand :** chaque élément supprimé a une preuve d’inutilité, la taille/complexité baisse sans diff visuel ou route cassée, les contrôles restent verts.

### Dépendances ouvertes et risques bloquants

- **Aucun désaccord d’architecture n’empêche de démarrer Phase 0 ou Phase 1.** Le seul conflit structurel important identifié est la canonicalisation restaurants/hôtels; la règle `canonicalPath` du plan le résout sans changer les URLs indexées.
- **Build standard non vert au baseline** à cause du JSON caisse dérivé. À traiter dans la sécurisation avant d’utiliser le build comme garde-fou régulier; ne pas lancer le générateur avant d’avoir confirmé son contrat et son consommateur.
- **Avant finition du visuel :** choisir l’accent ou conserver une palette strictement neutre, fournir/valider une photo réelle du hero, et trancher le niveau de condensation À propos/Histoire. Ces éléments ne bloquent ni schéma de données ni gabarits des hubs.
- **Priorisation éditoriale :** les pages restaurant/hôtel/garage fournissent une première matière; les métiers supplémentaires ne doivent entrer qu’avec des solutions pertinentes et du contenu factuel distinct.

## Phase 0 — sécurisation et baseline exécutées (24 octobre 2026)

- Dépôt vérifié sur `main`, au commit source de vérité `9ddd82647303ff0cc4bf1936e9eaf882acbc3be5`, identique à `origin/main`. Les dossiers non suivis `output/` et `tmp/` ont été conservés.
- `core.autocrlf=true`; `git ls-files --eol` indique le JSON caisse en index LF et checkout CRLF. Le fichier sur disque fait 8 187 octets avec 277 fins CRLF; le contenu généré en mémoire fait 7 910 octets en LF. Après normalisation LF/CRLF, les chaînes et le JSON parsé sont identiques. Diagnostic : faux positif de fins de ligne seulement.
- `portal/core/caisse_catalogue.json` et `scripts/caisse-sync.cjs` n’ont pas été modifiés et le générateur sans `--check` n’a pas été exécuté.
- Matrice des routes/canoniques confirmée. Les pages Restaurant, Hôtel et Garage gardent leurs URLs racine; `/metiers/restaurant/` et `/metiers/hotel/` ne sont pas créées. Les alias `/realisations/` et `/yvexor-pos/` conservent meta-refresh, lien de repli, `noindex` et canonical adéquat.

La Phase 1 (modèle de contenu) est livrée dans le commit distinct suivant.
## Phase 1 — modèle de contenu exécuté (24 octobre 2026)

- Ajout du modèle typé Solutions–Métiers–Projets et des quatre clusters. Les Solutions réutilisent les huit catégories existantes, avec le retrofit comme entrée autonome; les trois Métiers initiaux (Restaurant, Hôtel, Garage) pointent vers leurs URLs canoniques existantes. La liste projets reste vide jusqu’à validation d’un cas réel.
- Les offres existantes sont réutilisées. Le pricing `validated: false` est occulté par l’API publique; les projets doivent être approuvés pour être publiés. Les extensions assistant/open source sont optionnelles et inactives. Aucun rendu, route, tarif source, caisse, assistant ou intégration n’a été modifié.
- Vérifications : `npx next build` réussi (69 pages statiques), `npm run test:seo` réussi (61 pages indexables), `npm run test:theme`, `npm run test:content` (9 solutions, 3 industries, 0 projet), `npx tsc --noEmit` et `git diff --check` réussis. `npm run build` et `caisse-sync --check` échouent au comparateur strict LF/CRLF; l’égalité caisse est confirmée après normalisation. Le JSON et le script caisse sont restés intacts.

## Correctif Phase 1 et Phase 2 — 24 octobre 2026

- **Correctif Phase 1 :** les entrées de `data/v2-solutions.ts` ont désormais des IDs stables; les seeds Solutions utilisent `v2SourceId` et un index par ID. Le test contenu vérifie l’unicité des IDs sources, la présence de la source attendue et le titre repris. Aucun texte fonctionnel, identifiant de Solution, prix, route ou canonicalPath n’a changé.
- **Phase 2 :** ajout de `app/site-tokens.css` et `app/site-primitives.css`, importés par le layout racine. Ils exposent une palette sémantique neutre claire/sombre, un accent gris remplaçable, espacements, rayons, typographie, largeurs et transitions, ainsi que des primitives container/section/heading/surface/bouton/lien. Tous les styles de composants sont opt-in sous `.site-foundation`.
- Aucun composant header/footer, aucune page, route, famille CSS historique, token historique, `globals.css`, `themes.css` ou `brand.css` n’a été modifié. Le rendu public et l’apparence des pages existantes restent inchangés; aucune bibliothèque n’est ajoutée.
- Le contrôle thème vérifie maintenant les contrastes texte/UI des palettes claire et sombre, le focus visible, les cibles tactiles de 44px, `prefers-reduced-motion` et la géométrie fluide aux largeurs 320, 375, 768, 1024 et 1440px. Il s’agit de contrôles CSS statiques; aucun composant consommateur n’est encore rendu dans une page.
- Vérifications : `npm run test:content`, `npx tsc --noEmit`, `npx next build` (69 pages statiques), `npm run test:seo` (61 pages indexables), `npm run test:theme` et `git diff --check` réussis. La Phase 2 n’ajoute aucune route.

## Phase 3 — hub Solutions et pages solution (24 octobre 2026)

- Le hub `/solutions/` est généré à partir des 9 Solutions typées, regroupées sous les quatre clusters de navigation. Les clusters restent des repères extensibles. Les cartes réutilisent les libellés d’offres et les relations Métiers; les liens secteur pointent vers les pages canoniques existantes.
- Les destinations historiques restent canoniques : `/logiciel-sur-mesure/`, `/automatisation-entreprise/`, `/logiciel-caisse-marseille/`, `/applications-metier/`, `/site-presence-web/`, `/systemes-connectes/` et `/boutique/`. Deux seules pages détail Solution sont générées : `/solutions/hebergement-infrastructure/` et `/solutions/retrofit-equipement-non-connecte/`. Le dernier chemin présente explicitement le retrofit d’équipements non connectés et son déroulé. Les alias d’ancre `#commerce` et `#infrastructure` préservent les liens historiques détectés par le contrôle SEO.
- Le pricing public reçoit exclusivement le type `PublishablePricing`; une offre non validée est masquée et remplacée par une indication d’étude du besoin. Les pages détaillées distinguent abonnement, achat définitif, matériel, installation et services récurrents. Aucun projet n’étant approuvé, aucun bloc de cas client n’est rendu. Aucun hub/page Métier, projet, nouvelle route GPT ni refonte homepage n’a été ajouté.
- Les deux pages consomment les primitives sous `.site-foundation` et les en-têtes/pieds partagés. La palette reste neutre; les grilles passent de deux colonnes à une à 760 px; les détails retrofit s’adaptent à 430 px. Les règles de focus et `prefers-reduced-motion` restent celles de la fondation.
- Correctif préalable séparé : `.site-container` est maintenant scoped sous `.site-foundation`; `scripts/theme-check.cjs` en vérifie l’absence hors fondation. Commit `479873b`.
- Vérifications après build exporté : `npx next build` réussi (71 routes statiques); `npm run test:seo` réussi (63 pages indexables, metadata/canonicals/JSON-LD/liens internes/sitemap); `npm run test:content` réussi (9 Solutions, 3 Métiers, 0 Projet); `npm run test:theme`, `npx tsc --noEmit` et `git diff --check` réussis. Aucun fichier caisse n’a été modifié. Aperçu navigateur effectué sur le hub et les deux pages détail, avec inspection de la structure accessible.
- Commit Phase 3 distinct créé après ce relevé. Aucun push n’a été effectué.

## Phase 4 — hub Métiers / Industries exécutée (25 octobre 2026)

- Création de `/metiers/` comme entrée par activité, entièrement alimentée par `data/industries.ts`. Les cartes Restaurant, Hôtel et Garage exposent leur résumé, la liste ordonnée des Solutions obtenue depuis `solutionIds`, et leur CTA canonique. L’encart final invite les activités non listées à présenter leur besoin.
- Destinations canoniques utilisées : `/solutions-restaurants/`, `/solutions-hotels/`, `/logiciel-garage/`. Aucun chemin `/metiers/{restaurant,hôtel,garage}/` n’est généré. Le filtre `getGeneratedIndustryPages` n’accepte qu’une égalité stricte entre `canonicalPath` et `/metiers/${slug}/`; le test couvre pages historiques, futur chemin exact et mismatch.
- Aucun gabarit `/metiers/[slug]/` n’est livré maintenant : aucune Industry ne possède encore ce canonicalPath. Le gabarit est volontairement différé jusqu'à la première Industry réellement nouvelle ; au moment de l'ajouter, vérifier empiriquement le comportement de l'export statique avec la version actuelle de Next.js. Le helper et son test fixent déjà la règle de génération.
- Navigation principale, menu mobile et footer comprennent désormais « Métiers ». Le statut, le contenu et le `noindex` de `/projets/` n’ont pas changé. Les trois pages historiques métier, les 17 routes caisse, les prix, la donnée caisse et le script caisse sont restés intacts. Aucun nouveau métier ou cas client n’a été ajouté.
- Les primitives de Phase 2 et la composition visuelle de Phase 3 sont réutilisées sous `.site-foundation`; palette neutre, cartes liées aux données, sans nouvelle dépendance ni association de Solution codée dans le composant.
- Vérifications : `npx next build` réussi (72 routes statiques); `npm run test:seo` réussi (64 pages indexables, canoniques, sitemap et liens internes); `npm run test:content` réussi (9 Solutions, 3 Industries, 0 Projet, relations et garde de routes); `npm run test:theme`, `npx tsc --noEmit` et `git diff --check` réussis. Le contrôle de contenu confirme que les relations Industry ↔ Solution restent réciproques.
- Revue navigateur : captures à 320 px et 1440 px; mesures à 320, 375, 768, 1024 et 1440 px sans débordement horizontal. Le menu mobile et sa navigation sont accessibles au clavier; ses liens comprennent `/metiers/`. Le rendu garde trois cartes lisibles et un CTA pour les activités non listées.

## Phase 5 — Projets / réalisations préparée (25 octobre 2026)

- `/projets/` consomme uniquement `getPublishedProjects()`. Tant qu’il n’existe aucun projet approuvé, sa copie d’attente reste affichée, ses métadonnées sont `noindex,follow` et le sitemap n’inclut pas la route. Dès qu’un projet approuvé existe, le hub devient indexable et entre dans le sitemap.
- Le filtre public retourne seulement les projets `publicationStatus === "approved"` et retire systématiquement les médias dont `publicationApproved` n’est pas `true`. Le modèle ajoute un contexte facultatif; les champs besoin, intervention, résultat, relations Solution/Métier et autorisation explicite de publication des médias permettent le récit AVANT → YVEXOR → APRÈS sans créer de contenu maintenant.
- `validateContentGraph` accepte des graphes en mémoire pour vérifier les relations inconnues et les IDs/slugs dupliqués. Les tests couvrent aussi brouillon absent des lookups/routes/sitemap, projet approuvé accessible par API publique et filtrage de média non autorisé. Aucun fixture n’est écrit dans `data/projects.ts`.
- Un essai réel avec Next.js 15.5.25 et `output: "export"` a montré qu’un gabarit dynamique `app/projets/[slug]/page.tsx` dont `generateStaticParams()` retourne `[]` échoue au build (« missing generateStaticParams »). Le gabarit détail est donc différé jusqu’à la première approbation réelle; l’ajouter avec le projet, puis vérifier canonical, metadata, liens, sitemap et export au même changement. Tant qu’il n’existe pas, le sitemap n’annonce que le hub et aucun détail.
- Fichiers concernés : `data/content-types.ts`, `lib/content.ts`, `app/projets/page.tsx`, `app/projets/projects.module.css`, `app/sitemap.ts`, `scripts/content-graph-check.cjs`, `scripts/seo-check.cjs`. Aucune homepage, page historique, donnée/script caisse ou page Solution/Métier n’est modifié.
- Vérifications : `npm run test:content`, `npx tsc --noEmit`, `npx next build` (72 routes statiques), `npm run test:seo` (64 pages indexables), `npm run test:theme` et `git diff --check` passent. Le build final a été relancé après retrait du gabarit dynamique vide; le faux positif CRLF caisse n’a pas été touché.
- Revue responsive/accessibilité : à refaire lorsqu’un projet réel et ses médias autorisés seront fournis; aucun contenu ne permet une revue visuelle de carte/détail à cette phase.

## Phase 6 — homepage définitive exécutée (25 octobre 2026)

- **Composition livrée :** hero portail avec le positionnement validé et deux CTA vers `/solutions/` et `/metiers/`; processus explicatif statique en six étapes; deux portes d’entrée; projet vedette conditionnel via `getPublishedProjects()` (aucun projet approuvé, donc aucun bloc rendu); CTA final vers `/contact/`. L’ancienne ancre `/#solutions` est conservée sur la section des portes d’entrée afin de ne pas casser les liens existants.
- **Visuel et mouvement :** réutilisation de `.site-foundation`, des tokens/primitives neutres, de `SiteHeader` et `SiteFooter`. Le hero emploie `HomeCodeField`, illustration de code animée sans bibliothèque, limitée à son cadre, masquée aux technologies d’assistance, arrêtée lorsque `document.hidden` ou `prefers-reduced-motion` est actif. Le processus reste intégralement compréhensible dans le HTML statique. Le brief de Phase 6 valide ce visuel temporaire; aucune photo/vidéo n’a été ajoutée. Aucun choix de couleur d’accent n’a été fait.
- **SEO :** title/description de l’accueil actualisés; `PageData` conserve le canonical racine et les données structurées. Aucune route, donnée Projet, Solution ou Industry ajoutée. `scripts/seo-check.cjs` vérifie les deux destinations, le positionnement et le processus dans le HTML exporté, l’état décoratif de l’animation et l’absence du bloc Projet vide.
- **Incident de contrôle puis correction :** le premier `test:seo` après retrait de l’ancienne grille a révélé que `/domotique-batiments/` utilise encore le lien `/#solutions`. L’ID a été rétabli sur la nouvelle section des deux portes; le contrôle relancé après build passe.
- **Vérifications :** `npx next build` réussi (72 routes exportées); `npm run test:seo` réussi (64 pages indexables); `npm run test:content` réussi (9 Solutions, 3 Industries, 0 Projet); `npm run test:theme` réussi; `npx tsc --noEmit` réussi; `git diff --check` réussi. Le faux positif CRLF de `npm run build`/caisse-sync demeure hors périmètre et aucun fichier caisse n’a été touché.
- **Revue navigateur :** page contrôlée aux largeurs 320, 375, 768, 1024 et 1440 px; composition empilée sur mobile et équilibrée sur grand écran, CTA et pied de page contenus à 320 px. Le HTML et le code confirment le repli sans animation et le comportement reduced-motion. L’émulation reduced-motion n’était pas disponible dans le panneau DevTools de cette session; ce cas n’a donc pas été observé visuellement. La console a signalé deux erreurs du service worker préexistant à `public/sw.js:11` (`Response.clone()` sur un corps déjà consommé). Le service worker n’a pas été modifié; confirmer si elles se reproduisent après purge/actualisation avant de traiter séparément.
- **Fichiers modifiés :** `app/page.tsx`, `app/home-journey.tsx`, `app/home-v2.module.css`, `components/home-code-field.tsx`, `components/home-code-field.module.css`, `lib/seo.ts`, `scripts/seo-check.cjs`, ce journal et l’état Phase 6 de `CODEX_CLAUDE_NOTES.md`. `output/` et `tmp/` restent non suivis et préservés. Aucun nettoyage de composants historiques n’a été entrepris.
- **Fin de phase :** aucun travail de Phase 7 ou ultérieure n’a commencé.

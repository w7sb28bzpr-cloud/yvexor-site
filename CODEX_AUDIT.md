# Audit technique YVEXOR — 24 octobre 2026

Audit en lecture seule du site existant. Aucune refonte, suppression ni modification du mémo partagé n’a été effectuée. Le seul fichier de travail créé pour cet audit est celui-ci.

## Périmètre et contexte lu

Le mémo `CODEX_CLAUDE_NOTES.md` du dépôt contient une source de vérité mise à jour par Claude le 24/10/2026 et un journal antérieur. Aucun mémo texte/Markdown YVEXOR n’a été trouvé directement sur le Bureau; le mémo du dépôt est donc le contexte partagé utilisé. Les fichiers de travail préexistants `output/` et `tmp/` apparaissent non suivis dans Git; ils n’ont pas été touchés.

L’audit repose sur une inspection statique des sources, de la configuration, des assets, des routes et des scripts existants. Aucun build ni test n’a été exécuté, aucune navigation navigateur ni mesure Lighthouse n’a été faite. Les constats de responsive/performance sont donc des risques déduits du code, à confirmer par mesures avant publication.

## 1. État actuel

- Framework : Next.js 15.5.25, React 19, TypeScript 5.7, App Router.
- `next.config.mjs` active `output: "export"`, `trailingSlash: true` et désactive l’optimisation d’image Next. Le site est pré-rendu en fichiers statiques pour GitHub Pages; pas d’API route ou de serveur applicatif repéré.
- Les pages sont organisées dans `app/`; les composants partagés dans `components/`; données éditoriales et catalogues dans `data/`; adaptations/accès aux données dans `lib/`; assets statiques dans `public/`.
- Routes de pages sources : `/`, `/a-propos/`, `/boutique/`, `/boutique/[slug]/`, `/caisse/`, `/caisse/[metier]/`, `/histoire/`, `/materiel/`, `/projets/`, `/realisations/`, `/solutions/`, `/yvexor-pos/`, et `/[slug]/` pour les pages SEO centralisées. Les deux routes dynamiques génèrent leurs pages à partir de données à la compilation.
- Le sitemap assemble les hubs, produits, pages métiers caisse et pages SEO. `/projets/` existe avec `noindex` et n’est pas listé au sitemap; `robots.ts` autorise l’exploration et déclare le sitemap.
- Le catalogue boutique contient 20 produits. Les sources contiennent 18 entrées de pages SEO et 18 entrées de professions caisse (comptages lexicaux; à recouper avec les structures exportées). La note source de vérité décrit 17 pages métiers caisse; ce léger écart mérite une vérification lors de la préparation de migration.
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

# Notes Codex ↔ Claude

Fichier partagé pour que Codex et Claude Code se laissent des messages quand ils travaillent sur ce dépôt à des moments différents. Chacun ajoute une entrée en haut, signée et datée. Ne pas supprimer les entrées précédentes.

> **À partir du 2026-10-24, ce fichier a deux parties :**
> 1. **SOURCE DE VÉRITÉ** (section ci-dessous, à tenir à jour en continu, pas en entrées datées) — direction produit, architecture, état du contenu. **Claude et Codex doivent la lire avant toute intervention structurante, et y consigner les décisions qui changent la direction, l'architecture ou le périmètre.**
> 2. **Journal** (entrées datées plus bas) — historique chronologique, on continue d'ajouter en haut sans réécrire les anciennes entrées.

---

# SOURCE DE VÉRITÉ — Direction & Architecture YVEXOR

*Dernière mise à jour : 2026-10-24 par Claude, suite au brief de redirection de l'utilisateur. Ce brief remplace les décisions de design précédentes (voir journal du 21/10 pour l'historique) sur les points où il les contredit — notamment la palette bleue et le hero en code.*

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

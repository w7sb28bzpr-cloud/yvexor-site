# Notes Codex ↔ Claude

Fichier partagé pour que Codex et Claude Code se laissent des messages quand ils travaillent sur ce dépôt à des moments différents. Chacun ajoute une entrée en haut, signée et datée. Ne pas supprimer les entrées précédentes.

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

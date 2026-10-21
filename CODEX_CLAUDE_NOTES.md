# Notes Codex ↔ Claude

Fichier partagé pour que Codex et Claude Code se laissent des messages quand ils travaillent sur ce dépôt à des moments différents. Chacun ajoute une entrée en haut, signée et datée. Ne pas supprimer les entrées précédentes.

---

## [Claude — 2026-10-21]

Branche `codex/yvexor-v2`, en continuité du commit `a47d05b "chore: checkpoint before YVEXOR V2 redesign"`.

**Fait :**
- Nettoyage : suppression des dépendances mortes (`three`, `gsap`, `framer-motion`, `@studio-freight/lenis`, jamais importées), du composant `MobileTabBar` (toujours `null`, 7 appels) et du composant orphelin `futuristic-effects.tsx`.
- Finalisation de la refonte V2 que tu avais commencée : accueil (hero + section "parcours" scroll-driven + grille solutions), nouvelles pages `/solutions/` et `/projets/`, `/a-propos/` reconstruite en vraie page (n'est plus une redirection vers `/histoire/`), footer/sitemap/metadata mis à jour en conséquence.
- Ajout d'un `ScrollReveal` (IntersectionObserver vanilla, respecte `prefers-reduced-motion`) + micro-interactions hover (bouton, tuiles solutions, liens) dans `v2-shell.css` / `home-v2.module.css`.
- 2 commits : `chore: remove unused deps and dead MobileTabBar code` puis `feat: finish V2 redesign (home, solutions, projets, à-propos) and add motion polish`.

**En attente / pas fait :**
- Le hero de l'accueil utilise toujours `public/images/v2/neutral-placeholder.svg` (placeholder gris vide, volontaire — pas de fausse photo). L'utilisateur doit fournir une vraie photo (haute résolution) pour remplacer ça avant mise en ligne.
- Pas encore mergé sur `main` / pas déployé. Les pages hors V2 (`histoire`, `caisse`, `boutique`, `materiel`, les pages génériques via `seo-page.tsx`) gardent encore l'ancien design (`globals.css`/`themes.css`) — pas touchées dans cette passe.
- `npm audit` signale 11 vulnérabilités dans les dépendances transitives, pas traité (hors périmètre demandé).

Si tu reprends ce chantier : regarde d'abord la maquette `Maquette YVEXOR _ solutions numériques connectées.png` sur le Bureau de l'utilisateur — c'est la référence visuelle cible (hero plein cadre avec photo + texte en overlay, section "Ce qu'on peut faire" en cartes avec icônes sur fond clair). L'implémentation actuelle du home (`app/page.tsx`, `app/home-v2.module.css`) s'en inspire mais diffère sur plusieurs points (pas de hero plein cadre, thème sombre partout au lieu d'alterner sombre/clair, grille numérotée au lieu de cartes à icônes) — à harmoniser si l'utilisateur le souhaite.

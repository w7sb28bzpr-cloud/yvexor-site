# RAPPORT BOUTIQUE YVEXOR

Date : 27 septembre 2026. Branche locale : `codex/boutique-catalogue-complet`.

## Résultat

- Produits détectés dans le ZIP : **20**.
- Produits intégrés : **20**, actifs, répartis dans six catégories.
- Visuels uniques extraits et utilisés : **23 / 23** ; 86 occurrences dans le HTML source (cartes, image principale, miniature et attribut de galerie).
- Boutique : `/boutique/` ; 20 fiches statiques issues de la route dynamique `/boutique/[slug]/`.
- Travail local uniquement : aucun commit, push ou déploiement. Les travaux préexistants dans `output/`, `tmp/` et les scripts de brochures ont été préservés.

## Audit et architecture retenue

Le projet utilise Next.js 15 / React 19, App Router, TypeScript et un export statique vers `out/` publié par GitHub Pages. Le README historique décrivait uniquement un serveur statique ; la configuration Next.js et le workflow réel ont été examinés avant modification.

Le catalogue historique `/materiel/` consomme l’API publique de `client.yvexor.com`. Son composant, ses liens de connexion/achat, son backend et le portail sont conservés. Un lien permet de rejoindre la nouvelle boutique ; la navigation principale et mobile présente désormais « Boutique ». La nouvelle boutique relie également le catalogue historique et l’espace client.

Le ZIP contient un seul fichier HTML de 225 177 759 octets. Il a été analysé comme données, jamais exécuté ni ajouté au site. Un script extrait les textes et les images ; le manifeste SHA-256 permet de vérifier chaque source.

Les données résident dans `data/boutique-products.json`. Chaque produit comprend id, slug, name, category, sourceCategory, price (centimes entiers), currency, priceLabel (texte exact), shortDescription, description, images, features, specifications, variants, relatedProducts et active. Le typage est dérivé dans `lib/boutique.ts`. Les caractéristiques et les fonctionnalités complètes du ZIP sont conservées. Les cas d’usage et les intégrations sont présentés dans les sections détaillées.

Des composants réutilisables gèrent les cartes, la recherche, les galeries et les demandes de devis. `generateStaticParams` produit une page réelle par produit, avec métadonnées, canonical, données structurées et sitemap. Pour ajouter un produit, ajouter ses médias et une entrée conforme dans le JSON, puis reconstruire le site ; aucune copie de page HTML nécessaire.

## Fonctions ajoutées

- Recherche instantanée insensible à la casse et aux accents, sur noms, descriptions, catégories et spécifications.
- Six catégories avec compteurs, filtre de budget, tri par prix croissant/décroissant ou nom, compteur de résultats et état vide avec réinitialisation.
- Grille de 3 produits à 1440 px, 4 à 1920 px, 2 à 768 px et 1 sur petit mobile.
- Images non recadrées (`object-fit: contain`), ressources responsives 480/960 px et originaux WebP sans perte.
- Galeries de 2 images sur les trois produits concernés ; aucune miniature redondante pour les 17 autres.
- Agrandissement dans un dialogue natif, fermeture au clavier, libellés accessibles.
- Quantité souhaitée et lien SMS prérempli avec nom, quantité, prix et URL du produit ; lien téléphone existant en alternative.
- Prix repris exactement, sans « à partir de » ni qualification HT/TTC inventée.
- Offre robotique premium sur mesure, configurations disponibles, fiches techniques et recommandations contextualisées.
- Fil d’Ariane et accès au catalogue, aux caisses, au contact et au compte client.

## Catalogue complet et routes

| Produit | Catégorie | Prix exact | Images | Route |
|---|---|---:|---:|---|
| Système d'appel serveur sans fil avec bracelets vibrants | Accessoires | 99 € | 1 | `/boutique/appel-serveur-sans-fil/` |
| Borne murale tout-en-un pour commande et paiement | Bornes | 469 € | 1 | `/boutique/borne-murale-commande-paiement/` |
| Borne de paiement espèces tout-en-un | Bornes | 3 099 € | 1 | `/boutique/borne-paiement-especes-tout-en-un/` |
| Borne de paiement espèces avec rendu de monnaie | Bornes | 3 500 € | 2 | `/boutique/borne-paiement-especes-rendu-monnaie/` |
| Commande, accueil et libre-service sur une seule borne | Bornes | 879 € | 2 | `/boutique/borne-tactile/` |
| Borne tactile Android sur pied | Bornes | 339,99 € | 1 | `/boutique/borne-tactile-android-sur-pied/` |
| Bracelet connecté relié à votre caisse YVEXOR | Accessoires | 99 € | 1 | `/boutique/bracelet-connecte-caisse/` |
| Brochure vidéo LCD 7 pouces personnalisable | Affichage | 49,99 € | 1 | `/boutique/brochure-video-lcd-7/` |
| Écran Android 10,1" pour présentation de menu | Affichage | 109,99 € | 1 | `/boutique/ecran-menu-android-10-1/` |
| Imprimante thermique POS 80 mm / 58 mm | Imprimantes | 85 € | 1 | `/boutique/imprimante-thermique-pos/` |
| Imprimante thermique POS 58/80 mm connectée | Imprimantes | 119,99 € | 1 | `/boutique/imprimante-thermique-wifi/` |
| Écran tactile KDS de cuisine | Affichage | 389,99 € | 1 | `/boutique/kds/` |
| Lecteur RFID/NFC USB 13,56 MHz | Accessoires | 50 € | 1 | `/boutique/lecteur-rfid-nfc-usb/` |
| Mini caisse Android tout-en-un | Caisses & POS | 369,99 € | 1 | `/boutique/mini-caisse-android/` |
| Robot humanoïde avec développement personnalisé | Robotique | 35 900 € | 1 | `/boutique/robot-humanoide/` |
| Système de caisse POS complet avec écran tactile | Caisses & POS | 480 € | 1 | `/boutique/systeme-caisse-pos/` |
| Tablette Android POE avec NFC | Affichage | 189,99 € | 2 | `/boutique/tablette-android-poe-nfc/` |
| Terminal mobile Android pour commande et paiement | Caisses & POS | 320 € | 1 | `/boutique/terminal-mobile-commande-paiement/` |
| Terminal POS portable avec imprimante intégrée | Caisses & POS | 189,99 € | 1 | `/boutique/terminal-pos-portable/` |
| Tiroir-caisse métal 4 billets / 3 pièces | Accessoires | 79,99 € | 1 | `/boutique/tiroir-caisse-4b3c/` |

## VÉRIFICATION AUCUN PRODUIT OUBLIÉ

- [x] Système d'appel serveur sans fil avec bracelets vibrants — source `yvexor-appel-serveur-sans-fil-99` ; prix et données vérifiés, fiche ouverte sur desktop et mobile.
- [x] Borne murale tout-en-un pour commande et paiement — source `yvexor-borne-murale-commande-paiement-469` ; prix et données vérifiés, fiche ouverte sur desktop et mobile.
- [x] Borne de paiement espèces tout-en-un — source `yvexor-borne-paiement-especes-3099` ; prix et données vérifiés, fiche ouverte sur desktop et mobile.
- [x] Borne de paiement espèces avec rendu de monnaie — source `yvexor-borne-paiement-especes-3500-2-visuels-separes` ; prix et données vérifiés, fiche ouverte sur desktop et mobile.
- [x] Commande, accueil et libre-service sur une seule borne — source `yvexor-borne-tactile-879-galerie` ; prix et données vérifiés, fiche ouverte sur desktop et mobile.
- [x] Borne tactile Android sur pied — source `yvexor-borne-tactile-android-sur-pied-339-99` ; prix et données vérifiés, fiche ouverte sur desktop et mobile.
- [x] Bracelet connecté relié à votre caisse YVEXOR — source `yvexor-bracelet-connecte-caisse-99` ; prix et données vérifiés, fiche ouverte sur desktop et mobile.
- [x] Brochure vidéo LCD 7 pouces personnalisable — source `yvexor-brochure-video-lcd-7-49-99` ; prix et données vérifiés, fiche ouverte sur desktop et mobile.
- [x] Écran Android 10,1" pour présentation de menu — source `yvexor-ecran-menu-android-10-1-109-99` ; prix et données vérifiés, fiche ouverte sur desktop et mobile.
- [x] Imprimante thermique POS 80 mm / 58 mm — source `yvexor-imprimante-thermique-pos-85` ; prix et données vérifiés, fiche ouverte sur desktop et mobile.
- [x] Imprimante thermique POS 58/80 mm connectée — source `yvexor-imprimante-thermique-wifi-119-99` ; prix et données vérifiés, fiche ouverte sur desktop et mobile.
- [x] Écran tactile KDS de cuisine — source `yvexor-kds-389-99-catalogue` ; prix et données vérifiés, fiche ouverte sur desktop et mobile.
- [x] Lecteur RFID/NFC USB 13,56 MHz — source `yvexor-lecteur-rfid-nfc-usb-50` ; prix et données vérifiés, fiche ouverte sur desktop et mobile.
- [x] Mini caisse Android tout-en-un — source `yvexor-mini-caisse-android-369-99` ; prix et données vérifiés, fiche ouverte sur desktop et mobile.
- [x] Robot humanoïde avec développement personnalisé — source `yvexor-robot-humanoide-35900` ; prix et données vérifiés, fiche ouverte sur desktop et mobile.
- [x] Système de caisse POS complet avec écran tactile — source `yvexor-systeme-caisse-pos-480` ; prix et données vérifiés, fiche ouverte sur desktop et mobile.
- [x] Tablette Android POE avec NFC — source `yvexor-tablette-android-poe-nfc-189-99` ; prix et données vérifiés, fiche ouverte sur desktop et mobile.
- [x] Terminal mobile Android pour commande et paiement — source `yvexor-terminal-mobile-commande-paiement-320` ; prix et données vérifiés, fiche ouverte sur desktop et mobile.
- [x] Terminal POS portable avec imprimante intégrée — source `yvexor-terminal-pos-portable-189-99` ; prix et données vérifiés, fiche ouverte sur desktop et mobile.
- [x] Tiroir-caisse métal 4 billets / 3 pièces — source `yvexor-tiroir-caisse-4b3c-79-99` ; prix et données vérifiés, fiche ouverte sur desktop et mobile.

## VÉRIFICATION IMAGES

- Occurrences encodées dans le ZIP : **86**.
- Nombre total d’images uniques extraites : **23**.
- Nombre total d’images uniques réellement utilisées : **23**.
- Fichiers web produits : **69** (23 originaux sans perte + 23 versions 480 px + 23 versions 960 px).
- Chaque original WebP a été comparé pixel par pixel à son image source : aucune différence.
- Chaque variante est un fichier décodable ; aucun base64 dans les données finales.
- Les 20 images principales et les trois vues supplémentaires ont été vérifiées dans le navigateur. Miniatures, changement de vue et agrandissement testés.
- Poids des images sources uniques : 45.16 Mo ; originaux WebP : 29.76 Mo ; ensemble des petites versions : 0.87 Mo ; versions 960 px : 2.40 Mo.
- Répertoire : `public/media/boutique/`. Chaque chemin et empreinte source figurent dans `data/boutique-import-audit.json`.

## Fichiers créés

- `app/boutique/page.tsx`
- `app/boutique/[slug]/page.tsx`
- `components/boutique.module.css`
- `components/shop-catalogue.tsx`
- `components/product-card.tsx`
- `components/product-gallery.tsx`
- `components/product-inquiry.tsx`
- `lib/boutique.ts`
- `data/boutique-products.json`
- `data/boutique-import-audit.json`
- `scripts/import-boutique.py`
- `scripts/verify-boutique.py`
- `public/media/boutique/*.webp` : 69 fichiers.
- `audit/boutique/browser-checks.json`
- `audit/boutique/desktop.png`
- `audit/boutique/mobile-produit.png`
- `RAPPORT_BOUTIQUE_YVEXOR.md`

Les fichiers temporaires de travail sont dans `tmp/` : audit HTML sans base64, planche contact et serveur de prévisualisation. Ils ne font pas partie de l’export public.

## Fichiers modifiés

- `components/navigation.tsx` : entrée Boutique dans les menus existants.
- `app/materiel/page.tsx` : accès à la boutique complète, catalogue historique conservé.
- `app/sitemap.ts` : collection boutique et 20 routes produit.

## Tests réalisés

- `npm run build` : succès, compilation TypeScript et export statique.
- `npm run test:seo` : **PASS — 59 pages indexables**, métadonnées uniques, canonical, données structurées, dimensions/chemins des images, tous les liens internes et ancres, sitemap, robots et 404.
- `python scripts/verify-boutique.py "C:/Users/Fantome/Desktop/YVEXOR_BOUTIQUE_COMPLETE_CORRIGEE.zip"` : **PASS**, 20 produits, tous les prix, nombre de fonctionnalités/spécifications, 23 images originales comparées pixel par pixel et relations produit valides.
- Navigateur réel : les 20 fiches ouvertes individuellement à 1440 px puis 390 px, un H1 par page, images principales chargées, aucun débordement horizontal.
- Boutique vérifiée à 320, 390, 768, 1440 et 1920 px. Menu mobile ouvert puis fermé par Échap à 320 px.
- Recherche « imprimante » : 9 résultats (y compris les appareils avec imprimante) ; recherche inexistante : 0 ; réinitialisation : 20 ; recherche « nfc » sur petit mobile : 4.
- Catégories : Bornes 5, Caisses & POS 4, Affichage 4, Imprimantes 2, Accessoires 4, Robotique 1.
- Budget maximum 100 € : 6 produits. Tri croissant vérifié sur cette sélection ; tri décroissant et alphabétique vérifiés sur le catalogue.
- Les trois galeries multiples : vue 2 sélectionnée, grande image changée, zoom ouvert/fermé.
- Quantité 3 : le lien SMS contient bien quantité 3, produit, prix et URL ; aucun message envoyé.
- Accueil, page Caisses, Contact et catalogue historique visités ; lien téléphone vérifié. Les autres routes et liens existants sont couverts par le test SEO sur tout l’export.
- API historique : HTTP 200 confirmé ; en-tête CORS autorisant `https://yvexor.com`, pas `http://127.0.0.1:3025`.

## Problèmes rencontrés et corrections

- Quatre descriptions manquantes/tronquées dans le ZIP (appel serveur, borne murale, borne tactile, lecteur RFID) : rédaction complétée uniquement à partir des caractéristiques présentes.
- Catégories source incohérentes : borne espèces reclassée en Bornes ; mini caisse, système POS et terminal POS classés en Caisses & POS. Catégorie originale conservée dans `sourceCategory`.
- Deux bornes espèces auraient eu le même slug en retirant les prix : routes distinctes `borne-paiement-especes-tout-en-un` et `borne-paiement-especes-rendu-monnaie`.
- Première compilation lancée avant la fin du traitement des images : fichier de données pas encore disponible ; compilation relancée après import complet.
- Test SEO initial : données structurées de page absentes ; ajout de CollectionPage/WebPage, fil d’Ariane et Product, puis validation réussie.
- L’appel navigateur du catalogue historique échoue sur localhost car l’API n’autorise pas cette origine. Il s’agit de la restriction existante, vérifiée par les en-têtes HTTP. Les données de construction existent et la production est autorisée ; aucune politique CORS ni aucun backend n’a été modifié.

## Éléments restant à faire et limites

- La nouvelle boutique est prête en local, non publiée. La publication reste soumise à la validation explicite prévue par le projet.
- Les produits du ZIP ne sont pas reliés aux stocks, références et paiements du portail : ils proposent donc un vrai contact pour devis, sans faux panier ni simulation d’achat. Le parcours de commande existant demeure accessible pour les articles du portail.
- Le ZIP ne précise pas de régime HT/TTC, stock contractuel, délai ou tarif par variante : ces informations ne sont pas inventées et sont à confirmer lors du devis.
- Aucun achat, authentification client, SMS réel ni déploiement n’a été effectué. Le fonctionnement de la messagerie dépend de l’application SMS du client.

## Reproduire

```powershell
python scripts/import-boutique.py "C:/Users/Fantome/Desktop/YVEXOR_BOUTIQUE_COMPLETE_CORRIGEE.zip"
python scripts/verify-boutique.py "C:/Users/Fantome/Desktop/YVEXOR_BOUTIQUE_COMPLETE_CORRIGEE.zip"
npm run build
npm run test:seo
python -m http.server 3025 --bind 127.0.0.1 --directory out
```

Python nécessite Pillow pour l’import et la vérification ; l’application web ne dépend pas de Python. Aperçu : `http://127.0.0.1:3025/boutique/`.

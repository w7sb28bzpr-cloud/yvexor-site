# Site officiel YVEXOR

Site statique officiel de YVEXOR, publié sur GitHub Pages avec le domaine `yvexor.com`.

## Prévisualisation locale

Depuis le dossier du projet :

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Ouvrir ensuite `http://127.0.0.1:4173/`.

Cette méthode est importante : ouvrir directement les fichiers HTML peut donner un comportement différent pour les liens vers les dossiers.

## Vérifications avant publication

- Tester l’accueil et toutes les pages du `sitemap.xml`.
- Vérifier les menus sur ordinateur et mobile.
- Vérifier les liens téléphone et SMS.
- Valider les blocs JSON-LD.
- Vérifier qu’aucune information marquée à confirmer dans `seo-internal/` n’a été publiée.
- Ne pas publier une affirmation NF525 sans justificatif correspondant à la version commercialisée.

## Publication

Le site est actuellement prévu pour GitHub Pages. Examiner les changements, créer un commit puis pousser la branche publiée uniquement après validation explicite de YVEXOR.

Le dossier `seo-internal/` est ignoré par Git et ne doit jamais être déployé comme contenu public.

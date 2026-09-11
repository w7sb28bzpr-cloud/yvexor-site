# YVEXOR Portal — lot de test 2

Application indépendante du site public Next.js. Voir PLAN.md pour le périmètre et les lots suivants.

## Fonctionnel

Inscription email (non vérifié dans ce lot), organisation isolée, sessions serveur persistantes 90 jours, activation propriétaire à usage unique, MFA TOTP Admin obligatoire, demandes, messages avec lecture et actualisation à 15 secondes, conversion en projet, avancement, dossiers clients, notes internes, solutions livrées, PWA sans cache de données privées. Documents privés téléchargés en pièce jointe (10 Mo/fichier, 200 Mo/organisation, 2 Go global). Notifications internes lorsque l’application est ouverte. Devis en EUR/CHF avec montants décimaux, TVA explicitement saisie, versions envoyées figées et document imprimable. Envoi soumis à MFA récent ; acceptation/refus réservé à un client dont l’email est vérifié. Un devis accepté ne peut plus être modifié via l’application.

## Pas encore livré

Google/Apple, validation email/récupération, push hors application, paiements/factures, rôles autres que propriétaire. Stripe reporté explicitement par le propriétaire. Sans email configuré, l’acceptation des devis reste bloquée : aucun compte n’est marqué vérifié artificiellement. Analyse antivirus non disponible : les fichiers ne sont jamais servis en ligne dans l’origine authentifiée. Pas de données sensibles/réelles avant configuration de récupération et sauvegarde externe testée. Les comptes non vérifiés ne sont associés à aucun dossier préexistant.

## Local

Python 3.12, `python -m venv .venv`, installation de `requirements.lock`. Définir `PORTAL_DEBUG=1` et `PORTAL_SECRET_KEY` avec une valeur locale sans rapport avec la production. Puis `python manage.py migrate`, `python manage.py test core`, `python manage.py runserver 127.0.0.1:8181`. SQLite est réservé au développement et aux tests, PostgreSQL obligatoire en déploiement.

L'installation PWA est le parcours prévu sur les domaines publics ; localhost permet le test navigateur. L'installation ne constitue pas une autorisation serveur. Les tokens ne sont jamais stockés dans localStorage. Les clients reçoivent une organisation neuve et ne choisissent aucun rôle.

## Déploiement Scaleway

Sources dans `/opt/yvexor/portal`, environnement Python `/opt/yvexor/venv`, compte de service non privilégié `yvexor`, base `yvexor_portal` avec authentification locale PostgreSQL peer (pas de port public). Configuration `/etc/yvexor/portal.env`, lisible root et processus lancé par systemd seulement. Installer les dépendances verrouillées, appliquer les migrations, collectstatic, `check --deploy`, puis installer l'unité fournie. Le backend écoute exclusivement sur 127.0.0.1:8100.

Ne pas activer nginx-https.conf avant raccordement DNS et certificat. Ne pas ouvrir la connexion en HTTP. Les configurations ci-jointes supposent les deux sous-domaines proposés ; les adapter après confirmation. Aucune modification du site yvexor.com ni de sa zone apex.

## Propriétaire

Configurer son email privé dans l'environnement, puis `python manage.py owner_invite --output /var/lib/yvexor/owner-activation.txt`. Ne jamais afficher le code dans les logs. Le transférer par canal privé au propriétaire qui définit lui-même son mot de passe sur `/auth/activate/`, puis configure TOTP. Le fichier est exclusif, permission 0600, code à usage unique expirant en 24 heures. Aucun mot de passe par défaut. Aucune attribution d'accès staff dans le formulaire public.

## Opérations

Avant mise à jour : dump PostgreSQL chiffré vers stockage privé, conservation de la version source précédente. Une sauvegarde locale seule est insuffisante. Après mise à jour : migrations, contrôles, redémarrage de cette seule unité, healthcheck. Retour arrière applicatif vers version précédente seulement si schéma compatible ; restauration DB planifiée sinon. Sauvegarde externe, restauration testée et récupération MFA restent des prérequis avant données réelles.

Limiter la rétention des LoginAttempt ; purger sessions expirées avec `clearsessions`. Ne pas journaliser les corps de requêtes, mots de passe, QR TOTP ou cookies. Les journaux AuditEvent ne contiennent que l'acteur, l'action et une référence. Les paramètres debug sont interdits en production.

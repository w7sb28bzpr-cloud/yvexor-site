# YVEXOR Client + Admin — audit et plan de réalisation

## Audit du 11 septembre 2026

Le dépôt contient le site public Next.js 15 / React 19 exporté en HTML sur GitHub Pages. Il n'a ni backend d'authentification ni base clients. Le nouveau serveur Scaleway est distinct, sous Ubuntu 24.04, 2 Go RAM, avec SSH seul exposé. Le site public et le restaurant restent inchangés.

## Architecture

Une application indépendante dans `portal/`, déployable séparément du site public : Django 5.2 LTS, PostgreSQL, Gunicorn derrière HTTPS. Deux surfaces Client/Admin partagent les mêmes services et données ; fichiers privés hors répertoire public. Les builds du site public restent inchangés. Une seule petite instance au départ ; workers et stockage externes pourront être séparés sans dupliquer les données. Aucun service payant supplémentaire sans validation.

## Modèle et autorisations

User (email unique), Organization, Membership, Request, Project, Message, AuditEvent forment le premier lot. Les références exposées sont UUID. Une inscription crée une organisation indépendante, jamais un rattachement par correspondance de nom. Chaque lecture/écriture est filtrée par appartenance. Admin : attribution explicite par opérateur, MFA obligatoire, aucune promotion par inscription publique. Les prochains lots ajoutent ProjectStep, Conversation, Attachment, Quote/Version/Item/Acceptance, Payment, Invoice, Solution, Notification. Notes internes dans un modèle non exposé aux clients.

## Sessions

Cookies de session opaques Secure, HttpOnly, SameSite=Lax ; données de session côté serveur. Appareil mémorisé 90 jours, fermeture de la PWA sans déconnexion. Expiration absolue, révocation à la déconnexion et invalidation après changement de mot de passe. Pas de token d'accès dans localStorage. MFA Admin après authentification, nouvelle vérification pour les futures opérations financières et permissions. Rotation de l'identifiant à la connexion. Protection CSRF, mots de passe Argon2, limitation des tentatives, audit.

## Écrans et endpoints du premier lot

Installation PWA, inscription email, connexion, compte, tableau de bord client, nouvelle demande, détail/échanges, projets ; tableau de bord Admin, dossiers clients, demandes, réponse, conversion en projet, suivi. Routes `/client/`, `/admin/`, `/requests/new/`, `/requests/<uuid>/`, `/projects/<uuid>/`, `/account/`, `/auth/login/`, `/auth/signup/`, `/auth/logout/`, `/auth/mfa/`. Les écritures utilisent POST + CSRF ; le rendu serveur et les endpoints réutilisent la même couche de permissions. Une API JSON de synchronisation limitée aux résumés autorisés sera ajoutée pour les notifications.

## Ordre de livraison

1. Fondations et migrations, inscription/connexion persistante, MFA Admin, demandes + réponses, projets, PWA et tests d'isolation.
2. Email vérifié/récupération et Google/Apple après configuration des comptes fournisseurs. Aucun bouton OAuth fictif.
3. Fichiers privés, messagerie temps réel, notifications et rôles fins.
4. Devis versionnés et acceptation auditée, puis PSP/webhooks, factures après validation des règles fiscales.

## Publication et conditions

Tester avant publication : isolation entre deux organisations, absence d'accès Admin sans MFA, CSRF, déconnexion, expiration, formulaires, affichage mobile, installation. HTTPS et noms de domaine nécessaires avant inscription publique/PWA. L'identité du propriétaire et son premier accès ne sont jamais inventés. La version de test annonce ses fonctions disponibles, sans faux clients ou faux paiements. Installation obligatoire comme parcours UX ; ce contrôle n'est pas une barrière de sécurité. Les callbacks d'authentification doivent rester accessibles dans le navigateur.

## Exploitation

Secrets hors Git, base non exposée, processus sans privilèges, logs sans mots de passe/tokens, migrations avant démarrage, sauvegarde PostgreSQL et restauration à vérifier avant accueil de données réelles. Conserver les sources et une procédure de retour arrière. Une sauvegarde sur le même serveur ne protège pas de sa perte : une destination externe reste à configurer.

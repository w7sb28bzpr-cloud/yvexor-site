# Boutique et Crédits YVEXOR

## Audit avant implémentation
- Site public : Next.js export statique sur GitHub Pages. Un catalogue compilé serait une seconde source périmée : lecture de l’API publique Django à l’exécution.
- Portail : Django 5.2, PostgreSQL en production, organisations/membres, sessions serveur, Admin propriétaire avec TOTP et confirmation récente.
- Réutilisation : Organization, User, Project, Quote, DirectMessage, Notification ; stockage existant, mais images catalogue servies par une route dédiée sans exposer les documents privés.
- Ajouts : catégories, produits, photos, portefeuille, écritures immuables, commandes/lignes figées/historique, demandes de paiement/historique, recharges en attente, audit commercial.
- Routes : /api/catalogue/, /catalogue/, /panier/, /commandes/, /credits/, /paiements/ et /admin/boutique/. API catalogue sans données privées et CORS limité au site public.
- Écrans : catalogue commun, panier et confirmation, commandes et timeline, portefeuille et écritures ; Admin produits/catégories/photos, crédits, demandes et commandes.
- Sécurité : centimes entiers, recalcul serveur, verrous PostgreSQL par portefeuille puis produits, clé d’idempotence, contrôle organisation sur chaque accès, CSRF, MFA récent pour opérations Admin, snapshots des ventes et écritures correctives sans modification des anciennes écritures.
- Stripe : interface PaymentProvider désactivée. Aucune recharge bancaire validée depuis le navigateur, aucun numéro de carte collecté.

## Premier article fourni
Écran tactile 15,6 pouces, 199,99 EUR TTC, TVA 20 % confirmée, 10 unités, livraison offerte. Photo fournie. Aucun délai, certification, SKU fabricant ou garantie inventé. L’import initial est idempotent et ne réinitialise jamais le stock ou le prix d’un produit déjà existant.

## Validation et publication
Tests Django existants + tests catalogue/tenant/idempotence/stock/remboursements, tests concurrents sur PostgreSQL, build public, vérification mobile. Sauvegarde et migrations avant redémarrage du seul portail YVEXOR. Stripe reste non connecté.

# Déploiement isolé OmniRoute — préproduction ADSO AFRICA

## Portée et garde-fous

Ce dossier est un modèle de déploiement autonome pour un **serveur/VPS séparé**. Il n'est pas exécuté par Vercel et ne change ni le déploiement, ni les variables, ni le trafic d'ADSO en production. Il ne contient aucun secret réel.

Le modèle utilise Docker Compose, un volume de données durable, Redis interne et Caddy pour obtenir HTTPS automatique. Les ports de l'application et de Redis ne sont pas publiés sur l'hôte ; seul Caddy expose 80/443. Le domaine doit pointer vers le VPS et les ports 80/443 doivent être accessibles pour l'émission/renouvellement du certificat TLS.

## Prérequis opérateur

- VPS Linux dédié, maintenu et avec Docker Engine + Docker Compose v2.
- Domaine ou sous-domaine réservé à la préproduction, par exemple `omniroute-preprod.example.com`.
- DNS A (et AAAA seulement si IPv6 est correctement configuré) pointant vers le VPS.
- Pare-feu : SSH limité aux adresses administratives autorisées ; ports entrants 80/443 ouverts ; aucun port 20128/20129/20132 ou 6379 ouvert sur Internet.
- Sauvegardes chiffrées, hors du VPS, pour les données persistantes.

## Préparer sur le VPS

1. Créer un répertoire dédié, par exemple `/opt/adso-omniroute-preprod`, et y placer `docker-compose.preproduction.yml` ainsi que `.env.example` depuis ce dossier.
2. Copier `.env.example` vers `.env`, puis renseigner le domaine et un tag d'image stable **exact**. Vérifier l'existence du tag dans la liste officielle des versions avant de démarrer ; ne pas utiliser `latest` pour les essais de validation reproductibles.
3. Générer des secrets différents directement sur le VPS. Exemple pour chaque valeur : `openssl rand -hex 32`. Pour `INITIAL_PASSWORD`, utiliser un gestionnaire de mots de passe pour produire une valeur longue et unique.
4. Protéger le fichier : `chmod 600 .env`; répertoire de déploiement accessible uniquement au compte d'administration. Ne jamais coller les secrets dans ChatGPT, GitHub Issues ou les logs.
5. Préparer le répertoire de données et donner au processus Docker le droit d'écriture requis : `mkdir -p data && sudo chown -R 1000:1000 data` (vérifier l'UID du conteneur de la version choisie avant de l'appliquer).
6. Valider le fichier Compose sans démarrer : `docker compose --env-file .env -f docker-compose.preproduction.yml config --quiet`.
7. Télécharger puis inspecter l'image épinglée : `docker compose --env-file .env -f docker-compose.preproduction.yml pull`. Consigner le tag et le digest obtenu.
8. Démarrer seulement après la revue opérateur : `docker compose --env-file .env -f docker-compose.preproduction.yml up -d`.
9. Contrôler : `docker compose --env-file .env -f docker-compose.preproduction.yml ps` et les journaux. Vérifier la santé, le certificat HTTPS et le parcours de première connexion.
10. Faire un test de restauration à partir d'une sauvegarde avant toute utilisation réelle.

## Attention aux secrets et à l'accès

- `REQUIRE_API_KEY=true` est imposé dans le Compose. Terminer l'onboarding, créer un jeton API dédié à ADSO si OmniRoute permet la portée voulue, puis vérifier qu'une requête non authentifiée reçoit 401/403.
- Les clés des fournisseurs IA sont ajoutées dans le tableau de bord OmniRoute après connexion administrateur ; elles ne doivent pas être mises dans ce dépôt ni dans le fichier de configuration ADSO.
- Si la version retenue exige d'autres variables obligatoires, suivre la documentation de **cette même version** avant démarrage. Ne pas copier aveuglément des variables d'une autre version.
- Les données SQLite, clés de fournisseurs et configuration restent sous `./data`. Ne jamais supprimer ce dossier pour mettre à jour ou redémarrer.
- Le service est prévu en **instance unique** : ne pas lancer plusieurs conteneurs OmniRoute sur le même fichier SQLite.
- L'image Caddy utilise le canal majeur `caddy:2). Pour une chaîne de livraison stricte, épingler aussi Caddy à une version/digest approuvé après vérification.

## Tests obligatoires avant connexion à ADSO

1. HTTPS valide, redirection HTTP vers HTTPS et absence d'avertissement de certificat.
2. Dashboard accessible uniquement sur le domaine préproduction.
3. `/v1/models` et un appel de test fonctionnent avec le jeton dédié ; appels sans jeton ou avec un jeton invalide refusés.
4. Redis et les ports applicatifs ne sont pas accessibles depuis l'extérieur.
5. Redémarrer les conteneurs : configuration et données toujours présentes.
6. Vérifier 429, erreurs fournisseur, timeout, indisponibilité du modèle et comportement de repli.
7. Confirmer que les secrets ne sont jamais renvoyés au navigateur ni écrits dans les journaux.
8. Mesurer latence, consommation, limites de dépense et qualité sur des prompts non sensibles.
9. Effectuer une revue de rétention et d'utilisation des données de chaque fournisseur.
10. Vérifier la procédure de sauvegarde, restauration et retour à la version précédente.

## Connexion ADSO — étape ultérieure, non incluse ici

Après approbation des tests seulement, ajouter dans **l'environnement de préproduction ADSO** :
- `OMNIROUTE_BASE_URL=https://<domaine-preproduction>/v1` (à confirmer selon la version : le code ADSO ajoute `/v1/chat/completions` à la base URL ; la valeur finale doit éviter un double `/v1`).
- `OMNIROUTE_API_KEY=<jeton dédié, secret de serveur>`
- `OMNIROUTE_MODEL=auto`

Important : le code actuel ADSO construit `<OMNIROUTE_BASE_URL>/v1/chat/completions`. Par conséquent, pour éviter un chemin doublé, la valeur d'environnement attendue par ce code est l'origine OmniRoute **sans** suffixe `/v1`, par exemple `https://omniroute-preprod.example.com`. Vérifier avec un test réel avant d'enregistrer la valeur.

Ne jamais définir ces valeurs avec le préfixe `NEXT_PUBLIC_`. Ne pas modifier les variables de production, ne pas fusionner la PR de préparation et ne pas basculer de trafic avant validation écrite.

## Sources officielles

- Guide Docker OmniRoute : https://github.com/cheaper-inference/OmniRoute/blob/release/v3.8.53/docs/guides/DOCKER_GUIDE.md
- Guide d'auto-hébergement : https://github.com/cheaper-inference/OmniRoute/blob/release/v3.8.53/docs/getting-started/SELF_HOST_GUIDE.md

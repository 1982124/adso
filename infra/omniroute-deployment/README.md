# Déploiement isolé OmniRoute v3.8.52 — préproduction ADSO AFRICA

## Statut et périmètre

Ce dossier prépare une instance OmniRoute sur un VPS distinct. Il ne modifie ni ADSO en production, ni ses variables Vercel, ni sa base de données, ni son trafic. Aucun secret réel n'est stocké dans Git.

La configuration reprend le contrat self-host officiel OmniRoute v3.8.52, avec un réseau Docker privé et Caddy en frontal HTTPS :
- OmniRoute : image épinglée sur le tag `3.8.52`, données persistantes dans `./data`.
- Redis : `redis:8.6.5-alpine`, accessible uniquement depuis le réseau Docker.
- Caddy : seul service publiant les ports 80/443.
- Aucun port 20128, 20129, 20132 ou 6379 n'est publié sur l'hôte.
- L'API unifiée LLM reste sur le port 20128 et le chemin `/v1`.

## Prérequis VPS

- Linux maintenu, Docker Engine 24+ et Docker Compose v2.
- Environ 2 Go de RAM libres au minimum ; prévoir davantage pour plusieurs modèles ou contextes volumineux.
- Domaine dédié à la préproduction, DNS A vers le VPS (et AAAA seulement si IPv6 fonctionne réellement).
- Pare-feu : SSH restreint, ports entrants 80/443 ouverts ; aucun port applicatif ou Redis ouvert depuis Internet.
- Sauvegarde chiffrée et externalisée du répertoire `data`.

## Variables alignées sur v3.8.52

Le fichier `.env.example` reprend les variables du modèle officiel :
- `DASHBOARD_PORT=20128`
- `API_PORT=20129`
- `LIVE_WS_PORT=20132`
- `APP_BIND_HOST=127.0.0.1` (valeur de sécurité par défaut officielle)
- `REQUIRE_API_KEY=true`
- `OMNIROUTE_MEMORY_MB=2048`
- `INITIAL_PASSWORD` reste facultatif ; l'onboarding peut créer le mot de passe administrateur.

Les variables non confirmées par le modèle self-host v3.8.52 ont été retirées du modèle : `JWT_SECRET`, `API_KEY_SECRET`, `STORAGE_ENCRYPTION_KEY`, `STORAGE_ENCRYPTION_KEY_VERSION`, `OMNIROUTE_WS_BRIDGE_SECRET` et `AUTH_COOKIE_SECURE`. Ne pas les réintroduire sans preuve dans le contrat exact de la version déployée.

`APP_BIND_HOST=127.0.0.1` conserve la valeur de sécurité officielle. Le Compose ne publie aucun port applicatif sur l'hôte ; Caddy atteint le service par le réseau Docker privé. Redis n'est jamais publié.

## Préparation sur le VPS — ne pas exécuter avant validation

1. Créer `/opt/adso-omniroute-preprod` et y déposer `docker-compose.preproduction.yml` et le modèle `.env.example`.
2. Copier `.env.example` vers `.env`, renseigner le vrai domaine, puis protéger le fichier avec `chmod 600 .env`.
3. Créer le dossier persistant : `mkdir -p data`. L'image officielle fonctionne sous l'utilisateur `node` UID/GID 1000 ; après vérification de l'image téléchargée, appliquer si nécessaire `sudo chown -R 1000:1000 data`.
4. Vérifier que le DNS pointe vers le VPS et que les ports 80/443 sont accessibles.
5. Valider la syntaxe sans démarrer : `docker compose --env-file .env -f docker-compose.preproduction.yml config --quiet`.
6. Vérifier la disponibilité du tag d'image puis télécharger : `docker compose --env-file .env -f docker-compose.preproduction.yml pull`. Consigner le digest exact obtenu.
7. Ne démarrer qu'après validation opérateur : `docker compose --env-file .env -f docker-compose.preproduction.yml up -d`.
8. Contrôler `docker compose --env-file .env -f docker-compose.preproduction.yml ps`, les journaux et le healthcheck.
9. Vérifier `https://<domaine>/healthz` (réponse attendue : `{"status":"ok"}`), le certificat TLS et le dashboard.
10. Terminer l'onboarding du dashboard. Avec `REQUIRE_API_KEY=true`, créer le mot de passe ; si l'assistant demande un jeton bootstrap, le lire sur le VPS avec `docker logs adso-omniroute-preprod 2>&1 | grep BOOTSTRAP`.
11. Créer ensuite un jeton API dédié à ADSO dans OmniRoute et vérifier qu'une requête sans jeton ou avec un jeton invalide est refusée.

## Persistance et sauvegardes

Les bases SQLite, migrations, journaux d'audit et clés fournisseurs chiffrées sont conservés dans `./data`. Ne jamais supprimer ce dossier lors d'une mise à jour. Le service est prévu en instance unique : ne pas lancer plusieurs instances OmniRoute sur le même fichier SQLite. Mettre en place une sauvegarde chiffrée hors VPS et tester une restauration.

## Contrôles avant connexion ADSO

- HTTPS valide et redirection HTTP/HTTPS correcte.
- `/v1/models` et un appel de chat de test répondent avec le jeton dédié.
- Sans jeton et avec jeton invalide : refus 401/403.
- Aucun port applicatif ni Redis accessible depuis Internet.
- Redémarrage sans perte des données.
- Test des erreurs fournisseur, 429, 5xx, timeout, modèle indisponible et limites de dépense.
- Aucune clé fournisseur dans le navigateur ou les journaux.
- Mesure de latence, consommation et coûts.

## Connexion ADSO — ultérieure et uniquement en préproduction

Après validation des tests seulement, configurer dans l'environnement de préproduction ADSO :
- `OMNIROUTE_BASE_URL=https://<domaine>` — origine seule, sans `/v1`, car ADSO ajoute le chemin `/v1/chat/completions`.
- `OMNIROUTE_API_KEY=<jeton dédié>` — secret serveur uniquement.
- `OMNIROUTE_MODEL=auto`.

Ne jamais utiliser de préfixe `NEXT_PUBLIC_` pour un secret. Ne pas modifier les variables de production, fusionner cette PR ou basculer du trafic sans validation explicite.

## Réserve sur le tag Docker

La version source/documentation v3.8.52 est bien identifiée, mais la présence du tag Docker `diegosouzapw/omniroute:3.8.52` doit être confirmée par un `docker pull` depuis le VPS avant démarrage. Si le registre ne publie pas ce tag, ne pas remplacer silencieusement par `latest` ou `3.8.51` : arrêter et faire valider le tag exact correspondant au code v3.8.52.

## Sources officielles consultées

- Self-Host Guide v3.8.52 : https://github.com/wuxueeee/omniroute/blob/release/v3.8.52/docs/getting-started/SELF_HOST_GUIDE.md
- `.env.selfhost.example` v3.8.52 : https://github.com/wuxueeee/omniroute/blob/release/v3.8.52/.env.selfhost.example
- `docker-compose.selfhost.yml` v3.8.52 : https://github.com/wuxueeee/omniroute/blob/release/v3.8.52/docker-compose.selfhost.yml

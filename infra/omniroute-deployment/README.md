# Déploiement isolé OmniRoute v3.8.52 — préproduction ADSO AFRICA

## Statut et périmètre

Ce dossier prépare une instance OmniRoute sur un VPS distinct. Il ne modifie ni ADSO en production, ni ses variables Vercel, ni sa base de données, ni son trafic. Aucun secret réel n'est stocké dans Git.

**Aucun conteneur ne doit être démarré avant validation explicite.** Les commandes de ce dossier séparent la validation statique, le téléchargement des images et le démarrage.

## Architecture et isolation

- Caddy est le seul service qui publie les ports hôte 80/443 (443 UDP pour HTTP/3).
- OmniRoute n'a aucun port publié sur l'hôte.
- Redis n'a aucun port publié et ne rejoint que le réseau backend Docker marqué `internal: true`.
- OmniRoute rejoint les réseaux proxy et backend : Caddy peut joindre OmniRoute, OmniRoute peut joindre Redis et les API externes, Caddy ne peut pas joindre Redis.
- Aucun socket Docker, répertoire système de l'hôte, périphérique ou mode `privileged` n'est monté/activé.
- ADSO production reste indépendant ; aucune URL, clé ou variable de production n'est requise.

## Durcissement inclus

- `REQUIRE_API_KEY=true` est conservé.
- `AUTH_COOKIE_SECURE=true` force l'attribut Secure des cookies derrière HTTPS.
- `ALLOW_API_KEY_REVEAL=false` interdit l'affichage des clés complètes dans le dashboard.
- `CORS_ALLOWED_ORIGINS` est limité à l'origine HTTPS du domaine OmniRoute.
- `no-new-privileges:true` est appliqué aux trois conteneurs.
- Toutes les capacités Linux sont retirées au conteneur OmniRoute (`cap_drop: ALL`). Aucune capacité supplémentaire n'est accordée.
- Redis et Caddy ont un système de fichiers racine en lecture seule ; seuls leurs volumes de données nécessaires et leurs répertoires temporaires dédiés sont inscriptibles.
- Redis ne possède pas de passerelle vers l'extérieur via son réseau.
- `init: true` active un processus init léger pour une gestion correcte des signaux et processus enfants.

Ces options doivent être validées sur le VPS avec l'image exacte avant le premier démarrage. Si un contrôle de santé échoue, ne pas retirer globalement les protections : identifier d'abord le droit ou répertoire précis requis.

## Images : réserve d'intégrité

Les références actuellement préparées sont :
- OmniRoute : `diegosouzapw/omniroute:3.8.52`
- Redis : `docker.io/library/redis:8.6.5-alpine`
- Caddy : `caddy:2.10.2-alpine`

Les tags versionnés sont plus contrôlables que `latest`, mais restent des références mutables. **Le verrouillage par digest SHA-256 n'est pas encore effectué**, car les digests doivent être relevés du registre au moment du téléchargement et vérifiés sur le VPS. Avant le démarrage, inspecter les digests réellement téléchargés et remplacer les références par `image@sha256:<digest>` dans une modification revue de cette PR. Ne pas inventer de digest ni basculer vers `latest` ou une autre version.

La présence de l'image OmniRoute v3.8.52 doit être confirmée séparément. Si le tag n'existe pas, arrêter et demander une décision ; ne pas substituer silencieusement v3.8.51.

## Prérequis VPS

- Linux maintenu, Docker Engine 24+ et Docker Compose v2.
- Environ 2 Go de RAM libres au minimum ; prévoir davantage selon les modèles et contextes.
- Domaine dédié à la préproduction, DNS A vers le VPS (et AAAA seulement si IPv6 fonctionne réellement).
- Pare-feu : SSH restreint, ports entrants 80/443 ouverts ; aucun port applicatif ou Redis ouvert depuis Internet.
- Sauvegarde chiffrée et externalisée du répertoire `data`.
- Vérifier que les ports 80/443 ne sont pas déjà utilisés par un autre service.

## Variables et secrets

Le fichier `.env.example` est un modèle sans secret réel. Il contient les variables de port et les paramètres documentés pour v3.8.52.

Après copie sur le VPS :
1. Remplacer `OMNIROUTE_DOMAIN` par le vrai nom DNS.
2. Protéger le fichier : `chmod 600 .env`.
3. Générer une clé de chiffrement SQLite avec `openssl rand -hex 32`, puis renseigner `STORAGE_ENCRYPTION_KEY` dans le fichier `.env` si le chiffrement au repos est activé. Conserver une copie sécurisée et séparée de cette clé : sa perte peut rendre les données chiffrées irrécupérables.
4. Ne pas définir de secrets dans le Compose, dans Git, dans une commande shell conservée dans l'historique, ni dans des journaux.
5. `OMNIROUTE_WS_BRIDGE_SECRET` n'est nécessaire que si le pont WebSocket Codex externe est activé ; dans ce cas, le générer avec `openssl rand -base64 32` et le conserver uniquement dans le fichier protégé du VPS.
6. Créer un mot de passe administrateur unique pendant l'onboarding. Ne pas réutiliser un mot de passe d'ADSO ou d'un autre service.

Les variables `JWT_SECRET` et `API_KEY_SECRET` sont générées et persistées par OmniRoute au premier démarrage dans le répertoire de données selon la documentation v3.8.52 ; ne pas leur fournir de valeurs improvisées.

## Préparation sur le VPS — aucune exécution de conteneur

1. Créer `/opt/adso-omniroute-preprod` et y déposer `docker-compose.preproduction.yml` et `.env.example`.
2. Copier `.env.example` vers `.env`, renseigner le vrai domaine et appliquer `chmod 600 .env`.
3. Créer le dossier persistant : `mkdir -p data`. L'image officielle fonctionne sous l'utilisateur `node` UID/GID 1000 ; après vérification de l'image téléchargée, appliquer si nécessaire `sudo chown -R 1000:1000 data`.
4. Vérifier le DNS et le pare-feu.
5. Valider la configuration sans démarrer : `docker compose --env-file .env -f docker-compose.preproduction.yml config --quiet`.
6. Lire et contrôler la configuration résolue : `docker compose --env-file .env -f docker-compose.preproduction.yml config`. Vérifier qu'aucun secret n'apparaît dans une sortie destinée à être partagée.
7. Vérifier la présence du tag v3.8.52 et télécharger les images seulement après décision : `docker compose --env-file .env -f docker-compose.preproduction.yml pull`. Relever les digests exacts.
8. Ne démarrer qu'après validation opérateur explicite : `docker compose --env-file .env -f docker-compose.preproduction.yml up -d`.

## Contrôles après autorisation de démarrage

- `docker compose ... ps`, journaux et healthchecks.
- Vérifier `https://<domaine>/healthz` (réponse attendue : `{"status":"ok"}`), le certificat TLS et le dashboard.
- Vérifier que les réseaux ont les membres attendus : Caddy seulement sur proxy ; OmniRoute sur proxy + backend ; Redis seulement sur backend.
- Vérifier depuis l'extérieur que seuls 80/443 sont accessibles ; 20128, 20129, 20132 et 6379 doivent rester fermés.
- Vérifier qu'un appel API sans clé ou avec une clé invalide est refusé ; tester les modèles et un appel de chat avec un jeton dédié.
- Tester un redémarrage sans perte des données et une restauration depuis sauvegarde.
- Tester les erreurs fournisseur, 429, 5xx, timeout, modèle indisponible et limites de dépense.
- Aucune clé fournisseur dans le navigateur ou les journaux.

## Connexion ADSO — étape ultérieure, uniquement en préproduction

Après validation de l'installation et des tests seulement, configurer dans l'environnement de préproduction ADSO :
- `OMNIROUTE_BASE_URL=https://<domaine>` — origine seule, sans `/v1`, car ADSO ajoute le chemin `/v1/chat/completions`.
- `OMNIROUTE_API_KEY=<jeton dédié>` — secret serveur uniquement.
- `OMNIROUTE_MODEL=auto`.

Ne jamais utiliser de préfixe `NEXT_PUBLIC_` pour un secret. Ne pas modifier les variables de production, fusionner cette PR ou basculer du trafic sans validation explicite.

## Sources officielles consultées

- Self-Host Guide v3.8.52 : https://github.com/wuxueeee/omniroute/blob/release/v3.8.52/docs/getting-started/SELF_HOST_GUIDE.md
- Référence des variables v3.8.52 : https://github.com/wuxueeee/omniroute/blob/release/v3.8.52/docs/reference/ENVIRONMENT.md
- `.env.selfhost.example` v3.8.52 : https://github.com/wuxueeee/omniroute/blob/release/v3.8.52/.env.selfhost.example
- `docker-compose.selfhost.yml` v3.8.52 : https://github.com/wuxueeee/omniroute/blob/release/v3.8.52/docker-compose.selfhost.yml
- Docker Compose security model : https://docs.docker.com/compose/trust-model/
- Docker Compose networks : https://docs.docker.com/reference/compose-file/networks/
- Docker Compose service security options : https://docs.docker.com/reference/compose-file/services/

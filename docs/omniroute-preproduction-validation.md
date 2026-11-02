# ADSO AFRICA × OmniRoute — validation préproduction

## Statut
Préparation uniquement. Cette branche ne modifie pas le code applicatif ni la configuration de production. Aucun secret, endpoint réel ou fournisseur n'est configuré dans Git.

## Architecture actuelle constatée
Le dépôt possède déjà `src/lib/ai-gateway.ts`, qui tente les routes dans cet ordre :
1. OmniRoute si `OMNIROUTE_BASE_URL` et `OMNIROUTE_API_KEY` sont définis ;
2. Vercel AI Gateway si `AI_GATEWAY_API_KEY` ou `VERCEL_OIDC_TOKEN` est défini ;
3. OpenAI direct si `OPENAI_API_KEY` est défini ;
4. repli local/open-source de Françoise.

L'appel OmniRoute utilise `POST /v1/chat/completions`, un jeton Bearer côté serveur et un délai de 20 secondes. Le routage est donc déjà préparé dans le code ; la connexion réelle n'est pas considérée active tant qu'un endpoint et un jeton valides n'ont pas été configurés et testés.

## Préconditions avant test
- Déployer OmniRoute dans un environnement séparé de la production, avec stockage persistant et accès réseau HTTPS.
- Configurer les fournisseurs IA dans OmniRoute, pas dans le navigateur ADSO.
- Créer un jeton dédié ADSO, limité aux modèles/endpoints nécessaires, si la version déployée d'OmniRoute prend en charge cette portée.
- Garder tous les secrets dans les variables d'environnement du déploiement de préproduction. Ne jamais les committer ni les envoyer dans un ticket ou une conversation.
- Configurer `OMNIROUTE_BASE_URL`, `OMNIROUTE_API_KEY` et `OMNIROUTE_MODEL=auto` uniquement dans l'environnement de préproduction ADSO.
- Ne pas activer de variable `NEXT_PUBLIC_*` pour un secret.
- Définir une limite de dépense et des plafonds/rate limits côté passerelle et fournisseurs.

## Contrôles de sécurité obligatoires
- HTTPS valide ; endpoint non public si possible, sinon authentification forte et filtrage réseau.
- Vérifier qu'une requête sans jeton retourne 401/403.
- Vérifier qu'un jeton invalide ou révoqué ne permet aucun appel.
- Confirmer que les clés fournisseur ne sont jamais renvoyées au client, dans les logs ou les messages d'erreur.
- Vérifier limites de taille des requêtes, rate limiting, quotas, timeout et comportement sur HTTP 429/5xx.
- Éviter d'envoyer des informations personnelles identifiantes ou des données sensibles des élèves dans les prompts, sauf nécessité démontrée et encadrée.
- Vérifier politique de rétention, localisation, usage pour l'entraînement, conditions contractuelles et conformité applicables pour chaque fournisseur.
- Les contenus réglementaires routiers générés par IA restent consultatifs et doivent être vérifiés à partir de sources officielles.

## Scénarios de test de préproduction
1. Santé du service OmniRoute et TLS.
2. Appel de chat valide depuis le serveur ADSO.
3. Appel sans jeton, avec jeton invalide et après révocation.
4. Modèle demandé indisponible.
5. Fournisseur en erreur 429, 5xx, timeout et réponse vide.
6. Bascule vers Vercel AI Gateway ou le repli local, selon les secrets configurés.
7. Contrôle qu'aucune clé ou donnée confidentielle n'apparaît dans les journaux.
8. Mesure latence, taux d'erreur, coût estimé et limites.
9. Vérification que cours, quiz, comptes, progression et fonctions de prévention fonctionnent quand OmniRoute est coupé.
10. Test manuel de non-régression sur les parcours critiques d'ADSO.

## Critères d'acceptation
- Aucun secret exposé côté client ou dans Git.
- Authentification, limites, délais et journaux vérifiés.
- Repli testé et fonctions essentielles d'ADSO toujours disponibles.
- Coût maximum défini et alertes configurées.
- Tests consignés avec date, environnement et résultats.
- Validation explicite du responsable avant toute modification des variables de production.

## Mise en service ultérieure
Après validation écrite seulement : configurer les secrets de production dans le gestionnaire d'environnement approprié, effectuer un déploiement contrôlé, vérifier les journaux et le comportement réel, puis conserver une procédure de retour arrière. Cette note n'autorise ni fusion de branche, ni promotion, ni changement de production.

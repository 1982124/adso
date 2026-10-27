# ADSO AFRICA — benchmark concurrentiel et décisions produit

**Date de l'audit : 27 octobre 2026**  
**Périmètre :** sources publiques accessibles, positionnement produit et éléments vérifiables du dépôt `1982124/adso`.  
**Limite :** il ne s'agit pas d'un recensement exhaustif de toutes les auto-écoles et applications mondiales. Les fonctions décrites ci-dessous sont celles annoncées par les sources consultées ; elles n'ont pas toutes été testées en compte utilisateur.

## 1. Résumé exécutif

ADSO ne doit pas chercher à gagner en copiant une application de préparation au permis. Son espace différenciant est l'éducation routière tout au long de la vie, pour les piétons, passagers, cyclistes, motocyclistes, conducteurs, élèves, apprentis, établissements et institutions publiques africaines.

Les concurrents et références étudiés montrent cinq attentes de marché :
1. des situations et questions interactives, pas seulement des textes ;
2. une adaptation réglementaire explicite au pays et des sources vérifiables ;
3. un apprentissage accessible sur mobile, dans plusieurs langues et avec une consommation de données maîtrisée ;
4. une mesure des acquis avant/après, distincte des statistiques d'accidents ;
5. des tableaux de bord et rapports compréhensibles pour les organisations et pouvoirs publics.

Le dépôt possède déjà plusieurs briques utiles : parcours immersif, évaluation et feedback après réponse, catalogue pédagogique commun, sélection du pays à l'inscription et page institutionnelle avec proposition de pilote. Elles ne prouvent pas encore que toutes les règles nationales, les médias, les parcours mobiles et la persistance des résultats fonctionnent de bout en bout.

## 2. Paysage concurrentiel représentatif

| Référence | Public / proposition publique | Forces à retenir | Limite ou leçon pour ADSO |
|---|---|---|---|
| **Vroom Africa** (Sénégal) | Préparation à la théorie du permis, leçons, quiz, simulateur et tuteur IA | Parcours guidé, quiz, simulation et aide conversationnelle | Ciblage surtout permis ; ADSO doit couvrir les usagers vulnérables et l'éducation dès l'école, sans promettre une équivalence officielle |
| **AfrikDrive** (Cameroun / zone CEMAC) | Sessions de conduite suivies, score de sécurité, relecture de trajet, modules de manœuvres et quiz | Boucle de feedback concrète et progression par session | Le suivi GPS implique des données sensibles ; ADSO ne doit pas ajouter de télématique sans besoin démontré, consentement et garanties |
| **DriveAbout** (Australie / international) | Ressources numériques de sécurité routière, formats LMS, e-books et applications, contenus multilingues et offres organisations | Accessibilité culturelle, choix des formats, offres écoles/entreprises/gouvernements | Le contexte juridique local doit rester exact ; traduire n'est pas localiser |
| **Yarrive** (Autriche) | Apprentissage numérique gamifié pour jeunes et candidats au permis | Répétition espacée, quiz, duels, mesure des usages et comparaison avant/après | Les résultats d'apprentissage et l'effet sur les accidents sont deux niveaux de preuve différents |
| **YOURS Academy** (international) | Modules en ligne sur la sécurité routière et la mobilité durable, destinés aux jeunes et institutions | Contenu fondé sur des preuves, récits concrets et capacité de formation des acteurs | ADSO doit rendre les résultats et limites pédagogiques transparents, pas seulement afficher une ambition |
| **Alertdriving / FleetDefense** (international) | Formation défensive, micro-apprentissage, scénarios de perception du danger, plans individualisés et rapports de gestion des risques | Formation ciblée, contenu localisé, suivi organisationnel | Modèle orienté flottes et entreprises ; ADSO doit rester accessible aux citoyens et communautés, en plus des institutions |
| **iRAP / ViDA** (référence institutionnelle, pas concurrent direct de cours) | Évaluation du risque des infrastructures, outils de données et planification des investissements routiers | Méthodologie, données, priorisation et décisions publiques fondées sur les risques | ADSO forme et évalue des apprentissages ; ne pas prétendre évaluer la sécurité d'une route comme iRAP sans les données et méthodologies correspondantes |
| **African Highway Code** (application de guide) | Guide mobile de principes et règles de sécurité routière présentés comme panafricains | Simplicité et accès rapide à l'information | Un socle commun africain ne remplace pas la réglementation de chaque pays ; toute règle précise doit avoir une juridiction, une source et une date |

### Sources publiques

- Vroom Africa, fiche Google Play : https://play.google.com/store/apps/details?id=com.vroomafrica.app
- AfrikDrive, fiche Google Play : https://play.google.com/store/apps/details?id=com.afrikdrive.app
- DriveAbout : https://www.driveabout.au/
- Yarrive, European Road Safety Charter : https://road-safety-charter.ec.europa.eu/content/yarrive-app-driving-license-preparation
- YOURS Academy : https://claimingourspace.org/yours-academy
- Alertdriving : https://www.alertdriving.info/
- iRAP : https://irap.org/
- African Highway Code, App Store : https://apps.apple.com/us/app/african-highway-code/id6757408001
- IRU, recommandations pour la sensibilisation routière en Afrique : https://www.iru.org/news-resources/newsroom/driving-road-safety-africa-what-can-governments-do

## 3. Diagnostic ADSO : ce que le dépôt permet de dire

### Déjà présent dans le produit ou le dépôt
- Page d'accueil centrée sur l'éducation, la prévention et la mobilité sûre.
- Entrées destinées aux citoyens, élèves/étudiants/apprentis, conducteurs, établissements et institutions.
- Parcours ADSO Immersif et évaluation des réponses avec retour après soumission.
- Sélection du pays et de la langue à l'inscription.
- API de cours qui cherche à distinguer le socle pédagogique commun des règles locales et à éviter d'exposer certains contenus juridiques étrangers dans le catalogue de secours.
- Page institutionnelle présentant un pilote de 90 jours et des mesures d'apprentissage.

### Non démontré à ce stade
- Validation juridique, source et date de chaque règle enseignée pour chacun des pays.
- Couverture complète et vérifiée de tous les pays africains, de leurs panneaux, règles, numéros d'urgence et sanctions.
- Mode hors ligne, audio ou consommation de données mesurée sur téléphone bas débit.
- Rapports institutionnels alimentés par des données réelles, exportables et testés.
- Test complet du parcours mobile, de la connexion jusqu'à la sauvegarde et la reprise de progression.
- Effet causal d'ADSO sur les collisions, les blessures ou les décès.

## 4. Modifications produit à prioriser

### P0 — Fiabilité et confiance avant croissance
1. Faire passer les contrôles de sécurité, TypeScript, lint et build sur le commit candidat. Le contrôle Production Quality Gate a échoué le 27 octobre 2026 au stade `npm audit --audit-level=high` : trois vulnérabilités de sévérité élevée ont été signalées par le journal. Il faut identifier les paquets et corriger les dépendances sans appliquer aveuglément `npm audit fix --force`.
2. Tester réellement sur mobile : inscription, choix pays/langue, ouverture d'un cours, scène, choix, feedback, sauvegarde et reprise.
3. Garder les réponses correctes invisibles avant la soumission ; afficher les explications seulement après l'évaluation côté serveur.
4. Ne pas fusionner la PR tant que les contrôles bloquants ne sont pas verts.

### P1 — Localisation nationale vérifiable
1. Introduire un registre éditorial par pays : code pays, thème, règle enseignée, source officielle, URL, date de consultation, date d'effet, validateur, statut (`draft`, `reviewed`, `verified`, `expired`).
2. Séparer explicitement « principe de sécurité universel » et « règle juridique nationale ». La langue ne doit jamais choisir la juridiction.
3. Pour un pays sans contenu réglementaire validé, afficher le socle de sécurité commun et un avertissement clair ; ne pas inventer vitesse, sanction, âge, panneau ou numéro d'urgence.
4. Auditer les données existantes avant toute migration : plusieurs modèles Prisma ont encore un défaut `FR`. Ne pas remplacer massivement ces valeurs par un pays africain sans source ni revue humaine.

### P1 — Qualité pédagogique distinctive
1. Standardiser chaque scène : situation réelle → décision de l'apprenant → conséquence → explication → compétence évaluée → conseil de progression.
2. Évaluer les mêmes connaissances avant et après une formation, avec un score de compréhension des risques et une analyse des erreurs fréquentes.
3. Répéter les apprentissages sur les erreurs observées, sans confondre points ludiques et maîtrise réelle d'une compétence.
4. Couvrir explicitement les piétons, passagers, cyclistes, motocyclistes, taxi-motos, conducteurs et abords d'écoles, pas seulement le permis voiture.

### P2 — Accessibilité africaine et institutions
1. Mesurer le poids des pages et médias, le temps de chargement mobile et la consommation de données ; ajouter un mode audio léger et un mode de reprise si les tests le justifient.
2. Ne promettre le hors-ligne qu'après implémentation et tests de synchronisation.
3. Produire des rapports institutionnels avec période, pays, taille de l'échantillon, taux de complétion, scores avant/après, données manquantes et limites méthodologiques.
4. Mesurer le coût par participant et la charge d'administration lors du pilote.
5. Ne publier aucun chiffre d'accidents évités ou de vies sauvées imputé à ADSO sans protocole d'évaluation approprié.

## 5. Mesures de succès pour le pilote

- Fiabilité : taux de parcours complets sans erreur, taux de sauvegarde et reprise réussie.
- Apprentissage : variation du score pré/post, reconnaissance des dangers, erreurs récurrentes.
- Accessibilité : réussite sur téléphone, durée de chargement, abandon par étape et retours des personnes ayant des contraintes de langue ou de littératie.
- Déploiement : inscriptions, participants actifs, achèvement, coût par participant.
- Gouvernance : proportion de règles nationales avec source officielle, date, statut de validation et responsable éditorial.
- Impact routier : à traiter séparément, uniquement si un dispositif d'évaluation et des données adaptées sont disponibles.

## 6. Décision produit

ADSO doit se différencier par **l'éducation routière pour tous les usagers + des décisions immersives + une localisation nationale contrôlée + une mesure honnête des apprentissages + une utilité institutionnelle**. Les fonctions de télématique, les classements, l'IA conversationnelle ou les modes hors ligne ne doivent être ajoutés que s'ils répondent à un besoin prioritaire, sont sécurisés et peuvent être testés.

Ce benchmark est une base de décision évolutive, pas une affirmation d'exhaustivité. Les fonctionnalités et la situation des concurrents peuvent changer ; réexaminer les sources avant toute communication commerciale.

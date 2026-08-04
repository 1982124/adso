// ═══════════════════════════════════════════════════════════
// ADSO V3 — Seed Data: Practical Driving Exercises
// 32 real driving school exercises covering all 16 categories
// Categories: city, highway, rural, mountain, night, rain, fog,
//   snow, parking, maneuver, intersection, priority, roundabout,
//   overtaking, emergency_braking, eco_driving
// ═══════════════════════════════════════════════════════════

export const seedPracticalExercises = [
  // ═══════════════════════════════════════════════════════════════
  // CITY — Conduite en milieu urbain
  // ═══════════════════════════════════════════════════════════════
  {
    title: "Traversée d'une agglomération en heure de pointe",
    description: "Parcours en centre-ville aux heures de forte affluence. L'élève doit naviguer dans un environnement dense avec piétons, cyclistes, bus et véhicules stationnés. La gestion de l'espace, l'anticipation des comportements et le respect des priorités sont essentiels.",
    category: "city",
    difficulty: "intermediate",
    objectives: JSON.stringify([
      "Maintenir une allure adaptée aux conditions de trafic urbain",
      "Anticiper les comportements des usagers vulnérables (piétons, cyclistes)",
      "Gérer les croisements et les changements de file en sécurité",
      "Respecter les limitations de vitesse en agglomération (50 km/h)",
      "Maîtriser la technique d'arrêt et de redémarrage en circulation dense"
    ]),
    steps: JSON.stringify([
      "Vérifier les rétroviseurs intérieur et extérieurs avant de démarrer",
      "Démarrer le véhicule et enclencher le clignotant droit",
      "S'insérer dans la circulation en vérifiant l'angle mort gauche",
      "Maintenir une distance de sécurité de 2 secondes minimum avec le véhicule précédent",
      "Surveiller les trottoirs et les traversées piétonnes en permanence",
      "Réduire l'allure à l'approche des feux tricolores et des passages piétons",
      "Effectuer les changements de file en utilisant le rétroviseur et l'angle mort",
      "Franchir les carrefours en vérifiant les priorités à droite",
      "Adapter sa vitesse aux zones de rencontre (20 km/h)",
      "Stationner le véhicule en fin de parcours en respectant le marquage au sol"
    ]),
    criteria: JSON.stringify([
      "Respect scrupuleux des limitations de vitesse (50 km/h en agglomération)",
      "Maintien constant d'une distance de sécurité suffisante",
      "Utilisation systématique des rétroviseurs avant toute manœuvre",
      "Anticipation et respect des priorités (piétons, cyclistes, priorité à droite)",
      "Fluidité de la conduite sans accélérations ou freinages brusques",
      "Positionnement correct sur la chaussée selon la manœuvre envisagée",
      "Gestion appropriée des feux tricolores (ni arrêt intempestif, ni passage au rouge)",
      "Maîtrise de l'angle mort lors des changements de direction"
    ]),
    tips: JSON.stringify([
      "Fixez un point de référence au sol pour évaluer la distance de sécurité (2 secondes)",
      "Balayez régulièrement du regard les trottoirs et les sorties de garage",
      "En cas de doute sur une priorité, cédez le passage",
      "Restez attentif aux clignotants des véhicules stationnés qui pourraient ouvrir une portière"
    ]),
    scoring: JSON.stringify({ "excellent": "90-100%", "good": "75-89%", "satisfactory": "60-74%", "insufficient": "<60%" }),
    countryCode: "FR",
    licenseCode: "B",
  },
  {
    title: "Navigation en zone 30 et zones de rencontre",
    description: "Parcours dans des zones à vitesse limitée (30 km/h) incluant des zones de rencontre. L'élève doit partager l'espace avec les piétons, adapter sa vitesse et être particulièrement vigilant face aux enfants et aux personnes âgées.",
    category: "city",
    difficulty: "beginner",
    objectives: JSON.stringify([
      "Respecter la limitation à 30 km/h en permanence",
      "Partager l'espace routier avec les piétons en toute sécurité",
      "Identifier et comprendre la signalisation des zones de rencontre",
      "Adapter sa vitesse aux alentours des écoles et des parcs",
      "Réagir de manière appropriée aux imprévus fréquents en zone 30"
    ]),
    steps: JSON.stringify([
      "Identifier le panneau d'entrée en agglomération et la zone 30",
      "Réduire immédiatement l'allure à 30 km/h maximum",
      "Observer les abords de la route : écoles, parcs, commerces",
      "Maintenir une vitesse permettant l'arrêt devant tout imprévu",
      "Céder systématiquement le passage aux piétons engagés sur la chaussée",
      "Franchir les ralentisseurs à vitesse modérée sans freinage brusque",
      "Sortir de la zone 30 en accélérant progressivement après le panneau de fin",
      "Commenter les situations rencontrées avec l'accompagnateur"
    ]),
    criteria: JSON.stringify([
      "Vitesse maintenue en dessous ou égale à 30 km/h",
      "Arrêt systématique devant les piétons sur la chaussée",
      "Conduite souple sur les dos d'âne et les coussins berlinois",
      "Respect de la signalisation spécifique aux zones de rencontre",
      "Vigilance accrue aux abords des écoles et espaces de jeux"
    ]),
    tips: JSON.stringify([
      "En zone de rencontre, le piéton a priorité sur tout le reste de la chaussée",
      "Réduisez suffisamment pour ne pas avoir à freiner devant un ralentisseur",
      "Les enfants ont des comportements imprévisibles : soyez doublement vigilant"
    ]),
    scoring: JSON.stringify({ "excellent": "90-100%", "good": "75-89%", "satisfactory": "60-74%", "insufficient": "<60%" }),
    countryCode: "FR",
    licenseCode: "B",
  },

  // ═══════════════════════════════════════════════════════════════
  // HIGHWAY — Conduite sur autoroute
  // ═══════════════════════════════════════════════════════════════
  {
    title: "Insertion sur autoroute et conduite à 130 km/h",
    description: "Exercice complet d'entrée sur autoroute par une bretelle d'accélération, insertion dans le trafic sur la voie de droite, maintien de la vitesse réglementaire et préparation à la sortie. L'élève doit maîtriser les vitesses élevées et les distances de sécurité associées.",
    category: "highway",
    difficulty: "advanced",
    objectives: JSON.stringify([
      "S'insérer sur l'autoroute en adaptant sa vitesse au trafic de la voie de droite",
      "Maintenir la vitesse autorisée de 130 km/h (110 km/h par temps de pluie)",
      "Respecter les distances inter-véhicules adaptées à la vitesse",
      "Effectuer un dépassement sécurisé en utilisant la voie de gauche",
      "Préparer et exécuter une sortie d'autoroute en toute sécurité"
    ]),
    steps: JSON.stringify([
      "S'engager sur la bretelle d'accès et accélérer progressivement",
      "Vérifier le rétroviseur gauche et l'angle mort gauche",
      "Enclencher le clignotant gauche pour signaler son intention",
      "S'insérer dans la voie de droite à une vitesse adaptée au trafic",
      "Maintenir la vitesse de 130 km/h en surveillant le compteur",
      "Vérifier régulièrement les rétroviseurs (toutes les 5-10 secondes)",
      "Pour dépasser : rétroviseur gauche, angle mort, clignotant gauche, déboîtement",
      "Après le dépassement, rétroviseur droit, clignotant droit, rabattement",
      "À l'approche de la sortie, enclencher le clignotant droit suffisamment tôt",
      "Décélérer progressivement sur la bretelle de sortie"
    ]),
    criteria: JSON.stringify([
      "Vitesse d'insertion adaptée au flux de circulation sur la voie de droite",
      "Distance de sécurité de 2 secondes minimum respectée à toute vitesse",
      "Utilisation correcte des clignotants avant tout changement de voie",
      "Vérification systématique de l'angle mort avant déboîtement",
      "Retour rapide sur la voie de droite après dépassement",
      "Vitesse de croisière stable et conforme à la limitation",
      "Sortie anticipée sur la voie de droite avant un point de sortie",
      "Freinage progressif sur la bretelle de sortie sans freinage brusque"
    ]),
    tips: JSON.stringify([
      "La distance d'arrêt à 130 km/h est d'environ 130 mètres : doublez vos distances de sécurité",
      "Regardez loin devant pour anticiper les ralentissements",
      "Ne circulez jamais sur la voie de gauche de manière prolongée",
      "Sur autoroute, le clignotant doit être mis suffisamment tôt pour être vu des autres conducteurs"
    ]),
    scoring: JSON.stringify({ "excellent": "90-100%", "good": "75-89%", "satisfactory": "60-74%", "insufficient": "<60%" }),
    countryCode: "FR",
    licenseCode: "B",
  },
  {
    title: "Conduite sur autoroute par temps de pluie",
    description: "Parcours autoroutier spécifique aux conditions de pluie. La vitesse maximale est réduite à 110 km/h et les distances de sécurité doivent être augmentées. L'élève apprend à gérer l'aquaplaning et la visibilité réduite.",
    category: "highway",
    difficulty: "advanced",
    objectives: JSON.stringify([
      "Adapter sa vitesse à 110 km/h maximum par temps de pluie",
      "Augmenter les distances de sécurité (minimum 2 secondes, idéalement 3)",
      "Identifier les zones à risque d'aquaplanage",
      "Utiliser les feux de croisement en permanence",
      "Réagir correctement en cas de perte d'adhérence"
    ]),
    steps: JSON.stringify([
      "Allumer les feux de croisement dès les premières gouttes",
      "Réduire la vitesse à 110 km/h maximum",
      "Augmenter la distance de sécurité avec le véhicule précédent",
      "Éviter les flaques d'eau et les zones où l'eau s'accumule",
      "Ne pas effectuer de manœuvres brusques (freinage, direction)",
      "En cas d'aquaplaning : ne pas braquer, lever le pied de l'accélérateur",
      "Utiliser les essuie-glaces à la vitesse adaptée",
      "Mettre en route le dégivrage arrière si nécessaire",
      "Maintenir une trajectoire stable dans les virages autoroutiers",
      "Signaliser tout changement de voie avec anticipation"
    ]),
    criteria: JSON.stringify([
      "Vitesse respectée à 110 km/h maximum",
      "Feux de croisement allumés en permanence",
      "Distance de sécurité augmentée par rapport aux conditions normales",
      "Conduite souple sans accélérations ni freinages brusques",
      "Évitement des flaques d'eau",
      "Maîtrise du véhicule en cas de perte d'adhérence",
      "Utilisation adaptée des essuie-glaces et du dégivrage"
    ]),
    tips: JSON.stringify([
      "Après un long trajet sous la pluie, les freins peuvent être moins efficaces : testez-les doucement",
      "Les premiers centimètres d'eau sur la route sont les plus dangereux (mélange huile/eau)",
      "Surveillez les réactions des véhicules devant vous : ils indiquent les zones glissantes"
    ]),
    scoring: JSON.stringify({ "excellent": "90-100%", "good": "75-89%", "satisfactory": "60-74%", "insufficient": "<60%" }),
    countryCode: "FR",
    licenseCode: "B",
  },

  // ═══════════════════════════════════════════════════════════════
  // RURAL — Conduite en rase campagne
  // ═══════════════════════════════════════════════════════════════
  {
    title: "Conduite sur route départementale à 80 km/h",
    description: "Parcours sur route à deux voies en rase campagne avec une vitesse maximale de 80 km/h. L'élève doit gérer les croisements, les virages, les accès de propriétés et la présence éventuelle d'animaux ou de véhicules agricoles.",
    category: "rural",
    difficulty: "beginner",
    objectives: JSON.stringify([
      "Maintenir une allure de 80 km/h sur route départementale",
      "Gérer les croisements avec des véhicules larges (tracteurs, camions)",
      "Anticiper les virages en adaptant sa vitesse avant le virage",
      "Surveiller les accès de propriétés et les traversées d'animaux",
      "Respecter les priorités à droite aux intersections non signalisées"
    ]),
    steps: JSON.stringify([
      "Vérifier la signalisation en entrant sur la route départementale",
      "Adapter sa vitesse à la limitation de 80 km/h",
      "Maintenir sa position sur la droite de la chaussée",
      "Surveiller les panneaux de virage et adapter sa vitesse en conséquence",
      "En cas de croisement difficile, ralentir et serrer légèrement à droite",
      "Franchir les hameaux et les agglomérations en réduisant à 50 km/h",
      "Respecter la priorité à droite aux intersections sans signalisation",
      "Être vigilant aux animaux pouvant traverser la route",
      "Gérer les dépassements de véhicules lents en toute sécurité",
      "Maintenir une conduite souple et anticipée"
    ]),
    criteria: JSON.stringify([
      "Vitesse adaptée à la limitation (80 km/h) et aux conditions",
      "Positionnement correct sur la chaussée",
      "Gestion appropriée des croisements",
      "Anticipation des virages par réduction de vitesse avant le virage",
      "Respect des priorités aux intersections",
      "Vigilance aux usagers vulnérables et aux animaux",
      "Conduite souple et fluide"
    ]),
    tips: JSON.stringify([
      "Sur route départementale, les sorties de champs et de bois sont des zones de danger",
      "En cas de rencontre avec un tracteur, serrez à droite sans descendre sur l'accotement",
      "Les limitations en rase campagne sont passées de 90 à 80 km/h depuis 2018"
    ]),
    scoring: JSON.stringify({ "excellent": "90-100%", "good": "75-89%", "satisfactory": "60-74%", "insufficient": "<60%" }),
    countryCode: "FR",
    licenseCode: "B",
  },
  {
    title: "Traversée de hameaux et zones habitées en rase campagne",
    description: "Parcours sur route départementale avec traversée de plusieurs hameaux sans panneau d'agglomération. L'élève doit identifier les zones habitées et adapter sa vitesse même en l'absence de signalisation explicite.",
    category: "rural",
    difficulty: "intermediate",
    objectives: JSON.stringify([
      "Identifier les indices permettant de repérer une zone habitée",
      "Adapter sa vitesse à 50 km/h dans les hameaux non signalisés",
      "Être vigilant aux enfants, animaux domestiques et véhicules stationnés",
      "Gérer les accès de propriétés non visibles",
      "Maintenir une allure adaptée entre les zones habitées"
    ]),
    steps: JSON.stringify([
      "Observer les indices de présence habitée : maisons proches de la route, boîtes aux lettres",
      "Réduire progressivement la vitesse à l'approche d'un hameau",
      "Maintenir une allure permettant l'arrêt devant tout imprévu",
      "Surveiller les portails, grilles et entrées de propriétés",
      "Franchir le hameau à vitesse modérée en restant vigilant",
      "Reprendre progressivement la vitesse autorisée après le hameau",
      "Répéter l'opération pour chaque zone habitée traversée"
    ]),
    criteria: JSON.stringify([
      "Identification correcte des zones habitées",
      "Réduction de vitesse adaptée dans les hameaux",
      "Vigilance accrue aux accès de propriétés",
      "Conduite souple avec anticipation"
    ]),
    tips: JSON.stringify([
      "L'absence de panneau d'agglomération ne dispense pas de prudence dans les hameaux",
      "Les boîtes aux lettres regroupées indiquent souvent une zone habitée proche",
      "Les animaux errants sont fréquents dans les hameaux ruraux"
    ]),
    scoring: JSON.stringify({ "excellent": "90-100%", "good": "75-89%", "satisfactory": "60-74%", "insufficient": "<60%" }),
    countryCode: "FR",
    licenseCode: "B",
  },

  // ═══════════════════════════════════════════════════════════════
  // MOUNTAIN — Conduite en montagne
  // ═══════════════════════════════════════════════════════════════
  {
    title: "Descente de col avec utilisation du frein moteur",
    description: "Exercice de descente d'un col de montagne sur route sinueuse. L'élève doit utiliser le frein moteur pour contrôler sa vitesse sans surchauffer les freins, gérer les virages en épingles et respecter les priorités dans les virages sans visibilité.",
    category: "mountain",
    difficulty: "advanced",
    objectives: JSON.stringify([
      "Utiliser le frein moteur pour contrôler la vitesse en descente",
      "Rétrograder à temps pour maintenir un régime moteur efficace",
      "Gérer les virages en épingles avec une trajectoire adaptée",
      "Respecter les priorités dans les virages sans visibilité",
      "Éviter la surchauffe des freins en descente prolongée"
    ]),
    steps: JSON.stringify([
      "En haut du col, vérifier l'état des freins et du véhicule",
      "Passer en rapport inférieur avant la descente (2ème ou 3ème)",
      "Lever le pied de l'accélérateur et laisser le frein moteur agir",
      "À l'approche d'un virage, freiner légèrement puis relâcher en entrée de virage",
      "Maintenir une vitesse constante dans le virage grâce au frein moteur",
      "Rétrograder si nécessaire pour maintenir le contrôle",
      "Surveiller les panneaux de virage et les indications de pente",
      "Céder le passage aux véhicules montants dans les zones étroites",
      "Ne jamais couper les virages, rester sur sa droite",
      "En fin de descente, vérifier la température des freins si possible"
    ]),
    criteria: JSON.stringify([
      "Utilisation systématique du frein moteur en descente",
      "Rétrogradage effectué avant la perte de contrôle de la vitesse",
      "Trajectoire dans les virages sans coupure",
      "Priorité donnée aux véhicules montants dans les passages étroits",
      "Absence de surchauffe des freins (freinage minimal)",
      "Vitesse adaptée à chaque virage",
      "Positionnement correct sur la chaussée dans les virages"
    ]),
    tips: JSON.stringify([
      "En descente, le frein moteur est votre meilleur allié : rétrogradez plutôt que de freiner",
      "Si vous sentez une odeur de brûlé ou une perte d'efficacité des freins, arrêtez-vous immédiatement",
      "Les virages en montagne peuvent cacher des obstacles : restez sur votre droite"
    ]),
    scoring: JSON.stringify({ "excellent": "90-100%", "good": "75-89%", "satisfactory": "60-74%", "insufficient": "<60%" }),
    countryCode: "FR",
    licenseCode: "B",
  },
  {
    title: "Montée de route sinueuse en montagne",
    description: "Exercice d'ascension d'une route de montagne avec des virages serrés et des pentes importantes. L'élève doit gérer les changements de rapport, maintenir une vitesse stable dans les montées et gérer les dépassements de véhicules lents.",
    category: "mountain",
    difficulty: "advanced",
    objectives: JSON.stringify([
      "Maintenir une vitesse adéquate dans les montées raides",
      "Changer de rapport au bon moment pour éviter le calage",
      "Gérer les virages en montée avec une trajectoire adaptée",
      "Évaluer la visibilité suffisante pour un dépassement en montée",
      "Respecter les interdictions de dépassement dans les virages"
    ]),
    steps: JSON.stringify([
      "Aborder la montée en rapport adapté à la pente",
      "Maintenir un régime moteur entre 2000 et 3000 tr/min",
      "Réduire la vitesse avant chaque virage",
      "Rétrograder si le moteur peine dans la montée",
      "Garder sa droite dans les virages sans s'en approcher trop",
      "En cas de dépassement, vérifier la visibilité sur une distance suffisante",
      "Respecter les lignes blanches continues (interdiction de dépasser)",
      "Surveiller la température du moteur en montée prolongée",
      "Utiliser les créneaux de dépassement lorsqu'ils sont disponibles",
      "Redescendre les rapports progressivement en fin de montée"
    ]),
    criteria: JSON.stringify([
      "Gestion adéquate du rapport de vitesse dans les montées",
      "Vitesse stable et adaptée dans les virages",
      "Respect des lignes blanches et des interdictions de dépassement",
      "Trajectoire correcte dans les virages",
      "Surveillance de la jauge de température moteur"
    ]),
    tips: JSON.stringify([
      "En montée forte, ne forcez pas le moteur : rétrogradez plutôt que d'accélérer",
      "Les virages en montagne sont souvent dévisagés : ne les coupez jamais",
      "Les véhicules poids lourds sont très lents en montée : patience et prudence"
    ]),
    scoring: JSON.stringify({ "excellent": "90-100%", "good": "75-89%", "satisfactory": "60-74%", "insufficient": "<60%" }),
    countryCode: "FR",
    licenseCode: "B",
  },

  // ═══════════════════════════════════════════════════════════════
  // NIGHT — Conduite nocturne
  // ═══════════════════════════════════════════════════════════════
  {
    title: "Conduite de nuit en agglomération et hors agglomération",
    description: "Parcours nocturne combinant milieu urbain éclairé et rase campagne non éclairée. L'élève doit maîtriser le passage entre feux de croisement et feux de route, l'éblouissement par les véhicules en sens inverse et l'adaptation de la vitesse à la portée des feux.",
    category: "night",
    difficulty: "intermediate",
    objectives: JSON.stringify([
      "Utiliser correctement les feux de croisement et les feux de route",
      "Passer des feux de route aux feux de croisement en temps voulu",
      "Adapter sa vitesse à la portée de ses feux",
      "Gérer l'éblouissement causé par les véhicules en sens inverse",
      "Identifier les usagers et obstacles dans l'obscurité"
    ]),
    steps: JSON.stringify([
      "Vérifier le bon fonctionnement de tous les feux avant le départ",
      "Allumer les feux de croisement dès le coucher du soleil ou par visibilité réduite",
      "En agglomération éclairée, rouler en feux de croisement",
      "En quittant l'agglomération, passer en feux de route si la route est non éclairée",
      "Repasser en feux de croisement à l'approche d'un véhicule en sens inverse",
      "Repasser en feux de croisement à l'approche d'un véhicule que l'on suit",
      "Adapter sa vitesse pour pouvoir s'arrêter dans la zone éclairée par ses feux",
      "Surveiller les reflets des yeux des animaux sur le bord de la route",
      "En cas d'éblouissement, ralentir sans freiner brusquement et fixer le bord droit de la route",
      "Rester attentif aux piétons non éclairés et aux cyclistes sans éclairage"
    ]),
    criteria: JSON.stringify([
      "Utilisation correcte et anticipée des feux de route et de croisement",
      "Vitesse adaptée à la portée des feux",
      "Gestion maîtrisée de l'éblouissement",
      "Transition fluide entre zones éclairées et non éclairées",
      "Vigilance accrue aux usagers faiblement visibles",
      "Conduite souple et anticipée"
    ]),
    tips: JSON.stringify([
      "Règle des feux de route : passez en croisement à 150 mètres d'un véhicule en face",
      "Nettoyez régulièrement le pare-brise intérieur pour éviter les reflets",
      "Si vous êtes ébloui, fixez le bord droit de la chaussée pour vous guider",
      "Adaptez toujours votre vitesse à ce que vous pouvez VOIR, pas à ce que vous devinez"
    ]),
    scoring: JSON.stringify({ "excellent": "90-100%", "good": "75-89%", "satisfactory": "60-74%", "insufficient": "<60%" }),
    countryCode: "FR",
    licenseCode: "B",
  },

  // ═══════════════════════════════════════════════════════════════
  // RAIN — Conduite sous la pluie
  // ═══════════════════════════════════════════════════════════════
  {
    title: "Conduite sous forte pluie en ville et en rase campagne",
    description: "Parcours sous pluie intense avec gestion de la visibilité réduite, des flaques d'eau et de l'augmentation des distances d'arrêt. L'élève apprend à adapter sa conduite aux conditions d'adhérence dégradées.",
    category: "rain",
    difficulty: "intermediate",
    objectives: JSON.stringify([
      "Adapter sa vitesse aux conditions d'adhérence réduite",
      "Augmenter les distances de sécurité par temps de pluie",
      "Utiliser les essuie-glaces et le désembuage correctement",
      "Identifier et éviter les zones à risque d'aquaplanage",
      "Comprendre l'augmentation de la distance d'arrêt sur sol mouillé"
    ]),
    steps: JSON.stringify([
      "Allumer les feux de croisement dès le début de la pluie",
      "Activer les essuie-glaces à la vitesse adaptée à l'intensité de la pluie",
      "Augmenter la distance de sécurité à 3 secondes minimum",
      "Réduire sa vitesse de 10 à 20 km/h par rapport à la limitation",
      "Éviter les flaques d'eau et les zones inondées",
      "En cas d'aquaplaning, ne pas braquer ni freiner brusquement",
      "Utiliser le frein moteur plutôt que le frein à pédale",
      "Surveiller les piétons et cyclistes sous parapluies",
      "Mettre en route le dégivrage si le pare-brise s'embue",
      "Doubler la prudence aux passages piétons"
    ]),
    criteria: JSON.stringify([
      "Feux de croisement allumés en permanence",
      "Distance de sécurité augmentée",
      "Vitesse réduite adaptée aux conditions",
      "Évitement des flaques d'eau",
      "Conduite souple sans manœuvres brusques",
      "Utilisation adaptée des équipements du véhicule (essuie-glaces, dégivrage)"
    ]),
    tips: JSON.stringify([
      "Sur sol mouillé, la distance d'arrêt augmente d'environ 50%",
      "Les premiers millimètres d'eau sur la route sont les plus glissants",
      "Après un long trajet sous la pluie, testez doucement vos freins en zone sûre"
    ]),
    scoring: JSON.stringify({ "excellent": "90-100%", "good": "75-89%", "satisfactory": "60-74%", "insufficient": "<60%" }),
    countryCode: "FR",
    licenseCode: "B",
  },

  // ═══════════════════════════════════════════════════════════════
  // FOG — Conduite dans le brouillard
  // ═══════════════════════════════════════════════════════════════
  {
    title: "Conduite dans le brouillard",
    description: "Apprendre à adapter sa conduite en conditions de visibilité réduite par le brouillard. Maîtriser l'utilisation des feux antibrouillard, les distances de sécurité augmentées et les vitesses adaptées.",
    category: "fog",
    difficulty: "intermediate",
    objectives: JSON.stringify([
      "Utiliser correctement les feux antibrouillard avant et arrière",
      "Adapter sa vitesse à la visibilité réduite",
      "Maintenir des distances de sécurité suffisantes",
      "Savoir réagir en cas de brouillard épais soudain"
    ]),
    steps: JSON.stringify([
      "Allumer les feux de croisement et les feux antibrouillard avant si nécessaire",
      "Réduire la vitesse en dessous de 50 km/h hors agglomération",
      "Augmenter la distance de sécurité à au moins 100 mètres",
      "Ne pas s'arrêter sur la chaussée ; utiliser un emplacement sûr",
      "En cas de brouillard dense, s'arrêter sur l'accotement ou une aire de stationnement",
      "Utiliser les repères latéraux (bande blanche, bordure) pour se guider"
    ]),
    criteria: JSON.stringify([
      "Feux antibrouillard utilisés à bon escient",
      "Vitesse adaptée à la visibilité",
      "Distance de sécurité suffisante",
      "Aucun arrêt dangereux sur la chaussée",
      "Utilisation des feux de détresse en cas d'arrêt"
    ]),
    tips: JSON.stringify([
      "En brouillard, la visibilité peut passer de 100m à moins de 10m en quelques mètres",
      "Les feux antibrouillard arrière sont obligatoires uniquement si visibilité < 50m",
      "Ne jamais utiliser les feux de route en brouillard (ils éblouissent par réflexion)"
    ]),
    scoring: JSON.stringify({ "excellent": "90-100%", "good": "75-89%", "satisfactory": "60-74%", "insufficient": "<60%" }),
    countryCode: "FR",
    licenseCode: "B",
  },

  // ═══════════════════════════════════════════════════════════════
  // SNOW — Conduite sur neige et verglas
  // ═══════════════════════════════════════════════════════════════
  {
    title: "Conduite sur neige et verglas",
    description: "Maîtriser la conduite hivernale sur chaussées enneigées ou verglacées. Apprendre les techniques de démarrage, freinage et direction sur sol à faible adhérence.",
    category: "snow",
    difficulty: "advanced",
    objectives: JSON.stringify([
      "Effectuer un démarrage sur sol enneigé sans patinage",
      "Freiner progressivement sans blocage des roues",
      "Adapter sa vitesse et sa trajectoire sur sol glissant",
      "Identifier les zones à risque de verglas"
    ]),
    steps: JSON.stringify([
      "Équiper le véhicule de pneus hiver ou de chaînes si nécessaire",
      "Démarrer en seconde vitesse pour limiter le couple",
      "Accélérer très progressivement pour éviter le patinage",
      "Freiner par à-coups légers (freinage dégressif)",
      "Anticiper tous les virages en décélérant avant le virage",
      "En cas de perte d'adhérence, ne pas braquer ni freiner brusquement"
    ]),
    criteria: JSON.stringify([
      "Démarrage sans patinage excessif",
      "Freinage progressif et adapté",
      "Vitesse raisonnable pour les conditions",
      "Trajectoire adaptée dans les virages",
      "Aucune manœuvre brusque"
    ]),
    tips: JSON.stringify([
      "Les ponts et zones ombragées verglacent en premier",
      "Testez l'adhérence dans un endroit sûr avant de rouler normalement",
      "En montée, prenez de l'élan avant la pente pour éviter de devoir démarrer en côte"
    ]),
    scoring: JSON.stringify({ "excellent": "90-100%", "good": "75-89%", "satisfactory": "60-74%", "insufficient": "<60%" }),
    countryCode: "FR",
    licenseCode: "B",
  },

  // ═══════════════════════════════════════════════════════════════
  // INTERSECTION — Franchissement d'intersection
  // ═══════════════════════════════════════════════════════════════
  {
    title: "Franchissement d'intersection complexe",
    description: "Apprendre à négocier différents types d'intersections : croisement, carrefour à feux, carrefour avec priorité à droite, sens giratoire. Maîtriser les règles de priorité et la communication avec les autres usagers.",
    category: "intersection",
    difficulty: "intermediate",
    objectives: JSON.stringify([
      "Identifier et appliquer les règles de priorité",
      "Franchir un carrefour à feux en toute sécurité",
      "Gérer un carrefour avec cédez-le-passage",
      "Communiquer clairement ses intentions"
    ]),
    steps: JSON.stringify([
      "Ralentir à l'approche de toute intersection",
      "Observer la signalisation (feux, panneaux, marquage au sol)",
      "Vérifier la présence de véhicules prioritaires",
      "Mettre le clignotant pour indiquer sa direction",
      "Vérifier les angles morts et les piétons",
      "S'engager avec une vitesse adaptée et en contrôlant les côtés"
    ]),
    criteria: JSON.stringify([
      "Règles de priorité respectées",
      "Clignotants utilisés systématiquement",
      "Observation complète de l'environnement",
      "Passage à la bonne vitesse",
      "Respect des passages piétons"
    ]),
    tips: JSON.stringify([
      "L'absence de signalisation signifie priorité à droite",
      "Un feu orange fixe ne signifie pas 'accélérer' mais 's'arrêter si possible'",
      "Toujours vérifier les deux côtés, même si vous êtes prioritaire"
    ]),
    scoring: JSON.stringify({ "excellent": "90-100%", "good": "75-89%", "satisfactory": "60-74%", "insufficient": "<60%" }),
    countryCode: "FR",
    licenseCode: "B",
  },

  // ═══════════════════════════════════════════════════════════════
  // OVERTAKING — Dépassement
  // ═══════════════════════════════════════════════════════════════
  {
    title: "Manœuvre de dépassement en sécurité",
    description: "Maîtriser la procédure complète de dépassement sur route. Savoir quand dépasser, comment se placer, comment signaler et comment se rabattre en toute sécurité.",
    category: "overtaking",
    difficulty: "intermediate",
    objectives: JSON.stringify([
      "Évaluer si un dépassement est possible et légal",
      "Effectuer un dépassement en respectant toutes les étapes",
      "Se rabattre correctement après le dépassement",
      "Connaître les cas où le dépassement est interdit"
    ]),
    steps: JSON.stringify([
      "Vérifier que le dépassement est autorisé (pas de ligne continue, panneau d'interdiction)",
      "Vérifier les mirrors et l'angle mort gauche",
      "Mettre le clignotant gauche",
      "Déboîter en accélérant franchement",
      "Dépasser en gardant un écart latéral suffisant",
      "Mettre le clignotant droit une fois le véhicule dépassé visible dans le rétroviseur intérieur",
      "Se rabattre progressivement"
    ]),
    criteria: JSON.stringify([
      "Dépassement autorisé au regard de la signalisation",
      "Vérification des angles morts effectuée",
      "Clignotants utilisés avant et après le dépassement",
      "Écart latéral suffisant pendant le dépassement",
      "Rabattement après visibilité suffisante du véhicule dépassé"
    ]),
    tips: JSON.stringify([
      "Un dépassement ne doit jamais être effectué à droite (sauf exceptions spécifiques)",
      "Si un véhicule vous dépasse, ne ralentissez pas brusquement mais maintenez votre trajectoire",
      "Par temps de pluie, augmentez l'écart latéral en raison des projections d'eau"
    ]),
    scoring: JSON.stringify({ "excellent": "90-100%", "good": "75-89%", "satisfactory": "60-74%", "insufficient": "<60%" }),
    countryCode: "FR",
    licenseCode: "B",
  },

  // ═══════════════════════════════════════════════════════════════
  // EMERGENCY BRAKING — Freinage d'urgence
  // ═══════════════════════════════════════════════════════════════
  {
    title: "Freinage d'urgence et arrêt de sécurité",
    description: "Apprendre à effectuer un freinage d'urgence dans les meilleures conditions. Maîtriser l'ABS, l'évitement et les réflexes après un arrêt d'urgence.",
    category: "emergency_braking",
    difficulty: "advanced",
    objectives: JSON.stringify([
      "Effectuer un freinage d'urgence avec maintien de la trajectoire",
      "Comprendre le fonctionnement de l'ABS",
      "Savoir réagir après un freinage d'urgence",
      "Effectuer une manœuvre d'évitement si nécessaire"
    ]),
    steps: JSON.stringify([
      "Appuyer fortement et en continu sur la pédale de frein (ne pas pomper)",
      "Maintenir la direction vers l'avant (ne pas braquer)",
      "Si ABS activé, garder la pression sur le frein",
      "En cas de besoin d'évitement, braquer tout en freinant",
      "Une fois arrêté, mettre les feux de détresse",
      "Enclencher le frein à main et serrer le frein de stationnement"
    ]),
    criteria: JSON.stringify([
      "Freinage sufficiently appuyé et continu",
      "Trajectoire maintenue pendant le freinage",
      "Réaction appropriée après l'arrêt",
      "Feux de détresse activés après arrêt",
      "Aucune perte de contrôle du véhicule"
    ]),
    tips: JSON.stringify([
      "L'ABS ne raccourcit pas la distance de freinage sur sol sec, il empêche le blocage des roues",
      "Sur sol mouillé ou neigeux, la distance de freinage peut être multipliée par 3 ou plus",
      "Un freinage d'urgence doit toujours être suivi d'une mise en sécurité du véhicule"
    ]),
    scoring: JSON.stringify({ "excellent": "90-100%", "good": "75-89%", "satisfactory": "60-74%", "insufficient": "<60%" }),
    countryCode: "FR",
    licenseCode: "B",
  },

  // ═══════════════════════════════════════════════════════════════
  // ECO DRIVING — Éco-conduite
  // ═══════════════════════════════════════════════════════════════
  {
    title: "Éco-conduite et conduite économique",
    description: "Apprendre les techniques d'éco-conduite pour réduire la consommation de carburant, les émissions de CO2 et l'usure du véhicule tout en garantissant la sécurité.",
    category: "eco_driving",
    difficulty: "beginner",
    objectives: JSON.stringify([
      "Anticiper les ralentissements et les arrêts pour éviter les freinages inutiles",
      "Maintenir une vitesse régulière et adapter les rapports de boîte",
      "Réduire la consommation grâce à des habitudes de conduite adaptées",
      "Comprendre l'impact de l'éco-conduite sur l'environnement et le budget"
    ]),
    steps: JSON.stringify([
      "Démarrer doucement sans accélérations brusques",
      "Passer les rapports de vitesse à des régimes moteurs bas (2000-2500 tr/min pour un diesel)",
      "Anticiper les ralentissements en levant le pied plutôt qu'en freinant",
      "Maintenir une vitesse constante en utilisant le régulateur si disponible",
      "Couper le moteur si arrêt prolongé (plus de 30 secondes)",
      "Vérifier régulièrement la pression des pneus (sous-gonflage = surconsommation)"
    ]),
    criteria: JSON.stringify([
      "Démarrages progressifs",
      "Rapports de boîte adaptés",
      "Anticipation des situations (peu de freinages brusques)",
      "Vitesse stable et régulière",
      "Conduite souple et fluide"
    ]),
    tips: JSON.stringify([
      "L'éco-conduite peut réduire la consommation de 20 à 30%",
      "Rouler aux vitesses légales plutôt que 10 km/h au-dessus économise significativement",
      "Un véhicule bien entretenu consomme 5 à 10% de moins qu'un véhicule mal entretenu"
    ]),
    scoring: JSON.stringify({ "excellent": "90-100%", "good": "75-89%", "satisfactory": "60-74%", "insufficient": "<60%" }),
    countryCode: "FR",
    licenseCode: null,
  },
]; 
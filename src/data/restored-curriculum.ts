export type RestoredModule = { id: string; title: string; type: 'lesson' | 'interactive' | 'quiz'; content: string; duration: number };
export type RestoredCourse = { id: string; title: string; description: string; category: string; level: 'beginner' | 'intermediate' | 'advanced'; duration: number; icon: string; isPremium: boolean; modules: RestoredModule[] };

const schoolImage = 'https://anaser.sn/storage/2023/01/sensibilisation-par-les-enfants-sur-la-1024x852.jpg';
const schoolSign = 'https://commons.wikimedia.org/wiki/Special:FilePath/SADC_road_sign_TW305.svg';
const stopSign = 'https://commons.wikimedia.org/wiki/Special:FilePath/SADC_road_sign_R1.1.svg';
const trafficLight = 'https://commons.wikimedia.org/wiki/Special:FilePath/Traffic-light.svg';
const africaTraffic = 'https://commons.wikimedia.org/wiki/Special:FilePath/Traffic_light_and_roads_signs_on_the_Opebi_Road.jpg';
const bicycleSign = 'https://commons.wikimedia.org/wiki/Special:FilePath/SADC_road_sign_TIN11.561.svg';

export const restoredCurriculum: RestoredCourse[] = [
  {
    id: 'adso-mobility-foundations', title: 'Fondamentaux de la mobilité sûre',
    description: 'Comprendre la route comme un espace partagé : observer, anticiper, protéger et agir avec responsabilité.', category: 'safety', level: 'beginner', duration: 35, icon: 'ShieldCheck', isPremium: false,
    modules: [
      { id: 'rmf-1', title: 'La route est un espace partagé', type: 'lesson', duration: 10, content: `![Situation de sensibilisation routière en Afrique](${schoolImage})\n\n## La route est un espace partagé\n\nLa sécurité commence par l'observation. Conducteurs, piétons, cyclistes, motocyclistes et passagers utilisent le même espace et peuvent être vulnérables à des moments différents.\n\n### À retenir\n- Observer avant d'agir.\n- Anticiper les mouvements des autres usagers.\n- Adapter son comportement à l'environnement.\n- Protéger en priorité les usagers vulnérables.\n\n**Compétence travaillée : observation et responsabilité.**` },
      { id: 'rmf-2', title: 'Voir avant de décider', type: 'interactive', duration: 12, content: `![Panneau de danger lié aux enfants](${schoolSign})\n\n## Situation : une zone scolaire\n\nUn panneau annonce la présence d'enfants. Vous approchez d'une zone où des élèves peuvent traverser.\n\nA. Ralentir, observer les abords et se préparer à s'arrêter.\nB. Accélérer pour passer avant les élèves.\nC. Regarder uniquement devant le véhicule.\n\n**Bonne décision : A.**\n\nLa bonne décision réduit l'exposition au danger et laisse davantage de temps pour réagir.\n\n**Compétence travaillée : anticipation du danger.**` },
      { id: 'rmf-3', title: 'Quiz : réflexes essentiels', type: 'quiz', duration: 13, content: `## Vérification\n\nUn bon réflexe de mobilité sûre consiste d'abord à :\n\nA. Observer et anticiper.\nB. Accélérer pour réduire le temps sur la route.\nC. Se fier uniquement à l'expérience.\n\n**Bonne décision : A.**\n\nLa compétence est reconnue pédagogiquement lorsque l'apprenant démontre de façon répétée une observation et une décision sûres.` }
    ]
  },
  {
    id: 'adso-signals', title: 'Lire et comprendre la signalisation',
    description: 'Apprendre à reconnaître les familles de panneaux et à transformer un signal visuel en décision sûre.', category: 'theory', level: 'beginner', duration: 40, icon: 'Signpost', isPremium: false,
    modules: [
      { id: 'ras-1', title: 'Un panneau est une information à traiter', type: 'lesson', duration: 10, content: `![Signalisation routière](${schoolSign})\n\n## Lire un panneau\n\nLa signalisation donne une information destinée à orienter ou protéger les usagers. L'apprenant doit apprendre à **voir, identifier, comprendre puis agir**.\n\n### Méthode ADSO\n1. Voir la forme et les couleurs.\n2. Identifier le symbole.\n3. Comprendre le message.\n4. Adapter son comportement.\n\nLes règles précises et la signification juridique d'un panneau doivent être vérifiées dans le Country Pack du pays concerné.` },
      { id: 'ras-2', title: 'STOP : observer avant de franchir', type: 'interactive', duration: 12, content: `![Panneau STOP](${stopSign})\n\n## Situation : STOP\n\nVous arrivez devant un STOP.\n\nA. Marquer l'arrêt et vérifier avant de poursuivre.\nB. Ralentir légèrement puis passer si la route semble libre.\nC. Passer rapidement pour ne pas gêner.\n\n**Bonne décision : A.**\n\nL'objectif pédagogique est de transformer la lecture du panneau en comportement prudent.` },
      { id: 'ras-3', title: 'Quiz : signalisation et décision', type: 'quiz', duration: 18, content: `## Vérification\n\nPourquoi faut-il apprendre les panneaux par la vue ?\n\nA. Parce que la conduite repose sur des informations visuelles à traiter rapidement.\nB. Parce que les panneaux sont décoratifs.\nC. Parce qu'un panneau remplace l'observation.\n\n**Bonne décision : A.**` }
    ]
  },
  {
    id: 'adso-lights-intersections', title: 'Feux et intersections',
    description: 'Développer une méthode d'approche sûre des carrefours et des feux sans imposer de règle nationale non vérifiée.', category: 'theory', level: 'beginner', duration: 45, icon: 'TrafficCone', isPremium: false,
    modules: [
      { id: 'rli-1', title: 'Comprendre les feux', type: 'lesson', duration: 12, content: `![Feu de circulation](${trafficLight})\n\n## Les feux organisent les mouvements\n\nUn feu de circulation donne une information visuelle qui doit être observée avant l'engagement.\n\n### Réflexe ADSO\n- Observer le feu.\n- Observer les autres usagers.\n- Vérifier l'espace disponible.\n- Ne pas s'engager si la situation devient dangereuse.\n\nLes séquences et règles juridiquement applicables sont à confirmer selon le pays.` },
      { id: 'rli-2', title: 'Approcher une intersection', type: 'interactive', duration: 15, content: `![Route et feux en contexte africain](${africaTraffic})\n\n## Situation : intersection chargée\n\nA. Réduire l'allure et analyser plusieurs sources d'information.\nB. Regarder uniquement le véhicule devant.\nC. Accélérer pour traverser avant les autres.\n\n**Bonne décision : A.**\n\nUne intersection exige une observation active et une marge de sécurité.` },
      { id: 'rli-3', title: 'Quiz : carrefour', type: 'quiz', duration: 18, content: `## Vérification\n\nAvant de s'engager dans une intersection, l'apprenant doit :\n\nA. Observer la signalisation et l'environnement.\nB. Supposer que les autres vont s'arrêter.\nC. Se concentrer uniquement sur son itinéraire.\n\n**Bonne décision : A.**` }
    ]
  },
  {
    id: 'adso-vulnerable-users', title: 'Protéger les usagers vulnérables',
    description: 'Piétons, enfants, cyclistes et motocyclistes : reconnaître leur vulnérabilité et adapter son comportement.', category: 'safety', level: 'beginner', duration: 45, icon: 'Users', isPremium: false,
    modules: [
      { id: 'rvu-1', title: 'Enfants et environnement scolaire', type: 'lesson', duration: 12, content: `![Enfants et sensibilisation routière](${schoolImage})\n\n## Autour des écoles\n\nUn enfant peut changer de trajectoire rapidement. La prévention repose sur une réduction de l'allure, une observation des abords et une anticipation permanente.\n\n**Compétence : protection des usagers vulnérables.**` },
      { id: 'rvu-2', title: 'Cyclistes et visibilité', type: 'lesson', duration: 12, content: `![Signalisation liée aux cyclistes](${bicycleSign})\n\n## Cyclistes\n\nLe cycliste doit être identifié comme un usager vulnérable. Le conducteur doit maintenir une marge de sécurité et surveiller les changements de trajectoire.\n\nLe port du casque est un comportement de protection important pour le cycliste ; ADSO l'enseigne comme une mesure de prévention, sans transformer cette leçon en règle juridique nationale non vérifiée.` },
      { id: 'rvu-3', title: 'Situation : taxi-moto et écolier', type: 'interactive', duration: 21, content: `![Scène de sensibilisation scolaire](${schoolImage})\n\n## Situation ADSO\n\nUn écolier à vélo porte un casque. Un conducteur de taxi-moto approche sans casque à proximité d'une zone scolaire.\n\nA. Ralentir fortement, observer les élèves et laisser une marge de sécurité.\nB. Accélérer pour passer devant le groupe.\nC. Utiliser le klaxon comme seule mesure de sécurité.\n\n**Bonne décision : A.**\n\nLa scène enseigne simultanément l'anticipation, la protection des enfants et l'importance des équipements de protection. Aucun blessé n'est représenté.` }
    ]
  },
  {
    id: 'adso-speed-distance', title: 'Allure, distance et marge de sécurité',
    description: 'Comprendre pourquoi l'allure, le temps de réaction et la distance disponible déterminent la capacité à éviter un danger.', category: 'safety', level: 'intermediate', duration: 40, icon: 'Gauge', isPremium: false,
    modules: [
      { id: 'rsd-1', title: 'Le temps de réaction', type: 'lesson', duration: 12, content: `![Route et signalisation](${africaTraffic})\n\n## Plus l'allure augmente, plus la marge diminue\n\nLa vitesse influence la distance parcourue pendant le temps de réaction et la distance nécessaire pour s'arrêter.\n\nADSO enseigne une règle simple : **si la situation est incertaine, réduire l'allure augmente la marge de décision.**\n\nLes valeurs numériques réglementaires doivent être fournies par le Country Pack vérifié.` },
      { id: 'rsd-2', title: 'Garder une marge', type: 'interactive', duration: 12, content: `## Situation\n\nUn piéton semble pouvoir entrer sur la chaussée.\n\nA. Réduire l'allure et augmenter la marge disponible.\nB. Garder exactement la même allure sans analyser.\nC. Accélérer.\n\n**Bonne décision : A.**\n\n**Compétence : gestion de la marge de sécurité.**` },
      { id: 'rsd-3', title: 'Quiz : distance de sécurité', type: 'quiz', duration: 16, content: `## Vérification\n\nLa meilleure marge de sécurité est celle qui permet de :\n\nA. conserver du temps pour observer, décider et agir.\nB. rouler le plus vite possible.\nC. dépendre uniquement des autres usagers.\n\n**Bonne décision : A.**` }
    ]
  },
  {
    id: 'adso-professional-mobility', title: 'Mobilité sûre pour apprentis et professionnels',
    description: 'Prévenir les risques liés aux trajets et aux déplacements professionnels, quel que soit le métier.', category: 'safety', level: 'intermediate', duration: 40, icon: 'BriefcaseBusiness', isPremium: false,
    modules: [
      { id: 'rmp-1', title: 'L'apprenti n'est pas seulement un conducteur', type: 'lesson', duration: 12, content: `![Mobilité scolaire et citoyenne](${schoolImage})\n\n## Mobilité-first\n\nUn apprenti peut être piéton, passager, cycliste, motocycliste ou conducteur selon son activité.\n\nADSO commence donc par la personne, puis observe son mode de déplacement et son exposition au risque.\n\n**Personne → mobilité → exposition → compétence.**` },
      { id: 'rmp-2', title: 'Préparer un trajet professionnel', type: 'interactive', duration: 12, content: `## Situation\n\nAvant un déplacement professionnel, que faut-il vérifier ?\n\nA. Le mode de déplacement, l'environnement, l'équipement et les conditions du trajet.\nB. Uniquement l'heure d'arrivée.\nC. Rien si le trajet est déjà connu.\n\n**Bonne décision : A.**` },
      { id: 'rmp-3', title: 'Quiz : responsabilité professionnelle', type: 'quiz', duration: 16, content: `## Vérification\n\nLa compétence professionnelle de mobilité sûre consiste notamment à :\n\nA. anticiper les risques du déplacement avant et pendant le trajet.\nB. supposer que le risque est nul.\nC. considérer que la sécurité concerne uniquement les conducteurs.\n\n**Bonne décision : A.**` }
    ]
  }
];

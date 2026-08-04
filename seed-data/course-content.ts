export interface CourseModule {
  id: string;
  title: string;
  type: 'lesson' | 'video' | 'interactive' | 'quiz';
  content: string;
  duration: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  icon: string;
  isPremium: boolean;
  modules: CourseModule[];
}

export const courseContent: Course[] = [
  // ═══════════════════════════════════════════════════════════════
  // THEORY COURSES (8)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'intro-code',
    title: 'Introduction au Code de la Route',
    description: 'Découvrez les bases essentielles du code de la route français : règles fondamentales, signalisation et priorités.',
    category: 'theory',
    level: 'beginner',
    duration: 45,
    icon: 'BookOpen',
    isPremium: false,
    modules: [
      { id: 'ic-1', title: 'Le Code de la Route : Pourquoi ?', type: 'lesson', content: '## Pourquoi connaître le Code de la Route ?\n\nLe Code de la route est l\'ensemble des règles qui régissent la circulation sur les voies publiques. Il a été créé pour **assurer la sécurité de tous** : conducteurs, passagers, piétons et cyclistes.\n\n### Les enjeux\n- **Sécurité** : réduire les accidents de la route\n- **Ordre** : organiser la circulation de manière fluide\n- **Responsabilité** : chaque usager a des droits et des devoirs\n- **Respect** : partager l\'espace public de manière équitable\n\nEn France, près de **3 000 personnes** meurent chaque année sur les routes. Connaître le code de la route, c\'est contribuer à réduire ce bilan.', duration: 8 },
      { id: 'ic-2', title: 'Les Principes Fondamentaux', type: 'lesson', content: '## Les 3 Principes Fondamentaux\n\n### 1. La Prudence\nLe conducteur doit toujours se comporter avec prudence, quelle que soit la situation.\n\n### 2. Le Respect des Autres\nChaque usager de la route doit respecter les autres : piétons, cyclistes, automobilistes, motards...\n\n### 3. La Maîtrise du Véhicule\nUn conducteur doit toujours avoir la maîtrise de son véhicule et adapter sa vitesse aux conditions.\n\n> **À retenir** : Ces 3 principes sont la base de toute la réglementation routière.', duration: 10 },
      { id: 'ic-3', title: 'Quiz : Principes de Base', type: 'quiz', content: 'Testez vos connaissances sur les principes fondamentaux du Code de la route.', duration: 12 },
      { id: 'ic-4', title: 'Les Sanctions', type: 'lesson', content: '## Les Sanctions du Code de la Route\n\n### Amendes forfaitaires\n- Contravention 1re classe : 11 € (stationnement)\n- Contravention 2e classe : 35 €\n- Contravention 3e classe : 68 €\n- Contravention 4e classe : 135 € (excès de vitesse, téléphone)\n- Contravention 5e classe : 375 € à 750 € (délits graves)\n\n### Retrait de Points\nLe permis est doté de **12 points**. Certaines infractions entraînent un retrait de 1 à 6 points.\n\n### Suspension et Annulation\nEn cas d\'infraction grave, le permis peut être suspendu ou annulé par le préfet ou le tribunal.', duration: 10 },
      { id: 'ic-5', title: 'Exercice : Reconnaître les Panneaux', type: 'interactive', content: 'Identifiez les différents types de panneaux et leur signification dans cet exercice interactif.', duration: 5 },
    ],
  },
  {
    id: 'signalisation',
    title: 'La Signalisation Routière',
    description: 'Apprenez à identifier et comprendre tous les types de panneaux : danger, interdiction, obligation et information.',
    category: 'theory',
    level: 'beginner',
    duration: 50,
    icon: 'Signpost',
    isPremium: false,
    modules: [
      { id: 'sig-1', title: 'Les Panneaux d\'Avertissement', type: 'lesson', content: '## Les Panneaux d\'Avertissement (Triangulaires)\n\nLes panneaux d\'avertissement sont de forme **triangulaire** avec un fond **rouge** et une bordure blanche. Ils signalent un danger ou un risque.\n\n### Principaux panneaux :\n- **Virage dangereux** : zigzag dans le triangle\n- **Descente dangereuse** : pourcentage de pente\n- **Passage à niveau** : train dans le triangle\n- **Pierreux** : cailloux sur la route\n- **Animaux** : silhouettes d\'animaux\n\n> Toujours ralentir à l\'approche d\'un panneau d\'avertissement !', duration: 12 },
      { id: 'sig-2', title: 'Les Panneaux d\'Interdiction', type: 'lesson', content: '## Les Panneaux d\'Interdiction (Ronds)\n\nLes panneaux d\'interdiction sont de forme **ronde** avec un fond **rouge** et une barre ou un symbole.\n\n### Principaux panneaux :\n- **Sens interdit** : rond barré\n- **Interdiction de dépasser** : deux voitures\n- **Limite de vitesse** : chiffre dans le cercle\n- **Interdiction aux piétons** : piéton barré\n- **Interdiction de klaxonner** : trompe barrée\n\nLe panneau de **fin d\'interdiction** est rond gris avec une barre noire rayée.', duration: 12 },
      { id: 'sig-3', title: 'Les Panneaux d\'Obligation', type: 'lesson', content: '## Les Panneaux d\'Obligation (Carrés Bleus)\n\nLes panneaux d\'obligation sont de forme **carrée** bleue avec un **cercle blanc**.\n\n### Principaux panneaux :\n- **Obligation de tourner** : flèche dans le cercle\n- **Sens obligatoire** : flèche directionnelle\n- **Piste cyclable** : vélo dans le cercle\n- **Chemin pour piétons** : piéton dans le cercle\n\n### Les Panneaux d\'Indication\nLes panneaux rectangulaires bleus donnent des informations :\n- Parkings, hôpitaux, écoles\n- Sens interdit, sens unique\n- Directions et itinéraires', duration: 12 },
      { id: 'sig-4', title: 'Exercice : Identifier les Panneaux', type: 'interactive', content: 'Pratiquez l\'identification des panneaux dans des situations réelles de conduite.', duration: 14 },
    ],
  },
  {
    id: 'priorites',
    title: 'Les Règles de Priorité',
    description: 'Maîtrisez toutes les règles de priorité : priorité à droite, routes prioritaires, cédez le passage et cas particuliers.',
    category: 'theory',
    level: 'beginner',
    duration: 40,
    icon: 'ArrowRight',
    isPremium: false,
    modules: [
      { id: 'pr-1', title: 'La Priorité à Droite', type: 'lesson', content: '## La Règle de la Priorité à Droite\n\nEn l\'absence de signalisation, **tout véhicule approchant par la droite est prioritaire**.\n\n### Exceptions :\n- Sur les routes à chaussées séparées\n- Dans les ronds-points\n- Lorsque vous circulez sur une route prioritaire\n- Lorsque la signalisation indique autre chose\n\n> **Attention** : La priorité à droite s\'applique QUE si aucune signalisation ne dit le contraire.', duration: 10 },
      { id: 'pr-2', title: 'Routes Prioritaires et Dépriorité', type: 'lesson', content: '## Routes Prioritaires\n\n### Panneau de Route Prioritaire (Losange Jaune)\n\nLes véhicules circulant sur cette route sont prioritaires.\n\n### Panneau « Cédez le Passage » (Triangle Pointe en Bas)\n\nVous devez laisser passer les véhicules circulant sur la route prioritaire.\n\n### Panneau « Vous N\'êtes Pas Prioritaire » (Triangle Barré)\n\nIndique que vous quittez une route prioritaire. La règle de la priorité à droite ne s\'applique plus.', duration: 12 },
      { id: 'pr-3', title: 'Les Cas Particuliers', type: 'lesson', content: '## Cas Particuliers de Priorité\n\n### Véhicules d\'Urgence\n- Police, pompiers, SAMU avec sirènes\n- **Toujours prioritaires**\n\n### Bus Scolaire\n- Lorsqu\'ils s\'arrêtent avec leurs feux orange\n- Le dépassement est interdit\n\n### Cyclistes et Piétons\n- Protégés par les passages pour piétons\n- Cyclistes sur pistes cyclables marquées', duration: 10 },
      { id: 'pr-4', title: 'Quiz : Situations de Priorité', type: 'quiz', content: 'Testez votre compréhension des règles de priorité dans différentes situations.', duration: 8 },
    ],
  },
  {
    id: 'vitesse',
    title: 'Vitesses et Distances',
    description: 'Comprenez les limites de vitesse, les distances d\'arrêt et de sécurité dans toutes les conditions.',
    category: 'theory',
    level: 'intermediate',
    duration: 55,
    icon: 'Gauge',
    isPremium: false,
    modules: [
      { id: 'vit-1', title: 'Les Limites de Vitesse', type: 'lesson', content: '## Limites de Vitesse en France\n\n| Route | Voiture | Jeune Conducteur |\n|------|---------|------------------|\n| Agglomération | 50 km/h | 50 km/h |\n| Route (double sens) | 80 km/h | 80 km/h |\n| Route (séparateur) | 110 km/h | 100 km/h |\n| Autoroute | 130 km/h | 110 km/h |\n\n### Conditions Particulières\n- **Pluie/Neige** : -20 km/h\n- **Visibilité < 50 m** : 50 km/h maximum\n- **Brouillard épais** : adaptée par prudence', duration: 15 },
      { id: 'vit-2', title: 'Distance d\'Arrêt', type: 'lesson', content: '## La Distance d\'Arrêt\n\nLa distance d\'arrêt = **Temps de réaction** + **Distance de freinage**\n\n### Temps de réaction moyen : **1 seconde**\n\n### Exemples sur sol sec :\n| Vitesse | Distance d\'arrêt |\n|---------|-------------------|\n| 30 km/h | ~13 mètres |\n| 50 km/h | ~25 mètres |\n| 90 km/h | ~70 mètres |\n| 130 km/h | ~130 mètres |\n\n### Sur sol mouillé : multipliez par 2 !', duration: 15 },
      { id: 'vit-3', title: 'Distance de Sécurité', type: 'lesson', content: '## La Distance de Sécurité\n\n### Règle des 2 secondes\n\nSur route, laissez au moins **2 secondes** entre vous et le véhicule qui vous précède.\n\nSur autoroute, la règle des 2 secondes correspond à :\n- **73 mètres à 130 km/h**\n- **50 mètres à 90 km/h**\n\n### Comment vérifier ?\nPrenez un repère fixe (pont, panneau). Quand le véhicule devant passe ce repère, comptez « 1 Mississippi, 2 Mississippi ». Vous ne devez pas atteindre le repère avant la fin.', duration: 15 },
      { id: 'vit-4', title: 'Exercice : Calcul de Distances', type: 'interactive', content: 'Calculez les distances d\'arrêt et de sécurité dans différentes conditions de conduite.', duration: 10 },
    ],
  },
  {
    id: 'intersections',
    title: 'Intersections et Carrefours',
    description: 'Apprenez à naviguer les différents types de carrefours : feux, ronds-points, priorité à droite.',
    category: 'theory',
    level: 'intermediate',
    duration: 60,
    icon: 'GitBranch',
    isPremium: true,
    modules: [
      { id: 'int-1', title: 'Les Types de Carrefours', type: 'lesson', content: '## Les Différents Types de Carrefours\n\n### Carrefour à Feux\nRespectez scrupuleusement les feux tricolores.\n\n### Carrefour avec Panneau STOP\nArrêt obligatoire avant la ligne.\n\n### Carrefour avec Cédez le Passage\nRalentissez et cédez si nécessaire.\n\n### Rond-point\nCédez le passage aux véhicules dans l\'anneau.\n\n### Carrefour sans Signalisation\nLa priorité à droite s\'applique.', duration: 12 },
      { id: 'int-2', title: 'Techniques de Franchissement', type: 'lesson', content: '## Comment Franchir un Carrefour\n\n### 1. L\'approche\n- Ralentissez suffisamment en amont\n- Observez la signalisation\n- Vérifiez vos rétroviseurs\n\n### 2. L\'engagement\n- Vérifiez à gauche, puis à droite, puis à nouveau à gauche\n- Engagez-vous à vitesse modérée\n- Ne vous arrêtez pas au milieu du carrefour\n\n### 3. La sortie\n- Accélérez progressivement\n- Vérifiez que la voie est libre', duration: 12 },
      { id: 'int-3', title: 'Les Ronds-Points', type: 'lesson', content: '## Règles dans les Giratoires\n\n### Principe de base\n- **Cédez le passage** aux véhicules déjà dans le giratoire\n- Signalisation à gauche pour sortir\n- Circulez dans le sens des aiguilles d\'une montre\n\n### Astuces de sécurité\n- Ne vous engagez pas si l\'anneau est saturé\n- Positionnez-vous sur la bonne voie avant d\'entrer\n- Utilisez vos clignotants pour signaler votre sortie', duration: 12 },
      { id: 'int-4', title: 'Cas Pratiques : Carrefours Complexes', type: 'interactive', content: 'Analysez des situations complexes : carrefours multiples, voies dédiées, voies de bus.', duration: 14 },
      { id: 'int-5', title: 'Quiz : Intersections', type: 'quiz', content: 'Évaluez votre compréhension des règles de franchissement des intersections.', duration: 10 },
    ],
  },
  {
    id: 'stationnement',
    title: 'Stationnement et Arrêt',
    description: 'Les règles complètes du stationnement : emplacements autorisés, interdictions et distances minimales.',
    category: 'theory',
    level: 'beginner',
    duration: 30,
    icon: 'ParkingCircle',
    isPremium: false,
    modules: [
      { id: 'st-1', title: 'Règles Générales', type: 'lesson', content: '## Le Stationnement\n\n### Définition\nLe stationnement est l\'immobilisation du véhicule **sans conducteur**.\n\n### Où est-il interdit ?\n- Sur les trottoirs\n- Sur les passages piétons\n- Sur les pistes cyclables\n- En double file\n- Devant les entrées de garage\n- Aux emplacements réservés (handicapés, livraison)\n\n### Distances minimales\n- **5 mètres** d\'un passage piéton\n- **5 mètres** d\'un carrefour\n- **15 mètres** d\'un panneau STOP', duration: 15 },
      { id: 'st-2', title: 'Le Stationnement Payant', type: 'lesson', content: '## Zones de Stationnement\n\n### Zone Bleue\nStationnement limité avec disque.\n\n### Zone Verte\nStationnement payant en horodateur.\n\n### Zone de Stationnement Réglementé\nRègles spécifiques affichées par la signalisation.', duration: 15 },
      { id: 'st-3', title: 'Quiz : Stationnement', type: 'quiz', content: 'Testez vos connaissances sur les règles de stationnement.', duration: 10 },
    ],
  },
  {
    id: 'documents',
    title: 'Documents et Réglementation',
    description: 'Tous les documents obligatoires pour conduire et les réglementations essentielles à connaître.',
    category: 'theory',
    level: 'beginner',
    duration: 35,
    icon: 'FileText',
    isPremium: false,
    modules: [
      { id: 'doc-1', title: 'Documents du Conducteur', type: 'lesson', content: '## Documents Obligatoires\n\n### Toujours dans le véhicule :\n1. **Permis de conduire**\n2. **Carte grise** (certificat d\'immatriculation)\n3. **Attestation d\'assurance**\n4. **Contrôle technique** (si applicable)\n\n### Papiers du véhicule :\n1. Carte grise\n2. Attestation d\'assurance\n3. Contrôle technique (plus de 4 ans)\n4. Constats amiables', duration: 10 },
      { id: 'doc-2', title: 'Le Système de Points', type: 'lesson', content: '## Le Permis à Points\n\n### Capital initial : 12 points\n\n### Retrait de points :\n- Excès de vitesse (< 20 km/h) : 1 point\n- Excès de vitesse (≥ 20 km/h) : 2-3 points\n- Téléphone au volant : 3 points\n- Alcoolémie : 6 points\n- Grand excès de vitesse : 6 points\n\n### Récupération :\n- **Automatique** : 2 ans sans infraction\n- **Stage de récupération** : 4 points maximum (1 fois/2 ans)\n- **Permis probatoire** : récupération plus longue', duration: 10 },
      { id: 'doc-3', title: 'Quiz : Documents', type: 'quiz', content: 'Questions sur les documents et le système de points du permis de conduire.', duration: 8 },
      { id: 'doc-4', title: 'L\'Assurance Auto', type: 'video', content: 'Comprendre les différents types d\'assurance auto et leurs couvertures.', duration: 7 },
    ],
  },
  {
    id: 'mecanique-bases',
    title: 'Bases de la Mécanique',
    description: 'Les notions essentielles de mécanique automobile pour une conduite en toute sécurité.',
    category: 'theory',
    level: 'intermediate',
    duration: 45,
    icon: 'Wrench',
    isPremium: true,
    modules: [
      { id: 'mec-1', title: 'Les Fluides du Véhicule', type: 'lesson', content: '## Les Fluides Essentiels\n\n### Huile moteur\n- Vérifiez le niveau régulièrement\n- Changez selon les préconisations\n- Panneau rouge d\'huile = arrêt immédiat\n\n### Liquide de refroidissement\n- Maintient le moteur à bonne température\n- Panneau rouge de température = arrêt\n\n### Liquide de frein\n- Essentiel pour le freinage\n- Vérifiez le niveau et l\'état\n\n### Liquide lave-glace\n- Pour la visibilité\n- Utilisez un produit adapté à la saison', duration: 12 },
      { id: 'mec-2', title: 'Les Pneus', type: 'lesson', content: '## Les Pneus\n\n### Pression\n- Vérifiez **au moins 1 fois par mois**\n- Pression recommandée dans la portière ou le manuel\n- Sous-gonflé = surconsommation + danger\n- Sur-gonflé = usure au centre\n\n### Profondeur\n- Minimum légal : **1,6 mm**\n- Idéalement, changez à 3 mm\n- Les témoins d\'usure dans les sillons\n\n### Équilibrage et géométrie\n- Équilibrez à chaque changement de pneu\n- Faites la géométrie si le véhicule tire d\'un côté', duration: 12 },
      { id: 'mec-3', title: 'Le Contrôle Technique', type: 'lesson', content: '## Le Contrôle Technique\n\n### Fréquence\n- Tous les **4 ans** pour un véhicule neuf\n- Puis tous les **2 ans**\n\n### Points vérifiés\n- Freinage\n- Éclairage et signalisation\n- Pollution\n- Structure\n- Équipements de sécurité\n\n### Contre-visite\nSi des défauts sont détectés, une contre-visite est obligatoire dans les **2 mois**.', duration: 11 },
      { id: 'mec-4', title: 'Quiz : Mécanique', type: 'quiz', content: 'Testez vos connaissances sur l\'entretien de base de votre véhicule.', duration: 10 },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  // SAFETY COURSES (5)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'securite-active',
    title: 'Sécurité Active',
    description: 'Maîtrisez les équipements de sécurité active : ABS, ESP, airbags et systèmes d\'aide à la conduite.',
    category: 'safety',
    level: 'intermediate',
    duration: 50,
    icon: 'Shield',
    isPremium: true,
    modules: [
      { id: 'sa-1', title: 'Le système ABS', type: 'lesson', content: '## ABS (Antiblockier System)\n\n### Fonctionnement\nL\'ABS empêche le blocage des roues lors d\'un freinage d\'urgence, permettant au conducteur de continuer à diriger.\n\n### Utilisation\n- **Appuyez à fond** sur la pédale de frein\n- Ne relâchez JAMAIS\n- Le pédalier vibre = l\'ABS travaille\n- Conservez le contrôle directionnel\n\n> L\'ABS ne réduit PAS la distance de freinage sur sol mouillé !', duration: 12 },
      { id: 'sa-2', title: 'L\'ESP', type: 'lesson', content: '## ESP (Electronic Stability Program)\n\n### Fonctionnement\nL\'ESP détecte le sous-virage et le survirage et corrige automatiquement la trajectoire en freinant sélectivement certaines roues.\n\n### Quand ça fonctionne ?\n- Le voyant ESP clignote\n- Le système corrige automatiquement\n- Le conducteur peut ne pas remarquer la correction\n\n### Quand le voyant reste allumé\n- Dysfonctionnement du système\n- Consultez un garagiste', duration: 12 },
      { id: 'sa-3', title: 'Les Airbags', type: 'lesson', content: '## Les Airbags\n\n### Types\n- **Airbag frontal** (volant et tableau de bord)\n- **Airbags latéraux** (portières)\n- **Airbags rideaux** (toit)\n\n### Précautions\n- Ne pas placer d\'enfant face aux airbags\n- Maintenir une distance de 25 cm minimum du volant\n- Les airbags ne remplacent PAS la ceinture', duration: 12 },
      { id: 'sa-4', title: 'Quiz : Systèmes de Sécurité', type: 'quiz', content: 'Évaluez votre compréhension des systèmes de sécurité active.', duration: 14 },
    ],
  },
  {
    id: 'securite-pasive',
    title: 'Sécurité Passive et Équipements',
    description: 'Les équipements de sécurité passifs : ceintures, gilets, triangle et extincteur.',
    category: 'safety',
    level: 'beginner',
    duration: 30,
    icon: 'ShieldCheck',
    isPremium: false,
    modules: [
      { id: 'sp-1', title: 'Les Équipements Obligatoires', type: 'lesson', content: '## Équipements Obligatoires\n\n### Ceinture de sécurité\n- Obligatoire pour TOUS les occupants\n- À l\'avant ET à l\'arrière\n- En ville ET sur route\n\n### Gilet de haute visibilité\n- Obligatoire dès la sortie du véhicule en cas d\'arrêt d\'urgence\n- De jour comme de nuit\n\n### Triangle de présignalisation\n- Obligatoire à partir de 4 mètres du véhicule\n- Obligatoire si vous n\'avez pas de feux de détresse\n\n### Extincteur\n- Non obligatoire pour les voitures particulières\n- Recommandé', duration: 15 },
      { id: 'sp-2', title: 'Comment Utiliser le Triangle', type: 'video', content: 'Démonstration correcte de la pose du triangle de présignalisation en toute sécurité.', duration: 8 },
      { id: 'sp-3', title: 'Quiz : Équipements', type: 'quiz', content: 'Questions sur les équipements de sécurité obligatoires.', duration: 7 },
    ],
  },
  {
    id: 'first-aid',
    title: 'Premiers Secours en Conduite',
    description: 'Les gestes de premiers secours essentiels en cas d\'accident de la route.',
    category: 'first-aid',
    level: 'beginner',
    duration: 55,
    icon: 'Heart',
    isPremium: true,
    modules: [
      { id: 'fa-1', title: 'La Sécurité : Le Premier Réflexe', type: 'lesson', content: '## PROTÉGER — ALERTER — SECOURIR\n\n### 1. PROTÉGER\n- Allumez les **feux de détresse**\n- Enfilez votre **gilet haute visibilité**\n- Placez le **triangle** à 30 m en ville, 100 m hors agglomération\n- Éloignez les témoins\n\n### 2. ALERTER\n- **15** : SAMU (urgence médicale)\n- **17** : Police / Gendarmerie\n- **18** : Pompiers\n- **112** : Numéro d\'urgence européen\n\n### 3. SECOURIR\n- Ne déplacez JAMAIS un blessé\n- Couvrez-le pour le réchauffer\n- Parlez-lui, rassurez-le', duration: 12 },
      { id: 'fa-2', title: 'L\'Arrêt Cardiaque', type: 'lesson', content: '## Reconnaître et Agir\n\n### Signes d\'un arrêt cardiaque\n- La personne ne répond pas\n- Ne respire pas normalement\n\n### Que faire ?\n1. **Appeler les secours** (15 ou 112)\n2. **Masse cardiaque** : 30 compressions thoraciques\n3. **Insufflations** : 2 bouche-à-bouche\n4. **Répéter** jusqu\'à l\'arrivée des secours\n\n> Toute minute compte. La masse cardiaque peut doubler les chances de survie.', duration: 12 },
      { id: 'fa-3', title: 'Les Hémorragies', type: 'lesson', content: '## Arrêter une Hémorragie\n\n### Hémorragie externe\n1. **Appuyez** directement sur la plaie\n2. Si possible, **allongez** la personne\n3. Maintenez la **pression**\n4. **Alertez** les secours\n\n### Ne jamais :\n- Enlever un corps étranger\n- Mettre de la poudre directement\n- Utiliser un garrot (sauf formation spécifique)', duration: 10 },
      { id: 'fa-4', title: 'Le Constable Amiable', type: 'lesson', content: '## Remplir le Constat Amiable\n\n### Étapes :\n1. Remplissez le recto de votre côté\n2. Échangez avec l\'autre conducteur\n3. Laissez l\'autre remplir son verso\n4. Signez les deux exemplaires\n5. Gardez votre exemplaire\n\n### Points clés :\n- Soyez précis sur le croquis\n- Notez les témoins\n- Ne signez JAMAIS sous la contrainte\n- Ne reconnaissez JAMAIS de faute si vous n\'êtes pas d\'accord', duration: 12 },
      { id: 'fa-5', title: 'Quiz : Premiers Secours', type: 'quiz', content: 'Testez vos connaissances sur les gestes de premiers secours en situation d\'urgence.', duration: 9 },
    ],
  },
  {
    id: 'eco-conduite',
    title: 'Éco-conduite',
    description: 'Techniques d\'éco-conduite pour réduire la consommation de carburant et les émissions.',
    category: 'eco-driving',
    level: 'intermediate',
    duration: 35,
    icon: 'Leaf',
    isPremium: true,
    modules: [
      { id: 'eco-1', title: 'Les Principes de l\'Éco-conduite', type: 'lesson', content: '## Éco-conduite : Les 5 Règles\n\n1. **Anticiper** : regarder loin, relâcher l\'accélérateur\n2. **Accélérer doucement** : éviter les coups de pied\n3. **Maintenir une vitesse régulière** : utiliser le régulateur\n4. **Freiner progressivement** : décélération en roue libre\n5. **Couper le moteur** aux arrêts prolongés\n\n> L\'éco-conduite peut réduire la consommation de **10 à 25%** !', duration: 12 },
      { id: 'eco-2', title: 'Le Régulateur et le Limiteur', type: 'lesson', content: '## Régulateur et Limiteur de Vitesse\n\n### Régulateur de vitesse\n- Maintient une vitesse constante\n- Réduit la consommation sur route et autoroute\n- Utile hors des zones à trafic dense\n\n### Limiteur de vitesse\n- Empêche de dépasser une vitesse choisie\n- Idéal en agglomération (régler sur 50 km/h)\n- Sécurité : pas de risque d\'excès de vitesse', duration: 12 },
      { id: 'eco-3', title: 'Quiz : Éco-conduite', type: 'quiz', content: 'Questions sur les techniques d\'économie de carburant et d\'éco-conduite.', duration: 11 },
    ],
  },
  {
    id: 'conditions-difficiles',
    title: 'Conduite en Conditions Difficiles',
    description: 'Techniques de conduite adaptées : pluie, neige, brouillard, nuit et forte chaleur.',
    category: 'safety',
    level: 'advanced',
    duration: 65,
    icon: 'CloudRain',
    isPremium: true,
    modules: [
      { id: 'cd-1', title: 'La Pluie et le Verglas', type: 'lesson', content: '## Conduire sous la Pluie\n\n- **Allumez les feux de croisement**\n- Réduisez votre vitesse de **20 km/h**\n- Doublez vos distances de sécurité\n- Évitez les flaques et les freinages brusques\n- Sur autoroute : max **110 km/h**\n\n### Le Verglas\n- Redoutez les zones ombragées et les ponts\n- Réduisez considérablement la vitesse\n- Pas de freinage brusque ni de braquage sec', duration: 15 },
      { id: 'cd-2', title: 'La Neige', type: 'lesson', content: '## Conduire sur la Neige\n\n- **Pneus hiver ou chaînes** obligatoires en zone montagneuse\n- Vitesse limitée à **50 km/h** max\n- Freinages très progressifs\n- Distance de sécurité multipliée par 3\n- Démarrage en 2e vitesse pour limiter le patinage', duration: 12 },
      { id: 'cd-3', title: 'Le Brouillard', type: 'lesson', content: '## Conduite dans le Brouillard\n\n### Feux à utiliser\n- **Feux de croisement** en brouillard léger\n- **Feux de brouillard** avant en brouillard dense\n- **Feux de brouillard** arrière si visibilité < 50 m\n\n### Vitesse\n- Adaptée à la visibilité\n- Max 50 km/h si visibilité < 50 m\n- Ne jamais s\'arrêter sur la chaussée', duration: 12 },
      { id: 'cd-4', title: 'La Conduite Nocturne', type: 'lesson', content: '## Conduire de Nuit\n\n- **Feux de croisement** en présence d\'autres véhicules\n- **Feux de route** sur route non éclairée (seul)\n- Réduisez votre vitesse\n- Vérifiez la propreté des feux\n- Repérez les reflets des panneaux\n- Attention aux piétons et animaux', duration: 12 },
      { id: 'cd-5', title: 'Exercice : Conditions Difficiles', type: 'interactive', content: 'Scénarios interactifs de conduite dans des conditions météorologiques difficiles.', duration: 14 },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  // PRACTICE PREPARATION (4)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'debuter-conduite',
    title: 'Premiers Pas en Conduite',
    description: 'Les bases de la conduite : démarrage, freinage, direction et manœuvres simples.',
    category: 'practice',
    level: 'beginner',
    duration: 50,
    icon: 'Car',
    isPremium: false,
    modules: [
      { id: 'dc-1', title: 'Le Poste de Conduite', type: 'lesson', content: '## Le Poste de Conduite\n\n### Réglages essentiels\n1. **Siège** : distance d\'un bras entre genou et tableau de bord\n2. **Rétroviseur intérieur** : voir la lunette arrière en entier\n3. **Rétroviseurs latéraux** : voir une bande mince du flanc\n4. **Appuie-tête** : niveau du haut de la tête\n\n### Les pédales\n- **Accélérateur** : droite\n- **Frein** : milieu\n- **Embrayage** : gauche (véhicule manuel)', duration: 12 },
      { id: 'dc-2', title: 'Démarrer et S\'arrêter', type: 'lesson', content: '## Démarrage\n\n### Véhicule à boîte automatique\n1. Pied sur le frein\n2. Passer en « D » (Drive)\n3. Relâcher doucement le frein\n\n### Véhicule manuel\n1. Point mort\n2. Débrayer\n3. Enclencher la 1ère\n4. Accélérer légèrement\n5. Lever progressivement le pied d\'embrayage\n\n> **À retenir** : Les mouvements doivent être fluides et progressifs.', duration: 15 },
      { id: 'dc-3', title: 'Freiner et Tourner', type: 'video', content: 'Les techniques correctes de freinage progressif et de direction anticipée.', duration: 10 },
      { id: 'dc-4', title: 'Les Lignes au Sol', type: 'lesson', content: '## Comprendre le Marquage\n\n- **Ligne blanche continue** : ne pas franchir\n- **Ligne blanche discontinue** : dépassement possible\n- **Ligne jaune** : interdiction de stationner\n- **Tirets centraux** : séparation des voies\n- **Passages piétons** : cédez le passage\n- **Zebras** : arrêt obligatoire si piéton', duration: 8 },
      { id: 'dc-5', title: 'Exercice : Première Conduite', type: 'interactive', content: 'Simulation interactive des premiers gestes de conduite.', duration: 5 },
    ],
  },
  {
    id: 'manoeuvres',
    title: 'Les Manœuvres Essentielles',
    description: 'Maîtrisez les manœuvres du permis : créneau, marche arrière, demi-tour et stationnement en épi.',
    category: 'practice',
    level: 'intermediate',
    duration: 50,
    icon: 'RotateCcw',
    isPremium: true,
    modules: [
      { id: 'man-1', title: 'Le Créneau', type: 'lesson', content: '## Le Créneau\n\n### Étapes :\n1. Placez-vous parallèlement au véhicule devant\n2. Reculez en tournant le volant vers la place\n3. Quand l\'arrière est à 45°, redressez\n4. Continuez en reculant\n5. Tournez vers la chaussée pour ajuster\n6. Avancez pour centrer\n\n### Erreurs fréquentes\n- Toucher les trottoirs\n- Frapper le véhicule derrière\n- Se placer trop loin de la chaussée', duration: 15 },
      { id: 'man-2', title: 'La Marche Arrière en Ligne Droite', type: 'lesson', content: '## Marche Arrière en Ligne Droite\n\n1. Regardez par la lunette arrière\n2. Placez votre main droite sur le dossier du siège passager\n3. Reculez lentement\n4. Vérifiez régulièrement les rétroviseurs\n5. Corrigez avec de petits mouvements du volant', duration: 12 },
      { id: 'man-3', title: 'Le Demi-tour', type: 'lesson', content: '## Le Demi-tour\n\n1. Ralentissez et signalez\n2. Positionnez-vous près du bord droit\n3. Tournez à gauche vers le trottoir opposé\n4. Reculez si nécessaire\n5. Repartez dans le sens opposé\n\n> Le demi-tour est interdit : sur autoroute, ponts, tunnels et virages.', duration: 12 },
      { id: 'man-4', title: 'Exercice : Manœuvres', type: 'interactive', content: 'Pratiquez les manœuvres dans un environnement de simulation interactif.', duration: 11 },
    ],
  },
  {
    id: 'conduite-urbaine',
    title: 'Conduite en Milieu Urbain',
    description: 'Spécificités de la conduite en ville : piétons, cyclistes, bus, embouteillages.',
    category: 'practice',
    level: 'intermediate',
    duration: 45,
    icon: 'Building2',
    isPremium: true,
    modules: [
      { id: 'cu-1', title: 'La Spécificité Urbaine', type: 'lesson', content: '## Conduire en Ville\n\n### Défis\n- **Densité** : nombreux usagers\n- **Complexité** : feux, panneaux, sens uniques\n- **Variabilité** : arrêts fréquents\n- **Risques** : piétons imprévisibles, cyclistes\n\n### Règles\n- Vitesse max : **50 km/h** (zone 30 = 30 km/h)\n- Priorité aux bus à l\'arrêt (clignotants)\n- Arrêt aux passages piétons\n- Anticipez les sorties de garage et parkings', duration: 15 },
      { id: 'cu-2', title: 'Les Zones Spécifiques', type: 'lesson', content: '## Zones Urbaines Particulières\n\n### Zone 30\n- 30 km/h max\n- Partage de l\'espace\n\n### Zone de Rencontre\n- 20 km/h max\n- Piétons ont la priorité\n- Véhicules et piétons cohabitent\n\n### Aires Piétonnes\n- Interdiction aux véhicules (sauf livraisons)\n\n### Couloirs de Bus\n- Réservés aux transports en commun\n- Cyclistes parfois autorisés', duration: 15 },
      { id: 'cu-3', title: 'Quiz : Conduite Urbaine', type: 'quiz', content: 'Questions sur les situations de conduite en milieu urbain.', duration: 15 },
    ],
  },
  {
    id: 'conduite-nuit',
    title: 'Conduite Nocturne',
    description: 'Maîtrisez les spécificités de la conduite de nuit : éclairage, visibilité et fatigue.',
    category: 'night',
    level: 'advanced',
    duration: 40,
    icon: 'Moon',
    isPremium: true,
    modules: [
      { id: 'cn-1', title: 'L\'Éclairage de Nuit', type: 'lesson', content: '## Les Feux de Nuit\n\n### Feux de croisement\n- Illuminent ~30 m devant le véhicule\n- Obligatoires en croisement et en agglomération\n\n### Feux de route\n- Illuminent ~100 m\n- Utilisés sur routes non éclairées, seul\n- Interdits en croisement\n\n### Conduite à apprendre\n- Permet d\'éclairer les virages\n- Évite d\'éblouir les autres', duration: 15 },
      { id: 'cn-2', title: 'Gérer la Fatigue Nocturne', type: 'lesson', content: '## La Fatigue Nocturne\n\n### Signes d\'alerte\n- Bâillements répétés\n- Difficulté à se concentrer\n- Paupières lourdes\n- Hésitations\n\n### Que faire ?\n1. **Arrêtez-vous** toutes les 2 heures\n2. Faites une **pause de 15 minutes** minimum\n3. Buvez un café (effet temporaire)\n4. Si possible, **dormez 20 minutes**\n\n> La fatigue est responsable de 20% des accidents mortels.', duration: 12 },
      { id: 'cn-3', title: 'Quiz : Conduite Nocturne', type: 'quiz', content: 'Évaluez vos connaissances sur la conduite nocturne.', duration: 13 },
    ],
  },
  // ═══════════════════════════════════════════════════════════════
  // EXAM PREPARATION (3)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'exam-blanc-theorie',
    title: 'Examen Blanc — Théorie',
    description: 'Préparez-vous à l\'examen théorique avec des quiz blancs et des révisions ciblées.',
    category: 'exam-prep',
    level: 'intermediate',
    duration: 60,
    icon: 'ClipboardCheck',
    isPremium: false,
    modules: [
      { id: 'ebt-1', title: 'Format de l\'Examen', type: 'lesson', content: '## L\'Examen Théorique (ETG)\n\n### Format\n- **40 questions** à choix multiples\n- **Seuil de réussite** : 35/40 réponses correctes\n- **Temps** : 30 minutes\n- **5 fausses réponses** max par thématique\n\n### Thématiques\n- Signalisation\n- Priorités\n- Vitesse et distances\n- Mécanique\n- Conduite\n- Sécurité\n- Documents\n- Premiers secours', duration: 10 },
      { id: 'ebt-2', title: 'Quiz Blanc 1', type: 'quiz', content: 'Examen blanc complet : 40 questions couvrant toutes les thématiques de l\'examen.', duration: 30 },
      { id: 'ebt-3', title: 'Quiz Blanc 2', type: 'quiz', content: 'Second examen blanc avec des questions différentes pour renforcer vos connaissances.', duration: 30 },
      { id: 'ebt-4', title: 'Révision Ciblée', type: 'interactive', content: 'Identifiez vos lacunes et concentrez vos révisions sur les thématiques les plus difficiles.', duration: 10 },
    ],
  },
  {
    id: 'exam-cas-pratiques',
    title: 'Cas Pratiques d\'Examen',
    description: 'Analysez des scénarios complexes et apprenez à prendre les bonnes décisions.',
    category: 'exam-prep',
    level: 'advanced',
    duration: 55,
    icon: 'Brain',
    isPremium: true,
    modules: [
      { id: 'ecp-1', title: 'Les Pièges de l\'Examen', type: 'lesson', content: '## Les Questions Pièges\n\n### Les erreurs fréquentes\n- Confondre interdiction et obligation\n- Mal interpréter les distances\n- Oublier les exceptions aux règles\n- Répondre trop vite sans lire\n\n### Astuces\n- **Lisez BIEN la question**\n- Éliminez les réponses absurdes\n- Méfiez-vous des « toujours » et « jamais »\n- Vérifiez votre réponse avant de valider', duration: 15 },
      { id: 'ecp-2', title: 'Cas : Intersections Complexes', type: 'interactive', content: 'Analysez des carrefours complexes avec signalisation combinée et déterminez qui est prioritaire.', duration: 15 },
      { id: 'ecp-3', title: 'Cas : Conditions Météo', type: 'interactive', content: 'Prenez les bonnes décisions dans des situations météorologiques variées : pluie forte, neige, brouillard, nuit.', duration: 15 },
      { id: 'ecp-4', title: 'Cas : Situations d\'Urgence', type: 'interactive', content: 'Réagissez correctement aux situations d\'urgence : crevaison, panne, accident.', duration: 10 },
    ],
  },
  {
    id: 'erreurs-frequentes',
    title: 'Les Erreurs Fréquentes à l\'Examen',
    description: 'Identifiez et évitez les erreurs les plus courantes commises lors de l\'examen du permis.',
    category: 'exam-prep',
    level: 'intermediate',
    duration: 40,
    icon: 'AlertTriangle',
    isPremium: false,
    modules: [
      { id: 'ef-1', title: 'Les 10 Erreurs Fatales', type: 'lesson', content: '## Les 10 Erreurs à Éviter\n\n1. **Confondre panneaux** interdiction/obligation\n2. **Mauvaise priorité** aux carrefours\n3. **Vitesse excessive** dans les zones\n4. **Feux mal utilisés** en croisement\n5. **Distance de sécurité** insuffisante\n6. **Pas de clignotant** au changement de direction\n7. **Alcool** : taux supérieur à la limite légale\n8. **Téléphone en main** pendant la conduite\n9. **Angle mort** non vérifié\n10. **Passage piéton** non respecté\n\n> Ces 10 erreurs représentent 80% des échecs à l\'examen théorique.', duration: 15 },
      { id: 'ef-2', title: 'Analyse de Vos Erreurs', type: 'interactive', content: 'Revoyez vos quiz précédents et identifiez les thématiques où vous faites le plus d\'erreurs.', duration: 15 },
      { id: 'ef-3', title: 'Plan de Révision Personnalisé', type: 'quiz', content: 'Quiz ciblé basé sur les thématiques où vous avez le plus de difficultés.', duration: 10 },
    ],
  },
];

export function getCourseById(id: string): Course | undefined {
  return courseContent.find((c) => c.id === id);
}

export function getCoursesByCategory(category: string): Course[] {
  return courseContent.filter((c) => c.category === category);
}

export function getCoursesByLevel(level: string): Course[] {
  return courseContent.filter((c) => c.level === level);
}

export type VisualPriority = 'signature' | 'critical' | 'progressive';
export type VisualStatus = 'ready' | 'enrich' | 'to-create' | 'to-verify';

export type AdsoVisualScene = {
  id: string;
  title: string;
  learningGoal: string;
  priority: VisualPriority;
  status: VisualStatus;
  countries: string[];
  tags: string[];
};

/**
 * Canonical content plan for ADSO Immersif.
 * A scene is not considered complete until its visual asset and its
 * pedagogical decision/consequence sequence have both been validated.
 */
export const ADSO_VISUAL_SCENE_LIBRARY: readonly AdsoVisualScene[] = [
  { id: 'school-zone-crossing', title: 'Zone scolaire — traversée', learningGoal: 'Anticiper un enfant près d’une école.', priority: 'signature', status: 'ready', countries: ['ALL'], tags: ['école', 'piéton', 'moto', 'panneau'] },
  { id: 'school-zone-motorcycle', title: 'Moto près d’une école', learningGoal: 'Réduire la vitesse et garder une marge de sécurité.', priority: 'signature', status: 'enrich', countries: ['ALL'], tags: ['école', 'moto', 'vitesse'] },
  { id: 'pedestrian-crossing', title: 'Passage piéton', learningGoal: 'Observer, céder le passage et repartir seulement quand la zone est sûre.', priority: 'critical', status: 'ready', countries: ['ALL'], tags: ['piéton', 'passage'] },
  { id: 'helmet-driver', title: 'Casque conducteur', learningGoal: 'Comprendre le rôle du casque.', priority: 'critical', status: 'ready', countries: ['ALL'], tags: ['moto', 'casque'] },
  { id: 'helmet-passenger', title: 'Casque passager', learningGoal: 'Sécuriser le conducteur et son passager.', priority: 'critical', status: 'enrich', countries: ['ALL'], tags: ['moto', 'passager', 'casque'] },
  { id: 'three-riders', title: 'Surcharge d’une moto', learningGoal: 'Identifier une situation de risque avant le départ.', priority: 'critical', status: 'to-create', countries: ['ALL'], tags: ['moto', 'passager', 'risque'] },
  { id: 'junction-red', title: 'Feu rouge', learningGoal: 'Respecter l’arrêt et anticiper les usagers vulnérables.', priority: 'critical', status: 'ready', countries: ['ALL'], tags: ['feu', 'intersection'] },
  { id: 'junction-priority', title: 'Intersection et priorité', learningGoal: 'Lire la priorité avant de s’engager.', priority: 'critical', status: 'ready', countries: ['ALL'], tags: ['intersection', 'priorité'] },
  { id: 'roundabout', title: 'Carrefour giratoire', learningGoal: 'Choisir la bonne trajectoire et contrôler les angles.', priority: 'critical', status: 'to-create', countries: ['ALL'], tags: ['giratoire', 'priorité'] },
  { id: 'blind-spot-moto', title: 'Angle mort d’une moto', learningGoal: 'Vérifier avant de changer de direction.', priority: 'critical', status: 'ready', countries: ['ALL'], tags: ['moto', 'angle-mort'] },
  { id: 'blind-spot-car', title: 'Angle mort d’un véhicule', learningGoal: 'Comprendre ce que le rétroviseur ne montre pas.', priority: 'critical', status: 'enrich', countries: ['ALL'], tags: ['voiture', 'angle-mort'] },
  { id: 'overtaking', title: 'Dépassement', learningGoal: 'Évaluer visibilité, distance et espace.', priority: 'critical', status: 'ready', countries: ['ALL'], tags: ['dépassement', 'visibilité'] },
  { id: 'phone-driving', title: 'Téléphone au volant', learningGoal: 'Identifier la distraction et ses conséquences.', priority: 'critical', status: 'ready', countries: ['ALL'], tags: ['distraction', 'téléphone'] },
  { id: 'speed-school', title: 'Vitesse près d’une école', learningGoal: 'Adapter la vitesse au contexte.', priority: 'critical', status: 'to-create', countries: ['ALL'], tags: ['vitesse', 'école'] },
  { id: 'rain', title: 'Conduite sous la pluie', learningGoal: 'Augmenter distance et réduire vitesse.', priority: 'critical', status: 'ready', countries: ['ALL'], tags: ['pluie', 'adhérence'] },
  { id: 'night', title: 'Conduite de nuit', learningGoal: 'Voir et être vu.', priority: 'critical', status: 'ready', countries: ['ALL'], tags: ['nuit', 'visibilité'] },
  { id: 'bus-stop', title: 'Arrêt de bus', learningGoal: 'Anticiper les piétons masqués par un véhicule.', priority: 'critical', status: 'ready', countries: ['ALL'], tags: ['bus', 'piéton'] },
  { id: 'pedestrian-hidden', title: 'Piéton masqué', learningGoal: 'Réduire l’allure lorsqu’un obstacle masque la visibilité.', priority: 'critical', status: 'to-create', countries: ['ALL'], tags: ['piéton', 'visibilité'] },
  { id: 'animal-road', title: 'Animal sur la chaussée', learningGoal: 'Anticiper un obstacle imprévisible.', priority: 'progressive', status: 'to-create', countries: ['ALL'], tags: ['obstacle', 'rural'] },
  { id: 'roadworks', title: 'Travaux routiers', learningGoal: 'Lire la signalisation temporaire.', priority: 'progressive', status: 'to-create', countries: ['ALL'], tags: ['travaux', 'signalisation'] },
  { id: 'pothole', title: 'Nid-de-poule', learningGoal: 'Adapter trajectoire et vitesse sans mettre les autres en danger.', priority: 'progressive', status: 'to-create', countries: ['ALL'], tags: ['route', 'obstacle'] },
  { id: 'unmarked-road', title: 'Route sans marquage', learningGoal: 'Partager l’espace avec prudence.', priority: 'progressive', status: 'to-create', countries: ['ALL'], tags: ['rural', 'partage'] },
  { id: 'market-road', title: 'Marché en bord de route', learningGoal: 'Anticiper les traversées et arrêts imprévus.', priority: 'progressive', status: 'to-create', countries: ['ALL'], tags: ['marché', 'piéton'] },
  { id: 'taxi-moto-stop', title: 'Taxi-moto en arrêt', learningGoal: 'Anticiper un départ ou un arrêt brusque.', priority: 'progressive', status: 'enrich', countries: ['ALL'], tags: ['taxi-moto', 'arrêt'] },
  { id: 'public-transport', title: 'Transport collectif', learningGoal: 'Partager la route avec les bus et minibus.', priority: 'progressive', status: 'to-create', countries: ['ALL'], tags: ['bus', 'transport'] },
  { id: 'emergency-vehicle', title: 'Véhicule prioritaire', learningGoal: 'Libérer le passage sans créer un second danger.', priority: 'critical', status: 'to-create', countries: ['ALL'], tags: ['urgence', 'priorité'] },
  { id: 'fatigue', title: 'Fatigue', learningGoal: 'Reconnaître le moment où il faut s’arrêter.', priority: 'critical', status: 'to-create', countries: ['ALL'], tags: ['fatigue', 'vigilance'] },
  { id: 'alcohol', title: 'Alcool et conduite', learningGoal: 'Comprendre l’altération et choisir de ne pas conduire.', priority: 'critical', status: 'to-create', countries: ['ALL'], tags: ['alcool', 'prévention'] },
  { id: 'seatbelt', title: 'Ceinture', learningGoal: 'Faire de la ceinture un réflexe pour chaque trajet.', priority: 'critical', status: 'to-create', countries: ['ALL'], tags: ['ceinture', 'voiture'] },
  { id: 'child-restraint', title: 'Protection de l’enfant', learningGoal: 'Choisir une protection adaptée à l’enfant.', priority: 'critical', status: 'to-create', countries: ['ALL'], tags: ['enfant', 'protection'] },
  { id: 'school-bus', title: 'Sortie d’école', learningGoal: 'Anticiper les mouvements groupés d’élèves.', priority: 'signature', status: 'to-create', countries: ['ALL'], tags: ['école', 'groupe'] },
  { id: 'motorcycle-queue', title: 'File de motos', learningGoal: 'Garder distance et trajectoire dans un trafic dense.', priority: 'progressive', status: 'enrich', countries: ['ALL'], tags: ['moto', 'trafic'] },
  { id: 'lane-change', title: 'Changement de voie', learningGoal: 'Contrôler rétroviseurs, angle mort et clignotant.', priority: 'critical', status: 'to-create', countries: ['ALL'], tags: ['voie', 'angle-mort'] },
  { id: 'turning-pedestrian', title: 'Tourner face à un piéton', learningGoal: 'Céder aux usagers vulnérables présents dans la trajectoire.', priority: 'critical', status: 'to-create', countries: ['ALL'], tags: ['tourner', 'piéton'] },
  { id: 'safe-following-distance', title: 'Distance de sécurité', learningGoal: 'Conserver une marge suffisante pour réagir.', priority: 'critical', status: 'to-create', countries: ['ALL'], tags: ['distance', 'anticipation'] },
  { id: 'defensive-driving', title: 'Conduite défensive', learningGoal: 'Anticiper l’erreur des autres sans agressivité.', priority: 'signature', status: 'to-create', countries: ['ALL'], tags: ['anticipation', 'responsabilité'] },
] as const;

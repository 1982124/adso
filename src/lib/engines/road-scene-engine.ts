export type RoadSceneDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type RoadSceneStatus = 'DRAFT' | 'REVIEW' | 'VALIDATED' | 'PUBLISHED' | 'ARCHIVED';

export interface RoadSceneTimelineStep {
  start: number;
  end: number;
  action: string;
  visualCue: string;
  expectedBehavior?: string;
}

export interface RoadSceneDefinition {
  id: string;
  category: string;
  difficulty: RoadSceneDifficulty;
  title: string;
  objective: string;
  duration: number;
  environment: string;
  actors: string[];
  vehicles: string[];
  weather: string;
  lighting: string;
  rule: string;
  correctBehavior: string;
  incorrectBehavior: string;
  timeline: RoadSceneTimelineStep[];
  status: RoadSceneStatus;
  audioOptional: boolean;
  visualMode: 'real-reference' | 'realistic-composite' | 'diagram';
}

const CATEGORIES = ['city','highway','rural','mountain','night','rain','fog','snow','parking','maneuver','intersection','priority','roundabout','overtaking','emergency_braking','eco_driving'];
const DIFFICULTIES: RoadSceneDifficulty[] = ['beginner','intermediate','advanced'];

const TITLES: Record<string, string> = {
  city: 'Traversée urbaine et usagers vulnérables', highway: 'Conduite sur grand axe', rural: 'Partage de la chaussée en zone rurale', mountain: 'Virage et visibilité en montagne', night: 'Conduite nocturne et visibilité', rain: 'Chaussée mouillée et adhérence', fog: 'Brouillard et distance de sécurité', snow: 'Chaussée enneigée', parking: 'Sortie de stationnement sécurisée', maneuver: 'Manœuvre et contrôle autour du véhicule', intersection: 'Franchissement d’une intersection', priority: 'Lecture d’une priorité', roundabout: 'Entrée et sortie d’un rond-point', overtaking: 'Dépassement avec visibilité suffisante', emergency_braking: 'Freinage d’urgence face à un obstacle', eco_driving: 'Anticipation et conduite fluide'
};

const OBJECTIVES: Record<string, string> = {
  city: 'Repérer les usagers vulnérables et adapter sa trajectoire.', highway: 'Maintenir une marge de sécurité et anticiper les trajectoires.', rural: 'Partager la chaussée avec des usagers et obstacles imprévisibles.', mountain: 'Adapter allure et trajectoire à la visibilité et au relief.', night: 'Utiliser la visibilité disponible sans dépasser ses capacités d’anticipation.', rain: 'Réduire les risques liés à l’adhérence et à la visibilité.', fog: 'Augmenter la prudence lorsque la visibilité diminue.', snow: 'Adapter vitesse et trajectoire à une adhérence dégradée.', parking: 'Contrôler l’environnement avant et pendant une sortie de stationnement.', maneuver: 'Observer autour du véhicule avant toute manœuvre.', intersection: 'Analyser les trajectoires avant de franchir une intersection.', priority: 'Identifier l’ordre de passage avant d’avancer.', roundabout: 'Observer et choisir une trajectoire sûre dans un rond-point.', overtaking: 'Vérifier visibilité, espace et interaction avant un dépassement.', emergency_braking: 'Réagir progressivement et garder le contrôle face à un danger soudain.', eco_driving: 'Anticiper pour éviter accélérations et freinages inutiles.'
};

const RULES: Record<string, string> = {
  city: 'La sécurité des piétons, cyclistes et motocyclistes prime dans toute décision de trajectoire.', highway: 'Adapter vitesse et distance aux conditions réelles, sans dépasser les règles applicables localement.', rural: 'La visibilité et les trajectoires des autres usagers doivent être anticipées.', mountain: 'La vitesse doit rester compatible avec la visibilité et la maîtrise du véhicule.', night: 'La conduite doit rester compatible avec la visibilité réelle.', rain: 'L’adhérence et la visibilité peuvent diminuer ; la conduite doit être adaptée.', fog: 'Une visibilité réduite impose davantage d’anticipation et de marge.', snow: 'Les conditions de chaussée peuvent modifier fortement l’adhérence.', parking: 'Avant de quitter une place, contrôler l’avant, l’arrière et les côtés.', maneuver: 'Toute manœuvre doit être précédée d’une observation de l’environnement.', intersection: 'Ne franchir une intersection qu’après avoir analysé les usagers et la signalisation.', priority: 'Respecter la signalisation et la priorité applicable au contexte.', roundabout: 'Observer la circulation avant l’entrée et signaler les changements de direction selon les règles locales.', overtaking: 'Ne dépasser que lorsque la visibilité, l’espace et les règles permettent une manœuvre sûre.', emergency_braking: 'Freiner et conserver le contrôle ; éviter une manœuvre brusque non maîtrisée.', eco_driving: 'Anticiper la circulation et privilégier une conduite régulière.'
};

function build(category: string, difficulty: RoadSceneDifficulty): RoadSceneDefinition {
  const advanced = difficulty === 'advanced';
  const intermediate = difficulty === 'intermediate';
  const duration = advanced ? 12 : intermediate ? 10 : 8;
  return {
    id: `SCENE-${category.toUpperCase()}-${difficulty.toUpperCase()}`,
    category, difficulty,
    title: `${TITLES[category]} — ${difficulty === 'beginner' ? 'Débutant' : difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}`,
    objective: OBJECTIVES[category], duration,
    environment: category === 'city' || category === 'intersection' || category === 'roundabout' ? 'urbain réaliste' : category === 'rural' ? 'route rurale réaliste' : 'environnement routier réaliste',
    actors: ['conducteur', ...(category === 'city' || category === 'intersection' || category === 'priority' ? ['piéton'] : []), ...(category === 'overtaking' || category === 'roundabout' ? ['conducteur secondaire'] : [])],
    vehicles: ['automobile', ...(category === 'city' || category === 'rural' ? ['moto', 'vélo'] : [])],
    weather: category === 'rain' ? 'pluie' : category === 'fog' ? 'brouillard' : category === 'snow' ? 'neige' : 'clair',
    lighting: category === 'night' ? 'nuit' : 'jour',
    rule: RULES[category],
    correctBehavior: 'Observer, anticiper et adapter allure, trajectoire et distance à la situation.',
    incorrectBehavior: 'Accélérer, couper une trajectoire ou agir sans vérifier la situation.',
    timeline: [
      { start: 0, end: 2, action: 'situation_initiale', visualCue: 'La scène s’installe et montre clairement la chaussée et les usagers.' },
      { start: 2, end: duration - 3, action: 'evenement', visualCue: 'Un événement de circulation apparaît et impose une observation.' },
      { start: duration - 3, end: duration - 1, action: 'decision', visualCue: 'La scène marque le moment de décision.', expectedBehavior: 'Observer puis choisir une action sûre.' },
      { start: duration - 1, end: duration, action: 'resolution', visualCue: 'Le comportement sûr est illustré.' }
    ],
    status: 'VALIDATED', audioOptional: true,
    visualMode: 'realistic-composite'
  };
}

export const ROAD_SCENE_LIBRARY: RoadSceneDefinition[] = CATEGORIES.flatMap(category => DIFFICULTIES.map(difficulty => build(category, difficulty)));

export function getRoadScene(category: string, difficulty: string): RoadSceneDefinition {
  return ROAD_SCENE_LIBRARY.find(s => s.category === category && s.difficulty === difficulty) ?? build(category, (DIFFICULTIES.includes(difficulty as RoadSceneDifficulty) ? difficulty : 'beginner') as RoadSceneDifficulty);
}

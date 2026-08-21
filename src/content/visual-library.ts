export type AdsoVisualPack = {
  id: string
  title: string
  priority: 'critical' | 'high' | 'medium'
  status: 'planned' | 'in-production' | 'ready'
  targetCount: number
  visualDirection: string
}

/** Canonical ADSO visual roadmap. Assets should be produced and reviewed against this registry. */
export const ADSO_VISUAL_LIBRARY: AdsoVisualPack[] = [
  {
    id: 'home-signature',
    title: 'ADSO Home — scène signature',
    priority: 'critical',
    status: 'in-production',
    targetCount: 5,
    visualDirection: 'Afrique de l’Ouest réaliste, école, élève, panneau de traversée scolaire, moto, accident non graphique, lumière cinématographique, prévention.',
  },
  {
    id: 'immersive',
    title: 'ADSO Immersif',
    priority: 'critical',
    status: 'planned',
    targetCount: 50,
    visualDirection: 'Scènes réalistes utilisables pour observer → décider → conséquence → explication, avec variantes de décisions.',
  },
  {
    id: 'road-safety',
    title: 'Éducation routière',
    priority: 'critical',
    status: 'planned',
    targetCount: 100,
    visualDirection: 'Panneaux, feux, priorités, intersections, piétons, motos, véhicules, comportements à risque et prévention.',
  },
  {
    id: 'francoise',
    title: 'Françoise',
    priority: 'high',
    status: 'planned',
    targetCount: 8,
    visualDirection: 'Identité africaine contemporaine, chaleureuse, professionnelle, cohérente sur avatar, états d’écoute, réflexion et réponse.',
  },
  {
    id: 'africa-54',
    title: '54 pays africains',
    priority: 'high',
    status: 'planned',
    targetCount: 54,
    visualDirection: 'Variantes progressives par pays : environnement, mobilité, école, usagers et contexte local sans stéréotypes.',
  },
  {
    id: 'marketplace',
    title: 'Marketplace / livres / marketing',
    priority: 'medium',
    status: 'planned',
    targetCount: 30,
    visualDirection: 'Couvertures, collections, teasers, bannières et visuels sociaux cohérents avec la marque ADSO.',
  },
]

import type { AppModule } from './view-store';

/** MVP product boundary: legacy insurance/fleet modules are intentionally absent. */
export const mvpModules: AppModule[] = ['home', 'learning', 'driving', 'security', 'enterprise'];

export const mvpModuleLabels = {
  home: { label: 'Accueil', description: "Page d'accueil ADSO" },
  learning: { label: 'Formation', description: 'Parcours de formation à la mobilité' },
  driving: { label: 'Conducteur', description: 'Accompagnement du conducteur responsable' },
  security: { label: 'Sécurité', description: 'Prévention et culture de sécurité routière' },
  enterprise: { label: 'Établissements', description: 'Solutions ADSO pour écoles et organisations de formation' },
} as const;

import { create } from 'zustand';

export type LearningTab = 'explorer' | 'cours' | 'programme' | 'signalisation' | 'reglementations' | 'permis' | 'examens' | 'exercices' | 'progression';

export type AppModule =
  | 'home'
  | 'learning'
  | 'driving'
  | 'security'
  | 'insurance'
  | 'fleet'
  | 'enterprise';

interface ViewState {
  currentView: AppModule;
  learningTab: LearningTab;
  setView: (view: AppModule) => void;
  setLearningTab: (tab: LearningTab) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  currentView: 'home',
  learningTab: 'explorer',
  setView: (view) => {
    set({ currentView: view });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  setLearningTab: (tab) => set({ learningTab: tab }),
}));

export const moduleLabels: Record<AppModule, { label: string; icon: string; description: string }> = {
  home: { label: 'Accueil', icon: 'Home', description: "Page d'accueil ADSO" },
  learning: { label: 'Éducation routière', icon: 'GraduationCap', description: "Parcours de l'école au futur conducteur" },
  driving: { label: 'Conducteur', icon: 'Car', description: 'Préparation et accompagnement du conducteur' },
  security: { label: 'Sécurité', icon: 'Shield', description: 'Prévention et culture de sécurité routière' },
  insurance: { label: 'Assurance', icon: 'ShieldCheck', description: "Services de prévention autour de l'assurance" },
  fleet: { label: 'Flottes', icon: 'Truck', description: 'Formation et pilotage des conducteurs professionnels' },
  enterprise: { label: 'Établissements & entreprises', icon: 'Building2', description: 'Solutions ADSO pour écoles, entreprises et opérateurs de mobilité' },
};

export const mainModules: AppModule[] = [
  'home', 'learning', 'driving', 'security', 'insurance', 'fleet', 'enterprise',
];

export const v41Modules: AppModule[] = ['driving', 'insurance', 'fleet', 'enterprise'];
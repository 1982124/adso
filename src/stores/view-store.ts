import { create } from 'zustand';

export type LearningTab = 'explorer' | 'cours' | 'programme' | 'signalisation' | 'reglementations' | 'permis' | 'examens' | 'exercices' | 'progression';

export type AppModule = 'home' | 'learning' | 'driving' | 'security' | 'enterprise';

interface ViewState {
  currentView: AppModule;
  learningTab: LearningTab;
  setView: (view: AppModule) => void;
  setLearningTab: (tab: LearningTab) => void;
  openLearningTab: (tab: LearningTab) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  currentView: 'home',
  learningTab: 'explorer',
  setView: (view) => {
    set({ currentView: view });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  setLearningTab: (tab) => set({ learningTab: tab }),
  openLearningTab: (tab) => {
    set({ currentView: 'learning', learningTab: tab });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
}));

export const moduleLabels: Record<AppModule, { label: string; icon: string; description: string }> = {
  home: { label: 'Accueil', icon: 'Home', description: "Page d'accueil ADSO" },
  learning: { label: 'Formation', icon: 'GraduationCap', description: 'Parcours de formation à la mobilité' },
  driving: { label: 'Conducteur', icon: 'Car', description: 'Accompagnement du conducteur responsable' },
  security: { label: 'Sécurité', icon: 'Shield', description: 'Prévention et culture de sécurité routière' },
  enterprise: { label: 'Établissements', icon: 'Building2', description: 'Solutions ADSO pour écoles et organisations de formation' },
};

export const mainModules: AppModule[] = ['home', 'learning', 'driving', 'security', 'enterprise'];
export const v41Modules: AppModule[] = ['driving', 'enterprise'];

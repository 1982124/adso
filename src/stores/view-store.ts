import { create } from 'zustand';

export type AppModule = 
  | 'home'        // Landing page with all existing sections
  | 'learning'    // Learning platform (courses, signs, regulations, licenses)
  | 'mechanic'    // AI Mechanic diagnostic
  | 'scanner'     // Vehicle OBD-II scanner
  | 'telematics'  // GPS tracking & telematics
  | 'security'    // Vehicle security & anti-theft
  | 'marketplace' // Marketplace (garages, parts, services)
  | 'blueprint';  // Technical blueprint documentation

interface ViewState {
  currentView: AppModule;
  setView: (view: AppModule) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  currentView: 'home',
  setView: (view) => {
    set({ currentView: view });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
}));

export const moduleLabels: Record<AppModule, { label: string; icon: string; description: string }> = {
  home: { label: 'Accueil', icon: 'Home', description: 'Page d\'accueil ADSO' },
  learning: { label: 'Formation', icon: 'GraduationCap', description: 'Plateforme d\'apprentissage' },
  mechanic: { label: 'Mécanicien IA', icon: 'Wrench', description: 'Diagnostic mécanique intelligent' },
  scanner: { label: 'Scanner', icon: 'Scan', description: 'Scanner véhicule OBD-II' },
  telematics: { label: 'Télématique', icon: 'MapPin', description: 'Suivi GPS et télématique' },
  security: { label: 'Sécurité', icon: 'Shield', description: 'Sécurité véhicule' },
  marketplace: { label: 'Marketplace', icon: 'Store', description: 'Marketplace services auto' },
  blueprint: { label: 'Architecture', icon: 'FileCode', description: 'Blueprint technique' },
};

export const mainModules: AppModule[] = ['home', 'learning', 'mechanic', 'scanner', 'telematics', 'security', 'marketplace'];

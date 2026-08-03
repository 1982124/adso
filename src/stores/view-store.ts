import { create } from 'zustand';

interface ViewState {
  currentView: 'app' | 'blueprint';
  setView: (view: 'app' | 'blueprint') => void;
}

export const useViewStore = create<ViewState>((set) => ({
  currentView: 'app',
  setView: (view) => {
    set({ currentView: view });
    if (view === 'app' || view === 'blueprint') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },
}));

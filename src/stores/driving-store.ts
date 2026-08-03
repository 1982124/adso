import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type DrivingView =
  | 'home'
  | 'courses'
  | 'quiz'
  | 'exam'
  | 'simulation'
  | 'practical'
  | 'theory'
  | 'moniteur'
  | 'neuro'
  | 'command-center'
  | 'tablet'
  | 'certification'
  | 'notifications'
  | 'admin'
  | 'pricing'
  | 'marketplace';

interface DrivingState {
  currentView: DrivingView;
  selectedCountry: string;
  selectedLicense: string;
  selectedCourse: string | null;
  sidebarOpen: boolean;

  setCurrentView: (view: DrivingView) => void;
  setSelectedCountry: (country: string) => void;
  setSelectedLicense: (license: string) => void;
  setSelectedCourse: (course: string | null) => void;
  toggleSidebar: () => void;
}

export const useDrivingStore = create<DrivingState>()(
  persist(
    (set) => ({
      currentView: 'home',
      selectedCountry: 'ML',
      selectedLicense: 'auto',
      selectedCourse: null,
      sidebarOpen: true,

      setCurrentView: (currentView) => set({ currentView }),

      setSelectedCountry: (selectedCountry) => set({ selectedCountry }),

      setSelectedLicense: (selectedLicense) => set({ selectedLicense }),

      setSelectedCourse: (selectedCourse) => set({ selectedCourse }),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    { name: 'adso-driving-store' }
  )
);

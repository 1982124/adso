import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: string;
  country: string;
  language: string;
  subscription: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  updateProfile: (field: keyof User, value: string | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      setLoading: (isLoading) =>
        set({ isLoading }),

      updateProfile: (field, value) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, [field]: value }
            : null,
        })),
    }),
    { name: 'adso-user-store' }
  )
);

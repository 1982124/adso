import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Student {
  id: string;
  name: string;
  avatar: string | null;
  progress: number;
  lastSession: string | null;
}

export interface SessionExercise {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed';
  score: number | null;
}

export interface ActiveSession {
  studentId: string;
  startTime: string;
  exercises: SessionExercise[];
}

export interface MoniteurNotification {
  id: string;
  type: 'session_request' | 'quiz_completed' | 'achievement' | 'system' | 'message';
  message: string;
  read: boolean;
  createdAt: string;
}

interface MoniteurState {
  isConnected: boolean;
  currentStudent: Student | null;
  students: Student[];
  activeSession: ActiveSession | null;
  notifications: MoniteurNotification[];

  connect: () => void;
  disconnect: () => void;
  selectStudent: (student: Student | null) => void;
  startSession: (studentId: string) => void;
  endSession: () => void;
  markNotificationRead: (id: string) => void;
  addNotification: (notification: Omit<MoniteurNotification, 'id' | 'read' | 'createdAt'>) => void;
}

export const useMoniteurStore = create<MoniteurState>()(
  persist(
    (set, get) => ({
      isConnected: false,
      currentStudent: null,
      students: [],
      activeSession: null,
      notifications: [],

      connect: () => set({ isConnected: true }),

      disconnect: () =>
        set({
          isConnected: false,
          activeSession: null,
        }),

      selectStudent: (student) => set({ currentStudent: student }),

      startSession: (studentId) =>
        set({
          activeSession: {
            studentId,
            startTime: new Date().toISOString(),
            exercises: [],
          },
        }),

      endSession: () => set({ activeSession: null }),

      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              read: false,
              createdAt: new Date().toISOString(),
            },
            ...state.notifications,
          ],
        })),
    }),
    { name: 'adso-moniteur-store' }
  )
);

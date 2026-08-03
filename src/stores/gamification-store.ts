import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  earned: boolean;
}

const XP_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2500, 4000, 6000, 10000];

const RANKS = ['Débutant', 'Apprenti', 'Confirmé', 'Expert', 'Maître', 'Champion', 'Légende'];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-quiz', name: 'Premier Quiz', description: 'Complétez votre premier quiz', icon: '🎯', unlocked: false, unlockedAt: null },
  { id: 'ten-quizzes', name: '10 Quiz Réussis', description: 'Réussissez 10 quiz', icon: '🏆', unlocked: false, unlockedAt: null },
  { id: 'perfect-score', name: 'Score Parfait', description: 'Obtenez 100% à un quiz', icon: '⭐', unlocked: false, unlockedAt: null },
  { id: 'streak-7', name: 'Streak 7 Jours', description: 'Étudiez 7 jours de suite', icon: '🔥', unlocked: false, unlockedAt: null },
  { id: 'streak-30', name: 'Streak 30 Jours', description: 'Étudiez 30 jours de suite', icon: '💪', unlocked: false, unlockedAt: null },
  { id: 'xp-1000', name: 'Mille Points', description: 'Atteignez 1000 XP', icon: '💎', unlocked: false, unlockedAt: null },
  { id: 'xp-5000', name: 'Cinq Mille Points', description: 'Atteignez 5000 XP', icon: '🌟', unlocked: false, unlockedAt: null },
  { id: 'level-5', name: 'Niveau 5 Atteint', description: 'Atteignez le niveau 5', icon: '📈', unlocked: false, unlockedAt: null },
  { id: 'course-complete', name: 'Cours Terminé', description: 'Terminez un cours complet', icon: '📚', unlocked: false, unlockedAt: null },
  { id: 'exam-passed', name: 'Examen Réussi', description: 'Réussissez un examen de simulation', icon: '🎓', unlocked: false, unlockedAt: null },
  { id: 'all-correct', name: 'Sans Faute', description: '100 bonnes réponses consécutives', icon: '👑', unlocked: false, unlockedAt: null },
  { id: 'night-owl', name: 'Oiseau de Nuit', description: 'Étudiez après 22h', icon: '🦉', unlocked: false, unlockedAt: null },
];

const DEFAULT_BADGES: Badge[] = [
  { id: 'bronze-driver', name: 'Conducteur Bronze', icon: '🥉', color: '#CD7F32', earned: false },
  { id: 'silver-driver', name: 'Conducteur Argent', icon: '🥈', color: '#C0C0C0', earned: false },
  { id: 'gold-driver', name: 'Conducteur Or', icon: '🥇', color: '#FFD700', earned: false },
  { id: 'theory-master', name: 'Maître de la Théorie', icon: '📖', color: '#8B5CF6', earned: false },
  { id: 'road-warrior', name: 'Guerrier de la Route', icon: '🛡️', color: '#EF4444', earned: false },
];

interface GamificationState {
  xp: number;
  level: number;
  rank: string;
  ranks: string[];
  achievements: Achievement[];
  badges: Badge[];
  streak: number;
  totalQuizAttempts: number;
  totalCorrectAnswers: number;

  addXp: (amount: number) => void;
  unlockAchievement: (id: string) => void;
  earnBadge: (id: string) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  recordQuizAttempt: (correct: number, total: number) => void;
}

function computeLevel(xp: number): number {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

function computeRank(level: number): string {
  const rankIndex = Math.min(Math.floor((level - 1) / 2), RANKS.length - 1);
  return RANKS[rankIndex];
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      rank: 'Débutant',
      ranks: RANKS,
      achievements: DEFAULT_ACHIEVEMENTS,
      badges: DEFAULT_BADGES,
      streak: 0,
      totalQuizAttempts: 0,
      totalCorrectAnswers: 0,

      addXp: (amount) => {
        const newXP = Math.max(0, get().xp + amount);
        const newLevel = computeLevel(newXP);
        const newRank = computeRank(newLevel);
        set({ xp: newXP, level: newLevel, rank: newRank });
      },

      unlockAchievement: (id) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id && !a.unlocked
              ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
              : a
          ),
        })),

      earnBadge: (id) =>
        set((state) => ({
          badges: state.badges.map((b) =>
            b.id === id ? { ...b, earned: true } : b
          ),
        })),

      incrementStreak: () =>
        set((state) => ({ streak: state.streak + 1 })),

      resetStreak: () => set({ streak: 0 }),

      recordQuizAttempt: (correct, total) =>
        set((state) => ({
          totalQuizAttempts: state.totalQuizAttempts + 1,
          totalCorrectAnswers: state.totalCorrectAnswers + correct,
        })),
    }),
    { name: 'adso-gamification-store' }
  )
);

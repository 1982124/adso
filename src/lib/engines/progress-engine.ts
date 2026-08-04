// ═════════════════════════════════════════════════════════════════════════════════════════════════════════
// ADSO — Progress Engine
// Progress analysis, skill tracking, recommendations, and weakness identification.
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════

import type {
  CourseData,
  CourseModuleData,
  CategoryBreakdownItem,
  WeeklyReport,
  Milestone,
  StudyStreak,
} from './types';

/**
 * Calculate overall progress percentage across all courses.
 * @param courses - All courses
 * @param allModules - All modules across all courses (may include extra modules)
 * @param completedByCourse - Map of course ID to array of completed module IDs
 * @returns Overall progress percentage from 0 to 100
 */
export function calculateOverallProgress(
  courses: CourseData[],
  allModules: CourseModuleData[],
  completedByCourse: Record<string, string[]>
): number {
  if (courses.length === 0) return 0;

  let totalModules = 0;
  let totalCompleted = 0;

  for (const course of courses) {
    const modules = allModules.filter((m) => m.courseId === course.id);
    const completed = completedByCourse[course.id] ?? [];
    totalModules += modules.length;
    totalCompleted += modules.filter((m) => completed.includes(m.id)).length;
  }

  if (totalModules === 0) return 0;
  return Math.round((totalCompleted / totalModules) * 100);
}

/**
 * Identify strong areas from category breakdown.
 * Strong areas have a score >= 80%.
 * @param breakdown - Per-category breakdown data
 * @returns Array of strong category names
 */
export function analyzeStrengths(
  breakdown: CategoryBreakdownItem[]
): string[] {
  return breakdown
    .filter((item) => item.percentage >= 80)
    .map((item) => item.category);
}

/**
 * Identify weak areas from category breakdown.
 * Weak areas have a score < 60%.
 * @param breakdown - Per-category breakdown data
 * @returns Array of weak category names
 */
export function analyzeWeaknesses(
  breakdown: CategoryBreakdownItem[]
): string[] {
  return breakdown
    .filter((item) => item.percentage < 60)
    .map((item) => item.category);
}

/**
 * Generate course recommendations based on weak areas.
 * Matches weak categories to available courses.
 * @param weaknesses - Array of weak category names
 * @param availableCourses - All available courses
 * @returns Array of recommended course objects with reason
 */
export function generateRecommendations(
  weaknesses: string[],
  availableCourses: CourseData[]
): Array<{ course: CourseData; reason: string }> {
  if (weaknesses.length === 0) return [];

  const weakSet = new Set(weaknesses.map((w) => w.toLowerCase()));
  const recommendations: Array<{ course: CourseData; reason: string }> = [];
  const seenCourseIds = new Set<string>();

  for (const weakness of weaknesses) {
    const matchingCourses = availableCourses.filter((c) => {
      return (
        c.category.toLowerCase() === weakness.toLowerCase() ||
        c.title.toLowerCase().includes(weakness.toLowerCase()) ||
        c.description.toLowerCase().includes(weakness.toLowerCase())
      );
    });

    for (const course of matchingCourses) {
      if (!seenCourseIds.has(course.id)) {
        seenCourseIds.add(course.id);
        recommendations.push({
          course,
          reason: `Improve your ${weakness} skills`,
        });
      }
    }
  }

  return recommendations;
}

/**
 * Calculate the current study streak (consecutive days with activity).
 * @param attempts - Array of attempt dates (Date objects or ISO strings)
 * @returns Streak info with current streak, longest streak, and last study date
 */
export function calculateStudyStreak(
  attempts: Array<Date | string>
): StudyStreak {
  if (attempts.length === 0) {
    return { current: 0, longest: 0, lastStudyDate: null };
  }

  // Get unique dates (YYYY-MM-DD)
  const uniqueDates = new Set<string>();
  for (const a of attempts) {
    const d = new Date(a);
    uniqueDates.add(d.toISOString().slice(0, 10));
  }

  const sortedDates = Array.from(uniqueDates)
    .map((d) => new Date(d + 'T00:00:00'))
    .sort((a, b) => b.getTime() - a.getTime());

  // Check if today or yesterday was a study day
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastStudy = sortedDates[0];
  const isRecentStreak =
    lastStudy.getTime() === today.getTime() ||
    lastStudy.getTime() === yesterday.getTime();

  if (!isRecentStreak) {
    // Calculate longest from history
    let longest = 1;
    let current = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const diffDays = Math.round(
        (sortedDates[i - 1].getTime() - sortedDates[i].getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (diffDays === 1) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 1;
      }
    }
    return { current: 0, longest, lastStudyDate: lastStudy };
  }

  // Calculate current and longest streak
  let currentStreak = 1;
  let longestStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const diffDays = Math.round(
      (sortedDates[i - 1].getTime() - sortedDates[i].getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return {
    current: currentStreak,
    longest: longestStreak,
    lastStudyDate: lastStudy,
  };
}

/**
 * Get the next milestone to achieve based on current progress.
 * @param currentProgress - Current overall progress percentage (0-100)
 * @returns The next milestone to reach
 */
export function getNextMilestone(currentProgress: number): Milestone {
  const milestones = [
    { name: 'Premier pas', target: 10 },
    { name: 'Apprenti engagé', target: 25 },
    { name: 'Étudiant assidu', target: 50 },
    { name: 'Expert en formation', target: 75 },
    { name: 'Prêt pour l\'examen', target: 90 },
    { name: 'Maîtrise totale', target: 100 },
  ];

  const next = milestones.find((m) => currentProgress < m.target);
  if (!next) {
    return {
      name: 'Maîtrise totale',
      target: 100,
      current: currentProgress,
      progress: 100,
      achieved: true,
    };
  }

  return {
    name: next.name,
    target: next.target,
    current: currentProgress,
    progress: Math.round((currentProgress / next.target) * 100),
    achieved: false,
  };
}

/**
 * Get per-category progress from category breakdown.
 * @param breakdown - Per-category breakdown data
 * @returns Map of category name to progress percentage
 */
export function getProgressByCategory(
  breakdown: CategoryBreakdownItem[]
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const item of breakdown) {
    result[item.category] = item.percentage;
  }
  return result;
}

/**
 * Generate a weekly report summary from study statistics.
 * @param stats - Weekly study statistics
 * @returns Weekly report with key metrics
 */
export function generateWeeklyReport(stats: {
  totalStudyTime: number;
  quizzesTaken: number;
  avgScore: number;
  coursesProgress: number;
 strongAreas: string[];
  weakAreas: string[];
}): WeeklyReport {
  let recommendation: string;

  if (stats.weakAreas.length > 3) {
    recommendation =
      'Focus on your weakest areas first. Try taking adaptive quizzes targeting priority, highway, and regulation categories.';
  } else if (stats.avgScore < 60) {
    recommendation =
      'Review course materials before taking more quizzes. Focus on understanding concepts rather than memorization.';
  } else if (stats.avgScore >= 80) {
    recommendation =
      'Excellent progress! Consider taking a mock exam to test your readiness for the official exam.';
  } else {
    recommendation =
      'Good progress! Continue studying regularly and focus on the areas where you scored below 70%.';
  }

  return {
    totalStudyTime: stats.totalStudyTime,
    quizzesTaken: stats.quizzesTaken,
    avgScore: stats.avgScore,
    coursesProgress: stats.coursesProgress,
    strongAreas: stats.strongAreas,
    weakAreas: stats.weakAreas,
    recommendation,
  };
}

/**
 * Estimate the time to completion based on remaining modules.
 * @param remainingModules - Number of modules left to complete
 * @param avgTimePerModule - Average time per module in minutes
 * @returns Estimated minutes remaining
 */
export function estimateTimeToCompletion(
  remainingModules: number,
  avgTimePerModule: number
): number {
  return remainingModules * avgTimePerModule;
}

/**
 * Get a human-readable skill level label based on a numeric level (0-100).
 * @param level - Skill level from 0 to 100
 * @returns French skill level label
 */
export function getSkillLevel(level: number): string {
  if (level >= 90) return 'Expert';
  if (level >= 70) return 'Avancé';
  if (level >= 40) return 'Intermédiaire';
  return 'Débutant';
}

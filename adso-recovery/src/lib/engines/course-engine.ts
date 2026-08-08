// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// ADSO — Course Engine
// Course management, module completion, and progression tracking.
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

import type { CourseData, CourseModuleData } from './types';

/**
 * Parse a JSON string field from course/module data into a typed array.
 * Falls back to an empty array if the value is invalid or null.
 */
function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

/**
 * Filter courses by category.
 * @param courses - Array of course data
 * @param category - Category to filter by (e.g., 'theory', 'practice')
 * @returns Filtered courses matching the category
 */
export function getCoursesByCategory(
  courses: CourseData[],
  category: string
): CourseData[] {
  const normalized = category.trim().toLowerCase();
  return courses.filter((c) => c.category.toLowerCase() === normalized);
}

/**
 * Filter courses by difficulty level.
 * @param courses - Array of course data
 * @param level - Level to filter by ('beginner', 'intermediate', 'advanced')
 * @returns Filtered courses matching the level
 */
export function getCoursesByLevel(
  courses: CourseData[],
  level: string
): CourseData[] {
  const normalized = level.trim().toLowerCase();
  return courses.filter((c) => c.level.toLowerCase() === normalized);
}

/**
 * Filter courses by associated license code.
 * @param courses - Array of course data
 * @param licenseCode - License code to filter by (case-insensitive)
 * @returns Filtered courses associated with the license
 */
export function getCoursesByLicense(
  courses: CourseData[],
  licenseCode: string
): CourseData[] {
  const normalized = licenseCode.toUpperCase().trim();
  return courses.filter(
    (c) => c.licenseCode && c.licenseCode.toUpperCase() === normalized
  );
}

/**
 * Calculate the completion percentage of a set of modules.
 * @param modules - All modules for a course
 * @param completedIds - Array of completed module IDs
 * @returns Completion percentage from 0 to 100
 */
export function calculateProgress(
  modules: CourseModuleData[],
  completedIds: string[]
): number {
  if (modules.length === 0) return 0;
  const completedSet = new Set(completedIds);
  const completedCount = modules.filter((m) => completedSet.has(m.id)).length;
  return Math.round((completedCount / modules.length) * 100);
}

/**
 * Get the next uncompleted module in order.
 * @param modules - All modules for a course
 * @param completedIds - Array of completed module IDs
 * @returns The next module to complete, or undefined if all done
 */
export function getNextModule(
  modules: CourseModuleData[],
  completedIds: string[]
): CourseModuleData | undefined {
  const sorted = sortModulesByOrder(modules);
  const completedSet = new Set(completedIds);
  return sorted.find((m) => !completedSet.has(m.id));
}

/**
 * Check if all modules in a course have been completed.
 * @param modules - All modules for a course
 * @param completedIds - Array of completed module IDs
 * @returns True if every module has been completed
 */
export function isCourseComplete(
  modules: CourseModuleData[],
  completedIds: string[]
): boolean {
  if (modules.length === 0) return false;
  const completedSet = new Set(completedIds);
  return modules.every((m) => completedSet.has(m.id));
}

/**
 * Get the estimated remaining time in minutes for incomplete modules.
 * @param modules - All modules for a course
 * @param completedIds - Array of completed module IDs
 * @returns Total remaining duration in minutes
 */
export function getEstimatedTime(
  modules: CourseModuleData[],
  completedIds: string[]
): number {
  const completedSet = new Set(completedIds);
  return modules
    .filter((m) => !completedSet.has(m.id))
    .reduce((sum, m) => sum + m.duration, 0);
}

/**
 * Sort modules by their order field.
 * Returns a new array; does not mutate the input.
 * @param modules - Array of module data
 * @returns New array sorted by order
 */
export function sortModulesByOrder(modules: CourseModuleData[]): CourseModuleData[] {
  return [...modules].sort((a, b) => a.order - b.order);
}

/**
 * Parse the learning objectives of a module.
 * @param module - Module data
 * @returns Array of learning objective strings
 */
export function getModuleObjectives(module: CourseModuleData): string[] {
  return parseJsonArray(module.objectives);
}

/**
 * Parse the tips of a module.
 * @param module - Module data
 * @returns Array of tip strings
 */
export function getModuleTips(module: CourseModuleData): string[] {
  return parseJsonArray(module.tips);
}

/**
 * Parse the common mistakes of a module.
 * @param module - Module data
 * @returns Array of common mistake strings
 */
export function getModuleMistakes(module: CourseModuleData): string[] {
  return parseJsonArray(module.commonMistakes);
}

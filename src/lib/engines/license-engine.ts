// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// ADSO — License Engine
// License eligibility, prerequisites, and progression paths.
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

import type { LicenseCategoryData } from './types';

/**
 * Parse a JSON string field from license data into a typed array.
 * Falls back to an empty array if the value is invalid.
 */
function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

/**
 * Filter license categories by their type (motorcycle, automobile, heavy, special).
 * @param licenses - Array of license data
 * @param category - Category type to filter by
 * @returns Filtered licenses matching the category
 */
export function getLicensesByCategory(
  licenses: LicenseCategoryData[],
  category: string
): LicenseCategoryData[] {
  const normalized = category.trim().toLowerCase();
  return licenses.filter((l) => l.category.toLowerCase() === normalized);
}

/**
 * Find a specific license category by its code (e.g., 'B', 'A2', 'C1').
 * @param licenses - Array of license data
 * @param code - License code to find (case-insensitive)
 * @returns The matching license or undefined
 */
export function getLicenseByCode(
  licenses: LicenseCategoryData[],
  code: string
): LicenseCategoryData | undefined {
  return licenses.find((l) => l.code.toUpperCase() === code.toUpperCase().trim());
}

/**
 * Check if a user is eligible for a license based on age and currently held licenses.
 * Returns an object with eligibility status and reasons.
 * @param license - License to check eligibility for
 * @param userAge - User's current age in years
 * @param heldLicenses - Array of license codes the user already holds
 * @returns Eligibility result with `eligible` flag and `reasons` array
 */
export function checkEligibility(
  license: LicenseCategoryData,
  userAge: number,
  heldLicenses: string[]
): { eligible: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const heldUpper = heldLicenses.map((c) => c.toUpperCase());

  // Check age requirement
  const requiredAge = getAgeRequired(license, heldUpper);
  if (userAge < requiredAge) {
    reasons.push(
      `Minimum age required: ${requiredAge} years (you are ${userAge})`
    );
  }

  // Check prerequisites
  const prerequisites = parseJsonArray(license.prerequisites);
  for (const prereq of prerequisites) {
    if (!heldUpper.includes(prereq.toUpperCase())) {
      reasons.push(
        `Prerequisite license ${prereq} is required but not held`
      );
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
}

/**
 * Get the progression path from a currently held license to a target license.
 * Returns an ordered array of license codes to obtain, or empty if unreachable.
 * @param licenses - Array of all license data
 * @param fromCode - Currently held license code
 * @returns Ordered array of license codes to obtain (excluding the starting license)
 */
export function getProgressionPath(
  licenses: LicenseCategoryData[],
  fromCode: string
): string[] {
  const from = fromCode.toUpperCase().trim();
  const licenseMap = new Map<string, LicenseCategoryData>();
  for (const l of licenses) {
    licenseMap.set(l.code.toUpperCase(), l);
  }

  // BFS to find which licenses have `fromCode` as a prerequisite
  const path: string[] = [];
  let current = from;
  const visited = new Set<string>([current]);

  // Find direct next steps
  const findNextSteps = (code: string): string[] => {
    return licenses
      .filter((l) => {
        const prereqs = parseJsonArray(l.prerequisites);
        return (
          prereqs.map((p) => p.toUpperCase()).includes(code.toUpperCase()) &&
          !visited.has(l.code.toUpperCase())
        );
      })
      .map((l) => l.code.toUpperCase());
  };

  // Simple one-level and two-level path resolution
  const nextSteps = findNextSteps(current);
  for (const step of nextSteps) {
    path.push(step);
    visited.add(step);
  }

  // For each new step, find further steps
  for (const step of [...path]) {
    const further = findNextSteps(step);
    for (const f of further) {
      path.push(f);
      visited.add(f);
    }
  }

  return path;
}

/**
 * Get the list of prerequisite license codes for a license.
 * Parses the JSON string field into an array of strings.
 * @param license - License data
 * @returns Array of prerequisite license codes
 */
export function getPrerequisites(license: LicenseCategoryData): string[] {
  return parseJsonArray(license.prerequisites);
}

/**
 * Get the list of authorized vehicle types for a license.
 * Parses the JSON string field into an array of strings.
 * @param license - License data
 * @returns Array of authorized vehicle type descriptions
 */
export function getVehicles(license: LicenseCategoryData): string[] {
  return parseJsonArray(license.vehicles);
}

/**
 * Get the list of evaluation criteria for a license exam.
 * Parses the JSON string field into an array of strings.
 * @param license - License data
 * @returns Array of evaluation criteria descriptions
 */
export function getEvaluationCriteria(license: LicenseCategoryData): string[] {
  return parseJsonArray(license.evaluationCriteria);
}

/**
 * Get the minimum age required to obtain a license.
 * If the user holds a qualifying lower license, the reduced age (minAgeHeld) applies.
 * @param license - License data
 * @param heldLicenses - Array of currently held license codes
 * @returns Minimum required age
 */
export function getAgeRequired(
  license: LicenseCategoryData,
  heldLicenses: string[] = []
): number {
  // If the user already holds a prerequisite, they may qualify for the reduced age
  const prerequisites = parseJsonArray(license.prerequisites);
  const holdsPrereq = heldLicenses.some((held) =>
    prerequisites.map((p) => p.toUpperCase()).includes(held.toUpperCase())
  );

  if (holdsPrereq && license.minAgeHeld !== null) {
    return license.minAgeHeld;
  }

  return license.minAge;
}

/**
 * Get all unique license category types present in the data.
 * @param licenses - Array of license data
 * @returns Sorted array of unique category types
 */
export function getAllCategories(licenses: LicenseCategoryData[]): string[] {
  const set = new Set(licenses.map((l) => l.category));
  return Array.from(set).sort();
}

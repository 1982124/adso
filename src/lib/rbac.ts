/**
 * ADSO RBAC — Role-Based Access Control
 *
 * 8 roles ordered by privilege level (lowest → highest):
 *   driver, student, mechanic, insurer, fleet_manager, instructor, admin, super_admin
 *
 * Hierarchy: each role inherits all permissions of the roles below it.
 */

export type ADSORole =
  | 'driver'
  | 'student'
  | 'mechanic'
  | 'insurer'
  | 'fleet_manager'
  | 'instructor'
  | 'admin'
  | 'super_admin';

/** Role hierarchy — index = privilege level */
const ROLE_HIERARCHY: ADSORole[] = [
  'driver',
  'student',
  'mechanic',
  'insurer',
  'fleet_manager',
  'instructor',
  'admin',
  'super_admin',
];

/** Validate that a string is a known role */
export function isValidRole(role: string): role is ADSORole {
  return ROLE_HIERARCHY.includes(role as ADSORole);
}

/** Get the numeric privilege level (0 = lowest, 7 = highest) */
export function roleLevel(role: ADSORole): number {
  return ROLE_HIERARCHY.indexOf(role);
}

/** Check if a user's role meets a minimum required level */
export function hasMinRole(userRole: string, minRole: ADSORole): boolean {
  if (!isValidRole(userRole)) return false;
  return roleLevel(userRole) >= roleLevel(minRole);
}

/** Check if a user's role is exactly one of the allowed roles */
export function hasExactRole(userRole: string, allowed: ADSORole[]): boolean {
  return allowed.includes(userRole as ADSORole);
}

/** All role labels in French */
export const ROLE_LABELS: Record<ADSORole, string> = {
  super_admin: 'Super Administrateur',
  admin: 'Administrateur',
  instructor: 'Instructeur',
  mechanic: 'Mécanicien',
  insurer: 'Assureur',
  fleet_manager: 'Gestionnaire de flotte',
  student: 'Élève',
  driver: 'Conducteur',
};

// ═══════════════════════════════════════════════════════════
// Permission definitions per resource
// ═══════════════════════════════════════════════════════════

export const RESOURCE_PERMISSIONS: Record<string, ADSORole> = {
  // Read — anyone authenticated
  'read:profile':      'driver',
  'read:courses':      'driver',
  'read:quiz':         'driver',
  'read:road_signs':   'driver',
  'read:leaderboard':  'driver',
  'read:analytics':    'driver',

  // Write — student+
  'write:quiz':        'student',
  'write:chat':        'student',
  'write:enrollment':  'student',
  'write:progress':    'student',

  // Instructor
  'write:exam':        'instructor',
  'write:course':      'instructor',
  'read:all_students': 'instructor',

  // Mechanic
  'write:diagnostic':  'mechanic',
  'read:diagnostics':  'mechanic',

  // Insurer
  'write:claim':       'insurer',
  'write:policy':       'insurer',
  'read:insurance':     'insurer',

  // Fleet manager
  'write:fleet':       'fleet_manager',
  'write:maintenance': 'fleet_manager',
  'write:fuel':        'fleet_manager',

  // Admin
  'write:user':        'admin',
  'write:seed':        'admin',
  'read:audit':        'admin',
  'write:organization':'admin',

  // Super admin only
  'write:role':        'super_admin',
  'write:system':      'super_admin',
  'read:all_data':     'super_admin',
};

/**
 * Check if a user role has permission for a resource.
 */
export function hasPermission(userRole: string, resource: string): boolean {
  const minRole = RESOURCE_PERMISSIONS[resource];
  if (!minRole) return false;
  return hasMinRole(userRole, minRole);
}

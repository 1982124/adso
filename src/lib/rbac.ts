/**
 * ADSO authorization model.
 *
 * Business roles are intentionally NOT one global privilege ladder.
 * A mechanic must not inherit insurer/fleet permissions, and an insurer
 * must not inherit mechanic permissions simply because the role is ranked
 * higher in an array.
 *
 * Administrative roles remain the global override layer; business roles
 * inherit only the capabilities that are explicitly defined for them.
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

const ALL_ROLES: ADSORole[] = [
  'driver',
  'student',
  'mechanic',
  'insurer',
  'fleet_manager',
  'instructor',
  'admin',
  'super_admin',
];

/** Explicit capability inheritance. Never infer business permissions from role ordering. */
const ROLE_INHERITANCE: Record<ADSORole, readonly ADSORole[]> = {
  driver: ['driver'],
  student: ['student', 'driver'],
  instructor: ['instructor', 'student', 'driver'],
  mechanic: ['mechanic', 'driver'],
  insurer: ['insurer', 'driver'],
  fleet_manager: ['fleet_manager', 'driver'],
  admin: ALL_ROLES,
  super_admin: ALL_ROLES,
};

export function isValidRole(role: string): role is ADSORole {
  return ALL_ROLES.includes(role as ADSORole);
}

/** Retained for compatibility. Business-role ordering is no longer security-sensitive. */
export function roleLevel(role: ADSORole): number {
  if (role === 'super_admin') return 7;
  if (role === 'admin') return 6;
  if (role === 'instructor') return 5;
  if (role === 'student') return 2;
  if (role === 'driver') return 1;
  return 3;
}

/** Check explicit capability inheritance, with admin/super-admin as administrative overrides. */
export function hasMinRole(userRole: string, requiredRole: ADSORole): boolean {
  if (!isValidRole(userRole) || !isValidRole(requiredRole)) return false;
  return ROLE_INHERITANCE[userRole].includes(requiredRole);
}

export function hasExactRole(userRole: string, allowed: ADSORole[]): boolean {
  return allowed.includes(userRole as ADSORole);
}

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

/** Minimum explicit role required for each capability. */
export const RESOURCE_PERMISSIONS: Record<string, ADSORole> = {
  'read:profile': 'driver',
  'read:courses': 'driver',
  'read:quiz': 'driver',
  'read:road_signs': 'driver',
  'read:leaderboard': 'driver',
  'read:analytics': 'driver',

  'write:quiz': 'student',
  'write:chat': 'student',
  'write:enrollment': 'student',
  'write:progress': 'student',

  'write:exam': 'instructor',
  'write:course': 'instructor',
  'read:all_students': 'instructor',

  'write:diagnostic': 'mechanic',
  'read:diagnostics': 'mechanic',

  'write:claim': 'insurer',
  'write:policy': 'insurer',
  'read:insurance': 'insurer',

  'write:fleet': 'fleet_manager',
  'write:maintenance': 'fleet_manager',
  'write:fuel': 'fleet_manager',

  'write:user': 'admin',
  'write:seed': 'admin',
  'read:audit': 'admin',
  'write:organization': 'admin',

  'write:role': 'super_admin',
  'write:system': 'super_admin',
  'read:all_data': 'super_admin',
};

export function hasPermission(userRole: string, resource: string): boolean {
  const requiredRole = RESOURCE_PERMISSIONS[resource];
  if (!requiredRole) return false;
  return hasMinRole(userRole, requiredRole);
}

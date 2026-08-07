/**
 * LOOK VISION v2.4 - Firebase Custom Claims & Role Based Access Control (RBAC) Utility
 * 
 * Supported Custom Claims & Roles:
 * - user: Standard sartorialist platform member
 * - creator: Fashion designer & digital atelier creator
 * - curator: Lookbook editor & gallery curator
 * - admin: System administrator with telemetry & platform control
 * - super_admin: Full root platform governance & security administrator
 */

import { UserRole } from '../identity/userIdentityTypes';

export const VALID_USER_ROLES: UserRole[] = ['user', 'creator', 'curator', 'admin', 'super_admin'];

export interface CustomClaimsPayload {
  role?: UserRole;
  admin?: boolean;
  super_admin?: boolean;
  creator?: boolean;
  curator?: boolean;
  user?: boolean;
  [key: string]: any;
}

/**
 * Parses Firebase ID Token Custom Claims and returns the normalized UserRole.
 */
export function parseUserRoleFromClaims(
  claims: CustomClaimsPayload | null | undefined,
  fallbackRole: UserRole = 'user'
): UserRole {
  if (!claims) return fallbackRole;

  if (claims.role && VALID_USER_ROLES.includes(claims.role as UserRole)) {
    return claims.role as UserRole;
  }

  // Boolean claim flag fallbacks
  if (claims.super_admin === true) return 'super_admin';
  if (claims.admin === true) return 'admin';
  if (claims.curator === true) return 'curator';
  if (claims.creator === true) return 'creator';

  return fallbackRole;
}

/**
 * Helper to evaluate admin access. Admin access is granted for 'admin' and 'super_admin' roles.
 */
export function isAdminRole(role: UserRole | string | undefined | null): boolean {
  return role === 'admin' || role === 'super_admin';
}

/**
 * Helper to evaluate creator permissions.
 */
export function isCreatorRole(role: UserRole | string | undefined | null): boolean {
  return role === 'creator' || role === 'curator' || role === 'admin' || role === 'super_admin';
}

/**
 * Helper to evaluate curator permissions.
 */
export function isCuratorRole(role: UserRole | string | undefined | null): boolean {
  return role === 'curator' || role === 'admin' || role === 'super_admin';
}

/**
 * Helper to evaluate super admin permissions.
 */
export function isSuperAdminRole(role: UserRole | string | undefined | null): boolean {
  return role === 'super_admin';
}

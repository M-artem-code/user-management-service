import { RoleEnumType } from '../../generated/prisma/enums';

/**
 * Single source of truth for user roles, derived from the Prisma schema enum.
 * Use ROLES.admin / ROLES.user instead of string literals across the app.
 */
export const ROLES = RoleEnumType;

export type Role = RoleEnumType;

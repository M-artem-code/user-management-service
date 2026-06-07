import { Role } from '../constants/roles';

/** Minimal authenticated user context used by authorization checks. */
export type CurrentUser = { id: string; role: Role };

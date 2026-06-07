const UNIT_MS: Record<string, number> = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

/**
 * Parse a short duration string (e.g. "15m", "7d", "30s", "500ms") into
 * milliseconds. Falls back to `fallbackMs` for empty/invalid input so cookie
 * TTLs can be derived from the same env vars used for JWT expiry.
 */
export const parseDurationToMs = (
  value: string | undefined,
  fallbackMs: number
): number => {
  if (!value) return fallbackMs;

  const match = /^(\d+)\s*(ms|s|m|h|d)?$/.exec(value.trim());
  if (!match) return fallbackMs;

  const amount = Number(match[1]);
  const unit = match[2] ?? 'ms';

  return amount * UNIT_MS[unit];
};

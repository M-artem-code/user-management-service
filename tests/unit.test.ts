import { describe, expect, it } from 'vitest';
import { parseDurationToMs } from '../src/utils/duration';
import validateEnv from '../src/utils/validateEnv';

describe('parseDurationToMs', () => {
  it('parses supported units', () => {
    expect(parseDurationToMs('500ms', 0)).toBe(500);
    expect(parseDurationToMs('30s', 0)).toBe(30_000);
    expect(parseDurationToMs('15m', 0)).toBe(15 * 60_000);
    expect(parseDurationToMs('2h', 0)).toBe(2 * 60 * 60_000);
    expect(parseDurationToMs('7d', 0)).toBe(7 * 24 * 60 * 60_000);
  });

  it('falls back for missing or invalid input', () => {
    expect(parseDurationToMs(undefined, 123)).toBe(123);
    expect(parseDurationToMs('', 123)).toBe(123);
    expect(parseDurationToMs('not-a-duration', 123)).toBe(123);
  });
});

describe('validateEnv', () => {
  it('passes with the test environment and returns typed env', () => {
    const env = validateEnv();
    expect(env.DATABASE_URL).toBeDefined();
    expect(env.NODE_ENV).toBe('test');
  });

  it('throws a descriptive error when a secret is too short', () => {
    const original = process.env.JWT_ACCESS_TOKEN_SECRET;
    process.env.JWT_ACCESS_TOKEN_SECRET = 'too-short';
    try {
      expect(() => validateEnv()).toThrowError(/JWT_ACCESS_TOKEN_SECRET/);
    } finally {
      process.env.JWT_ACCESS_TOKEN_SECRET = original;
    }
  });
});

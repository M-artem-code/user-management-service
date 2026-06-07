// src/utils/validateEnv.ts
export default function validateEnv() {
  const required = [
    'DATABASE_URL',
    'JWT_ACCESS_TOKEN_SECRET',
    'JWT_REFRESH_TOKEN_SECRET',
  ];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }
}

import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().regex(/^\d+$/, 'PORT must be a number').optional(),
  JWT_ACCESS_TOKEN_SECRET: z
    .string()
    .min(32, 'JWT_ACCESS_TOKEN_SECRET must be at least 32 characters'),
  JWT_REFRESH_TOKEN_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_TOKEN_SECRET must be at least 32 characters'),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().optional(),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string().optional(),
  CLIENT_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

export default function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment variables:\n${details}`);
  }

  return result.data;
}

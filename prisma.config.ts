import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

// override: true so values from .env always win over any stale/empty
// DATABASE_URL already present in the shell/system environment (dotenv does not
// override existing env vars by default). Mirrors src/load-env.ts.
dotenv.config({ override: true });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Read directly from process.env (populated by dotenv) instead of prisma's
    // env() helper, which throws at config-load time when DATABASE_URL is unset.
    // This keeps `prisma generate` (postinstall / CI / fresh clones) working
    // without a database, while migrate/runtime still pick up the real value.
    url: process.env.DATABASE_URL ?? '',
  },
});

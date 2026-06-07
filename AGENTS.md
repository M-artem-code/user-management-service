# AGENTS.md

## Cursor Cloud specific instructions

### Product overview

Single backend service: **User Management Service** — Express/TypeScript REST API for user registration, JWT auth, user listing, and blocking. No frontend in this repo.

### Services

| Service | Port | Notes |
|---------|------|-------|
| PostgreSQL | 5432 | Required. The committed `.env` points at a remote Prisma-hosted DB; no `docker-compose` in repo. For a local DB, run Postgres yourself and set `DATABASE_URL` in `.env`. |
| API (dev) | 8000 | `npm run dev` — uses `tsx watch`, hot reload |

### Startup (after dependencies are installed)

```bash
cp .env.example .env   # only if .env is missing; fill JWT_* secrets (32+ chars)
npx prisma generate
npm run db:deploy      # non-interactive; prefer over `db:migrate` in automation
npm run dev
```

Health: `GET http://localhost:8000/api/health`

### Lint / test / build

- **Lint:** not configured (no ESLint/Prettier scripts).
- **Tests:** not configured (no test runner or `npm test` script).
- **Build:** `npm run build` runs `tsc`, but `typescript` is not in `package.json` devDependencies and `tsconfig.json` has `"noEmit": true`, so production build is not set up. Use `npm run dev` for development.

### Gotchas

- `npm run db:migrate` (`prisma migrate dev`) is interactive; use `npm run db:deploy` in non-interactive/CI environments.
- Prisma client is generated to `generated/prisma` (gitignored); run `npx prisma generate` after `npm install` if the folder is missing.
- Required env vars at startup: `DATABASE_URL`, `JWT_ACCESS_TOKEN_SECRET`, `JWT_REFRESH_TOKEN_SECRET`.
- Node.js 18+ required (Prisma 7 peer dependency).

### Hello-world API check

```bash
curl -s http://localhost:8000/api/health

curl -s -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"lastName":"Test","firstName":"Dev","birthDate":"1990-05-15","email":"user@example.com","password":"password123","passwordConfirm":"password123"}'

curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

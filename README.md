# User Management Service

REST API для работы с пользователями: регистрация, авторизация (JWT), просмотр и блокировка.

## Стек

- Node.js, Express, TypeScript
- PostgreSQL, Prisma ORM
- Zod (валидация), bcrypt (пароли), JWT (access + refresh)

## Architecture

Проект разделён на слои:

```
src/
  routes/           # маршрутизация, Zod-валидация, middleware
  controllers/      # HTTP-адаптеры (req/res), без бизнес-логики
  services/         # use cases: register, login, block, права доступа
  repositories/     # Prisma CRUD, работа с БД
  constants/        # select-поля, настройки cookies, роли (single source)
  utils/            # JWT, пароли, cookies, permissions, env, duration
  schemas/          # Zod-схемы входных данных
  middleware/       # deserializeUser, requireUser, restrictTo, errorHandler
  types/            # общие типы (CurrentUser, express augmentation)
tests/              # Vitest + Supertest (без реальной БД)
```

| Слой             | Ответственность                                        |
| ---------------- | ------------------------------------------------------ |
| **Controllers**  | Вызов service, формирование HTTP-ответа                |
| **Services**     | Бизнес-правила ТЗ (auth, права admin/self, блокировка) |
| **Repositories** | Персистентность (изоляция Prisma)                      |
| **Middleware**   | Аутентификация запроса, роли                           |

## Быстрый старт

```bash
npm install
cp .env.example .env
# заполните DATABASE_URL и JWT_* в .env

# вариант с Docker для локального Postgres:
docker compose up -d db

npm run db:migrate
npm run dev
```

Сервер по умолчанию: `http://localhost:8000`

> Переменные окружения проверяются при старте через Zod (`src/utils/validateEnv.ts`):
> при отсутствии/некорректности значений сервер не запустится с понятной ошибкой.

## Переменные окружения

| Переменная                     | Описание                                         |
| ------------------------------ | ------------------------------------------------ |
| `DATABASE_URL`                 | PostgreSQL connection string                     |
| `PORT`                         | Порт сервера (по умолчанию 3000, в примере 8000) |
| `NODE_ENV`                     | `development` / `production`                     |
| `JWT_ACCESS_TOKEN_SECRET`      | Секрет access token (мин. 32 символа)            |
| `JWT_REFRESH_TOKEN_SECRET`     | Секрет refresh token                             |
| `JWT_ACCESS_TOKEN_EXPIRES_IN`  | TTL access token (например `15m`)                |
| `JWT_REFRESH_TOKEN_EXPIRES_IN` | TTL refresh token (например `7d`)                |
| `CLIENT_URL`                   | Origin для CORS (с `credentials: true`)          |

## Скрипты

| Команда                 | Описание                      |
| ----------------------- | ----------------------------- |
| `npm run dev`           | Запуск в режиме разработки    |
| `npm run build`         | Сборка TypeScript (в `dist/`) |
| `npm start`             | Запуск production-сборки      |
| `npm run typecheck`     | Проверка типов без эмита      |
| `npm run lint`          | ESLint                        |
| `npm run lint:fix`      | ESLint с автоисправлением     |
| `npm run format`        | Prettier (запись)             |
| `npm run format:check`  | Prettier (проверка)           |
| `npm test`              | Тесты (Vitest)                |
| `npm run test:watch`    | Тесты в watch-режиме          |
| `npm run test:coverage` | Тесты с покрытием             |
| `npm run db:migrate`    | Миграции (dev)                |
| `npm run db:deploy`     | Миграции (production)         |

## Тестирование и качество

- **Тесты:** Vitest + Supertest. Покрывают auth-флоу, матрицу прав, валидацию,
  пагинацию и маппинг ошибок. Работают без реальной БД (in-memory мок репозитория),
  поэтому стабильно гоняются локально и в CI.
- **CI:** GitHub Actions (`.github/workflows/ci.yml`) — lint, format:check,
  typecheck, test, build на каждый push/PR.
- **Ошибки API:** единый формат ответа через `errorHandler` (Zod / Prisma /
  AppError / неизвестные ошибки), внутренние детали не утекают клиенту.

## API

### Auth (без токена)

| Метод  | Путь                 | Описание                                         |
| ------ | -------------------- | ------------------------------------------------ |
| `POST` | `/api/auth/register` | Регистрация                                      |
| `POST` | `/api/auth/login`    | Вход (JWT + cookies)                             |
| `GET`  | `/api/auth/refresh`  | Обновление access token (cookie `refresh_token`) |

### Auth (с токеном)

| Метод | Путь               | Описание |
| ----- | ------------------ | -------- |
| `GET` | `/api/auth/logout` | Выход    |

### Users (Bearer или cookie `access_token`)

| Метод   | Путь                   | Доступ                       |
| ------- | ---------------------- | ---------------------------- |
| `GET`   | `/api/users`           | Только `admin`               |
| `GET`   | `/api/users/:id`       | `admin` или сам пользователь |
| `PATCH` | `/api/users/:id/block` | `admin` или сам пользователь |

`GET /api/users` поддерживает пагинацию: `?page=1&limit=20` (по умолчанию
`page=1`, `limit=20`, максимум `limit=100`). В ответе — блок `pagination`
с `page`, `limit`, `total`, `totalPages`. `:id` валидируется как UUID.

### Прочее

| Метод | Путь          | Описание     |
| ----- | ------------- | ------------ |
| `GET` | `/api/health` | Health check |

## Авторизация

После `POST /api/auth/login` в ответе приходит `access_token`. Передавайте его:

- заголовок: `Authorization: Bearer <access_token>`
- или cookie `access_token` (устанавливается при login)

Refresh: `GET /api/auth/refresh` с cookie `refresh_token`.

## Пример register

```json
POST /api/auth/register
{
  "lastName": "Иванов",
  "firstName": "Иван",
  "middleName": "Иванович",
  "birthDate": "1990-05-15",
  "email": "user@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

> Роль всегда назначается сервером (`user`). Передать `role` при регистрации нельзя —
> это закрывает возможность привилегированной эскалации.

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
  constants/        # select-поля, настройки cookies
  utils/            # JWT, пароли, cookies, permissions
  schemas/          # Zod-схемы входных данных
  middleware/       # deserializeUser, requireUser, restrictTo
```

| Слой | Ответственность |
|------|-----------------|
| **Controllers** | Вызов service, формирование HTTP-ответа |
| **Services** | Бизнес-правила ТЗ (auth, права admin/self, блокировка) |
| **Repositories** | Персистентность (изоляция Prisma) |
| **Middleware** | Аутентификация запроса, роли |

## Быстрый старт

```bash
npm install
cp .env.example .env
# заполните DATABASE_URL и JWT_* в .env
npm run db:migrate
npm run dev
```

Сервер по умолчанию: `http://localhost:8000`

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Порт сервера (по умолчанию 3000, в примере 8000) |
| `NODE_ENV` | `development` / `production` |
| `JWT_ACCESS_TOKEN_SECRET` | Секрет access token (мин. 32 символа) |
| `JWT_REFRESH_TOKEN_SECRET` | Секрет refresh token |
| `JWT_ACCESS_TOKEN_EXPIRES_IN` | TTL access token (например `15m`) |
| `JWT_REFRESH_TOKEN_EXPIRES_IN` | TTL refresh token (например `7d`) |
| `CLIENT_URL` | Origin для CORS (с `credentials: true`) |

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск в режиме разработки |
| `npm run build` | Сборка TypeScript |
| `npm start` | Запуск production-сборки |
| `npm run db:migrate` | Миграции (dev) |
| `npm run db:deploy` | Миграции (production) |

## API

### Auth (без токена)

| Метод | Путь | Описание |
|-------|------|----------|
| `POST` | `/api/auth/register` | Регистрация |
| `POST` | `/api/auth/login` | Вход (JWT + cookies) |
| `GET` | `/api/auth/refresh` | Обновление access token (cookie `refresh_token`) |

### Auth (с токеном)

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/api/auth/logout` | Выход |

### Users (Bearer или cookie `access_token`)

| Метод | Путь | Доступ |
|-------|------|--------|
| `GET` | `/api/users` | Только `admin` |
| `GET` | `/api/users/:id` | `admin` или сам пользователь |
| `PATCH` | `/api/users/:id/block` | `admin` или сам пользователь |

### Прочее

| Метод | Путь | Описание |
|-------|------|----------|
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

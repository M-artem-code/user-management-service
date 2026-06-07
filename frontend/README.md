# User Management — Frontend

Современный адаптивный фронтенд для `user-management-service`, построенный по
методологии **Feature-Sliced Design (FSD)**.

## Стек

- **React 19** + **TypeScript** + **Vite**
- **React Router** — маршрутизация и guard'ы
- **TanStack Query** — серверное состояние и кеш
- **Zustand** — клиентское состояние (сессия, тема)
- **React Hook Form** + **Zod** — формы и валидация
- **Tailwind CSS v4** — стили, тёмная/светлая темы
- **axios** — HTTP-клиент с авто-refresh токена
- **sonner** — уведомления, **lucide-react** — иконки

## Архитектура (FSD)

Слои сверху вниз — модуль может импортировать только из слоёв **строго ниже**.
Каждый срез предоставляет публичный API через `index.ts`.

```
src/
  app/        # инициализация: провайдеры, роутер, guard'ы, глобальные стили
  pages/      # страницы: home, login, register, users, profile, not-found
  widgets/    # самостоятельные блоки: header, users-panel
  features/   # действия-фичи: auth/login, auth/register, auth/logout, user/block-user
  entities/   # бизнес-сущности: user, session
  shared/     # переиспользуемое: api, config, lib, ui-kit, types
```

Сегменты внутри срезов: `ui` (компоненты), `model` (состояние/логика),
`api` (запросы), `lib` (хелперы), `config` (константы).

### Ключевые решения

- **Сессия** (`entities/session`) хранит access-token и текущего пользователя в
  Zustand. При старте приложения выполняется `refresh` по cookie, затем
  загружается пользователь — сессия восстанавливается без повторного входа.
- **API-клиент** (`shared/api`) добавляет `Authorization: Bearer` и при `401`
  автоматически обновляет токен и повторяет запрос. Слой `shared` остаётся
  независимым: `session` регистрирует геттер токена и обработчик refresh.
- **Доменные типы** (`User`, `Role`) лежат в `shared/types`, чтобы срезы
  `user` и `session` могли их использовать без импортов между собой.
- **Доступ**: guard'ы `ProtectedRoute` / `AdminRoute` / `GuestRoute`.

## Быстрый старт

```bash
npm install
cp .env.example .env   # при необходимости поменяйте VITE_API_URL
npm run dev
```

Приложение поднимется на `http://localhost:3000` (совпадает с `CLIENT_URL`
бэкенда по умолчанию, чтобы работали CORS и cookies). Бэкенд должен быть запущен
на `http://localhost:8000`.

## Скрипты

| Команда                | Описание                      |
| ---------------------- | ----------------------------- |
| `npm run dev`          | Дев-сервер (порт 3000)        |
| `npm run build`        | Прод-сборка (`tsc -b` + Vite) |
| `npm run preview`      | Предпросмотр прод-сборки      |
| `npm run typecheck`    | Проверка типов                |
| `npm run lint`         | ESLint                        |
| `npm run format`       | Prettier (запись)             |
| `npm run format:check` | Prettier (проверка)           |

## Переменные окружения

| Переменная     | Описание                                   |
| -------------- | ------------------------------------------ |
| `VITE_API_URL` | Базовый URL API (по умолчанию `:8000/api`) |

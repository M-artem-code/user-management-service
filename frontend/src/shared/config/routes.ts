export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  users: '/users',
  user: (id: string) => `/users/${id}`,
  userPattern: '/users/:id',
  profile: '/profile',
} as const;

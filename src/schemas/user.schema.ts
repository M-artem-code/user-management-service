import { object, string, TypeOf } from 'zod';

export const registerUserSchema = object({
  body: object({
    lastName: string({ required_error: 'Last name is required' }),
    firstName: string({ required_error: 'First name is required' }),
    middleName: string().optional(),
    birthDate: string({ required_error: 'Birth date is required' }).refine(
      (val) => !isNaN(Date.parse(val)),
      {
        message: 'Invalid date format',
      }
    ),
    email: string({ required_error: 'Email is required' }).email(
      'Invalid email address'
    ),
    password: string({ required_error: 'Password is required' })
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string({ required_error: 'Please confirm your password' }),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  }),
});

export const loginUserSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email(
      'Invalid email address'
    ),
    password: string({ required_error: 'Password is required' }).min(
      8,
      'Invalid email or password'
    ),
  }),
});

export const userIdParamSchema = object({
  params: object({
    id: string({ required_error: 'User id is required' }).uuid(
      'Invalid user id'
    ),
  }),
});

export const listUsersSchema = object({
  query: object({
    page: string().regex(/^\d+$/, 'page must be a positive integer').optional(),
    limit: string()
      .regex(/^\d+$/, 'limit must be a positive integer')
      .optional(),
  }),
});

export type RegisterUserInput = Omit<
  TypeOf<typeof registerUserSchema>['body'],
  'passwordConfirm'
>;

export type LoginUserInput = TypeOf<typeof loginUserSchema>['body'];

export type ListUsersQuery = TypeOf<typeof listUsersSchema>['query'];

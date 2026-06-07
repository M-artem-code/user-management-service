import { z } from 'zod';

export const registerSchema = z
  .object({
    lastName: z.string().min(1, 'Введите фамилию'),
    firstName: z.string().min(1, 'Введите имя'),
    middleName: z.string().optional(),
    birthDate: z.string().min(1, 'Укажите дату рождения'),
    email: z.string().min(1, 'Введите email').email('Некорректный email'),
    password: z
      .string()
      .min(8, 'Минимум 8 символов')
      .max(32, 'Максимум 32 символа'),
    passwordConfirm: z.string().min(1, 'Повторите пароль'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Пароли не совпадают',
  });

export type RegisterValues = z.infer<typeof registerSchema>;

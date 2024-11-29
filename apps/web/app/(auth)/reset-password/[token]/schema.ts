import { passwordSchema } from '@/app/(auth)/register/schema';
import { z } from 'zod';

export const schema = z
  .object({
    token: z.string().min(1),
    password: passwordSchema,
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Confirm password must match password',
    path: ['confirmPassword']
  });

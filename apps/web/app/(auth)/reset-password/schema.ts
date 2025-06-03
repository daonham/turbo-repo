import { z } from 'zod';

import { passwordSchema } from '@/app/(auth)/register/schema';

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

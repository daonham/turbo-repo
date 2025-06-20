import * as z from 'zod/v4';

import { passwordSchema } from '@/app/(auth)/register/schema';

export const schema = z
  .object({
    token: z.string().min(1, 'Token is required.'),
    password: passwordSchema,
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Confirm password must match password.',
    path: ['confirmPassword']
  });

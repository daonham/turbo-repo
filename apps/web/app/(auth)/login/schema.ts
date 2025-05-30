import { passwordSchema } from '@/app/(auth)/register/schema';
import { z } from 'zod';

export const schema = z.object({
  email: z.string().email({
    message: 'Email must be a valid email.'
  }),
  password: passwordSchema
});

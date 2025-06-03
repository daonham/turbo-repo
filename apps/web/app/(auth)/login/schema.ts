import { z } from 'zod';

import { passwordSchema } from '@/app/(auth)/register/schema';

export const schema = z.object({
  email: z.string().email({
    message: 'Email must be a valid email.'
  }),
  password: passwordSchema
});

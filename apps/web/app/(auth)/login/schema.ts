import * as z from 'zod';

import { passwordSchema } from '@/app/(auth)/register/schema';

export const schema = z.object({
  email: z.email('Email must be a valid email.'),
  password: passwordSchema
});

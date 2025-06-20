import * as z from 'zod/v4';

import { passwordSchema } from '@/app/(auth)/register/schema';

export const schema = z.object({
  email: z.email('Email must be a valid email.'),
  password: passwordSchema
});

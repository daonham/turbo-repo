import { z } from 'zod';

export const signUpSchema = z.object({
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters long.'
  }),
  email: z.string().email({
    message: 'Email must be a valid email.'
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long.'
  })
});

export const registerSchema = signUpSchema.extend({
  code: z.string().min(6, 'OTP must be 6 characters long.')
});

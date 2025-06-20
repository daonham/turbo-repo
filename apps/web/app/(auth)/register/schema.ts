import * as z from 'zod/v4';

export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 8 characters.')
  .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, 'Password must contain at least one number, one uppercase, and one lowercase letter.');

export const schema = z.object({
  name: z.string().min(3, 'Username must be at least 3 characters long.'),
  email: z.email('Email must be a valid email.'),
  password: passwordSchema
});

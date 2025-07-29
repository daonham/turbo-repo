import * as z from 'zod';

export const schema = z.object({
  email: z.email('Email must be a valid email.')
});

import * as z from 'zod/v4';

export const schema = z.object({
  email: z.email('Email must be a valid email.')
});
